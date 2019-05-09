import React from "react"
import Editor from "../components/editor.js";
import Navigator from "../components/navigator.js"

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
        <Editor
          style={{ width: '60%' }}
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
        <Navigator
          content={this.props.content}
          gotoCursor={this.setScroll}
          onChange={this.props.onChange}
        />
      </div>
    )
  }
}