import axios from "axios";
import {formatUrl} from "../util";

const url = "https://wp0r948d32.execute-api.us-east-1.amazonaws.com/prod/"

//consider changing this to a post so I can send metadata (title, description etc)
export const getPreSignedUrl = (fileName, urlTypeRequested) => axios.post(url, {
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

