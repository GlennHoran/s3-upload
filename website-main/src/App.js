import React from "react";
import Footer from './footerComponents/FooterContainer'
import Body from './bodyComponents/BodyContainer'
import Header from './headerComponents/HeaderContainer'
import './app.css'


export default () => (

    // https://medium.com/javascript-in-plain-english/using-node-js-to-display-images-in-a-private-aws-s3-bucket-4c043ed5c5d0
    <div className='container'>
        <Header/>
        <Body/>
        <Footer/>
    </div>
);
