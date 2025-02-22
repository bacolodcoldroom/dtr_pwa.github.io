var CAMERA_ON=false;

'use strict';

// Put variables in global scope to make them available to the browser console.
var video = document.querySelector('video');
var canvas = window.canvas = document.querySelector('canvas');

const constraints = {
  audio: false,  
  video: {
    facingMode: 'environment',
    width: {
      min: 320,
      max: 1280
    },
      height: {
      min: 140,
      max: 720
    }
      
  }
};

function show_camera(img,div_close){
  let h_main=400;
  var dtl=        
    '<div id="myCameraBox_main" data-open=0 data-meter=0 style="height:'+h_main+'px;border:1px solid none;background:cyan;">'+ 

      '<div id="dtl_cam_box" style="width:100%;height:100%;padding:5px;border:0px solid orange;color:black;background:red;">'+
        '<div id="container" style="position:relative;width:100%;height:100%;border:0px solid cyan;background:yellow;">'+
          '<div id="div_curr_photo" style="display:block;width:500px;height:500px;text-align:center;border:2px solid black;background:yellow;">'+
            '<img id="div_curr_img" src="gfx/avatar.png" style="width:auto;max-width:100%;height:100%;background:darkgray;" alt="div curr image"/>'+
          '</div>'+
          '<div id="div_video" style="display:none;text-align:center;width:500px;height:500px;padding:0px;text-align:center;border:1px solid violet;background:black;">'+
            //'<video id="myVideo" style="width:300px;height:300px;overflow:hidden;padding:0px;border:1px solid cyan;" playsinline autoplay></video>'+
            '<video id="myVideo" style="width:100%;height:100%;overflow:hidden;padding:0px;border:1px solid cyan;" playsinline autoplay></video>'+
            //'<div id="jfocus" style="position:absolute;top:15px;left:0;width:300px;height:300px;border:1px dashed red;"></div>'+
            '<div id="jfocus" style="position:absolute;top:0px;left:0;width:250px;height:250px;border:1px dashed red;"></div>'+
          '</div>'+
          '<div style="display:none;width:100%;height:100%;text-align:center;padding:0px;border:1px solid yellow;overflow:auto;background:green;">'+
            '<canvas id="myCanvas"></canvas>'+
          '</div>'+ 
        '</div>'+   
      '</div>'+   
      //'<div style="display:none;width:100%;height:20%;padding:5px;text-align:center;color:black;background:orange;">'+
      //  '<img id="div_save_img" src="gfx/jsave.png" style="width:auto;max-width:100%;height:100%;background:darkgray;" alt="div curr image"/>'+
      //'</div>'+   
    '</div>';
  
  var dtl2=      
  '<div style="width:100%;height:100%;text-align:center;border:0px solid red;background:green;padding:0px;">'+    

    '<div style="width:100%;height:100%;padding:5px;background:none;">'+
      '<div id="btn_cam_main" data-mode=0 onclick="doCamera()" style="float:left;width:55%;height:100%;border-radius:10px;padding:2px;background:#8b9dc3;">'+
        '<div style="float:left;text-align:left;margin-left:15px;width:auto;height:100%;color:black;background:none;">'+
          '<img id="btn_cam_img" src="gfx/jcam.png" style="height:100%;" alt="btn cam image"/>'+
        '</div>'+
        '<div id="btn_cam_txt" style="float:left;text-align:left;margin-left:10px;width:auto;height:100%;font-size:18px;padding:3px 0 0 0;color:black;background:none;">'+
          'Take Photo'+
        '</div>'+    
      '</div>'+
      '<div id="btn_cam_cancel" data-mode=0 onclick="doClose()" style="float:right;width:43%;height:100%;border-radius:10px;padding:2px;background:#8b9dc3;">'+
        '<div id="btn_cam_txt2" style="float:left;text-align:left;margin-left:15px;width:auto;height:100%;font-size:18px;padding:3px 0 0 0;color:black;background:none;">'+
          'Close'+
        '</div>'+         
        '<div style="float:right;text-align:left;margin-right:10px;width:auto;height:100%;color:black;background:none;">'+
          '<img id="btn_cam_img2" src="gfx/jcancel.png" style="height:100%;" alt="btn2 cam image"/>'+
        '</div>'+
      '</div>'+        
    '</div>'+

  '</div>';
  JBE_OPENBOX('myCameraBox_main','Camera Box',dtl,dtl2,'closeNow'); 
  video = document.querySelector('video');
  openCameraBox(1); 
}

function openCameraBox(meter) { 
  setter(0);
  //document.getElementById("myCameraBox").style.height = H_BODY+'px';              
  var h=parseInt(document.getElementById("myCameraBox_main").style.height);
  //var h_tapal=parseInt(document.getElementById("div_tapal").style.height);
  
  //document.getElementById("dtl_cam_box").style.height = (h-(30))+'px';    
  //document.getElementById("container").style.height = (h-(h_tapal+40))+'px';
  document.getElementById("myCameraBox_main").setAttribute('data-open',1);     
  document.getElementById("myCameraBox_main").setAttribute('data-meter',meter); 
}

