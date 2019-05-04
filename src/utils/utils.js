const FILE_OPEN = "file_open"
const FILE_EDIT = "file_edit"
const FILE_NEW = "file_new" 
const SETTINGS = "settings"
const TRANSLITERATE = "transliterate"
const EDITOR_MODE = 'editor';
const EDITOR_MODE_TRANS = 'trans_editor';
const PREVIEW_MODE = 'preview';
const PREVIEW_MODE_INDIAN = 'preview_indian';

let isAllowedExtension = (fileName) => {
    return (fileName.match(/.+.[txt|fountain]$/) == null ? false : true)
}

let parseQueryString = function(str) {
  var ret = Object.create(null);

  if (typeof str !== 'string') {
    return ret;
  }

  str = str.trim().replace(/^(\?|#|&)/, '');

  if (!str) {
    return ret;
  }

  str.split('&').forEach(function (param) {
    var parts = param.replace(/\+/g, ' ').split('=');
    // Firefox (pre 40) decodes `%3D` to `=`
    // https://github.com/sindresorhus/query-string/pull/37
    var key = parts.shift();
    var val = parts.length > 0 ? parts.join('=') : undefined;

    key = decodeURIComponent(key);

    // missing `=` should be `null`:
    // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
    val = val === undefined ? null : decodeURIComponent(val);

    if (ret[key] === undefined) {
      ret[key] = val;
    } else if (Array.isArray(ret[key])) {
      ret[key].push(val);
    } else {
      ret[key] = [ret[key], val];
    }
  });

  return ret;
}

export {isAllowedExtension, parseQueryString, FILE_EDIT, FILE_NEW, FILE_OPEN, EDITOR_MODE_TRANS, EDITOR_MODE, SETTINGS,PREVIEW_MODE,PREVIEW_MODE_INDIAN, TRANSLITERATE}