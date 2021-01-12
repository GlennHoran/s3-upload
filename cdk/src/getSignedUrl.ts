import * as AWS from 'aws-sdk'
//@ts-ignore
const handler = async function (event: any) {
    //@ts-ignore
    const bucketName: string = process.env['BUCKET_NAME'];
    const signedUrlExpiresSeconds = 60 * 5;
    const s3 = new AWS.S3({apiVersion: "2006-03-01"})
    console.log(`event: ${JSON.stringify(event)}`);
    const payload = JSON.parse(event.body)
    const httpMethod = event.httpMethod
    console.log("method: ", httpMethod)
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
            ResponseContentType: getImageType(payload.fileName)
        }
    }
    try {
        // Pre-signing a putObject (asynchronously)
        const preSignedUrl: string = s3.getSignedUrl(operation, params)
        if (!preSignedUrl) {
            return {error: 'Unable to get presigned upload URL from S3'}
        }
        return sendRes(200, `${preSignedUrl}`);
    } catch (e) {
        console.log(e)
        return {error: 'An unexpected error occurred during password change.'}
    }
};

function getImageType(fileName: string){
    if (fileName.includes("png")){
        return "image/png"
    } else {
        return "image/jpeg"
    }
}

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




