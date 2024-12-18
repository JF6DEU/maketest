let windowUpdateStatus = {
    mojiutiWaitTime: [
        ["fast", "middle", "low"],
        [50, 100, 300]
    ],
    debug: true
};
/*
    注意：
    eventcatch.js
    を読んだ後に実行すること。
*/
class windowUpdate{
    constructor(element = document.getElementsByClassName("click_inner")[0], sousa = document.getElementsByClassName("sousa")[0], click_sita = document.getElementsByClassName("click_sita")[0]){
        this.elem = element;
        this.sousa = sousa;
        this.click_sita = click_sita;
    }
    wait(t){
        return new Promise((r) => setTimeout(r, t));
    }
    clear(){
        // 全内容を消し、操作と続きを消す
        this.elem.innerHTML = "";
        this.sousa.style.display = "none";
        this.click_sita.style.display = "none";
    }
    sousaDisp(isOn = true){
        // sousaの入り切りをする。
        if (isOn){
            this.sousa.style.display = "block";
        } else {
            this.sousa.style.display = "none";
        }
    }
    clickDisp(isOn = true){
        // click_sitaの入り切りをする。
        if (isOn){
            this.click_sita.style.display = "block";
        } else {
            this.click_sita.style.display = "none";
        }
    }
    findWait(waitNameOrTime){
        // 待つ時間を定義
        let waitTime = 0;
        // undefinedの場合はエラーを返す
        if (waitNameOrTime === undefined){
            console.error("Cannot find wait chars: windowUpdate");
            return waitTime;
        }
        if (isNaN(Number(waitNameOrTime))){
            // 文字が入っている。もしかしたらwaitTimeにあるかも。
            // mojiutiから探してくる
            let waitIndex = windowUpdateStatus.mojiutiWaitTime[0].findIndex((f) => f == waitNameOrTime);
            if (waitIndex === -1){
                // 残念。ありませんでした。
                console.error("Cannot find wait index name: windowUpdate", waitNameOrTime);
            } else {
                // あったら代入
                waitTime = windowUpdateStatus.mojiutiWaitTime[1][waitIndex];
                // もしデバッグモードが入ってたら
                if (windowUpdateStatus.debug){
                    // 報告
                    console.log("searched with name and inserted: windowUpdate", waitNameOrTime);
                }
            }
        } else {
            // 数値が入っている。その分待つべし。
            waitTime = Math.abs(Number(waitNameOrTime));
            // もしデバッグモードが入ってたら
            if (windowUpdateStatus.debug){
                // 報告
                console.log("found a number and inserted: windowUpdate", waitNameOrTime);
            }
        }
        return waitTime;
    }
    async mojiWaituti(wait, ...data){
        // 文字を全部消す
        this.clear();
        // 操作画面を出す
        this.sousaDisp();
        var waitTime = this.findWait(wait);
        // data配列がある限り書く、改行あり
        for (const dataone of data){
            // 1文字ずつに分解
            let dataoneSplit = dataone.split("");
            for (const moji of dataoneSplit){
                // 要素に書き込み
                this.elem.insertAdjacentHTML("beforeend", moji);
                // 指定時間待つ
                await this.wait(waitTime);
            }
            // 改行を書き込み
            this.elem.insertAdjacentHTML("beforeend", "<br>");
        };
        // クリックボタンを出す
        this.clickDisp();
        let event = new eventCatch(this.click_sita);
        // クリックされるまで待つ
        await event.waitClick();
        // クリックされたら元に戻す
        this.clear();
        return new Promise(r => r(true));
    }
}