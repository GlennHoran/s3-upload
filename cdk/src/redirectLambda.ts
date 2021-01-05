//@ts-ignore
const handler = (event, context, callback) => {
    const request = event.Records[0].cf.request;           // extract the request object
    request.uri = request.uri.replace(/^\/[^\/]+\//,'/');  // modify the URI
    return callback(null, request);
};
export default handler;



