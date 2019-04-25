import React from "react"

import {TRANSLITERATE} from "../utils/utils.js"
import ViewContainer from "./view_container.js";
import TransEditor from "./trans_editor.js";

export default class Details extends React.Component {

  constructor(props) {
    super(props);     
    this.actionToComponent = this.actionToComponent.bind(this)     
  }

  // TODO - just pass actionData as is?
  actionToComponent = (actionData) => {
    switch (actionData.action) {
      case TRANSLITERATE:
        return <TransEditor
          mode={actionData.mode}
          action={actionData.action}
          content={actionData.editorContent}
          transContent={actionData.transEditorContent}
          onTransliteration={this.props.onTransliteration}
          editorFile={actionData.editorFile}
          onEditorFilenameChange={this.props.onEditorFilenameChange}
          onTransEditorFilenameChange={this.props.onTransEditorFilenameChange}
          transEditorFile={actionData.transEditorFile}
          onEditorChange={this.props.onEditorChange}
          onTransEditorChange={this.props.onTransEditorChange}
          onDbxTransEditorSave={this.props.onDbxTransEditorSave}
          onDbxEditorSave={this.props.onDbxEditorSave}          
          onPreview={this.props.onPreview}
          onError={this.props.onError}
          onInfo={this.props.onInfo}
          />
      default:
        return <ViewContainer
          content={actionData.editorContent}
          file={actionData.editorFile}
          onFileNameChange={this.props.onEditorFilenameChange}
          action={actionData.action}
          onChange={this.props.onEditorChange}
          onPreview={this.props.onPreview}
          onDropboxSave={this.props.onDbxEditorSave}
          mode={actionData.mode}/>
    }
  }

  render() {
    console.log('detail render');
    return (
      <div className="detail">
        {this.actionToComponent(this.props.actionData)}
      </div>
    )
  }
}
