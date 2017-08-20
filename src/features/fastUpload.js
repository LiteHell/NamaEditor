module.exports = function (Designer, handlerEnv, e) { // e = textarea
    // https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop
    var TextProc = handlerEnv.textProc,
        options =  handlerEnv.editorOptions,
        txtarea = e;
    function whenUploaded(err, files) {
        if (err) {
            toastr.error('파일 업로드중 무언가 오류가 발생했습니다.<br>' + err.message);
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
            if (evt.target.files.length === 0) return;
            $(e).prop('disabled', true);
            options.uploadFunc(evt.target.files, whenUploaded);
        });
        fileInput.click();
    });
}