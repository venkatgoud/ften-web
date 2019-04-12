import React from "react"
import MenuBar from "./menu_bar.js"
import Detail from "./detail.js"

import {FILE_EDIT, FILE_OPEN, PREVIEW, SETTINGS, TRANSLITERATE} from "../utils/utils.js"

export default class Master extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      file: null,
      action: FILE_EDIT
    }
  }

  handleOpen = (file) => {     
    this.setState({
      file:file,
      action: FILE_OPEN }
    )
  }

  handleEdit = () => {
    this.setState({
      action: FILE_EDIT }
    )
  }

  handlePreview = () => {
    this.setState({
      action: PREVIEW }
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
          onSettings={this.handleSettings}
          onTransliterate={this.handleTransliterate}
       />
       <Detail actionData={this.state} ></Detail>
     </div>
  }
}


