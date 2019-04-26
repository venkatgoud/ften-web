import React from "react"
export default (props) => (<>

  <div className={`dialog ${props.kind}`}>
    <p>{props.message}</p>
    <button className="dialog--btn" onClick={props.onOk}>Ok</button>
    {/* Only warnings get a cancel option */}
    { props.kind === 'warning' ? <button className="dialog--btn" onClick={props.onCancel}>Cancel</button> : null }
  </div>
</>)