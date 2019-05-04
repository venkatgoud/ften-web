import React from "react"

export default (props) =>
    <div className={props.className} > 
        <span className="tooltiptext">{props.alt}</span>        
        <img 
            src={props.src} 
            alt={props.alt}
            width="50px"
            onClick={props.onClick}/>          
    </div>

 