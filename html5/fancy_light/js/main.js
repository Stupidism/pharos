

var cameraSelector = document.querySelector("select#videoSource");
var camera = document.getElementById("cameraVideo");

var cw, ch;
var curCanvas= document.getElementById("curCanvas");
var newCanvas= document.createElement('canvas');
        
var curContext = curCanvas.getContext('2d');
var newContext;

var pharos;

var maskDiv=$('#mask_div');
var message=document.getElementById("message");

document.addEventListener('DOMContentLoaded',init);

var text = "test!!!";
//初始化
function init(){
    window.URL = window.URL || window.webkitURL;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || 
                            navigator.getmozGetUserMedia || navigator.msGetUserMedia;
    window.requestAnimationFrame =
        window.requestAnimationFrame||window.mozRequestAnimationFrame||
        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    
    //初始化摄像头选择器
    function gotSources(sourceInfos) {
      for (var i = 0; i != sourceInfos.length; ++i) {
        var sourceInfo = sourceInfos[i];
        var option = document.createElement("option");
        option.value = sourceInfo.id;
        if (sourceInfo.kind === 'video') {
          option.text = sourceInfo.label || 'camera ' + (cameraSelector.length+1);
          cameraSelector.appendChild(option);
        } else {
          console.log('Some other kind of source: ', sourceInfo);
        }
      }
      cameraSelector.selectedIndex=1;
      listenVideoStream();
    }
    
    MediaStreamTrack.getSources(gotSources);
    cameraSelector.onchange = listenVideoStream;
    
    //maskDiv.show();
}

var videoSource = null;


//监听用户的摄像头视频流
function listenVideoStream(){
    console.info("listener");
    
    videoSource=cameraSelector.value;

    var _onSucc = function(stream){
        camera.src = window.URL.createObjectURL(stream);
        
        requestAnimationFrame(eachFrame);
    };
    var _onError = function(error){
        console.log('navigator.getUserMedia error: ', error);
    };
    var constraints={video:{'optional':[{'sourceId':videoSource},{'frameRate ':60},{'facingMode':'environment'}]}};
    navigator.getUserMedia(constraints, _onSucc, _onError);
    
}

var canvasInitialized=null;
function eachFrame(timestamp) {
    requestAnimationFrame(eachFrame);
    if(canvasInitialized){
        newContext.drawImage(camera,0,0,cw,ch);
        //pharos.setNewFrame();
        pharos.newFrame=newContext.getImageData(0,0,cw,ch);
        setTimeout(pharos.update(),0);
        curContext.putImageData(pharos.newFrame,0,0);
        setTimeout(updateText(timestamp),0);
        
    }
    else if (camera.videoWidth>0 && camera.videoHeight > 0&&
             camera.offsetWidth>0 && camera.offsetHeight > 0) {
        var videoRatio = camera.videoWidth / camera.videoHeight;
        var offsetRatio = camera.offsetWidth / camera.offsetHeight;
        if (videoRatio >= offsetRatio) {
            cw = camera.offsetWidth;
            ch = cw / videoRatio;
        } else {
            ch = camera.offsetHeight;
            cw = ch * videoRatio;
        }
        curCanvas.width = newCanvas.width= cw;
        curCanvas.height = newCanvas.height= ch;
        newContext = newCanvas.getContext('2d');
        
        curContext.font = "15pt Calibri";
        curContext.fillStyle = "#f0f";
        
        pharos=new Pharos(cw,ch,255);
        
        canvasInitialized=true;
    }
}

var lasttime=null;
var fps=null;
var maxFrameTime=1;
function updateText(timestamp){
    if(lasttime!==null)
        curContext.fillText("fps:"+1000/(timestamp-lasttime), 0, 15);
    lasttime=timestamp;
    message.innerHTML=pharos.decoder.message.join('');
}

