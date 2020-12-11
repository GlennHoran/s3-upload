import React, {useState} from 'react'
import {getPreSignedUrl, uploadFileToS3} from "../service/axiosService";

const FileUpload = props => {

    const [input, setInput] = useState("");
    const [url, setUrl] = useState("");
    const [status, setStatus] = useState("")
    const [file, setFile] = React.useState("");
    const [imageUrl, setImageUrl] = React.useState("");

    async function getUrlThenUploadFileToS3() {
        setStatus("Getting PreSigned URL")
        let fileName = file.name
        let url = await getPreSignedUrl(fileName, "upload")
        setStatus(`URL retrieved, uploading file: ${fileName}`)
        setUrl(url)
        console.log('url recieved: ', url)
        let status = await uploadFileToS3(url, file)
        setStatus(status)
    }

    async function getImage() {
        setStatus("Fetching presigned URL ")
        let url = await getPreSignedUrl(input, "download")
        setStatus("Image URL retrieved")
        setImageUrl(url)
    }

    function handleUpload(event) {
        setFile(event.target.files[0]);
    }

    return (<div>
        <form>
            <label> Image Key  </label>
        <input onChange={(event) => setInput(event.target.value)}
               value={input}/>
               <br/>
               <label> Upload file </label>
            <input type="file" onChange={handleUpload} />
        </form>
        <br/>
        <button onClick={() => getUrlThenUploadFileToS3()}>Upload File</button>
        <button onClick={() => getImage()}>Get image</button>
        <br/>
        <br/>
        <div>STATUS: {status}</div>
        <br/>
        <div>Image Preview: </div>
        <img src={imageUrl} alt=""/>
    </div>)
}

export default FileUpload