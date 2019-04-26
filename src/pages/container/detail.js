import React from "react"

import { TRANSLITERATE, PREVIEW_MODE, PREVIEW_MODE_INDIAN } from "../../utils/utils.js"
import ViewContainer from "./view_container.js";
import TransEditor from "./trans_editor.js";
import Preview from "../components/preview";

export default class Details extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      previewContent: null
    }
    this.actionToComponent = this.actionToComponent.bind(this)
    this.onPreview = this.onPreview.bind(this)
  }

  onPreview = (value, indian) => {
    this.props.onPreview(indian)
    this.setState({ previewContent: value })
  }

  // TODO - just pass actionData as is?
  actionToComponent = (actionData) => {
    switch (actionData.action) {
      case TRANSLITERATE:
        return <TransEditor
          actionData={this.props.actionData}                      
          onTransliteration={this.props.onTransliteration}           
          onEditorFilenameChange={this.props.onEditorFilenameChange}
          onTransEditorFilenameChange={this.props.onTransEditorFilenameChange}           
          onEditorChange={this.props.onEditorChange}
          onTransEditorChange={this.props.onTransEditorChange}
          onDbxTransEditorSave={this.props.onDbxTransEditorSave}
          onDbxEditorSave={this.props.onDbxEditorSave}
          onPreview={this.onPreview}
          onError={this.props.onError}
          onInfo={this.props.onInfo}
        />
      default:
        return <ViewContainer
          content={actionData.editorContent}
          file={actionData.editorFile}
          onFileNameChange={this.props.onEditorFilenameChange}           
          onChange={this.props.onEditorChange}
          onPreview={this.onPreview}
          onDropboxSave={this.props.onDbxEditorSave}
        />
    }
  }

  render() {
    console.log('detail render');
    let element
    if (this.props.actionData.mode === PREVIEW_MODE_INDIAN || this.props.actionData.mode === PREVIEW_MODE) {
      element = <Preview
        indian={this.props.actionData.mode === PREVIEW_MODE_INDIAN}
        content={this.state.previewContent}
        onError={this.props.onError}
        onInfo={this.props.onInfo} />
    }
    else {
      element = this.actionToComponent(this.props.actionData)
    }
    return (
      <div className="detail">
        {element}
      </div>
    )
  }
}
