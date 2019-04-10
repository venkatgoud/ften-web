import React from "react"
import MenuBar from "./menu_bar.js"
import Detail from "./detail.js"

import {FILE_EDIT, FILE_OPEN, PREVIEW, FILE_SAVE, SETTINGS, TRANSLITERATE} from "../utils/utils.js"

export default class Master extends React.Component {

  constructor(props) {
    super(props)
    this.state = {       
      file: null,
      action: FILE_EDIT,      
      isTransDone: false 
    }
  }

  handleOpen = (file) => {
    this.setState({
      file:file,
      action: FILE_OPEN,       
      isTransDone: false }
    ) 
  }

  handleEdit = () => {
    this.setState({       
      action: FILE_EDIT,
      isTransDone: false }
    ) 
  }

  handlePreview = () => {
    this.setState({
      action: PREVIEW,
      isTransDone: false }
    )
  }

  handleSave = () => {
    this.setState({
      action: FILE_SAVE}
    )
  }

  handleSettings = () => {
    this.setState({
      action: SETTINGS}
    )
  }

  handleTransliterate = () => {
    this.setState({
      action: TRANSLITERATE }
    )
  }

  render() {
    return <div className="master">
       <MenuBar
          onOpen={this.handleOpen}
          onPreview={this.handlePreview}
          onEdit={this.handleEdit}
          onSave={this.handleSave}
          onSettings={this.handleSettings}
          onTransliterate={this.handleTransliterate}
       />       
       <Detail actionData={this.state} ></Detail>
     </div>
  }    
}


