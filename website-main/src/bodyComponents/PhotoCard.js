import React, {useState} from 'react'
import {getPreSignedUrl} from "../../../photo-upload-website/src/service/axiosService";

export default (props) => {
    return <div>
         <img src={"data:image/jpeg;base64, " + props.data} alt={props.fileName}/>
    </div>
}