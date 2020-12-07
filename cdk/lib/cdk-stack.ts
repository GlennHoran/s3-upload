import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as Function from '@aws-cdk/aws-lambda';
import {LambdaRestApi} from '@aws-cdk/aws-apigateway';


export class CdkStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const storageBucket = new s3.Bucket(this, 'photo-storage', {
            versioned: true,
            //might need cors.
            // cors: [
            //     {
            //         maxAge: 3000,
            //         allowedOrigins: ["*"],
            //         allowedHeaders: ["*"],
            //         allowedMethods: [ s3.HttpMethods.POST,
            //             s3.HttpMethods.PUT,
            //             s3.HttpMethods.GET,],
            //     },
            // ],
        });

        const websiteBucket = new s3.Bucket(this, 'website-photo-upload', {
            versioned: true,
            websiteIndexDocument: "index.html",
            publicReadAccess: true,
        });

        const getSignedUrlLambda = new Function.Function(this, 'signed-url-lambda', {
                runtime: Function.Runtime.NODEJS_12_X,
                //point the lambda function to the functions folder
                code: Function.Code.fromAsset('./functions'),
                //the file is getSignedUrls, the function is handler.
                handler: 'getSignedUrl.default',
                tracing: Function.Tracing.ACTIVE
            }
        );

        //this construct should do all the plumbing for us - permissions to allow apigw to invoke the lambda +
        //all traffic routed to lambda regardless of path.
        const api = new LambdaRestApi(this, 'website-api', {
            handler: getSignedUrlLambda
        })

        //need to allow the lambda to read/write from the website. The lambda generates the
        // presigned URL so needs read/write permission
        // @ts-ignore
        websiteBucket.grantReadWrite(getSignedUrlLambda)
    }
}

