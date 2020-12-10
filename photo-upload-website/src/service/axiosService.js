import axios from "axios";
import {formatUrl} from "../util";

const url = "https://wp0r948d32.execute-api.us-east-1.amazonaws.com/prod/"

export const getPreSignedUrl = (fileName, urlTypeRequested) => axios.post(`${url}?filename=${encodeURI(fileName)}&urltype=${urlTypeRequested}`)
    .then(function (response) {
        console.log(response.data)
        return formatUrl(response.data);
    })
    .catch(function (error) {
        console.log(error);
    });