import React, {useState} from 'react'
import {getPreSignedUrlUpload, getPreSignedUrlDownload} from "../service/axiosService";

const FileUpload = props => {
    const [input, setInput] = useState("");
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false)

    async function getUrlUpload(input) {
        setLoading(true)
        let url = await getPreSignedUrlUpload(input)
        setUrl(url)
        setLoading(false)
    }

    async function getUrlDownload(input) {
        setLoading(true)
        let url = await getPreSignedUrlDownload(input)
        setUrl(url)
        setLoading(false)
    }

    return (<div>
        <input onChange={(event) => setInput(event.target.value)}
               value={input}/>
        <button onClick={() => getUrlUpload(input)}>Get presigned URL Upload</button>
        <button onClick={() => getUrlDownload(input)}>Get presigned URL Download</button>

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