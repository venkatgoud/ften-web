import React from "react"
import { saveAs } from 'file-saver';
import ClickToEdit from './click_to_edit.js';
import Select from 'react-select';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/theme/ambiance.css';
import 'codemirror/theme/blackboard.css';
import 'codemirror/theme/cobalt.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/theme/neat.css';
import 'codemirror/theme/solarized.css';
import 'codemirror/theme/yeti.css';
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/dialog/dialog.css';
import 'codemirror/addon/hint/show-hint.css';


import '../styles/editor.css';
import { SettingsContext } from './settings-context';
import fountainModeFn from "../lib/fountain-mode.js";
import { Controlled as CodeMirror } from 'react-codemirror2';

if (typeof navigator !== 'undefined') {
  import('codemirror/addon/fold/foldcode.js');
  import('codemirror/addon/fold/foldgutter.js');
  import('codemirror/addon/search/search.js');
  import('codemirror/addon/search/searchcursor.js');
  import('codemirror/addon/search/jump-to-line.js');
  import('codemirror/addon/dialog/dialog.js');
}

const mode = {
  name: 'fountain',
  fn: fountainModeFn
};

const newFile = 'newfile.fountain'

const EditorToolbarBtn = (onClick, imgSrc, altText) => {
  return (
    <button className="editor__toolbar__btn" onClick={onClick}>
      <img src={imgSrc} width="24px" alt={altText} />
    </button>)
}

const codeMirrorOptions = {
  foldGutter: true,
  gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
  lineNumbers: true,
  theme: 'material',
  mode: 'fountain',
  lineWrapping: true,
  extraKeys: {
    'Ctrl-Space': 'autocomplete',
    'Shift-Ctrl-Space': 'teluguAutoComplete',
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
    this.codeMirrorInstance = null;
    this.transliterate = this.transliterate.bind(this)
    this.download = this.download.bind(this)
    this.generatePdf = this.generatePdf.bind(this)
    this.handleTransSelection = this.handleTransSelection.bind(this)
    this.saveToDropbox = this.saveToDropbox.bind(this)

    this.downloadBtn = EditorToolbarBtn(this.download, "gfx/icons/download.svg", "downloand")
    this.pdfBtn = EditorToolbarBtn(this.generatePdf, "gfx/icons/pdf.svg", "pdf")
    this.pdfIndianBtn = EditorToolbarBtn(this.generateIndianPdf, "gfx/icons/indian.svg", "pdf")
    this.transBtn = EditorToolbarBtn(this.transliterate, "gfx/icons/arrow.svg", "Transliterate")
    this.dropboxBtn = EditorToolbarBtn(this.saveToDropbox, "gfx/icons/dropbox.svg", "Dropbox")
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

  componentDidUpdate(prevProps) {
    if (prevProps.scroll && this.props.scroll && prevProps.scroll !== this.props.scroll) {
      console.log(`scroll line : ${this.props.scroll.line}`)
      if (this.editorInstance) {
        console.log(`scrolling to ${this.props.scroll.line}`);
        this.editorInstance.scrollIntoView(this.props.scroll)
      }
    } else {
      console.log('no scroll');
    }
  }

  render() {
    return <SettingsContext.Consumer>
      {settings => {
        console.log('editor render')

        let fileName = this.props.file || newFile;

        let transMenu = (this.props.transMenu) ?
          <div style={{ display: 'inline-block' }}>
            <Select
              className="transmenu"
              value={this.props.transMenu.selectedScheme}
              onChange={this.handleTransSelection}
              options={this.props.transMenu.options}
            />
            {this.transBtn}
          </div>
          : null

        codeMirrorOptions.theme = settings.theme.value;
        return (
          <div className="editor" style={this.props.style}>
            <div className="editor__toolbar">
              <ClickToEdit
                onEditEnd={(v) => { this.props.onFileNameChange(v) }}
                maxLength="20"
                containerClass="input-container"
                inputClass="input-class"
                textClass="text-class"
                value={fileName} />
              {transMenu}
              {this.downloadBtn}
              {this.dropboxBtn}
              {this.pdfBtn}
              {this.pdfIndianBtn}
              <CodeMirror
                editorDidMount={(editor) => { this.editorInstance = editor; }}
                value={this.props.content}
                defineMode={mode}
                options={codeMirrorOptions}
                onBeforeChange={
                  (editor, data, value) => !!this.props.content && this.props.onChange(value)}
                onChange={(editor, data, value) => {
                }}
              />
            </div>
          </div>
        )
      }
      }
    </SettingsContext.Consumer>
  }
}
Editor.contextType = SettingsContext;