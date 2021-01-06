import axios from "axios";
import {formatUrl} from "../util";

const apiGatewayUrl = "https://wp0r948d32.execute-api.us-east-1.amazonaws.com/prod"

//consider changing this to a post so I can send metadata (title, description etc)
export const getPreSignedUrl = (fileName, urlTypeRequested) => axios.post(apiGatewayUrl + '/upload', {
        fileName: fileName,
        urlTypeRequested: urlTypeRequested
}
).then(function (response) {
        console.log(response.data)
        return formatUrl(response.data);
    })
    .catch(function (error) {
        console.log("something went wrong: ", error);
    });

export const uploadFileToS3 = (url, file) => axios.put(url, file)
    .then(function (response) {
        return "File Uploaded Successfully!!"
    })
    .catch(function (error) {
        return `Error: ${error.toString()}`
    });

export const listObjectsFromS3 = () => axios.get(apiGatewayUrl+ '/s3-api').then(
    function (response) {
        console.log(`1. ${JSON.stringify(response.data.Contents)}`)
        console.log(`2 : ${JSON.stringify(response.data.Contents.map(object => object.Key))}`)
        return response.data.Contents.map(object => object.Key)
    }
).catch(function (error){
        return `Error: ${error.toString()}`
    }
)

