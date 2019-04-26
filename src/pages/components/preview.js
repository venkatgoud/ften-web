import React from "react"
import { Page, Text, Document, StyleSheet } from '@react-pdf/renderer';
import { PDFViewer } from '@react-pdf/renderer';
import parser from '../lib/fountain.js'

//inches
const pageMargins = {
    left: 1.5,
    right: 1,
    top: 1,
    bottom: 1
}
// const headingMargin = 1.5
const characterMargin = 3.7
const dialogMargin = 2.5
const parentheticalMargin = 3.1
let DPI = 72

// Create styles
const stylesIndian = StyleSheet.create({
  page: {
    //for some reason marginRight is not working so using padding instead
    flexDirection: 'col',
    paddingLeft: pageMargins.left*DPI,
    paddingRight: pageMargins.right*DPI,
    paddingTop: pageMargins.top*DPI,
    paddingBottom: pageMargins.bottom*72,
  },
  scene_heading: {
    paddingTop: 16,
  },
  action: {
    textAlign: 'left',
    paddingTop: 16,
    paddingRight: '40%'
  },
  character: {
    paddingTop: 16,
    paddingLeft: '60%',
  },
  parenthetical: {
    paddingLeft: '60%',
  },
  dialogue: {
    paddingLeft: '60%',
    fontSize: 14
  },
  transition: {
    textAlign: 'right',
    paddingTop: 16
  },
  ignored: {
    color: 'red'
  }
});

const styles = StyleSheet.create({
  page: {
    //for some reason marginRight is not working so using padding
    flexDirection: 'col',
    paddingLeft: pageMargins.left*DPI,
    paddingRight: pageMargins.right*DPI,
    paddingTop: pageMargins.top*DPI,
    paddingBottom: pageMargins.bottom*72,
    fontFamily: 'Courier'
  },
  scene_heading: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  action: {
    textAlign: 'left'
  },
  character: {
    paddingTop: 16,
    paddingLeft: (characterMargin-pageMargins.left)*DPI
  },
  parenthetical: {
    paddingLeft: (parentheticalMargin-pageMargins.left)*DPI
  },
  dialogue: {
    paddingLeft: (dialogMargin-pageMargins.left)*DPI,
    fontSize: 14
  },
  transition: {
    textAlign: 'right',
    paddingTop: 16
  },
  ignored: {
    color: 'red'
  }
});

const MyDocument = (props) => (
  <Document>
    <Page size="A4" style={props.styles.page}>
      {generate(props)}
    </Page>
  </Document>
)

const Element = ({styles, token, text}) => {
  return <Text style={styles[token]}>{text}</Text>
}

function generate(props) {

  let tokens = parser.parse(props.content.toString(), true).tokens

  let elements = tokens.map(function (token,i) {
    let element
    switch (token.type) {
      case 'title':
      case 'credit':
      case 'author':
      case 'authors':
      case 'source':
      case 'notes':
      case 'draft_date':
      case 'date':
      case 'contact':
      case 'copyright':
      case 'page_break':
      case 'line_break':
      case 'centered':
      case 'section':
      case 'synopsis':
      case 'note':
      case 'boneyard_begin':
      case 'boneyard_end':
        element = <Element key={i} styles={props.styles} token={'ignored'} text={token.text}/>; break;
      case 'dialogue_begin':
      case 'dialogue_end':
      case 'dual_dialogue_begin':
      case 'dual_dialogue_end': break; //TODO
      case 'scene_heading':
      case 'transition':
      case 'action':
      case 'parenthetical':
      case 'dialogue':
      case 'character':
        element = <Element key={i} styles={props.styles} token={token.type} text={token.text}/>; break;
      default:  if (!token.text) { console.log(token) } break;
    }
    return element
  });
  return elements;
}


export default class Preview extends React.Component {
    render() {
      return <div className="pdf">
        <PDFViewer style={{width:"100%",height:"90vh"}}>
          <MyDocument
            content={this.props.content}
            styles={this.props.indian ? stylesIndian : styles}/>
        </PDFViewer>
      </div>
    }
}
