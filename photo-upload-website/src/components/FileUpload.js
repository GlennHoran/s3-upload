import React, {useState} from 'react'
import {getPreSignedUrl} from "../service/axiosService";

const FileUpload = props => {
    const [input, setInput] = useState("");
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false)

    async function getUrl(input) {
        setLoading(true)
        let url = await getPreSignedUrl(input)
        setUrl(url)
        setLoading(false)
    }

    return (<div>
        <input onChange={(event) => setInput(event.target.value)}
               value={input}/>
        <button onClick={() => getUrl(input)}>Get presigned URL</button>
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