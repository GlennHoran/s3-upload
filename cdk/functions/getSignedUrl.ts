import * as AWS from 'aws-sdk'

const handler = async function(event:any) {
    const BUCKET_NAME = process.env['BUCKET_NAME'];

    const signedUrlExpiresSeconds = 60 * 5;

    const s3 = new AWS.S3({apiVersion: "2006-03-01"})
    // JSON.stringify(event, undefined, 2)
    console.log(`bucket: ${BUCKET_NAME} fileName: ${event.body}`);
    try {
        // Pre-signing a putObject (asynchronously)
        const params = { Bucket: BUCKET_NAME, Key: event.body.toString(), Expires: signedUrlExpiresSeconds }
        const uploadUrl: string = await s3.getSignedUrl('getObject', params)

        if (!uploadUrl) {
            return { error: 'Unable to get presigned upload URL from S3' }
        }
//a comment
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
            "Content-Type": "text/html"
        },
        body: body
    };
};

export default handler;




