import React from "react" 
import Editor from "./editor.js";

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

export default class TransEditor extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      content: ''
    }
  }

  render(){
    let selectedLanguage = sourceLanguages[0];
    let selectedScheme = transSchemes[0];                 
    return (      
      <div className="transeditor">
        <Editor content={this.props.content} 
          onChange={this.props.onChange}
          transMenu={{selectedOption: selectedLanguage, options: sourceLanguages}}           
          file={this.props.file}/>
        <Editor content={this.props.transContent} 
          onChange={this.props.onChange} 
          transMenu={{selectedOption: selectedScheme, options: transSchemes}}           
          file={this.props.file}/>
      </div>
    )
  }
}

