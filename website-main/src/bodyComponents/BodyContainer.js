import React, {useState} from 'react'
import PhotoCard from "./PhotoCard";
import {listObjectsFromS3} from "../service/FileService"
import PhotoCardContainer from "./PhotoCardContainer";
import About from "./About"
import "../css/body.css"


export default class BodyContainer extends React.Component {
    constructor(props) {
        super(props);
    }
    render(){
        return (
            <div className="body-container">
                <About/>
                <PhotoCardContainer/>
            </div>
        )
    }

}