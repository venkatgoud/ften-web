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
  },
  centered: {
    alignSelf: "center"
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
  },
  centered: {
    alignSelf: "center"
  }
});

const titleStyles = StyleSheet.create({
  page: {
    flexDirection: 'col',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '100%',
    fontSize: 12,
    fontFamily: "Courier"
  },
  title: {
    alignSelf: "center",
    fontSize: 18,
    fontFamily: "Courier-Bold",
    textDecoration: "underline",
    marginTop: DPI * 2
  },
  center_view: {
    justifyContent: 'space-between'
  },
  left_view: {
    alignSelf: 'flex-start',
    paddingLeft: 40
  },
  title_center_item: {
    padding: 4,
    alignSelf: "center"
  },
  title_left_item: {
    paddingLeft: DPI,
    paddingBottom: 2,
    alignSelf: "left"
  }
});

const MyDocument = (props) => (
  <Document>
    {generate(props)}
  </Document>
)

let pdfContent = (tokens, styles) => {

  let authorDetails = [];
  let contactDetails = [];
  let scriptTitle;
  let otherItems = [];

  tokens.forEach((token, index) => {
    console.log(token);
    switch (token.type) {
      case 'title':
        scriptTitle = <Text key={index} style={titleStyles.title}>{token.text}</Text>
        break;
      case 'credit':
      case 'author':
      case 'authors':
      case 'source':
      case 'notes':
        authorDetails.push(<Text key={index} style={titleStyles.title_center_item}>{token.text}</Text>)
        break;
      case 'draft_date':
      case 'date':
      case 'contact':
      case 'copyright':
        contactDetails.push(<Text key={index} style={titleStyles.title_left_item}>{token.text}</Text>)
        break;
      case 'scene_heading':
      case 'action':
      case 'dialogue_end':
      case 'transition':
        otherItems.push(<View key={index}>
          <Text style={styles[token.type]}>{token.text}</Text>
          <Text style={styles.heading}>{"\n"}</Text>
        </View>)
        break;
      case 'character':
      case 'dialogue':
      case 'parenthetical':
        otherItems.push(<Text key={index} style={styles[token.type]}>{token.text}</Text>)
        break;
      case 'centered':
        otherItems.push(< View key={index}>
          <Text style={styles[token.type]}>{token.text}</Text>
          <Text style={styles.heading}>{"\n"}</Text>
        </View>)
        break;
      default:
        otherItems.push(<View key={index} />)
        break;
    }
  })
  return < >
    {titlePage(scriptTitle, authorDetails, contactDetails)}
    <Page size="LETTER" style={styles.page}>
      <Text style={styles.pageNumbers} render={({ pageNumber, totalPages }) => (
        `${pageNumber} / ${totalPages}`
      )} fixed />
      <View>
        {otherItems}
      </View>
    </Page>
  </ >
}

let titlePage = (scriptTitle, authorDetails, leftscriptTitles) => (
  scriptTitle ?
    <Page size="LETTER" style={titleStyles.page} >
      {scriptTitle}
      <View style={titleStyles.center_view}>
        {authorDetails}
      </View>
      <View style={titleStyles.left_view}>
        {leftscriptTitles}
      </View>
    </Page>
    : null
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
