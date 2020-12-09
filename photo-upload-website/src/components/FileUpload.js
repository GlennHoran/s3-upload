import React, {useState} from 'react'
import {getPresignedUrl} from "../service/axiosService";

const FileUpload = props => {
    const [input, setInput] = useState("");

    return (<div>
        <input onChange={(event) => setInput(event.target.value)}
        value={input}
        />
        <button onClick={() => getPresignedUrl(input)}>Get presigned URL</button>
    </div>)
}


export default FileUpload