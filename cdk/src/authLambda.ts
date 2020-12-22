import {SSM} from 'aws-sdk'
//@ts-ignore
const handler = async function (event: any, context, callback) {
    const ssm = new SSM({region: 'us-east-1'});

    const params = {
        Names: ['photo-upload-user', 'photo-upload-password'], /* required */
        WithDecryption: false
    };
    const parameters  = await ssm.getParameters(params).promise();
    console.log(parameters)
    console.log("after parameters")

    //@ts-ignore
    const user: string = "user"
    //@ts-ignore
    const password: string = "password"
    // Get the request and its headers
    const request = event.Records[0].cf.request;
    const headers = request.headers;

    // Build a Basic Authentication string
    const authString = 'Basic ' + new Buffer(user + ':' + password).toString('base64');

    // Challenge for auth if auth credentials are absent or incorrect
    if (typeof headers.authorization == 'undefined' || headers.authorization[0].value != authString) {
        const response = {
            status: '401',
            statusDescription: 'Unauthorized',
            body: 'Unauthorized',
            headers: {
                'www-authenticate': [{key: 'WWW-Authenticate', value:'Basic'}]
            },
        };
        callback(null, response);
    }

    // User has authenticated
    callback(null, request);
};

export default handler;




