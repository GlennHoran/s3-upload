import React, {useState} from 'react'
import {getPreSignedUrl, uploadFileToS3} from "../service/axiosService";

const FileUpload = props => {

    // const [input, setInput] = useState("");
    const [url, setUrl] = useState("");
    const [status, setStatus] = useState("")
    const [file, setFile] = React.useState("");


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

    // async function getUrlDownload() {
    //     setLoading(true)
    //     let url = await getPreSignedUrl(input, "download")
    //     setUrl(url)
    //     setLoading(false)
    // }

    function handleUpload(event) {
        setFile(event.target.files[0]);
    }

    return (<div>
        <form>
        {/*<input onChange={(event) => setInput(event.target.value)}*/}
        {/*       value={input}/>*/}
               <label> Upload file </label>
            <input type="file" onChange={handleUpload} />
        </form>
        <br/>

        <button onClick={() => getUrlThenUploadFileToS3()}>Upload File</button>
        {/*<button onClick={() => getUrlDownload(input)}>Get presigned URL Download</button>*/}
        <br/>
        <br/>
        <div>STATUS: {status}</div>
        {/*<div>*/}
        {/*    {JSON.stringify(url)}*/}
        {/*</div>*/}
    </div>)
}

export default FileUpload