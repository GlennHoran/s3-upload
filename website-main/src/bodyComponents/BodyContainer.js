import React, {useState} from 'react'
import PhotoCard from "./PhotoCard";
import { listObjectsFromS3 } from "../service/FileService"

export default () => {

    const [listOfFiles, setListOfFiles] = useState(["1", "2"]);

    async function getPhotos() {
        console.log("getfileList")
        const fileList = await listObjectsFromS3()
        setListOfFiles(fileList)
    }

    return <div className = "body-container">
        <div>This is the body </div>
        {listOfFiles.map(file => {
            return <PhotoCard name = {file}/>
        })}

        <PhotoCard name = "Glenn"/>
        <button onClick={() => getFileList()}> </button>
    </div>
}