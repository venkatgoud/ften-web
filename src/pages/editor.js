import React from "react" 
import {isFountainExtension} from "../utils/utils.js"
import { saveAs } from 'file-saver';
import {UnControlled as CodeMirror} from 'react-codemirror2'
import Select from 'react-select';
import fountainModeFn from './fountain-mode';
import MenuItem from "./menu_item.js"
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import '../styles/editor.css';
require('codemirror/mode/xml/xml');
require('codemirror/addon/fold/foldcode.js');
require('codemirror/addon/fold/foldgutter.js');
require('codemirror/addon/search/search.js');
require('codemirror/addon/search/searchcursor.js');
require('codemirror/addon/dialog/dialog.js');
  
export default class Editor extends React.Component {

    constructor(props) {
        super(props)
        this.state = {             
            errorMsg: '',
            selectedOption: null
        }              
    }
    componentDidUpdate = (prevProps) => {
        if (prevProps.file !== this.props.file) {
            if (!isFountainExtension(this.props.file.name)) {       
                this.setState({                 
                errorMsg: "Not a Fountain file!"})
            }
            else {
                this.setState({                 
                    errorMsg: ""})                    
            }
        }
    }

    download = ()=> {
        let fileName = this.props.file ? this.props.file.name : 'New file';
        var blob = new Blob([this.props.content], {type: "text/plain;charset=utf-8"});
        saveAs(blob, fileName);
    }

    handleTransSelection = (selectedOption) => {
        this.setState({ selectedOption });
        console.log(`Option selected:`, selectedOption);
    }
 
    render() {
        console.log('editor render') 
        const mode = {
            name: 'fountain',
            fn: fountainModeFn
        };

        const options = {
            foldGutter: true,
            gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
            lineNumbers: true,
            theme: 'material',
            mode: 'fountain',
            // fold: 'fountain',
            lineWrapping: true,
            extraKeys: {
              'Ctrl-Q': (cm) => { cm.foldCode(cm.getCursor()); },
              'Shift-Ctrl-F': (cm) => {
                cm.eachLine((lh) => {
                  cm.foldCode(lh.lineNo());
                });
              }
            }
          };
        let fileName = this.props.file ? this.props.file.name : 'New file';
           
        return (<div className="editor" style={this.props.style}>
            <div className="editor__toolbar">
                <span className="editor__toolbar__filename">{fileName}</span>
                {(this.props.transMenu) ?
                    <div style={{display:'inline-block'}}>
                    <Select
                        className="transmenu"
                        value={this.state.selectedOption || this.props.transMenu.selectedOption }
                        onChange={this.handleTransSelection.bind(this)}
                        options={this.props.transMenu.options}
                    />
                    <button className="editor__toolbar__trans" onClick={this.download.bind(this)}>
                        <img src="gfx/icons/arrow.svg" width="36px" alt="download"/> 
                    </button>
                    </div>
                : null
                }            
                <button className="editor__toolbar__pdf" onClick={this.download.bind(this)}>
                    <img src="gfx/icons/pdf.svg" width="36px" alt="download"/> 
                </button>
                <button className="editor__toolbar__pdf" onClick={this.download.bind(this)}>
                    <img src="gfx/icons/indian.svg" width="36px" alt="download"/> 
                </button>          
                <button className="editor__toolbar__download" onClick={this.download.bind(this)}>
                    <img src="gfx/icons/download.svg" width="36px" alt="download"/> 
                </button>                                
            </div>
            <p className="editor__warning">{this.state.errorMsg}</p>
            <CodeMirror
                value={this.props.content}
                options={options}
                defineMode={mode}
                onChange={(editor, data, value) => {
                }}
            />
        </div>)
    }
}
