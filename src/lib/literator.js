import * as FountainRegEx from './fountain-regex';
const Sanscript = require('./sanscript');

function transliterate(input, fromScheme, toScheme) {
  var output = Sanscript.Sanscript.t(input, fromScheme, toScheme); //TODO
  return output
}

function transform(dialog, dictionary, fromScheme, toScheme) {
  const tokens = dialog.split(' ')
  var output = '';
  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i];
    if (exclude(token.trim(), dictionary)) {
      output = output + token + ' '
    }
    else {
      output = output + transliterate(token, fromScheme, toScheme) + ' '
    }
  }

  return output;
}

function exclude(word, dictionary) {
  //remove trailing exclaimations  
  let inDictionary = dictionary[word.replace(/[-!?,.]*$/g, '').toLowerCase()]
  return inDictionary
}

// pass data to transliterate. It will call done when it is done.,
export default function literate(data, dictionary, fromScheme, toScheme, opts = {}) {

  var result = [];

  let wasCharacter = false;

  let convert = (line) => {
    if (line.trim() === '') {
      result.push(line);
    }
    else if (FountainRegEx.CHARACTER.test(line)) {
      result.push(line);
      wasCharacter = true;
    }
    else if (wasCharacter && FountainRegEx.PARENTHETICAL.test(line)) {
      result.push(line);
    }
    else if (wasCharacter && opts.transDialog) {
      wasCharacter = false;
      result.push(transform(line, dictionary, fromScheme, toScheme));
    }
    else if (opts.transAction) {
      if (!(FountainRegEx.CHARACTER.test(line) ||
        FountainRegEx.SCENE_HEADING.test(line) ||
        FountainRegEx.SECTION.test(line) ||
        FountainRegEx.TRANSITION.test(line))) {
        result.push(transform(line, dictionary, fromScheme, toScheme));
      }
      else {
        result.push(line);
      }
    }
    else {
      result.push(line)
    }
  }

  let lines = data.split(/\r?\n/);

  for (let index = 0; index < lines.length; index++) {
    convert(lines[index]);
    if (index !== lines.length - 1)
      result.push('\n');
  }

  return result.join("");
}

