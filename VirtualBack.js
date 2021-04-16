// import * as bodyPix from '@tensorflow-models/body-pix';
// import * as bodyPix from '/node_modules/@tensorflow-models/body-pix/dist/body-pix.js';

const VideoElement = document.getElementById('my-video');
const canvas = document.getElementById('canvas');
var canvasCtx = canvas.getContext('2d');
var handle;
var handleVB;
var isVirtualBack = false;

function _canvasUpdate(isOnVideo) {
  if(isOnVideo){
    // 描画を左右反転
    canvasCtx.scale(-1,1);
    canvasCtx.drawImage(VideoElement, 0, 0, -canvas.width, canvas.height);
    // canvasCtx.drawImage(VideoElement, 0, 0, canvas.width, canvas.height);
    handle = requestAnimationFrame(_canvasUpdate);
  }else{
    cancelAnimationFrame(handle);
  }
};
_canvasUpdate(true);

//ぼかし背景
// function segmentBody(bodypixnet) {
//     async function renderFrame() {
//       const segmentation = await bodypixnet.segmentPerson(VideoElement);
//       const backgroundBlurAmount = 3;
//       const edgeBlurAmount = 3;
//       const flipHorizontal = true;
//       bodyPix.drawBokehEffect(
//         canvas, VideoElement, segmentation, backgroundBlurAmount,
//         edgeBlurAmount, flipHorizontal);
//       requestAnimationFrame(renderFrame);
//     }
//     renderFrame();
//   }

async function start() {
  if(!isVirtualBack){
    _canvasUpdate(false);
    let bodypixnet = await bodyPix.load();
    // segmentBody(bodypixnet);
    VirtualBack(bodypixnet);
    isVirtualBack = true;
  }else{
    _canvasUpdate(true);
    isVirtualBack = false;
  }

}

//黒背景
function VirtualBack(bodypixnet) {
  async function renderFrame() {
    const segmentation = await bodypixnet.segmentPerson(VideoElement);

    // Convert the segmentation into a mask to darken the background.
    const foregroundColor = {r: 0, g: 0, b: 0, a: 0};
    const backgroundColor = {r: 0, g: 0, b: 0, a: 255};
    const backgroundDarkeningMask = bodyPix.toMask(segmentation, foregroundColor, backgroundColor);

    const opacity = 1.0;
    const maskBlurAmount = 1;
    const flipHorizontal = true;

    bodyPix.drawMask(
      canvas, VideoElement, backgroundDarkeningMask, opacity, maskBlurAmount, flipHorizontal);

    if(isVirtualBack){
      handleVB = requestAnimationFrame(renderFrame);
    }else{
      cancelAnimationFrame(handleVB);
    }
    
  }
  renderFrame();
}
