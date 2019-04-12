import React from "react" 
import Editor from "./editor.js";
import literate from "./literator.js"; 

const sourceLanguages = [
  { value: 'telugu', label: 'Telugu' },
  { value: 'tamil', label: 'Tamil' },
  { value: 'bengali', label: 'Bengali' },
  { value: 'gujarati', label: 'Gujarati' },   
  { value: 'kannada', label: 'Kannada' },
  { value: 'malayalam', label: 'Malayalam' },
  { value: 'oriya', label: 'Oriya' }
];

const transSchemes = [
  { value: 'itrans', label: 'ITRANS' }
];

let dictionary = {}

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
  }

  handleLangugeSelection = (language) => {
    this.setState({language: language});
  }

  handleSchemeSelection = (scheme) => {
    this.setState({scheme: scheme});
  }

  handleSourceTransliteration = (content, language) => {
    let done = (result) => {
      this.props.onTransliteration(content,result)        
    }
    literate.literate(content, dictionary,this.state.scheme.value, language.value, done)        
  }

  handleSchemeTransliteration = (content, scheme) => {
    let done = (result) => {         
      this.props.onTransliteration(result, content)
    }
    literate.literate(content, dictionary,this.state.language.value, scheme.value, done)
  }

  render(){     
     
    return (      
      <div className="transeditor">
        <Editor content={this.props.content} 
          onChange={this.props.onContentChange}
          transMenu={{selectedScheme: this.state.language, 
          options: sourceLanguages,
          onSelection: this.handleLangugeSelection,
          onTransliteration: this.handleSourceTransliteration}}           
          file={this.props.file}/>
        <Editor content={this.props.transContent} 
          onChange={this.props.onTransContentChange} 
          transMenu={{selectedScheme: this.state.scheme, 
          options: transSchemes,
          onSelection: this.handleSchemeSelection,        
          onTransliteration: this.handleSchemeTransliteration}}           
          file={this.props.file}/>
      </div>
    )
  }
}

