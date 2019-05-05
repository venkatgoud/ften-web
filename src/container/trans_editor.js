import React from "react"
import Editor from "../components/editor.js";
import literate from "../lib/literator.js";
import words from "../utils/common_words.js"

const sourceLanguages = [
  { value: 'telugu', label: 'Telugu' },
  { value: 'tamil', label: 'Tamil' },
  { value: 'bengali', label: 'Bengali' },
  { value: 'gujarati', label: 'Gujarati' },
  { value: 'kannada', label: 'Kannada' },
  { value: 'malayalam', label: 'Malayalam' },
  { value: 'oriya', label: 'Oriya' },
  { value: 'devanagari', label: 'Devanagari' }
];

const transSchemes = [
  { value: 'itrans', label: 'ITRANS' },
  { value: 'hk', label: 'Harvard-Kyoto' },
  { value: 'iast', label: 'iast' },
  { value: 'slp1', label: 'slp-basic' },
  { value: 'velthuis', label: 'velthuis' },
  { value: 'wx', label: 'wx' }
];

let dictionary = words.words;

export default class TransEditor extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      language: sourceLanguages[0],
      scheme: transSchemes[0]
    }

    this.handleLangugeSelection = this.handleLangugeSelection.bind(this)
    this.handleSchemeSelection = this.handleSchemeSelection.bind(this)
    this.handleSourceTransliteration = this.handleSourceTransliteration.bind(this)
    this.handleSchemeTransliteration = this.handleSchemeTransliteration.bind(this)
    this.onTransEditorChange = this.onTransEditorChange.bind(this)
  }

  onTransEditorChange = (content) => {
    this.props.onTransEditorChange(content)
  }

  handleLangugeSelection = (language) => {
    this.setState({ language: language });
  }

  handleSchemeSelection = (scheme) => {
    this.setState({ scheme: scheme });
  }

  handleSourceTransliteration = (content, language) => {
    let done = (result) => {
      this.props.onTransliteration(content, result)
    }
    literate.literate(content, dictionary, this.state.scheme.value, language.value, done)
  }

  handleSchemeTransliteration = (content, scheme) => {
    let done = (result) => {
      this.props.onTransliteration(result, content)
    }
    literate.literate(content, dictionary, this.state.language.value, scheme.value, done)
  }

  handleLangugeSelection = (language) => {
    this.setState({ language: language });
  }

  handleSchemeSelection = (scheme) => {
    this.setState({ scheme: scheme });
  }

  handleSourceTransliteration = (content, language) => {
    let done = (result) => {
      this.props.onTransliteration(content, result)
    }
    literate.literate(content, dictionary, this.state.scheme.value, language.value, done)
  }

  handleSchemeTransliteration = (content, scheme) => {
    let done = (result) => {
      this.props.onTransliteration(result, content)
    }
    literate.literate(content, dictionary, this.state.language.value, scheme.value, done)
  }

  render() {
    return <div className="transeditor">
      <Editor content={this.props.actionData.editorContent}
        onChange={this.props.onEditorChange}
        onPreview={this.props.onPreview}
        onDropboxSave={this.props.onDbxEditorSave}
        transMenu={{
          selectedScheme: this.state.language,
          options: sourceLanguages,
          onSelection: this.handleLangugeSelection,
          onTransliteration: this.handleSourceTransliteration
        }}
        file={this.props.actionData.editorFile}
        onFileNameChange={this.props.onEditorFilenameChange}
        onError={this.props.onError}
        onInfo={this.props.onInfo} />
      <Editor content={this.props.actionData.transEditorContent}
        onChange={this.onTransEditorChange}
        onPreview={this.props.onPreview}
        onDropboxSave={this.props.onDbxTransEditorSave}
        transMenu={{
          selectedScheme: this.state.scheme,
          options: transSchemes,
          onSelection: this.handleSchemeSelection,
          onTransliteration: this.handleSchemeTransliteration
        }}
        file={this.props.actionData.transEditorFile}
        onFileNameChange={this.props.onTransEditorFilenameChange}
        onError={this.props.onError}
        onInfo={this.props.onInfo} />
    </div>
  }
}

