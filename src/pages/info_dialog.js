import React from "react"
export default (props) => (<>
  <div className='info-dialog'>
    <p>&#9888;{props.message}</p>
    <button class="btn" onClick={props.onOk}>Ok?</button>     
  </div>
</>)