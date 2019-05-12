import React from "react"
import Editor from "../components/editor.js";
import Navigator from "../components/navigator.js"
import Resizable from "re-resizable";

export default class ViewContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      scroll: null
    }

    this.setScroll = this.setScroll.bind(this);
  }

  setScroll(scroll) {
    this.setState({ scroll })
  }

  render() {
    console.log('view container render')
    return (
      <div className="view_container">
        <Resizable
          enable={{ top: false, right: true, bottom: false, left: false, topRight: false, bottomRight: false, bottomLeft: false, topLeft: false }}
        >
          <Editor
            onChange={this.props.onChange}
            content={this.props.content}
            onPreview={this.props.onPreview}
            onDropboxSave={this.props.onDropboxSave}
            onFileNameChange={this.props.onFileNameChange}
            file={this.props.file}
            onError={this.props.onError}
            onInfo={this.props.onInfo}
            scroll={this.state.scroll}
          />
        </Resizable>
        <Navigator
          content={this.props.content}
          gotoCursor={this.setScroll}
          onChange={this.props.onChange}
        />
      </div>
    )
  }
}