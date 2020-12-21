import * as AWS from 'aws-sdk'
//@ts-ignore
const handler = async function (event: any, context, callback) {
    //@ts-ignore
    const user: string = process.env['AUTH_USER']
    //@ts-ignore
    const password: string = process.env['AUTH_PASSWORD']
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




