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

export {isAllowedExtension, FILE_EDIT, FILE_NEW, FILE_OPEN, EDITOR_MODE_TRANS, EDITOR_MODE, SETTINGS,PREVIEW_MODE,PREVIEW_MODE_INDIAN, TRANSLITERATE}