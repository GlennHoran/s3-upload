import React, {useState} from 'react'
import PhotoCard from "./PhotoCard";
import {getObjectFromS3, listObjectsFromS3} from "../service/FileService"
import "../css/body.css"


export default class PhotoCardContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loading: false, imageData: []};
    }

    componentDidMount() {
        this.setState({loading: true})
        listObjectsFromS3().then(fileList =>
            this.getImages(fileList)
        )
    }

    async getData(fileName) {
        return await getObjectFromS3(fileName)
    }

    async getImages(fileList) {
        const promiseArray = fileList.map(file => {
            if (file.includes("thumbnails")) {
                return this.getData(file)
            }
        })
        Promise.all(promiseArray).then((values) => {
            this.setState({loading: false, imageData: values})
        })
    }

    render() {
        return <div className="photo-card-container">
            {this.state.loading ? <div className="spinner">

            </div> : <div className="images-container">
                {this.state.imageData.map(data => {
                    if (data !== undefined) {
                        return <PhotoCard data={data.base64} fileName={data.fileName}/>
                    }
                })}
            </div>
            }

        </div>
    }

}