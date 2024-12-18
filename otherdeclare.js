// 待つやつ
function wait(t){
    new Promise(r => setTimeout(r, t));
}
