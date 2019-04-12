import React from "react" 
import { saveAs } from 'file-saver';
import {UnControlled as CodeMirror} from 'react-codemirror2'
import Select from 'react-select';
import fountainModeFn from './fountain-mode'; 
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css'; 
import '../styles/editor.css';
require('codemirror/addon/fold/foldcode.js');
require('codemirror/addon/fold/foldgutter.js');
require('codemirror/addon/search/search.js');
require('codemirror/addon/search/searchcursor.js');
require('codemirror/addon/dialog/dialog.js');

const EditorToolbarBtn = ( onClick, imgSrc,altText) => {
  return (
  <button className="editor__toolbar__btn" onClick={onClick}>
    <img src={imgSrc} width="24px" alt="download"/>
  </button>)
}

export default class Editor extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      content: props.content,
      errorMsg: props.errorMsg,
      selectedScheme: props.transMenu ? props.transMenu.selectedScheme : null
    }

    this.editorInstance = null;

    this.transliterate = this.transliterate.bind(this)
    this.download = this.download.bind(this)
    this.handleTransSelection = this.handleTransSelection.bind(this)
  }

  static getDerivedStateFromProps(nextProps, prevState){
    let newState = { errorMsg: nextProps.errorMsg}
    if(nextProps.transMenu && nextProps.transMenu.selectedScheme!==prevState.selectedScheme){
      newState.selectedScheme = nextProps.transMenu.selectedScheme;
    }
    return newState;
  }

  download = ()=> {
    let fileName = this.props.file ? this.props.file.name : 'New file';
    var blob = new Blob([this.props.content], {type: "text/plain;charset=utf-8"});
    saveAs(blob, fileName);
  }

  transliterate = ()=> {
    if(this.editorInstance){
      let value = this.editorInstance.getValue();
      this.props.transMenu.onTransliteration(value, this.state.selectedScheme)
    }
    else {
      this.setState({errorMsg: 'editorInstance not loaded!!!!'});
    }
  }

  handleTransSelection = (selectedScheme) => {
    this.setState({ selectedScheme });
  }

  render() {
    console.log('editor render')
    const mode = {
        name: 'fountain',
        fn: fountainModeFn
    };

    const options = {
        foldGutter: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        lineNumbers: true,
        theme: 'material',
        mode: 'fountain',
        lineWrapping: true,
        extraKeys: {
          'Ctrl-Q': (cm) => { cm.foldCode(cm.getCursor()); },
          'Shift-Ctrl-F': (cm) => {
            cm.eachLine((lh) => {
              cm.foldCode(lh.lineNo());
            });
          }
        }
      };
    let fileName = this.props.file ? this.props.file.name : 'New file';
    let downloadBtn = EditorToolbarBtn(this.download,"gfx/icons/download.svg", "downloand")
    let transBtn = EditorToolbarBtn(this.transliterate,"gfx/icons/arrow.svg", "Transliterate")

    let transMenu = (this.props.transMenu) ?
      <div style={{display:'inline-block'}}>
        <Select
          className="transmenu"
          value={this.state.selectedScheme}
          onChange={this.handleTransSelection}
          options={this.props.transMenu.options}
        />
        {transBtn}
      </div>
      : null

    return (<div className="editor" style={this.props.style}>
      <div className="editor__toolbar">
        <span className="editor__toolbar__filename">{fileName}</span>
           {transMenu}
           {downloadBtn}
        </div>
        <p className="editor__warning">{this.state.errorMsg}</p>
        <CodeMirror
          defineMode= {mode}       
          editorDidMount={(editor) => { this.editorInstance = editor }}
          value={this.props.content}
          options={options}
          onChange={(editor, data, value) => {
          }}
        />
      </div>
    )
  }
}