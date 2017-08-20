module.exports = function (Designer, handlerEnv) {
    var tempsaveDropdown = Designer.dropdown('<span class="fa fa-save"></span>').hoverMessage('임시저장');
    tempsaveDropdown.button('<span class="fa fa-save"></span>', '지금 임시저장').click((function () {
        this.tempsaves.saveTempsave(this.editorOptions.docName, Date.now(), this.textProc.value(), this.editorOptions.section)
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