import React from "react"
import Detail from "./detail.js"
import About from "../components/about.js"
import DeviceInfo from "../components/device-info"
import MenuBar from "../components/menu_bar.js"
import Dialog from "../components/dialog.js"
import { isAllowedExtension, EDITOR_MODE, EDITOR_MODE_TRANS, PREVIEW_MODE, PREVIEW_MODE_INDIAN, FILE_OPEN, FILE_EDIT, FILE_NEW, TRANSLITERATE } from "../utils/utils.js"
import sample from "../utils/sample.js"

import fetch from 'isomorphic-fetch';
const newFile = 'newfile1.fountain'

export default class Master extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      action: FILE_NEW,
      mode: EDITOR_MODE,
      editorFile: newFile,
      editorContent: sample.content,
      transEditorFile: newFile,
      transEditorContent: ' ',
      errorMsg: null,
      infoMsg: null,
      warningMsg: null,
      showHelp: true
    }
    this.readFileContents = this.readFileContents.bind(this)

    //TODO generalize this alert
    this.onWarningOk = this.onWarningOk.bind(this)
    this.clearInfoMsg = this.clearInfoMsg.bind(this)
    this.clearErrorMsg = this.clearErrorMsg.bind(this)
    this.clearWarningMsg = this.clearWarningMsg.bind(this)

    this.updateState = this.updateState.bind(this)
    this.onDropboxSave = this.onDropboxSave.bind(this)
    this.onDbxEditorSave = this.onDbxEditorSave.bind(this)
    this.onDbxTransEditorSave = this.onDbxTransEditorSave.bind(this)
    this.onEditorFilenameChange = this.onEditorFilenameChange.bind(this)
    this.onTransEditorFilenameChange = this.onTransEditorFilenameChange.bind(this)
    this.setErrorMessage = this.setErrorMessage.bind(this);
  }

  updateState = (newState) => {
    this.setState(newState);
  }

  onWarningOk = () => {
    this.setState({
      warningMsg: '',
      mode: EDITOR_MODE,
      action: FILE_NEW,
      editorFile: null,
      editorContent: sample.content,
      transEditorContent: ' '
    })
  }

  clearErrorMsg = () => {
    this.setState({ errorMsg: '' })
  }

  clearInfoMsg = () => {
    this.setState({ infoMsg: '' })
  }

  clearWarningMsg = () => {
    this.setState({ warningMsg: '' })
  }

  setErrorMessage = (msg) => {
    this.setState({ errorMsg: msg })
  }

  onInfo = (msg) => {
    this.setState({ infoMsg: msg })
  }

  readFileContents = (file) => {
    if (!isAllowedExtension(file.name)) {
      this.setState({ editorFile: file.name, errorMsg: "Not a Fountain file!" })
    }
    else {
      var reader = new FileReader();
      reader.onload = () => {
        this.updateState({ action: FILE_OPEN, editorFile: file.name, editorContent: reader.result })
      }
      reader.readAsText(file);
    }
  }

  onEditorFilenameChange = (newName) => {
    this.setState({ editorFile: newName })
  }

  onTransEditorFilenameChange = (newName) => {
    this.setState({ transEditorFile: newName })
  }

  onEditorChange = (newContent) => {
    this.setState({ editorContent: newContent });
  }

  onTransEditorChange = (newContent) => {
    this.setState({ transEditorContent: newContent });
  }

  handleNewMenu = () => {
    this.setState({ warningMsg: "Existing content will be gone!" })
  }

  handleOpenMenu = (file) => {
    this.readFileContents(file)
  }

  handleDropboxOpenMenu = (files) => {
    const file = files[0]; //file.link file.id
    fetch(file.link, {
      method: 'GET'
    })
      .then(response => { return response.text() })
      .then((content) => {
        this.updateState({
          action: FILE_OPEN,
          editorFile: file.name,
          editorContent: content,
          infoMsg: `Loaded from ${file.link}`
        })
      });
  }

  handleEditMenu = () => {
    this.setState({
      action: FILE_EDIT,
      mode: EDITOR_MODE
    })
  }

  handleTransliterateMenu = () => {
    this.setState({
      mode: EDITOR_MODE_TRANS,
      action: TRANSLITERATE
    })
  }

  onTransliteration = (content, transContent) => {
    this.setState({ editorContent: content, transEditorContent: transContent });
  }

  onPreview = (indian) => {
    this.setState({
      mode: indian ? PREVIEW_MODE_INDIAN : PREVIEW_MODE
    })
  }

  onAbout = () => {
    this.setState({ showHelp: true })
  }

  onDbxTransEditorSave = (name, content) => {
    this.onDropboxSave(name, content)
  }

  onDbxEditorSave = (name, content) => {
    this.onDropboxSave(name, content)
  }

  onDropboxSave = (name, content) => {
    const dataURI = 'data:;text/plain,' + encodeURIComponent(content);
    let options = {
      success: () => {
        this.setState({ infoMsg: `${name} saved` })
      },
    }
    window.Dropbox.save(dataURI, name, options);
  }

  render() {
    console.log('master render');

    const errorDialog = this.state.errorMsg ?
      <Dialog
        kind="error"
        message={this.state.errorMsg}
        onOk={this.clearErrorMsg} /> : null;

    const warningDialog = this.state.warningMsg ?
      <Dialog
        kind="warning"
        message={this.state.warningMsg}
        onOk={this.onWarningOk}
        onCancel={this.clearWarningMsg} /> : null;

    const infoDialog = this.state.infoMsg ?
      <Dialog
        kind="info"
        message={this.state.infoMsg}
        onOk={this.clearInfoMsg} /> : null;

    let { mode, action, editorContent, transEditorContent, editorFile, transEditorFile } = this.state;
    let actionData = { mode, action, editorContent, transEditorContent, editorFile, transEditorFile };

    return (
      <div className="master">
        <DeviceInfo />
        <MenuBar
          onOpen={this.handleOpenMenu}
          onDropboxSuccess={this.handleDropboxOpenMenu}
          onNew={this.handleNewMenu}
          onEdit={this.handleEditMenu}
          onTransliterate={this.handleTransliterateMenu}
          onAbout={this.onAbout}
        />
        {errorDialog}
        {warningDialog}
        {infoDialog}
        {this.state.showHelp ? <About onClick={() => { this.setState({ showHelp: false }) }} /> : null}
        <Detail
          actionData={actionData}
          onPreview={this.onPreview}
          onTransliteration={this.onTransliteration}
          onEditorChange={this.onEditorChange}
          onEditorFilenameChange={this.onEditorFilenameChange}
          onDbxEditorSave={this.onDbxEditorSave}
          onTransEditorChange={this.onTransEditorChange}
          onTransEditorFilenameChange={this.onTransEditorFilenameChange}
          onDbxTransEditorSave={this.onDbxTransEditorSave}
          onError={this.setErrorMessage}
          onInfo={this.onInfo}
        />
      </div>)
  }
}