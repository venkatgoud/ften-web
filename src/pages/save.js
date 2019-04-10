import React from "react"

export default class Save extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            file: '',
            errorMsg: ''
        }
    }

    render() {
        return <div className="save">
            <h3>Download</h3>
        </div>
    }
}
