import fountainFoldFn from './fountain-fold';
import teluguwordFn from './teluguword';
import {commonTeluguWords} from '../utils/common_telugu_words';
import * as constants from './fountain-regex';


let CodeMirror;
if (typeof navigator !== 'undefined') {
  CodeMirror = require('codemirror');

  import('codemirror/addon/hint/show-hint.js');  
  import('codemirror/addon/hint/anyword-hint.js');   
}
export default function fountainModeFn(editorConf, config_) {

  console.log('fountainModeFn');
  
  CodeMirror.registerHelper('fold', 'fountain', fountainFoldFn);
  CodeMirror.registerHelper('hint', 'teluguword', teluguwordFn);

  CodeMirror.commands.autocomplete = function(cm) {     
    cm.showHint({hint: CodeMirror.hint.anyword});
  }
   
  CodeMirror.commands.teluguAutoComplete = function(cm) {
    cm.showHint({hint: CodeMirror.hint.teluguword, commonWords: commonTeluguWords});  
  }

  function startState() {
    console.log('startState');
    const state = {
      blankLine: false,
      character: false,
      parenthetical: false
    };
    return state;
  }

  function isNextLineBlank(stream) {
    const nextLine = stream.lookAhead(1);
    return (!nextLine || nextLine === '');
  }

  /** The stream object that's passed to token encapsulates a line of code 
   * (tokens may never span lines) and our current position in that line 
   * It should read one token from the stream it is given as an argument, 
   * optionally update its state, and return a style string, or null for tokens that do not have to be styled. 
   * For your styles, you are encouraged to use the 'standard' names defined in the themes 
   * (without the cm- prefix). If that fails, it is also possible to come up with your own and write your own CSS theme file.
   * */
  function token(stream, state) {
    console.log('token');

    if (stream.match(constants.ITALICS)) {
      stream.skipToEnd();
      return 'em';
    }

    if (stream.match(constants.BOLD)) {
      stream.skipToEnd();
      return 'strong';
    }

    if (stream.match(constants.BOLD_ITALICS)) {
      stream.skipToEnd();
      return 'em strong';
    }

    if (stream.match(constants.UNDERLINE)) {
      stream.skipToEnd();
      return 'link';
    }

    if (stream.match(constants.SECTION)) {
      stream.skipToEnd();
      return 'ften-section';
    }

    if (stream.match(constants.CENTERED_TEXT)) {
      stream.skipToEnd();
      state.blankLine = false;
      state.character = false;
      state.dialog = false;
      state.parenthetical = false;
      return 'ften-centered-text';
    }

    if ((state.character || state.dialog) && stream.match(constants.PARENTHETICAL)) {
      stream.skipToEnd();
      state.blankLine = false;
      state.character = false;
      state.dialog = true;
      state.parenthetical = true;
      return 'variable-2 ften-parenthetical';
    }
    if (state.character || state.parenthetical) {
      stream.skipToEnd();
      state.blankLine = false;
      state.character = false;
      state.parenthetical = false;
      state.dialog = true;
      return 'string ften-dialog';
    }
    if (state.blankLine) {
      if (stream.match(constants.CHARACTER) && !isNextLineBlank(stream)) {
        stream.skipToEnd();
        state.blankLine = false;
        state.character = true;
        state.dialog = false;
        state.parenthetical = false;
        return 'keyword ften-character';
      }

      if (stream.match(constants.TRANSITION) && isNextLineBlank(stream)) {
        stream.skipToEnd();
        state.blankLine = false;
        state.character = false;
        state.dialog = false;
        state.parenthetical = false;
        return 'line-ften-transition';
      }
    }

    if (stream.sol() && stream.match(constants.SCENE_HEADING) && isNextLineBlank(stream)) {
      stream.skipToEnd();
      state.blankLine = false;
      state.character = false;
      state.dialog = false;
      state.parenthetical = false;
      return 'variable-2 line-ften-slugline';
    }

    stream.next();
    return 'line-ften-action';
  }
  function blankLine(state) {
    state.blankLine = true;
  }

  return {
    startState,
    token,
    blankLine
  };
}
