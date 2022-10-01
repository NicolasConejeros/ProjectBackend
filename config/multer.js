let multer = require('multer');
// const path = require('path');
const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, '-') + '.mp3');
    }
});
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'audio/mpeg' ||
        file.mimetype === 'audio/wave' ||
        file.mimetype === 'audio/wav' ||
        file.mimetype === 'audio/mp3'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};
exports.upload = multer({
    storage: storage,
    fileFilter: fileFilter
});
