import * as AWS from 'aws-sdk'


const BUCKET = process.env['BUCKET'];
const AWS_ACCESS_KEY_ID = process.env['AWS_ACCESS_KEY_ID'];
const AWS_SECRET_ACCESS_KEY = process.env['AWS_SECRET_ACCESS_KEY'];

const signedUrlExpiresSeconds = 60*10;

AWS.config.update({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: 'eu-west-2'
});

const s3 = new AWS.S3({ apiVersion: "2006-03-01" })

interface EventData {
    fileName: string
}
// todo write lambda function
// export default async (event: FunctionEvent<EventData>) => {
//
//     if (!event.context.auth || !event.context.auth.nodeId) {
//         return { error: 'No user logged in.' }
//     }
//
//     try {
//         const { fileName } = event.data;
//
//         // Pre-signing a putObject (asynchronously)
//         const params = { Bucket: BUCKET, Key: fileName, Expires: signedUrlExpiresSeconds }
//         const uploadUrl: string = await s3.getSignedUrl('putObject', params)
//
//         if (!uploadUrl) {
//             return { error: 'Unable to get presigned upload URL from S3' }
//         }
//
//
//
//         return { data: { uploadUrl } }
//     } catch (e) {
//         console.log(e)
//         return { error: 'An unexpected error occured during password change.' }
//     }
// }