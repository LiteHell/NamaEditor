module.exports = {
    decorationButtons: true,
    tempsaves: true,
    docName: 'unnamed namaeditor document',
    style: null,
    section: null, // section number, null if editing whole document
    fastUpload: false, // uploadFunc must be implemented before enabling fastUpload
    uploadFunc: function(files, callback) {
        // callback takes two arguments: error, result(array)
        var result = [];
        for(var i = 0; i < files.length; i++) {
            // files is array of File objects.
            // for more information about File interface, see here:
            // https://developer.mozilla.org/en-US/docs/Web/API/File
            var file = files[i];
            console.log('file name : ' + file.name);
            console.log('file type : ' + file.type);
            console.log('file size : ' + file.size);
            // Do something here
            // if failed
            result.push({filename: file.name, success: false});
            // elif if success
            // result.push({filename: file.name, success: true, docName:"파일:Something.png"});
        }
        // callback should be called ONCE when every files are processed.
        callback(null, result);
    }
};