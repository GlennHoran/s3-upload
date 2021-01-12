import React, {useState} from 'react'
import {getPreSignedUrl, uploadFileToS3, listObjectsFromS3} from "../service/axiosService";
import {renameFile} from "../util";

const FileUpload = props => {

    const [input, setInput] = useState("");
    const [fileList, setFileList] = useState([]);
    const [url, setUrl] = useState("");
    const [status, setStatus] = useState("")
    const [file, setFile] = React.useState("");
    const [imageUrl, setImageUrl] = React.useState("");

    async function getUrlThenUploadFileToS3() {
        setStatus("Getting PreSigned URL")
        const renamedFile = renameFile(file, `originals/${file.name}`)
        console.log("new filename = ", renamedFile.name)
        let fileName = renamedFile.name
        let url = await getPreSignedUrl(fileName, "upload")
        setStatus(`URL retrieved, uploading file: ${fileName}`)
        setUrl(url)
        console.log('url recieved: ', url)
        let status = await uploadFileToS3(url, file)
        setStatus(status)
    }

    function handleUpload(event) {
        setFile(event.target.files[0]);
    }

    async function getListOfFiles() {
        const listOfFiles = await listObjectsFromS3()
        setFileList(listOfFiles)
    }

    return (<div>
        <form>
        {/*    <label> Image Key  </label>*/}
        {/*<input onChange={(event) => setInput(event.target.value)}*/}
        {/*       value={input}/>*/}
        {/*       <br/>*/}
               <label> Upload file </label>
            <input type="file" onChange={handleUpload} />
        </form>
        <br/>
        <button onClick={() => getUrlThenUploadFileToS3()}>Upload File</button>
        {/*<button onClick={() => getImage()}>Get image</button>*/}
        <br/>
        <button onClick={()=> getListOfFiles()}>List Files in Bucket</button>
        <br/>
        <br/>
        <div>STATUS: {status}</div>
        <br/>
        {/*<div>Image Preview: </div>*/}
        {/*<img src={imageUrl} alt=""/>*/}
        <br/>
        Files in bucket: {JSON.stringify(fileList)}
        {/*{fileList.forEach()}*/}
    </div>)
}

export default FileUpload