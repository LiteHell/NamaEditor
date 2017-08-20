module.exports = function(Designer, handlerEnv){
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