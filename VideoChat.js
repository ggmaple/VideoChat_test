// import Peer from 'skyway-js';


let localStream;
      
// カメラ映像取得
navigator.mediaDevices.getUserMedia({video: {width:640,height:480}, audio: true})
  .then( stream => {
  // 成功時にvideo要素にカメラ映像をセットし、再生
  const VideoElm = document.getElementById('my-video');
  VideoElm.style = '-webkit-transform: scaleX(-1);';
  VideoElm.srcObject = stream;
  VideoElm.play();
  // 着信時に相手にカメラ映像を返せるように、グローバル変数に保存しておく
  // localStream = stream;
}).catch( error => {
  // 失敗時にはエラーログを出力
  console.error('mediaDevice.getUserMedia() error:', error);
  return;
});

// キャプチャしたい canvas 要素を取得
var canvasElt = document.querySelector('canvas');

// ストリームの取得
var stream = canvasElt.captureStream(60); // 60 FPS
localStream = stream;

//Peer作成
const peer = new Peer({
  //APIキー
  key: "57a0f3dc-efe0-49f9-bf2a-8607b50a446f",
  debug: 3
});

//PeerID取得
peer.on('open', () => {
    console.log("着信しました！");
    document.getElementById('my-id').textContent = peer.id;
});

// 発信処理
document.getElementById('make-call').onclick = () => {

  const theirID = document.getElementById('their-id').value;
  const mediaConnection = peer.call(theirID, localStream);
  setEventListener(mediaConnection);
};

// イベントリスナを設置する関数
const setEventListener = mediaConnection => {
  mediaConnection.on('stream', stream => {
    // video要素にカメラ映像をセットして再生
    const videoElm = document.getElementById('their-video')
    videoElm.srcObject = stream;
    videoElm.play();
  });
}

//着信処理
peer.on('call', mediaConnection => {
  //描画を左右反転
  let Ctx = canvasElt.getContext('2d');
  Ctx.scale(-1,1);
  Ctx.translate(-canvas.width, 0);
  mediaConnection.answer(localStream);
  setEventListener(mediaConnection);
});