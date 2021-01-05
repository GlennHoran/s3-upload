//@ts-ignore
const handler = (event, context, callback) => {
    const request = event.Records[0].cf.request;
    const uri = request.uri
    const index = uri.indexOf("/website")
    const updatedDomain = uri.slice(0, index) + '/index.html';
    /**
     * Reads query string to check if custom origin should be used, and
     * if true, sets custom origin properties.
     */
            /* Set custom origin fields*/
            request.origin = {
                custom: {
                    domainName: updatedDomain,
                    port: 443,
                    protocol: 'https',
                    path: '',
                    sslProtocols: ['TLSv1', 'TLSv1.1'],
                    readTimeout: 5,
                    keepaliveTimeout: 5,
                    customHeaders: {}
                }
            };
            request.headers['host'] = [{ key: 'host', value: updatedDomain}];
    callback(null, request);
};
export default handler;



