

var cameraSelector = document.querySelector("select#videoSource");
var camera = document.getElementById("cameraVideo");

var curCanvas= document.getElementById("curCanvas");
var newCanvas= document.createElement('canvas');
        
var curContext = curCanvas.getContext('2d');
var newContext;
var fps=$("#fps")[0];
var pharos;

var maskDiv=$('#mask_div');
var message=document.getElementById("message");

document.addEventListener('DOMContentLoaded',function(){

    var cw, ch;
    var line=4,row=4;
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
            setTimeout("pharos.update()",0);
            curContext.putImageData(pharos.newFrame,0,0);
            setTimeout("updateText("+timestamp+")",0);

        }
        else if (camera.videoWidth>0 && camera.videoHeight > 0&&
                 camera.offsetWidth>0 && camera.offsetHeight > 0) {
            console.info([camera.videoWidth , camera.videoHeight,camera.offsetWidth , camera.offsetHeight])
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
            curContext.fillText("hhh",0,100);
            pharos=new Pharos(cw,ch,line,row);

            createLedMask();
            canvasInitialized=true;
        }
    }

    init();
});

var lasttime=null;
function updateText(timestamp){
    if(lasttime!==null)
        fps.innerHTML="fps:"+1000/(timestamp-lasttime);
    lasttime=timestamp;
    message.innerHTML=pharos.decoder.message.join('');
}


function createLedMask(){
    for(var i=0;i<pharos.lattice.ledN;i++){
        var name="led_mask"+i;
        maskDiv.append("<div class=\"led_mask\" id=\""+name+"\"></div>");
        var mask=$("#"+name);
        var led=pharos.lattice.led[i];
        var margin=$("#curCanvas").offset().top-$("#videos_div").offset().top+"px 0 0 0";
        mask.css("margin",margin);
    }
    setTimeout("updateMask()",1000);
}

function updateMask(){
    //console.info("updateMask");
    for(var i=0;i<pharos.lattice.ledN;i++){
        var mask=$("#led_mask"+i);
        var led=pharos.lattice.led[i];
        if(led){
            mask.css("width",led.right-led.left+"px");
            mask.css("height",led.bottom-led.top+"px");
            mask.css("left",led.left+"px");
            mask.css("top",led.top+"px");
        }
    }
    setTimeout("updateMask()",1000);
}
