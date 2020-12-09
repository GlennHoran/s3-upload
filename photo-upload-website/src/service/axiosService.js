import axios from "axios";

const url = "https://wp0r948d32.execute-api.us-east-1.amazonaws.com/prod/"

export const getPresignedUrl = async (fileName) => {
    try{
        const response = await axios.post(url, fileName)
        console.log(response)
} catch (err) {
        console.error(err)
    }
}