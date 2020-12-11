import * as AWS from 'aws-sdk'

const handler = async function (event: any) {

    console.log(`event: ${JSON.stringify(event)}`);
    const bucketName = process.env['BUCKET_NAME'];
    const s3 = new AWS.S3({apiVersion: "2006-03-01"})
    const payload = JSON.parse(event.body)

    if(event.httpMethod === 'POST'){
        //@ts-ignore
        getSignedUrl(s3, payload, bucketName)
    }
    else if(event.httpMethod === 'GET'){
        //@ts-ignore
        getImagesList(s3, payload, bucketName)
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

const getSignedUrl = (s3: AWS.S3, payload: Payload , bucketName: string) => {
    const signedUrlExpiresSeconds = 60 * 5;
    let operation
    let params
    if (payload.urlTypeRequested === 'upload') {
        operation = 'putObject'
        params = {
            Bucket: bucketName,
            Key: payload.fileName,
            Expires: signedUrlExpiresSeconds,
            ContentType: 'application/x-www-form-urlencoded'
        }
    } else {
        operation = 'getObject'
        params = {
            Bucket: bucketName,
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
}

const getImageList = (s3:AWS.S3, payload: Payload, BUCKET_NAME:string) => {
        console.log("Get Image list called!")
}

interface Payload {
    fileName: string;
    urlTypeRequested: string;
}

export default handler;




