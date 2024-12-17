var audiostats = {
    audioBlob : [],
    isRead : false
};
class audioPlayer{
    constructor(){
        this.isPrepared = false;
        this.isPlaying = false;
    }
    prepare(name, isLoop = false){
        // もし既に準備されてたら or ダウンロードしてなかったらエラーを返す
        if (this.isPrepared || !audiostats.isRead) {
            console.error("music was already prepared or not downloaded: audio");
            return false;
        }
        this.isPrepared = true;
        // audio関数の作成
        this.music = new Audio();
        // srcセット
        // 音声配列を確認
        this.musicIndexNum = audiostats.audioBlob[1].findIndex((c) => c == name);
        // もし音声配列になかったら
        if (this.musicIndexNum === -1){
            // そんなものはないとエラー吐く
            console.error("No entry: audio");
            return false;
        } else {
            // あるならセット
            this.music.src = audiostats.audioBlob[0][this.musicIndexNum];
        }
        // ループ確認
        if (isLoop){
            // ループセット
            this.music.addEventListener("ended", function(t){
                t.target.currentTime = 0;
                t.target.play();
            });
        }
        return true;
    }
    play(){
        // もし準備されていなかったらfalse
        if (!this.isPrepared) {
            console.error("Not prepared: audio");
            return false;
        }
        this.music.play();
        this.isPlaying = true;
        return true;
    }
    pause(){
        // もし準備されていなかったらfalse
        if (!this.isPrepared) {
            console.error("Not prepared: audio");
            return false;
        }
        this.music.pause();
        this.isPlaying = false;
        return true;
    }
    stop(){
        // もし準備されていなかったらfalse
        if (!this.isPrepared) {
            console.error("Not prepared: audio");
            return false;
        }
        this.music.pause();
        this.music.currentTime = 0;
        this.isPlaying = false;
        return true;
    }
    async read(url = "./audio/"){
        // 既に読んでいたらエラー
        if (audiostats.isRead) return new Promise((r) => {console.warn("Already readed: audio");r(false)});
        audiostats.isRead = true;
        // 音声配列、URLを用意
        this.audioBlob = [[], []];
        this.audioUrls = new Array();
        // URLリストの読み取り
        await fetch(url)
        .then((r) => r.json())
        .then((d) => {this.audioUrls = d})
        .catch((e) => console.error(e));
        // リストをもとに受信
        for (const audiourl of this.audioUrls){
            await fetch(url+audiourl)
            .then((r) => r.blob())
            .then((d) => this.audioBlob[0].push(URL.createObjectURL(d)))
            .catch((e) => console.error(e));
            this.audioBlob[1].push(audiourl.split(".mp3")[0]);
        }
        // 音声を...
        if (this.audioBlob.length != 0){
            // 読めたら変数をコピー
            audiostats.audioBlob = this.audioBlob.slice();
            return new Promise((r) => (r(true)));
        } else {
            //読めなかった
            return new Promise((r) => (r(false)));
        }
    }
}