import React from "react"

export default class Preview extends React.Component {

    render() {
        let fileName = this.props.file ? this.props.file.name : 'New file';        

        return <div className="preview">
            <h3>Preview {fileName}</h3>
            <iframe id="pdf_frame"  title="pdf preview" type="application/pdf" src={this.props.url}></iframe>
        </div>
    }
}
