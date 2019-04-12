import React from "react"

import {FILE_EDIT, FILE_OPEN, PREVIEW, SETTINGS, TRANSLITERATE} from "../utils/utils.js"
import Preview from "./preview.js";
import Editor from "./editor.js";
import TransEditor from "./trans_editor.js";
import Settings from "./settings.js";
import {isFountainExtension} from "../utils/utils.js"
import sample from "./sample.js"

export default class Details extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      content: sample.content,
      readFile: false,
      transContent: null,       
      previewBlobUrl: null,
      settings: { key1: 'value1',key2: 'value2'},
      errorMsg: ''
    }
    this.actionToComponent = this.actionToComponent.bind(this)
  }

  onEditorChange = (newContent) => {
    this.setState({content: newContent});
  }

  onTransContentChange = (newContent) => {
    this.setState({transContent: newContent});
  }

  onSettingsChange = (newSettings) => {
    this.setState({settings: newSettings});
  }

  static getDerivedStateFromProps(nextProps, prevState){      
    if(nextProps.actionData.action === FILE_OPEN) {      
      return { readFile: !prevState.readFile};       
    }
    return null;    
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (this.props.actionData.action === FILE_OPEN && this.state.readFile) { 
      this.readFileContents(this.props.actionData.file);
    }
  }

  handleTransliteration = (content, transContent) => {
    this.setState({content: content, transContent: transContent});
  }

  readFileContents = (file, prevState, cbk) => {    
    console.log('readFileContents'); 
    if (!isFountainExtension(file.name)) {
      this.setState({ file:file,errorMsg: "Not a Fountain file!"})
    }
    else {
      var reader = new FileReader();
      reader.onload = () => {        
        this.setState({errorMsg:'',content: reader.result});        
      }
      reader.readAsText(file);
    }
  }

  actionToComponent = (actionData) => {     
    let editor = <Editor       
      content={this.state.content}
      onChange={this.onEditorChange}
      style = {{width: '100%'}}
      file={actionData.file}
    />
    switch (actionData.action) {
      case TRANSLITERATE:
        return <TransEditor
          content={this.state.content}
          transContent={this.state.transContent}
          onTransliteration={this.handleTransliteration}
          file={actionData.file}/>
      case PREVIEW:
          return <Preview content={this.state.content}
            file={actionData.file} url={this.state.previewBlobUrl}/>
      case SETTINGS:
          return <Settings onChange={this.onSettingsChange}/>
      case FILE_EDIT:
      case FILE_OPEN:
      default:
        return editor;
    }
  }

  render() {
    console.log('detail render');
    return (
      <div className="detail">
        {this.actionToComponent(this.props.actionData)}
      </div>)
  }
}
