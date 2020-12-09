import axios from "axios";
import {formatUrl} from "../util";

const url = "https://wp0r948d32.execute-api.us-east-1.amazonaws.com/prod/"

export const getPreSignedUrlUpload = (fileName) => axios.post(url, {
    headers: {
        fileName: fileName
    }
})
    .then(function (response) {
        console.log(response.data)
        return formatUrl(response.data);
    })
    .catch(function (error) {
        console.log(error);
    });

export const getPreSignedUrlDownload = (fileName) => axios.get(url, {
    headers: {
        fileName: fileName
    }
})
    .then(function (response) {
        console.log(response.data)
        return formatUrl(response.data);
    })
    .catch(function (error) {
        console.log(error);
    });