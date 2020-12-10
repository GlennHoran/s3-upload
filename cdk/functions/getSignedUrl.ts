import * as AWS from 'aws-sdk'
import {Cors} from "@aws-cdk/aws-apigateway";

const handler = async function(event:any) {
    const BUCKET_NAME = process.env['BUCKET_NAME'];

    const signedUrlExpiresSeconds = 60 * 5;

    const s3 = new AWS.S3({apiVersion: "2006-03-01"})
    console.log(`bucket: ${BUCKET_NAME} fileName: ${event.body}`);
    console.log(`event: ${JSON.stringify(event)}`);
    //this isn't great, but it's short.
    const operation = event.httpMethod === "POST"? 'putObject': 'getObject'
    const fileName = event.headers.filename
    console.log(`method: ${event.httpMethod}, fileName = ${fileName}`)
        try {
            // Pre-signing a putObject (asynchronously)
            const params = { Bucket: BUCKET_NAME, Key: fileName, Expires: signedUrlExpiresSeconds }
            const uploadUrl: string = s3.getSignedUrl(operation, params)
            if (!uploadUrl) {
                return { error: 'Unable to get presigned upload URL from S3' }
            }
            return sendRes(200, `URL = ${uploadUrl}`);
        } catch (e) {
            console.log(e)
            return { error: 'An unexpected error occured during password change.' }
        }
};

const sendRes = (status:number, body:string) => {
    return {
        statusCode: status,
        headers: {
            "Content-Type": "text/html",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": Cors.DEFAULT_HEADERS.concat(['filename']),
            "Access-Control-Allow-Methods": "OPTIONS, GET, POST, PUT"
        },
        body: body
    };
};

export default handler;




