import React from "react"

export default class Settings extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            file: '',
            errorMsg: ''
        }
    }

    render() {
        return <div className="settings">
            <h3>Settings </h3>
        </div>
    }
}
