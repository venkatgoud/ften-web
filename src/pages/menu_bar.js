import React from "react"
import MenuItem from "./menu_item.js"

export default class MenuBar extends React.Component {

    constructor(props) {
        super(props)
        this.inputOpenFileRef = React.createRef()         
    }
    showOpenFileDlg = () => {         
        this.inputOpenFileRef.current.click()
    }
    onChangeFile = (event) => {         
        event.stopPropagation();
        event.preventDefault();
        let file = event.target.files[0];        
        if (file){
            this.props.onOpen(file);         
        }
        // So the same file can be selected again.
        const element = event.target;
        element.value = ''; 
    }

    render() {         
        return <div className="menu-bar">
            <input type='file' id='file'
                onChange={this.onChangeFile.bind(this)}
                ref={this.inputOpenFileRef} style={{display: 'none'}}/>              
            <MenuItem className="menu-item"
                onClick={this.showOpenFileDlg} 
                src="gfx/icons/open.svg" alt="Open File"/>                        
            <MenuItem className="menu-item"
                onClick={this.props.onEdit}  
                src="gfx/icons/editor.svg" alt="Edit"/>                          
            <MenuItem className="menu-item"
                onClick={this.props.onTransliterate} 
                src="gfx/icons/translation.svg" alt="Trans"/>             
        </div>                       
    }
} 