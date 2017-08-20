var createDesigner = require('./toolbarDesigner'),
    createTextProcessor = require('./textProcessor'),
    defaultOptions = require('./defaultOptions');
$.fn.NamaEditor = function (_options) {
    toastr.options.closeButton = true;
    if (typeof _options === 'undefined')
        var _options = {};
    var options = $.extend(true, defaultOptions, _options);
    $(this).each(function (i, e) {
        var txtarea = e;
        if (txtarea.tagName.toLowerCase() !== 'textarea') {
            return;
        }
        var buttonBar = document.createElement('div');
        var rootDiv = document.createElement('div');
        buttonBar.className = 'NamaEditor NEMenu';
        txtarea.className = 'NamaEditor NETextarea'
        txtarea.name = document.querySelector("textarea").name;
        rootDiv.className += ' NamaEditor NERoot';
        rootDiv.appendChild(buttonBar);

        // Functions To Design
        var Designer = createDesigner(buttonBar);

        // Functions To Process
        var TextProc = createTextProcessor(txtarea);

        // make click handler environment
        var handlerEnv = {
            textProc: TextProc,
            editorOptions: options,
            tempsaves: new(require('./tempsaves'))({
                get: function (n, d) {
                    return localStorage.getItem(n) === null ? d : localStorage.getItem(n);
                },
                set: function (n, v) {
                    return localStorage.setItem(n, v);
                }
            })
        };

        // make decoration buttons
        if (options.decorationButtons) {
            require('./features/markups')(Designer, handlerEnv);
        }

        // make tempsave button
        if (options.tempsaves) {
            require('./features/tempsave')(Designer, handlerEnv);
        }

        // support drag-drop file upload and make file upload button
        if (options.fastUpload && options.uploadFunc) {
            require('./features/fastUpload')(Designer, handlerEnv, e);
        }
        // set style
        if (options.style)
            e.setAttribute('style', options.style);


        // insert NamaEditor
        var oldTextarea = e;
        var wText = e.value;
        e.parentNode.insertBefore(rootDiv, e);
        rootDiv.appendChild(txtarea);
        txtarea.value = wText;
    });
};