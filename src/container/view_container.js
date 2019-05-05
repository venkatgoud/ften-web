import React from "react"
import Editor from "../components/editor.js";

export default class ViewContainer extends React.Component {

  render() {
    console.log('view container render')
    return (
      <div className="view_container">
        <Editor
          style={{ width: '100%' }}
          onChange={this.props.onChange}
          content={this.props.content}
          onPreview={this.props.onPreview}
          onDropboxSave={this.props.onDropboxSave}
          onFileNameChange={this.props.onFileNameChange}
          file={this.props.file}
          onError={this.props.onError}
          onInfo={this.props.onInfo} />
      </div>
    )
  }
}