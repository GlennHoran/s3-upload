import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import {EventType} from '@aws-cdk/aws-s3';
import {Code, Function, Runtime, Tracing} from '@aws-cdk/aws-lambda';
import {S3EventSource} from '@aws-cdk/aws-lambda-event-sources'
import {ParameterTier, StringParameter} from "@aws-cdk/aws-ssm";
import {Cors, LambdaRestApi, HttpIntegration, LambdaIntegration} from '@aws-cdk/aws-apigateway';
import {ALL_METHODS} from "@aws-cdk/aws-apigateway/lib/util";
import {
    AllowedMethods,
    CachedMethods,
    Distribution,
    LambdaEdgeEventType,
    ViewerProtocolPolicy
} from '@aws-cdk/aws-cloudfront';
import {CompositePrincipal, Effect, ManagedPolicy, PolicyStatement, Role, ServicePrincipal} from '@aws-cdk/aws-iam'
import * as origins from '@aws-cdk/aws-cloudfront-origins';

export class CdkStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const storageBucket = new s3.Bucket(this, 'photo-storage', {
            versioned: true,
            cors: [
                {
                    maxAge: 3000,
                    allowedOrigins: Cors.ALL_ORIGINS,
                    allowedHeaders: Cors.DEFAULT_HEADERS,
                    allowedMethods: [s3.HttpMethods.POST,
                        s3.HttpMethods.PUT,
                        s3.HttpMethods.GET],
                },
            ],
        });

        const uploadWebpage = new s3.Bucket(this, 'website-photo-upload', {
            versioned: true,
            cors: [
                {
                    maxAge: 3000,
                    allowedOrigins: Cors.ALL_ORIGINS,
                    allowedHeaders: Cors.DEFAULT_HEADERS,
                    allowedMethods: [s3.HttpMethods.POST,
                        s3.HttpMethods.PUT,
                        s3.HttpMethods.GET],
                },
            ],
        });

        const mainWebpage = new s3.Bucket(this, 'website-main', {
            versioned: true,
            cors: [
                {
                    maxAge: 3000,
                    allowedOrigins: Cors.ALL_ORIGINS,
                    allowedHeaders: Cors.DEFAULT_HEADERS,
                    allowedMethods: [s3.HttpMethods.POST,
                        s3.HttpMethods.PUT,
                        s3.HttpMethods.GET],
                },
            ],
        });

        const getSignedUrlLambda = new Function(this, 'signed-url-lambda', {
                runtime: Runtime.NODEJS_12_X,
                //point the lambda function to the functions folder
                code: Code.fromAsset('src'),
                //the file is getSignedUrls and it's the default export.
                handler: 'getSignedUrl.default',
                tracing: Tracing.ACTIVE,
                //this environment variable comes from the npm deploy script being run with npm_config_BUCKET being passed in.
                environment: {
                    // @ts-ignore
                    'BUCKET_NAME': storageBucket.bucketName
                }
            }
        );

        const imageProcessorLambda = new Function(this, 'image-processor-lambda', {
                runtime: Runtime.NODEJS_12_X,
                code: Code.fromAsset('src'),
                handler: 'imageProcessor.default',
                tracing: Tracing.ACTIVE,
                environment: {
                    // @ts-ignore
                    'BUCKET_NAME': storageBucket.bucketName
                }
            }
        );

        const s3ApiLambda = new Function(this, 's3-api-lambda', {
                runtime: Runtime.NODEJS_12_X,
                code: Code.fromAsset('src', {exclude: ['node_modules']}),
                handler: 's3ApiLambda.default',
                tracing: Tracing.ACTIVE,
                environment: {
                    // @ts-ignore
                    'BUCKET_NAME': storageBucket.bucketName
                }
            }
        );

        //giving lambda access to bucket according to here: https://douglasduhaime.com/posts/s3-lambda-auth.html
        const authLambdaRole = new Role(this, 'customRole', {
            roleName: 'authLambdaRole',
            assumedBy: new CompositePrincipal(new ServicePrincipal('lambda.amazonaws.com'), new ServicePrincipal('edgelambda.amazonaws.com')),
            managedPolicies: [ManagedPolicy.fromAwsManagedPolicyName("AWSLambdaExecute")],
        })


        //allow access to specific parameters in parameter store
        const parameterStorePolicyStatement = new PolicyStatement({
            effect: Effect.ALLOW,
            resources: ['arn:aws:ssm:us-east-1:617840169292:parameter/photo-upload-user', 'arn:aws:ssm:us-east-1:617840169292:parameter/photo-upload-password'],
            actions: [
                'ssm:GetParameters'
            ]
        })

        const edgeLambdaLoggingPolicyStatement = new PolicyStatement({
            effect: Effect.ALLOW,
            resources: ['arn:aws:logs:*:*:*'],
            actions: [
                'logs:CreateLogGroup',
                'logs:CreateLogStream',
                'logs:PutLogEvents'
            ]
        })


        authLambdaRole.addToPolicy(parameterStorePolicyStatement)
        authLambdaRole.addToPolicy(edgeLambdaLoggingPolicyStatement)


        // this is an Edge@Lambda function. Because I'm using US-east-1 I don't need to specify it as an Edge Func - https://docs.aws.amazon.com/cdk/api/latest/docs/aws-cloudfront-readme.html
        //edge lambdas don't support environment variables... have to use aws parameter store
        const authLambda = new Function(this, 'auth-lambda', {
                runtime: Runtime.NODEJS_12_X,
                code: Code.fromAsset('src', {exclude: ['node_modules']}),
                handler: 'authLambda.default',
                tracing: Tracing.ACTIVE,
                role: authLambdaRole
                // environment: {
                //     // @ts-ignore
                //     'AUTH_USER': process.env.npm_config_AUTH_USERNAME,
                //     // @ts-ignore
                //     'AUTH_PASSWORD': process.env.npm_config_AUTH_PASSWORD
                // }
            }
        );

        //this construct should do all the plumbing for us - permissions to allow apigw to invoke the lambda +
        //all traffic routed to lambda regardless of path.
        const api = new LambdaRestApi(this, 'website-api', {
            proxy: false,
            handler: getSignedUrlLambda,
            defaultCorsPreflightOptions: {
                allowOrigins: Cors.ALL_ORIGINS,
                allowMethods: ALL_METHODS,
                allowHeaders: Cors.DEFAULT_HEADERS,
            },
        })

        const uploadResource = api.root.addResource('upload')
        uploadResource.addMethod('POST', new LambdaIntegration(getSignedUrlLambda));

        const s3ApiResource = api.root.addResource('s3-api')
        uploadResource.addMethod('GET', new LambdaIntegration(s3ApiLambda));

        // const distribution = new Distribution(this, 'myDist', {
        //     defaultBehavior: {
        //         // @ts-ignore
        //         origin: new origins.S3Origin(mainWebpage),
        //         allowedMethods: AllowedMethods.ALLOW_ALL,
        //         viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        //         cachedMethods: CachedMethods.CACHE_GET_HEAD_OPTIONS,
        //     },
        //     additionalBehaviors: {
        //         '/upload/*': {
        //             // @ts-ignore
        //             origin: new origins.S3Origin(uploadWebpage),
        //             allowedMethods: AllowedMethods.ALLOW_ALL,
        //             viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        //             cachedMethods: CachedMethods.CACHE_GET_HEAD_OPTIONS,
        //             edgeLambdas: [
        //                 {
        //                     functionVersion: authLambda.currentVersion,
        //                     eventType: LambdaEdgeEventType.VIEWER_REQUEST,
        //                 }
        //             ],
        //         }
        //     },
        //     defaultRootObject: "index.html"
        // });

        const distribution = new Distribution(this, 'myDist', {
            defaultBehavior: {
                // @ts-ignore
                origin: new origins.S3Origin(websiteBucket),
                allowedMethods: AllowedMethods.ALLOW_ALL,
                viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                cachedMethods: CachedMethods.CACHE_GET_HEAD_OPTIONS,
                edgeLambdas: [
                    {
                        functionVersion: authLambda.currentVersion,
                        eventType: LambdaEdgeEventType.VIEWER_REQUEST,
                    }
                ],
            },
            defaultRootObject: "index.html"
        });

        const parameterStoreUserName = new StringParameter(this, 'userName', {
            allowedPattern: '.*',
            description: 'Username for photo-upload',
            parameterName: 'photo-upload-user',
            // @ts-ignore
            stringValue: process.env.npm_config_AUTH_USERNAME,
            tier: ParameterTier.ADVANCED,
        })

        const parameterStorePassword = new StringParameter(this, 'notAPassword', {
            allowedPattern: '.*',
            description: 'Password for photo-upload',
            parameterName: 'photo-upload-password',
            // @ts-ignore
            stringValue: process.env.npm_config_AUTH_PASSWORD,
            tier: ParameterTier.ADVANCED,
        })

        //need to allow the lambda to read/write from the website. The lambda generates the
        // presigned URL so needs read/write permission
        // @ts-ignore
        storageBucket.grantReadWrite(getSignedUrlLambda)
        // @ts-ignore
        storageBucket.grantReadWrite(imageProcessorLambda)
        // @ts-ignore
        uploadWebpage.grantReadWrite(getSignedUrlLambda)
        // @ts-ignore
        mainWebpage.grantRead(s3ApiLambda)
        //adding event to trigger imageProcessor on image upload
        parameterStoreUserName.grantRead(authLambda)
        parameterStorePassword.grantRead(authLambda)
        // @ts-ignore
        const eventSource = imageProcessorLambda.addEventSource(new S3EventSource(storageBucket, {
            events: [EventType.OBJECT_CREATED],
            filters: [{prefix: 'originals/'}]
        }))
    }
}

