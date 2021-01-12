import axios from "axios";

const apiGatewayUrl = "https://wp0r948d32.execute-api.us-east-1.amazonaws.com/prod/s3-api"

export const listObjectsFromS3 = () => axios.get(apiGatewayUrl).then(
    function (response) {
        console.log(`1. ${JSON.stringify(response.data.Contents)}`)
        return response.data.Contents.map(object => object.Key)
    }
).catch(function (error){
        return `Error: ${error.toString()}`
    }
)

export const getObjectFromS3 = (key) => axios.get(apiGatewayUrl, {
    params: {
        key: key
    }
}).then(
     (response) => {

        console.log(`Response: ${JSON.stringify(response.data.Body.data)}`)
        console.log(`base64: ${encode(response.data.Body.data)}`)
        return encode(response.data.Body.data)
    }
).catch(function (error){
        console.log(error.toString())
        return `Error: ${error.toString()}`
    }
)

export const getPreSignedUrl = (fileName) => axios.post(apiGatewayUrl + '/upload', {
        fileName: fileName,
        urlTypeRequested: "download"
    }
).then(function (response) {
    console.log(response.data)
    return response.data;
})
    .catch(function (error) {
        console.log("something went wrong: ", error);
    });

function encode(data){
    let buf = Buffer.from(data);
    return buf.toString('base64')
}