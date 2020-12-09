import axios from "axios";
import {formatUrl} from "../util";

const url = "https://wp0r948d32.execute-api.us-east-1.amazonaws.com/prod/"

export const getPreSignedUrl = (fileName) => axios.post(url, fileName)
    .then(function (response) {
        console.log(response.data)
        return formatUrl(response.data);
    })
    .catch(function (error) {
        console.log(error);
    });