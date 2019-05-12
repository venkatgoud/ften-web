let CodeMirror;
if (typeof navigator !== 'undefined') {
  CodeMirror = require('codemirror');
}

const WORD = /[\w$]+/;

// TODO lot of improvements can be done here but this is just a POC for futher work.

function suggestions(wordList, word) {
  //wordList is a sorted string each word is separated by a space

  let start = wordList.indexOf(' '+ word);
  let end = wordList.lastIndexOf(' '+ word);

  if (start === end) {
    //there is only one word, find that word
    while (wordList[end++] !== ' ')      
    return [wordList.slice(start,end)]
  }

  let words = wordList.slice(start, end+1);     
  let list = words ? words.trim().split(' ') : [];
  return list;
}

export default function teluguwordFn(editor, options) {

  console.log('teluguwordFn'); 
  
  let cursor = editor.getCursor();
  let curLine = editor.getLine(cursor.line); // entire line the cursor is on
  let end = cursor.ch; //cursor's position on the line. starting from zero.
  let start = end;

  if (!options.commonWords) {
    return { list: [], from: CodeMirror.Pos(cursor.line, start), to: CodeMirror.Pos(cursor.line, end) };
  }

  let word = (options && options.word) || WORD;

  // traversing back from the cursor position till the beginning of the word to get the word below.
  while (start && word.test(curLine.charAt(start - 1))) --start;
  
  let curWord = (start !== end) && curLine.slice(start, end);      
  let list = suggestions(options.commonWords, curWord);

  return { list: list, from: CodeMirror.Pos(cursor.line, start), to: CodeMirror.Pos(cursor.line, end) };
}
