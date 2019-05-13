import { SCENE_HEADING } from './fountain-regex';

let CodeMirror;
if (typeof navigator !== 'undefined') {
  CodeMirror = require('codemirror');
}

export default function fountainFoldFn(cm, start) {
  const maxDepth = 100;

  function isSection(lineNo) {
    const tokentype = cm.getTokenTypeAt(CodeMirror.Pos(lineNo, 0));
    const res = /\bsection\b/.test(tokentype);
    return tokentype && res;
  }

  function sectionLevel(lineNo, line, nextLine) {
    const match = line && line.match(/^#+/);
    if (match && isSection(lineNo)) return match[0].length;
    // match = nextLine && nextLine.match(/^[=\-]+\s*$/);
    // if (match && isSection(lineNo + 1)) return nextLine[0] === '=' ? 1 : 2;
    return maxDepth;
  }

  function sceneHeading(lineNo, line) {
    return line && SCENE_HEADING.test(line);
  }

  const firstLine = cm.getLine(start.line);
  let nextLine = cm.getLine(start.line + 1);
  // sceneHeading folding
  if (sceneHeading(start.line, firstLine)) {
    const lastLineNo = cm.lastLine();
    let end = start.line;
    let nextNextLine = cm.getLine(end + 2);

    while (end < lastLineNo) {
      if (sceneHeading(end + 1, nextLine) || isSection(end + 1)) break;

      ++end;
      nextLine = nextNextLine;
      nextNextLine = cm.getLine(end + 2);
    }
    // console.log(`fold from ${start.line} to ${end}`);
    return {
      from: CodeMirror.Pos(start.line, firstLine.length),
      to: CodeMirror.Pos(end, cm.getLine(end).length)
    };
  }

  const level = sectionLevel(start.line, firstLine, nextLine);
  if (level === maxDepth) return undefined;

  // Follow markdown header-level folding rules
  const lastLineNo = cm.lastLine();
  let end = start.line;
  let nextNextLine = cm.getLine(end + 2);
  while (end < lastLineNo) {
    if (sectionLevel(end + 1, nextLine, nextNextLine) <= level) break;
    ++end;
    nextLine = nextNextLine;
    nextNextLine = cm.getLine(end + 2);
  }

  return {
    from: CodeMirror.Pos(start.line, firstLine.length),
    to: CodeMirror.Pos(end, cm.getLine(end).length)
  };
}
