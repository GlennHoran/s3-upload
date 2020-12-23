import * as AWS from 'aws-sdk'
//@ts-ignore
const handler = async function (event: any) {
    //@ts-ignore
    const bucketName: string = process.env['BUCKET_NAME'];
    const s3 = new AWS.S3({apiVersion: "2006-03-01"})
    console.log(`event: ${JSON.stringify(event)}`);
    const payload = JSON.parse(event.body)
    const httpMethod = event.httpMethod
    console.log("method: ", httpMethod)
    const params = {
        Bucket: bucketName
    };
    let s3Objects
    try {
        s3Objects = await s3.listObjectsV2(params).promise();
        return sendRes(200, JSON.stringify(s3Objects));
    } catch (e) {
        return sendRes(500, "Something went wrong");
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




