import React, {useState} from 'react'
import PhotoCard from "./PhotoCard";
import {getObjectFromS3, listObjectsFromS3} from "../service/FileService"

export default () => {

    const [listOfFiles, setListOfFiles] = useState([]);
    const [fileName, setFileName] = useState("");
    const [imageData, setImageData] = useState([]);


    async function getPhotos() {
        console.log("getfileList")
        const fileList = await listObjectsFromS3()
        setListOfFiles(fileList)
    }

    async function getData(fileName) {
        return await getObjectFromS3(fileName)
    }

    async function getImages(){
        const promiseArray = listOfFiles.map(file => {
                if(file.includes("thumbnails")){
                    return getData(file)
                }
            })
        Promise.all(promiseArray).then((values) => {
            setImageData(values)
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
        {imageData.map(data => {
            if(data !== undefined){
                return <PhotoCard data={data.base64} fileName = {data.fileName}/>
            }
        })}
        <button onClick={() => getPhotos()}> listFiles</button>
        <button onClick={() => getImages()}>getImages</button>
    </div>
}