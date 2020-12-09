import axios from "axios";

const url = "https://wp0r948d32.execute-api.us-east-1.amazonaws.com/prod/"

export const getPresignedUrl = (fileName) => axios.post(url,
    fileName)
    .then(function (response) {
        console.log("hi!")
        console.log(response);
    })
    .catch(function (error) {
        console.log(error);
    });