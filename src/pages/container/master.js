import React from "react"
import Detail from "./detail.js"
import MenuBar from "../components/menu_bar.js"
import Dialog from "../components/dialog.js"
import { isAllowedExtension, EDITOR_MODE, EDITOR_MODE_TRANS, PREVIEW_MODE, PREVIEW_MODE_INDIAN, FILE_OPEN, FILE_EDIT, FILE_NEW, TRANSLITERATE } from "../../utils/utils.js"
import sample from "../../utils/sample.js"
import { Dropbox } from 'dropbox';
import fetch from 'isomorphic-fetch';

const DROPBOX_ACCESS_TOKEN = 'WGDvudh9drkAAAAAAAAA7REgHz97HDcJqhv9YxhIn9fK1iascOLAXH_itL6zXZ_J';
const newFile = 'newfile1.fountain'

export default class Master extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      action: FILE_NEW,
      mode: EDITOR_MODE,
      editorFile: newFile,
      editorContent: sample.content,
      editorDbxMetadata: null,
      transEditorFile: newFile,
      transEditorContent: ' ',
      transEditorDboxMetadata: null,
      errorMsg: null,
      infoMsg: null,
      warningMsg: null
    }
    this.readFileContents = this.readFileContents.bind(this)

    //TODO generalize this alert
    this.onWarningOk = this.onWarningOk.bind(this)
    this.clearInfoMsg = this.clearInfoMsg.bind(this)
    this.clearErrorMsg = this.clearErrorMsg.bind(this)
    this.clearWarningMsg = this.clearWarningMsg.bind(this)

    this.updateState = this.updateState.bind(this)

    this.onDbxEditorSave = this.onDbxEditorSave.bind(this)
    this.onDbxTransEditorSave = this.onDbxTransEditorSave.bind(this)
    this.onEditorFilenameChange = this.onEditorFilenameChange.bind(this)
    this.onTransEditorFilenameChange = this.onTransEditorFilenameChange.bind(this)
    this.setErrorMessage = this.setErrorMessage.bind(this)
  }

  updateState = (newState) => {
    this.setState(newState);
  }

  onWarningOk = () => {
    this.setState({
      warningMsg: '',
      mode: EDITOR_MODE,
      action: FILE_NEW,
      file: null,
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

  onInfo=(msg) => {
    this.setState({infoMsg: msg})
  }

  readFileContents = (file) => {
    if (!isAllowedExtension(file.name)) {
      this.setState({ editorFile: file.name, errorMsg: "Not a Fountain file!" })
    }
    else {
      var reader = new FileReader();
      reader.onload = () => {
        this.updateState({action:FILE_OPEN, editorFile:file.name, editorContent: reader.result})
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

  dbxReadFile = (dbx, file, metadata) => {
    dbx.filesDownload({ path: metadata.path_lower })
      .then((response) => {
        const blob = response.fileBlob;
        const reader = new FileReader();
        reader.onload = () => {
          this.updateState({
            action: FILE_OPEN,
            editorFile: file.name,
            editorContent: reader.result,
            editorDbxMetadata: metadata,
            infoMsg: `Loaded from Dropbox folder ${metadata.path_lower}`
          })
        }
        reader.readAsText(blob);
      })
      .catch((error) => {
        this.setErrorMessage(error)
      })
  }

  handleDropboxOpenMenu = (files) => {
    const file = files[0]; //file.link file.id

    const dbx = new Dropbox({
      fetch: fetch,
      accessToken: DROPBOX_ACCESS_TOKEN
    });

    dbx.filesGetMetadata({ "path": file.id })
      .then((metadata) => { this.dbxReadFile(dbx, file, metadata) })
      .catch((error) => {
        this.setErrorMessage(error)
      })
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

  onDbxTransEditorSave = (name, content) => {
    this.onDropboxSave(name, content, this.state.transEditorDboxMetadata,
      (metadata) => {
        this.updateState({
          transEditorDboxMetadata: metadata, 
          errorMsg: '',
          infoMsg: `Saved to ${metadata.path}`
        })
      }
    )
  }

  onDbxEditorSave = (name, content) => {
    this.onDropboxSave(name, content, this.state.editorDbxMetadata,
      (metadata) => {
        this.updateState({
          transEditorDboxMetadata: metadata, errorMsg: ''
        })
      })
  }

  onDropboxSave = (name, content, metadata, cbk) => {
    const dbx = new Dropbox({
      fetch: fetch,
      accessToken: DROPBOX_ACCESS_TOKEN
    });

    //TODO if there is no path then use the saver component?
    if (metadata) {
      const { name, rev, path_lower } = metadata

      let path = path_lower
      let mode;
      if (metadata.name === name) {
        mode = { '.tag': 'update', 'update': rev }
      }
      else {
        mode = 'add'
      }

      dbx.filesUpload({ path, mode, contents: content })
        .then((metadata)=>{cbk(metadata)})
        .catch((error) => {
          this.setErrorMessage(error)
        });
    }
    else {
      //TODO
      const dataURI = 'data:;text/plain,' + encodeURIComponent(content);
      window.Dropbox.save(dataURI, name, {});
    }
  }

  render() {
    console.log('master render');

    const errorDialog = this.state.errorMsg ?
      <Dialog
        kind="error"
        message={this.state.errorMsg}
        onOk={this.clearErrorMsg}/> : null;

    const warningDialog = this.state.warningMsg ?
      <Dialog
        kind = "warning"
        message={this.state.warningMsg}
        onOk={this.onWarningOk}
        onCancel={this.clearWarningMsg} /> : null;

    const infoDialog = this.state.infoMsg ?
      <Dialog
        kind="info"
        message={this.state.infoMsg}
        onOk={this.clearInfoMsg}/> : null;

    let {mode, action, editorContent, transEditorContent, editorFile, transEditorFile} = this.state;
    let actionData = {mode, action, editorContent, transEditorContent, editorFile, transEditorFile};

    return <div className="master">
      <MenuBar
        onOpen={this.handleOpenMenu}
        onDropboxSuccess={this.handleDropboxOpenMenu}
        onNew={this.handleNewMenu}
        onEdit={this.handleEditMenu}
        onTransliterate={this.handleTransliterateMenu}
      />
      {errorDialog}
      {warningDialog}
      {infoDialog}
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
    </div>
  }
}