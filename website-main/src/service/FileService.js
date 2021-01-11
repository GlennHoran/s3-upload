import axios from "axios";

const apiGatewayUrl = "https://wp0r948d32.execute-api.us-east-1.amazonaws.com/prod/s3-api"

export const listObjectsFromS3 = () => axios.get(apiGatewayUrl).then(
    function (response) {
        console.log(`1. ${JSON.stringify(response.data.Contents)}`)
        console.log(`2 : ${JSON.stringify(response.data.Contents.map(object => object.Key))}`)
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
    function (response) {
        console.log(`1. ${JSON.stringify(response.data)}`)
        console.log(`base64: ${encode(response.data)}`)
        return encode(response.data)
    }
).catch(function (error){
        return `Error: ${error.toString()}`
    }
)

function encode(data){
    let buf = Buffer.from(data);
    return buf.toString('base64')
}