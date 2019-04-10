import React from "react"

import {FILE_EDIT, FILE_OPEN, PREVIEW, SETTINGS, FILE_SAVE, TRANSLITERATE} from "../utils/utils.js"
import Preview from "./preview.js";
import Editor from "./editor.js";
import TransEditor from "./trans_editor.js";
import Save from "./save.js";
import Settings from "./settings.js"; 
import {isFountainExtension} from "../utils/utils.js"
import literate from "./literator.js"; 
 
export default class Details extends React.Component {

    constructor(props) {
        super(props);

        this.state = {             
            content: '\nWrite \nyour \nscreenplay here!',
            file: null,
            previewBlobUrl: null,
            settings: { key1: 'value1',key2: 'value2'},
            transContent: '',
            errorMsg: '',
            isTransDone: false
        }
    }

    onEditorChange = (newContent) => {
        this.setState({content: newContent});
        console.log('onEditorChange');
        console.log(this.state);
    }

    onTransChange = (newContent) => {
        this.setState({transContent: newContent});
        console.log('onTransChange');
        console.log(this.state);
    }

    onSettingsChange = (newSettings) => {
        this.setState({settings: newSettings});
        console.log('onSettingsChange');
        console.log(this.state);
    }

    componentDidUpdate = (prevProps, prevState) => {                           
        if (this.props.actionData.action === FILE_OPEN) {
            if (this.props.actionData.file !== prevProps.actionData.file)
                this.readFileContents(this.props.actionData.file);
        }         
        else if (this.props.actionData.action === PREVIEW) {
            this.generatePdf();
        }
        else if (this.props.actionData.action === TRANSLITERATE) {
            if (this.state.content !== prevState.content)
                this.transliterate();
        }
    }

    transliterate = () => {
        let dictionary = {}
        let done = (result) => {
            console.log(result);
            this.setState({                                
                errorMsg:'',             
                transContent: result,
                isTransDone: true
            });
        }
        literate.literate(this.state.content, 
            dictionary,'itrans', 'telugu', done)        
    }

    readFileContents = (file) => {
        console.log('readFileContents')         
        if (!isFountainExtension(file.name)) {       
          this.setState({
            file:file,
            errorMsg: "Not a Fountain file!"})
        }
        else {             
            var reader = new FileReader();
            reader.onload = () => {                 
                this.setState({
                    file: file,                     
                    errorMsg:'',             
                    content: reader.result
                });                 
            }
            reader.readAsText(file);	
        } 
      }
  
    actionToComponent = (actionData) => {
        let defaultStyle = {width: '100%'};
        let editor = <Editor content={this.state.content} 
            style = {{width: '100%'}}
            onChange={this.onEditorChange} file={this.state.file}/>
        switch (actionData.action) {     
            case TRANSLITERATE:
                return <TransEditor 
                    content={this.state.content}                   
                    onChange={this.onEditorChange}
                    transContent={this.state.transContent}
                    onTransChange={this.onTransChange}
                    file={this.state.file}/>                                       
            case PREVIEW:
                return <Preview content={this.state.content} file={this.state.file} url={this.state.previewBlobUrl}/> 
            case FILE_SAVE:
                return <Save content={this.state.content} file={this.state.file}/> 
            case SETTINGS:
                return <Settings onChange={this.onSettingsChange}/> 
            case FILE_EDIT:                 
            case FILE_OPEN:
            default:
                return editor;
        }
    }

    render() {
        return (
        <div className="detail">                          
            {this.actionToComponent(this.props.actionData)}             
        </div>)
    }
}