function ret_img(div){
  return;
  //var selected_meter_img=document.getElementById(div).src.split('/').pop();
  var selected_meter_img=document.getElementById(div).src;
  return selected_meter_img;
}
function closeCameraBox(){
  if(CAMERA_ON){
    stopCamera();
    document.getElementById("btn_cam_main").setAttribute('data-mode',0);
  } 
}

function doCamera(){  
  var sw=parseInt(document.getElementById("btn_cam_main").getAttribute('data-mode')); 
  if(sw==0){
    openCamera();  
    //alert('doCamera');
    //setter(1);    
    
    var jpad=20;
    var jfocus=document.getElementById('jfocus');
    var jt='10px';
    var jw=parseInt(jfocus.style.width);

    var jl=(window.outerWidth-(jpad+jw))/2;
    jfocus.style.top=jt;
    jfocus.style.left=jl+'px';        
    
  }else{
    tira();
    stopCamera();
    setter(0);
  }
}

function doClose(){
  var btn2=document.getElementById("btn_cam_txt2");
  //alert(btn2.innerHTML);
  if(btn2.innerHTML=='STOP'){
    worker.terminate();
    setter(0);    
    return;
  }
  if(btn2.innerHTML=='Close'){
    closeCameraBox();
    JBE_CLOSEBOX('closeNow');
    return;
  }  
  var sw=parseInt(document.getElementById("btn_cam_main").getAttribute('data-mode'));    
  if(sw==0){
    closeCameraBox();
  }else{
    stopCamera();
    setter(0);
  }
}

function closeNow(){  
  let sw=parseInt(document.getElementById("btn_cam_main").getAttribute('data-mode'));    
  if(sw==0){
    closeCameraBox();
    return true;
  }else{
    snackBar("Can't Exit this time...");
    return false;
  }  
}

function openCamera(){
  //alert('opening camera');
  navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);
}

function stopCamera(){
  CAMERA_ON=false;
  console.log('stop called:');
  stream.getVideoTracks().forEach(function (track) {
      track.stop();
  });
}

function handleSuccess(stream) {
  window.stream = stream; // make stream available to browser console
  video.srcObject = stream;
  CAMERA_ON=true;
  setter(1);    
}

function handleError(error) {
  CAMERA_ON=false;
  setter(0);    
  //console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
  MSG_SHOW(vbOk,"ERROR:",'navigator.MediaDevices.getUserMedia error: '+ error.message+'<br>'+error.name,function(){ closeCameraBox(); },function(){}); 
}

function setter(m){
  document.getElementById("btn_cam_main").setAttribute('data-mode',0);  
  document.getElementById("btn_cam_main").style.backgroundColor=JBE_CLOR2;  
  document.getElementById("div_curr_photo").style.display='block';    
  document.getElementById("div_video").style.display='none';
  document.getElementById("btn_cam_txt").innerHTML="Take Photo";  
  document.getElementById("btn_cam_txt2").innerHTML="Close";  
  document.getElementById("btn_cam_img2").src='gfx/jcancel.png';
  
  document.getElementById("btn_cam_main").style.pointerEvents='auto';
  document.getElementById("btn_cam_main").style.backgroundColor=JBE_CLOR2; 
  document.getElementById("btn_cam_cancel").style.pointerEvents='auto';
  document.getElementById("btn_cam_cancel").style.backgroundColor=JBE_CLOR2;  
  
  if(m==1){
    document.getElementById("btn_cam_main").setAttribute('data-mode',1);   
    document.getElementById("btn_cam_main").style.backgroundColor='red'; 
    document.getElementById("div_curr_photo").style.display='none';
    document.getElementById("div_video").style.display='block';    
    document.getElementById("btn_cam_txt").innerHTML="Capture";
    document.getElementById("btn_cam_txt2").innerHTML="Cancel";  
    document.getElementById("btn_cam_img2").src='gfx/jback.png';
  }
}

function tira(){   
  const canvas = document.getElementById('myCanvas');
  const jvideo = document.getElementById('myVideo');
  
  canvas.width = jvideo.videoWidth;
  canvas.height = jvideo.videoHeight;
  //canvas.width=500;
  //canvas.height=500;
  //canvas.height=200;
  
  //canvas.getContext('2d').drawImage(jvideo, 0, 0);    
  canvas.getContext('2d').drawImage(jvideo, 0, 0, 500, 500);    
 
  document.getElementById('div_curr_img').src=canvas.toDataURL("image/png");  
  document.getElementById("div_curr_photo").style.display='block';    
}
