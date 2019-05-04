import React from "react"
import { saveAs } from 'file-saver';
import ClickToEdit from './click_to_edit.js';
import { Controlled as CodeMirror } from 'react-codemirror2';
import Select from 'react-select';
import fountainModeFn from '../lib/fountain-mode';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/addon/fold/foldgutter.css';
import '../../styles/editor.css' 
require('codemirror/addon/fold/foldcode.js');
require('codemirror/addon/fold/foldgutter.js');
require('codemirror/addon/search/search.js');
require('codemirror/addon/search/searchcursor.js');
require('codemirror/addon/dialog/dialog.js');

const newFile = 'newfile.fountain'

const EditorToolbarBtn = (onClick, imgSrc, altText) => {
  return (
    <button className="editor__toolbar__btn" onClick={onClick}>
      <img src={imgSrc} width="24px" alt={altText} />
    </button>)
}

const mode = {
  name: 'fountain',
  fn: fountainModeFn
};

const codeMirrorOptions = {
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

export default class Editor extends React.Component {

  constructor(props) {
    super(props)

    this.editorInstance = null;

    this.transliterate = this.transliterate.bind(this)
    this.download = this.download.bind(this)
    this.generatePdf = this.generatePdf.bind(this)
    this.handleTransSelection = this.handleTransSelection.bind(this)
    this.saveToDropbox = this.saveToDropbox.bind(this)
  }

  download = () => {
    if (this.editorInstance) {
      let value = this.editorInstance.getValue();
      let fileName = this.props.file || newFile;
      var blob = new Blob([value], { type: "text/plain;charset=utf-8" });
      saveAs(blob, fileName);
    }
    else {
      this.props.onError('editorInstance not loaded!');
    }
  }

  saveToDropbox = () => {
    if (this.editorInstance) {
      let value = this.editorInstance.getValue();
      this.props.onDropboxSave(this.props.file, value)
    }
    else {
      this.props.onError('editorInstance not loaded!');
    }
  }

  transliterate = () => {
    if (this.editorInstance) {
      let value = this.editorInstance.getValue();
      this.props.transMenu.onTransliteration(value, this.props.transMenu.selectedScheme)
    }
    else {
      this.props.onError('editorInstance not loaded!');
    }
  }

  generatePdf = () => {
    if (this.editorInstance) {
      let value = this.editorInstance.getValue();
      this.props.onPreview(value, false)
    }
    else {
      this.props.onError('editorInstance not loaded!');
    }
  }

  generateIndianPdf = () => {
    if (this.editorInstance) {
      let value = this.editorInstance.getValue();
      this.props.onPreview(value, true)
    }
    else {
      this.props.onError('editorInstance not loaded!');
    }
  }

  handleTransSelection = (selectedScheme) => {     
    this.props.transMenu.onSelection(selectedScheme)     
  }

  render() {
    console.log('editor render')

    let fileName = this.props.file || newFile;
    let downloadBtn = EditorToolbarBtn(this.download, "gfx/icons/download.svg", "downloand")
    let pdfBtn = EditorToolbarBtn(this.generatePdf, "gfx/icons/pdf.svg", "pdf")
    let pdfIndianBtn = EditorToolbarBtn(this.generateIndianPdf, "gfx/icons/indian.svg", "pdf")
    let transBtn = EditorToolbarBtn(this.transliterate, "gfx/icons/arrow.svg", "Transliterate")
    let dropboxBtn = EditorToolbarBtn(this.saveToDropbox, "gfx/icons/dropbox.svg", "Dropbox")

    let transMenu = (this.props.transMenu) ?
      <div style={{ display: 'inline-block' }}>
        <Select
          className="transmenu"
          value={this.props.transMenu.selectedScheme}
          onChange={this.handleTransSelection}
          options={this.props.transMenu.options}
        />
        {transBtn}
      </div>
      : null

    return (<div className="editor" style={this.props.style}>
      <div className="editor__toolbar">
        <ClickToEdit
          onEditEnd= { (v) => {this.props.onFileNameChange(v)} }
          maxLength="20"
          containerClass="input-container"
          inputClass="input-class"
          textClass="text-class"
          value={fileName} />
        {transMenu}
        {downloadBtn}
        {dropboxBtn}
        {pdfBtn}
        {pdfIndianBtn}
      </div>      
      <CodeMirror
        defineMode={mode}
        editorDidMount={(editor) => { this.editorInstance = editor }}
        value={this.props.content}
        options={codeMirrorOptions}
        onBeforeChange={
          (editor, data, value) => !!this.props.content && this.props.onChange(value)}
        onChange={(editor, data, value) => {
        }}
      />
    </div>
    )
  }
}