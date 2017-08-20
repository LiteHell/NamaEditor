var createDesigner = require('./toolbarDesigner'),
    createTextProcessor = require('./textProcessor'),
    tempsaves = new(require('./tempsaves'))({
        get: function (n, d) {
            return localStorage.getItem(n) === null ? d : localStorage.getItem(n);
        },
        set: function (n, v) {
            return localStorage.setItem(n, v);
        }
    }),
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
            tempsaves: tempsaves,
            editorOptions: options
        };

        // make decoration buttons
        if (options.decorationButtons) {
            var fontFuncClosure = function (markup) {
                return (function () {
                    return this.textProc.ToggleWrapSelection(markup);
                }).bind(handlerEnv);
            };
            var fontSizeFuncClosure = function (isIncrement) {
                return (function () {
                    var fontSizePattern = /^\{\{\{\+([12345]) (.+?)\}\}\}$/;
                    if (this.textProc.selectionTest(fontSizePattern)) {
                        var matches = fontSizePattern.exec(this.textProc.selectionText());
                        var newsize = parseInt(matches[1]);
                        if (isIncrement && newsize < 5)
                            newsize++;
                        else if (!isIncrement && newsize > 1)
                            newsize--;
                        this.textProc.selectionText('{{{+' + newsize + ' ' + matches[2] + '}}}');
                    } else {
                        if (isIncrement) {
                            this.textProc.selectionText('{{{+1 ' + this.textProc.selectionText() + '}}}');
                        } else {
                            this.textProc.selectionText('{{{+5 ' + this.textProc.selectionText() + '}}}');
                        }
                    }
                }).bind(handlerEnv);
            };
            var decoDropdown = Designer.dropdown('<span class="fa fa-font"></span>').hoverMessage('텍스트 서식 문법들');
            decoDropdown.button('<span class="fa fa-bold"></span>', '굵음').click(fontFuncClosure("''"));
            decoDropdown.button('<span class="fa fa-italic"></span>', '기울임꼴').click(fontFuncClosure("//"));
            decoDropdown.button('<span class="fa fa-underline"></span>', '밑줄').click(fontFuncClosure("__"));
            decoDropdown.button('<span class="fa fa-strikethrough"></span>', '취소선').click(fontFuncClosure("--"));
            decoDropdown.button('<span class="fa fa-superscript"></span>', '윗첨자').click(fontFuncClosure("^^"));
            decoDropdown.button('<span class="fa fa-subscript"></span>', '아랫첨자').click(fontFuncClosure(",,"));
            decoDropdown.button('<span class="fa fa-angle-down"></span>', '글씨 작게').click(fontSizeFuncClosure(false));
            decoDropdown.button('<span class="fa fa-angle-up"></span>', '글씨 크게').click(fontSizeFuncClosure(true));
            //decoDropdown.button('<span class="fa fa-bold"></span>', '글씨색').click(fontFuncClosure("''"));
        }

        // make tempsave button
        if (options.tempsaves) {
            var tempsaveDropdown = Designer.dropdown('<span class="fa fa-save"></span>').hoverMessage('임시저장');
            tempsaveDropdown.button('<span class="fa fa-save"></span>', '지금 임시저장').click((function () {
                this.tempsaves.saveTempsave(this.editorOptions.docName, Date.now(), txtarea.value, this.editorOptions.section)
                return toastr.success('임시저장 완료. <br>문단명 : ' + this.editorOptions.docName + (this.editorOptions.section ? '<br> 문단 번호 : ' + this.editorOptions.section : ''));
            }).bind(handlerEnv));
            tempsaveDropdown.button('<span class="fa fa-folder-open"></span>', '최근 임시저장 불러오기').click((function () {
                var curSection = this.editorOptions.section;
                var tempsaves = this.tempsaves.getTempsaves(this.editorOptions.docName).filter(function (v) {
                    return v.section === curSection;
                });
                if (tempsaves.length === 0)
                    return toastr.error('해당 문서의 해당 문단에 대해 임시저장이 없습니다.')
                tempsaves = tempsaves.sort(function (a, b) {
                    return b.timestamp - a.timestamp; // DESC
                })
                this.textProc.value(tempsaves[0].value);
                var dateObj = new Date(tempsaves[0].timestamp);
                return toastr.success('성공적으로 ' + dateObj.toString() + '에 저장된 임시저장을 반영했습니다.')

            }).bind(handlerEnv));
            //tempsaveDropdown.button('<span class="fa fa-trash" style="color: red;"></span>', '이 문단의 임시저장 전체 삭제');
            //tempsaveDropdown.button('<span class="fa fa-trash" style="color: orange;"></span>', '이 문서의 임시저장 전체 삭제');
            //tempsaveDropdown.button('<span class="fa fa-trash" style="color: yellow;"></span>', '특정 임시저장 전체 삭제');
        }

        // set style
        if (options.style)
            e.setAttribute('style', options.style);

        if (options.fastUpload && options.uploadFunc) {
            // https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop
            function whenUploaded(err, files, finisher) {
                if (err) {
                    toastr.error('파일 업로드중 무언가 오류가 발생했습니다.<br>' + br.message);
                    $(e).prop('disabled', false);
                    throw err;
                }
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    if (file.success) {
                        toastr.success('파일 업로드 성공<br>파일 이름 : ' + file.filename + '<br>위키내 파일 문서 이름 : ' + file.docName)
                        TextProc.selectionText(TextProc.selectionText() + '[[' + file.docName + ']]');
                    } else {
                        toastr.error('파일 업로드 실패<br>파일 이름 : ' + file.filename);
                    }
                }
                $(e).prop('disabled', false);
                if (typeof finisher !== 'undefined')
                    finisher();
            }
            txtarea.addEventListener('drop', function (evt) {
                evt.preventDefault();
                var dt = evt.dataTransfer;
                var files = [];
                if (dt.items) {
                    for (var i = 0; i < dt.items.length; i++) {
                        if (dt.items[i].kind == "file") {
                            var f = dt.items[i].getAsFile();
                            files.push(f);
                        }
                    }
                } else {
                    for (var i = 0; i < dt.files.length; i++) {
                        files.push(dt.files[i]);
                    }
                }
                if (files.length !== 0) {
                    $(e).prop('disabled', true);
                    options.uploadFunc(files, whenUploaded)
                }
            });
            txtarea.addEventListener('dragover', function (evt) {
                evt.preventDefault();
            });
            txtarea.addEventListener('dragend', function (evt) {
                var dt = evt.dataTransfer;
                if (dt.items) {
                    for (var i = 0; i < dt.items.length; i++) {
                        dt.items.remove(i);
                    }
                } else {
                    evt.dataTransfer.clearData();
                }
            });
            Designer.button('<span class="fa fa-image"></span>').hoverMessage('이미지 업로드').click(function () {
                var fileInput = $("input#namaeditor-file").length > 0 ? document.querySelector('input#namaeditor-file') : document.createElement("input");
                fileInput.id = 'namaeditor-file';
                fileInput.setAttribute("type", "file");
                fileInput.setAttribute("multiple", "1");
                fileInput.style.visibility = "hidden";
                fileInput.setAttribute("accept", "image/*");
                document.body.appendChild(fileInput);
                fileInput.addEventListener('change', function (evt) {
                    if(evt.target.files.length === 0) return;
                    $(e).prop('disabled', true);
                    options.uploadFunc(evt.target.files, whenUploaded);
                });
                fileInput.click();
            });
        }

        // insert NamaEditor
        var oldTextarea = e;
        var wText = e.value;
        e.parentNode.insertBefore(rootDiv, e);
        rootDiv.appendChild(txtarea);
        txtarea.value = wText;
    });
};