const parser = require('./fountain')
const Sanscript = require('./sanscript')
// var concat = require('concat-stream')

function transliterate(input, fromScheme, toScheme) {
  var output = Sanscript.Sanscript.t(input, fromScheme, toScheme); //TODO
  return output
}

function transform(dialog, dictionary, fromScheme, toScheme) {
  const tokens = dialog.split(' ')
  var output = '';
  for(let i=0; i< tokens.length; i++) {
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
  let inDictionary =  dictionary[word.replace(/[!?,.]*$/g,'').toLowerCase()]
  return inDictionary
}


// pass data to transliterate. It will call done when it is done.
function literate(data, dictionary,fromScheme, toScheme, done) {  
  
  var result = [];
  var output = {
    write : function(line) {result.push(line)},
    end: function() { done(result.join(""))}
  }
  
  // var output = concat((buffer) => done(buffer)); //create a stream

  parser.parse(data.toString(), true, function (result) {
    var tokens = result.tokens;
    for(let i=0; i < tokens.length; i++) {
      let token = tokens[i];
      switch (token.type) {
        case 'parenthetical': output.write(token.text+'\n'); break;
        case 'title': output.write('\ntitle:' + token.text); break;
        case 'credit': output.write('\ncredit:' + token.text); break;
        case 'author': output.write('\nauthors:' + token.text); break;
        case 'authors': output.write('\nauthors:' + token.text); break;
        case 'source': output.write('\nsource:' + token.text); break;
        case 'notes': output.write('\nnotes:' + token.text); break;
        case 'draft_date': output.write('\ndraft_date:' + token.text); break;
        case 'date': output.write('\ndate:' + token.text); break;
        case 'contact': output.write('\ncontact:' + token.text); break;
        case 'copyright': output.write('\ncopyright:' + token.text); break;
        case 'character': output.write(token.text+'\n'); break;
        case 'page_break':output.write("\n\n"); break;
        case 'line_break': output.write("\n\n"); break;
        case 'scene_heading':
        case 'transition':
        case 'action':  output.write('\n'+token.text+'\n'); break;
        case 'dialogue_begin':
        case 'dialogue_end': output.write("\n"); break;
        case 'dual_dialogue_begin': break;
        case 'dual_dialogue_end': break;
        case 'dialogue':              
            output.write(transform(token.text, dictionary, fromScheme, toScheme));
            break;
        case 'section': //TODO
        default: 
          if (!token.text) { 
            console.log('unknown token'+ token); 
          } 
          // output.write(token.text); 
        break;
    
      }
    }
    output.end();  
  })
}

module.exports = {
  literate: literate
}