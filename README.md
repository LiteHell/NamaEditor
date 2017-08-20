# NamaEditor
**NamaEditor** is an editor plugin, specialized for namumark.

**NOTE : Development in Progress**

## Requirements
- jQuery
- FontAwesome
- Toastr

## Build
```
npm install --only=dev
npm run build
```

## Installation
```html
<script src="NamaEditor.js"></script> <!-- /dist/bundle.js-->
<script src="NamaEditor.css"></script> <!-- /NamaEditor.css -->
```

## Usage
```javascript
// NOTE : NamaEditor must be called once, and options can't be changed after NamaEditor applied.

// this will make editor, but tempsave feature will work strangely (because document name and section aren't specified).
$('textarea').NamaEditor();

// document name and section(null if editing whole document) sholud be specified
$('textarea').NamaEditor({
    docName: 'Lorem ipsum',
    section: 2
});

// you can also specify additional options
$('textarea').NamaEditor({
    docName: 'Lorem ipsum',
    section: 2,
    style: 'height: 600px;' // NOTE : style is applied to textarea element
});

// you can also use NamaEditor with Image upload support
// drag-drop is also supported, but you must drag-drop file into textarea.
$('textarea').NamaEditor({
    docName: 'Lorem ipsum',
    section: 2,
    style: 'height: 600px;',
    fastUpload: true,
    uploadFunc: function (files, callback) {
        // callback takes two arguments: error, result(array)
        var result = [];
        for (var i = 0; i < files.length; i++) {
            // files is array of File objects.
            // for more information about File interface, see here:
            // https://developer.mozilla.org/en-US/docs/Web/API/File
            var file = files[i];

            //console.log('file name : ' + file.name);
            //console.log('file type : ' + file.type);
            //console.log('file size : ' + file.size);
            
            /*
             *
             *
             *
             *
             * Do something here
             *
             *
             *
             *
             */
            
            if(sucess) {
                // if uploading success
                result.push({
                    filename: file.name, 
                    success: true, 
                    docName:"파일:Something.png"
                    });
            } else {
                // if upload failed
                result.push({
                    filename: file.name,
                    success: false
                });
            }
        }
        // callback should be called ONCE when every files are processed.
        callback(null, result);
    }
});
```

## Available options
for more options, see `src/defaultOptions.js` file

## TO-DO
[x] Temporary save
[x] Markup helper
[x] Image upload
[ ] Better dropdown
[ ] Shortcut
[ ] Template inserting (document template)
[ ] Template inserting (include macro)
[ ] Macro inserting

## Copyrights
Copyrights (C) 2017 LiteHell
Distributed under MIT License.