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
// this will make editor.
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
    style: 'height: 600px;'
});

// NOTE : NamaEditor must be called once, and options can't be changed after NamaEditor applied.
```

## Available options
see `src/defaultOptions.js` file

## Copyrights
Copyrights (C) 2017 LiteHell
Distributed under MIT License.