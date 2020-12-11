import * as AWS from 'aws-sdk'

const handler = async function (event: any) {
    const BUCKET_NAME = process.env['BUCKET_NAME'];
    const signedUrlExpiresSeconds = 60 * 5;
    const s3 = new AWS.S3({apiVersion: "2006-03-01"})
    console.log(`event: ${JSON.stringify(event)}`);
    const payload = JSON.parse(event.body)
    const httpMethod = payload.httpMethod
    console.log("method: ", httpMethod)
    let operation
    let params
    if (payload.payload.urlTypeRequested === 'upload') {
        operation = 'putObject'
        params = {
            Bucket: BUCKET_NAME,
            Key: payload.fileName,
            Expires: signedUrlExpiresSeconds,
            ContentType: 'application/x-www-form-urlencoded'
        }
    } else {
        operation = 'getObject'
        params = {
            Bucket: BUCKET_NAME,
            Key: payload.fileName,
            Expires: signedUrlExpiresSeconds,
        }
    }

    try {
        // Pre-signing a putObject (asynchronously)
        const preSignedUrl: string = s3.getSignedUrl(operation, params)
        if (!preSignedUrl) {
            return {error: 'Unable to get presigned upload URL from S3'}
        }
        return sendRes(200, `URL = ${preSignedUrl}`);
    } catch (e) {
        console.log(e)
        return {error: 'An unexpected error occured during password change.'}
    }
};

const sendRes = (status: number, body: string) => {
    return {
        statusCode: status,
        headers: {
            "Content-Type": "text/html",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "OPTIONS, GET, POST, PUT"
        },
        body: body
    };
};

export default handler;




