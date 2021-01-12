import React, {useState} from 'react'
import PhotoCard from "./PhotoCard";
import {getObjectFromS3, listObjectsFromS3} from "../service/FileService"
import {getPreSignedUrl} from "../../../photo-upload-website/src/service/axiosService";

export default () => {

    const [listOfFiles, setListOfFiles] = useState([]);
    const [fileName, setFileName] = useState("");
    const [base64Data, setBase64Data] = useState([]);


    async function getPhotos() {
        console.log("getfileList")
        const fileList = await listObjectsFromS3()
        setListOfFiles(fileList)
    }

    async function getData(fileName) {
        const fileData = await getObjectFromS3(fileName)
        return fileData
    }

    async function getImages(){
        const promiseArray = listOfFiles.map(file => {
                if(file.includes("thumbnails")){
                    return getData(file)
                }
            })
        Promise.all(promiseArray).then((values) => {
            setBase64Data(values)
        })
    }

    return <div className="body-container">
        <div>This is the body</div>
        {listOfFiles.map(file => {
            if(file.includes("thumbnails")){
                return <div>
                    {file}
                </div>
        }})}
        {base64Data.map(data => {
            if(data !== undefined){
                return <PhotoCard data={data} fileName = ""/>
            }
        })}
        <button onClick={() => getPhotos()}> listFiles</button>
        <button onClick={() => getImages()}>getImages</button>
    </div>
}