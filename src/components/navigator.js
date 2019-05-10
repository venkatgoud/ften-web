import React from "react";
import { saveAs } from 'file-saver';
import '../styles/navigator.css';
import { SettingsContext } from './settings-context';
import { UnControlled as CodeMirror } from 'react-codemirror2';
if (typeof navigator !== 'undefined') {
  import('codemirror/addon/fold/foldcode.js');
  import('codemirror/addon/fold/foldgutter.js');
  import('codemirror/addon/fold/markdown-fold.js');
  require('codemirror/mode/markdown/markdown');
}

const EditorToolbarBtn = (onClick, imgSrc, altText) => {
  return (
    <button className="editor__toolbar__btn" onClick={onClick}>
      <img src={imgSrc} width="24px" alt={altText} />
    </button>)
}

const codeMirrorOptions = {
  readOnly: true,
  foldGutter: true,
  styleActiveLine: true,
  gutters: ["CodeMirror-foldgutter"],
  theme: 'material',
  mode: 'markdown',
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

function parse(script) {
  let lineArray = [];
  let toc;
  const SCENE_HEADING = /(^\.[\w]+.+)|(?:(?:^int|ext|est|int\.ext|int\/ext|i\/e)[. ].+)$/i;
  const SECTION = (/^#+/);
  const src = script.split('\n');
  let lineNumber = 0;

  for (let i = 0; i < src.length; i++) {
    const line = src[i];
    if (SCENE_HEADING.test(line) || SECTION.test(line)) {
      lineArray[lineNumber++] = i;
      if (!toc) {
        toc = line
      }
      else {
        toc = toc + '\n' + line;
      }
    }
  }

  return { lineArray, toc }
}

export default class Navigator extends React.Component {

  constructor(props) {
    super(props);
    this.editorInstance = null;
    this.lineArray = [];
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
    this.download = this.download.bind(this)
  }

  download = () => {
    if (this.editorInstance) {
      let value = this.editorInstance.getValue();
      var blob = new Blob([value], { type: "text/plain;charset=utf-8" });
      saveAs(blob, 'outline.md');
    }
    else {
      this.props.onError('editorInstance not loaded!');
    }
  }

  handleDoubleClick = (editor, event) => {
    event.preventDefault();
    const { line } = editor.coordsChar({ left: event.clientX, top: event.clientY });
    const targetLine = this.lineArray[line];
    console.log(`editor line ${targetLine}`);
    this.props.gotoCursor({ line: targetLine, ch: 0 });
  }

  render() {
    return <SettingsContext.Consumer>
      {settings => {
        console.log('navigator render');
        let downloadBtn = EditorToolbarBtn(this.download, "gfx/icons/download.svg", "downloand")
        let { lineArray, toc } = parse(this.props.content);
        this.lineArray = lineArray;
        codeMirrorOptions.theme = settings.theme.value;
        return < div className="navigator" >
          <div className="editor__toolbar">
            {downloadBtn}
            <CodeMirror
              editorDidMount={(editor) => {
                this.editorInstance = editor;
              }}
              onDblClick={this.handleDoubleClick}
              value={toc}
              options={codeMirrorOptions}
            />
          </div>
        </div>
      }
      }
    </SettingsContext.Consumer>
  }
}

Navigator.contextType = SettingsContext;
