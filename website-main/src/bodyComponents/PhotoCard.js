import React from 'react'

export default (props) => {



    return <div>
        <div> my name is {props.data}</div>
         <img src={"data:image/jpeg;base64, " + props.data} alt="an Image"/>
    </div>
}