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
$('textarea').NamaEditor();

// if you want options
$('textarea').NamaEditor({style: 'height: 600px;'})
```

## Available options
see `src/defaultOptions.js` file

## Copyrights
Copyrights (C) 2017 LiteHell
Distributed under MIT License.