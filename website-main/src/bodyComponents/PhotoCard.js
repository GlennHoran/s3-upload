import React from 'react'
import {getPreSignedUrl} from "../../../photo-upload-website/src/service/axiosService";

export default (props) => {

    async function getOriginalImage(fileName) {
        console.log("directory: " + replaceDirectory(fileName))
        const url = await getPreSignedUrl(replaceDirectory(fileName))
        if (url !== undefined) {
            window.location.href = url;
        }
    }

    function replaceDirectory(fileName){
        return fileName.replace("thumbnails", "originals")
    }

    return <div style = {{padding: "1em"}}>
        <div onClick={() => getOriginalImage(props.fileName)}>
            <img src={"data:image/jpeg;base64, " + props.data} alt={props.fileName} />
        </div>

    </div>
}