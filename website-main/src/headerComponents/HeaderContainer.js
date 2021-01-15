import React from 'react'
import logo from 'url:../img/logo.png'
import aboutIcon from 'url:../img/about-icon.png'
import '../css/header.css'

export default () => {
    return <div className="header">
        <div className="header-container">
            <div className = 'header-container-item'>
                <img src={logo} alt="logo" className='logo'/>
            </div>
            <div className = 'header-container-item'>
            <img src={aboutIcon} alt='about' className='about-icon'/>
            </div>
        </div>
    </div>
}