import * as CM from 'codemirror';
import fountainFoldFn from './fountain-fold';

const SCENE_HEADING = /(^\.[\w]+.+)|(?:(?:^int|ext|est|int\.ext|int\/ext|i\/e)[. ].+)$/i;
const TRANSITION = /^[A-Z\s]+TO:$/;
const CHARACTER = /^['A-Z\s\d]+(\s*\(.+\)\s*)*$/;
const PARENTHETICAL = /^\s*\(.+\)\s*$/;
const CENTERED_TEXT = /^>(.+)<$/;
const SECTION = /^#+/;
const ITALICS = /^\*(.+)\*$/;
const BOLD = /^\*\*(.+)\*\*$/;
const BOLD_ITALICS = /^\*\*\*(.+)\*\*\*$/;
const UNDERLINE = /^_(.+)_$/;

export default function fountainModeFn(editorConf, config_) {
  // CM.registerHelper('fold', 'fountain', fountainFoldFn);
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

  function token(stream, state) {
    console.log('token');

    if (stream.match(ITALICS)) {
      stream.skipToEnd();
      return 'em';
    }

    if (stream.match(BOLD)) {
      stream.skipToEnd();
      return 'strong';
    }

    if (stream.match(BOLD_ITALICS)) {
      stream.skipToEnd();
      return 'em strong';
    }

    if (stream.match(UNDERLINE)) {
      stream.skipToEnd();
      return 'link';
    }

    if (stream.match(SECTION)) {
      stream.skipToEnd();
      return 'line- ften-section';
    }

    if (stream.match(CENTERED_TEXT)) {
      stream.skipToEnd();
      state.blankLine = false;
      state.character = false;
      state.dialog = false;
      state.parenthetical = false;
      return 'line- ften-centered-text';
    }

    if ((state.character || state.dialog) && stream.match(PARENTHETICAL)) {
      stream.skipToEnd();
      state.blankLine = false;
      state.character = false;
      state.dialog = true;
      state.parenthetical = true;
      return 'line- variable-2 ften-parenthetical';
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
      if (stream.match(CHARACTER) && !isNextLineBlank(stream)) {
        stream.skipToEnd();
        state.blankLine = false;
        state.character = true;
        state.dialog = false;
        state.parenthetical = false;
        return 'line- keyword ften-character';
      }

      if (stream.match(TRANSITION) && isNextLineBlank(stream)) {
        stream.skipToEnd();
        state.blankLine = false;
        state.character = false;
        state.dialog = false;
        state.parenthetical = false;
        return 'line- ften-transition';
      }
    }
    if (stream.match(SCENE_HEADING) && isNextLineBlank(stream)) {
      stream.skipToEnd();
      state.blankLine = false;
      state.character = false;
      state.dialog = false;
      state.parenthetical = false;
      return 'line- variable-2 ften-slugline';
    }

    stream.next();
    return 'line- ften-action';
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
