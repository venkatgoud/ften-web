import React from "react"
import { Page, View, Text, Document, StyleSheet } from '@react-pdf/renderer';
import { PDFViewer } from '@react-pdf/renderer';
import parser from '../lib/fountain.js'

let DPI = 72

const stylesIndian = StyleSheet.create({
  page: {
    flexDirection: 'col',
    paddingTop: DPI * 1,
    paddingBottom: DPI * 1,
    fontSize: 12,
    fontFamily: "Courier",
    lineHeight: 1
  },
  scene_heading: {
    padding: 0,
    marginLeft: DPI * 1.5,
    marginRight: DPI * 0.75,
    fontFamily: "Courier-Bold",
    textDecoration: "underline"
  },
  action: {
    marginLeft: DPI * 1.5,
    marginRight: DPI * 4
  },
  character: {
    marginLeft: DPI * 6,
    marginRight: DPI * 1
  },
  parenthetical: {
    marginLeft: DPI * 5.5,
    marginRight: DPI * 1
  },
  dialogue: {
    marginLeft: DPI * 5.5,
    marginRight: DPI * 1
  },
  transition: {
    alignSelf: "flex-end",
    marginRight: DPI * 0.5
  },
  pageNumbers: {
    position: 'absolute',
    top: 40,
    right: 60,
    textAlign: 'left'
  }
});

const standardStyles = StyleSheet.create({
  page: {
    flexDirection: 'col',
    paddingTop: DPI * 1,
    paddingBottom: DPI * 1,
    fontSize: 12,
    fontFamily: "Courier",
    lineHeight: 1
  },
  transition: {
    alignSelf: "flex-end",
    marginRight: DPI * 0.5
  },
  parenthetical: {
    marginLeft: DPI * 3,
    marginRight: DPI * 1
  },
  dialogue: {
    marginLeft: DPI * 2.5,
    marginRight: DPI * 2.25
  },
  character: {
    marginLeft: DPI * 3.5,
    marginRight: DPI * 1
  },
  action: {
    padding: 0,
    marginLeft: DPI * 1.5,
    marginRight: DPI * 0.75
  },
  scene_heading: {
    padding: 0,
    marginLeft: DPI * 1.5,
    marginRight: DPI * 0.75,
    fontFamily: "Courier-Bold",
    textDecoration: "underline"
  },
  pageNumbers: {
    position: 'absolute',
    top: 40,
    right: 60,
    textAlign: 'left'
  }
});

const MyDocument = (props) => (
  <Document>
    <Page size="LETTER" style={props.styles.page}>
      <Text style={props.styles.pageNumbers} render={({ pageNumber, totalPages }) => (
        `${pageNumber} / ${totalPages}`
      )} fixed />
      <View>
        {generate(props)}
      </View>
    </Page>
  </Document>
)

let pdfContent = (tokens, styles) => (
  tokens.map((token, index) => {
    switch (token.type) {
      case 'scene_heading':
      case 'action':
      case 'dialogue_end':
      case 'transition':
        return <View key={index}>
          <Text style={styles[token.type]}>{token.text}</Text>
          <Text style={styles.heading}>{"\n"}</Text>
        </View>
      case 'character':
      case 'dialogue':
      case 'parenthetical':
        return <Text key={index} style={styles[token.type]}>{token.text}</Text>
      default:
        return <View key={index} />
    }

  })
)

function generate(props) {

  let tokens = parser.parse(props.content.toString(), true).tokens

  return pdfContent(tokens, props.styles);

}


export default class Preview extends React.Component {
  render() {
    return <div className="pdf">
      <PDFViewer style={{ width: "100%", height: "90vh" }}>
        <MyDocument
          content={this.props.content}
          styles={this.props.indian ? stylesIndian : standardStyles} />
      </PDFViewer>
    </div>
  }
}
