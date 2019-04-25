import React from "react"
import { EDITOR_MODE, PREVIEW_MODE_INDIAN } from "../utils/utils.js"
import Editor from "./editor.js";
import Preview from "./preview.js";

export default class ViewContainer extends React.Component {

  constructor(props) {
    super(props);
    this.modeToComponent = this.modeToComponent.bind(this)     
  }

  modeToComponent = () => {
    let editor = <Editor
      style={{ width: '100%' }}
      onChange={this.props.onChange}
      content={this.props.content}
      onPreview={this.props.onPreview}
      onDropboxSave={this.props.onDropboxSave}
      onFileNameChange={this.props.onFileNameChange}
      file={this.props.file} 
      onError={this.props.onError}
      onInfo={this.props.onInfo}/>
    let preview = <Preview
      indian={this.props.mode === PREVIEW_MODE_INDIAN}
      content={this.props.content}
      file={this.props.file} 
      onError={this.props.onError}
      onInfo={this.props.onInfo}/>
    return this.props.mode === EDITOR_MODE ? editor : preview;
  }

  render() {
    console.log('view container render')
    return (
      <div className="view_container">
        {this.modeToComponent()}
      </div>
    )
  }
}