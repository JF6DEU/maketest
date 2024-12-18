eventCatchStatus = {
    debug: true
};
class eventCatch{
    constructor(element){
        this.elem = element;
    }
    // イベント追加を簡潔に(nodeに似てる)
    on(eventType, functions){
        // デバッグモードが入ってたら
        if (eventCatchStatus.debug){
            // それぞれ出力
            console.log("addedEvent: eventCatch", this.elem, functions);
        }
        // 要素に設定する
        this.elem.addEventListener(eventType, functions);
        return true;
    }
    waitClick(){
        // デバッグモードが入ってたら
        if (eventCatchStatus.debug){
            // それぞれ出力
            console.log("waitClick: eventCatch", this.elem);
        }
        // promiseを返すことでそこまで処理を停止できる
        return new Promise((r) => this.elem.onclick = function(e){
            // デバッグモードが入ってたら
            if (eventCatchStatus.debug){
                // それぞれ出力
                console.log("waitClickEnd: eventCatch", e.target);
            }
            // イベントを削除
            e.target.onclick = function(){};
            r(true);
        });
    }
}