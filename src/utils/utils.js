const FILE_OPEN = "file_open"
const FILE_EDIT = "file_edit"
const PREVIEW = "fountain_preview"
const FILE_SAVE = "file_save"
const SETTINGS = "settings"
const TRANSLITERATE = "transliterate"


let isFountainExtension = (fileName) => {
    return (fileName.match(/.+.fountain$/) == null ? false : true)
}

export {isFountainExtension, FILE_EDIT, FILE_OPEN, FILE_SAVE, SETTINGS, PREVIEW, TRANSLITERATE}