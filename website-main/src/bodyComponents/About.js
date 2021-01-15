import React from 'react'

export default () => {
    return <div className='about'>
        <div className = 'profile-image'>
            <img src = "todo" alt = 'profile circle'/>
        </div>
        <div className = 'profile-words'>
            <h3 className='profile title'>
                Glenn
            </h3>
            <div className='profile-stats'> x photos </div>
            <div className = 'profile-description'> </div>
        </div>
    </div>
}