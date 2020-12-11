import React, {useState} from 'react'
import {getPreSignedUrl, uploadFileToS3} from "../service/axiosService";

const FileUpload = props => {

    const [input, setInput] = useState("");
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false)
    const [file, setFile] = React.useState("");


    async function getUrlThenUploadFileToS3() {
        console.log(file)
        setLoading(true)
        let fileName = file.name
        console.log('fileName = ', fileName)

        let url = await getPreSignedUrl(fileName, "upload")
        setUrl(url)
        console.log('url recieved: ', url)
        await uploadFileToS3(url, file)
        setLoading(false)
    }

    async function getUrlDownload() {
        setLoading(true)
        let url = await getPreSignedUrl(input, "download")
        setUrl(url)
        setLoading(false)
    }

    function handleUpload(event) {
        setFile(event.target.files[0]);

        // Add code here to upload file to server
        // ...
    }

    return (<div>
        <form>
               <label> Upload file </label>
            <input type="file" onChange={handleUpload} />
        </form>
        <button onClick={() => getUrlThenUploadFileToS3()}>Upload File</button>
        <button onClick={() => getUrlDownload(input)}>Get presigned URL Download</button>
        <div>FileName : {file.name} </div>
            <div>FileType : {file.type} </div>
                <div>FileSize : {file.size} </div>
        {loading? <div>
            LOADING
        </div>: <div>
            NOT LOADING
        </div>}
        <div>
            {JSON.stringify(url)}
        </div>
    </div>)
}

export default FileUpload