// import Peer from 'skyway-js';


let localStream;
const remoteVideo = document.getElementById('their-video');
const theirID = null;
const mediaConnection = null;
      
// カメラ映像取得
navigator.mediaDevices.getUserMedia({video: {width:400,height:300}, audio: true})
  .then( stream => {
  // 成功時にvideo要素にカメラ映像をセットし、再生
  const VideoElm = document.getElementById('my-video');
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

  //退出処理
  document.getElementById('close-call').onclick = () => {
    mediaConnection.close(true);
  }

  mediaConnection.once('close', () => {
    remoteVideo.srcObject.getTracks().forEach(track => track.stop());
    remoteVideo.srcObject = null;
  });
};

// イベントリスナを設置する関数
const setEventListener = mediaConnection => {
  mediaConnection.on('stream', stream => {
    // video要素にカメラ映像をセットして再生
  
    //ミラー反転
    remoteVideo.style = '-webkit-transform: scaleX(-1);';

    remoteVideo.srcObject = stream;
    remoteVideo.play();
  });
}

//着信処理
peer.on('call', mediaConnection => {
  mediaConnection.answer(localStream);
  setEventListener(mediaConnection);

  //退出処理
  document.getElementById('close-call').onclick = () => {
    mediaConnection.close(true);
  }

  mediaConnection.once('close', () => {
    remoteVideo.srcObject.getTracks().forEach(track => track.stop());
    remoteVideo.srcObject = null;
  });
});

