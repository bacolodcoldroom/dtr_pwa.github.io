var THISFILE=[];
clear_THISFILE();
var JBE_ARY_FULLMONTH = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
var JBE_ARY_MONTH = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

function JBE_GET_IMAGE(id,inp_file,targ_div,cb,likod){
  //alert('i:'+inp_file+'\nt:'+targ_div);    
  document.getElementById(inp_file).setAttribute('data-orig',targ_div);
  
  THISFILE[id]=null;
  var real_ImgBtn = document.getElementById(inp_file);
  real_ImgBtn.setAttribute("accept","image/* capture"); //accept="image/*"

  real_ImgBtn.addEventListener('change', e => {
    if (real_ImgBtn.value) {
      var reader = new FileReader();
      var imgSize=e.target.files[0].size;
      var fname=e.target.files[0].name;
      var tfile=e.target.files[0];
      
      if(imgSize > 6000000){
        MSG_SHOW(vbOk,"ERROR: ","File is too big. Maximum is 6mb.",function(){},function(){});
        return;
      }
      
      reader.onload = e => {        
        if(document.getElementById(inp_file).getAttribute('data-orig')==targ_div){          
          var output = document.getElementById(targ_div);          
          if(likod){          
            output.style.backgroundImage='url('+reader.result+')';
            output.style.backgroundRepeat='no-repeat';
            output.style.backgroundSize="100% 100%";
          }else{
            output.src = reader.result;
          }
          var ndx=cb.indexOf('|');
          var param='';
          if(ndx >= 0){
            param=cb.substr(ndx+1);
            cb=cb.substr(0,ndx);
          }
  
          var fn = window[cb];
          if (typeof fn === "function") fn(param);          
          THISFILE[id]=tfile;                 
          document.getElementById(targ_div).setAttribute('data-img',fname);
          real_ImgBtn.value=null;          
        }
      };      
      reader.readAsDataURL(e.target.files[0]);
      
    }
  });
  real_ImgBtn.click();
}

function JBE_MULTI_IMAGES(id,inp_file,targ_div,cb,likod){
  //alert('id:'+id+'\ninp_file: '+inp_file+'\ntarget:'+targ_div+'\nLIKOD = '+likod);   
  /*
  alert(      
      '\nid: '+id+
      '\nCurr item: '+curr_item+
      '\nInput id: '+inp_file+
      '\ntarget div: '+targ_div+
      '\nLikod: '+likod
      );
  */    
  //alert('curr I: '+c_item);
  
  THISFILE[id]=null;
  var real_ImgBtn = document.getElementById(inp_file);
  real_ImgBtn.setAttribute("accept","image/*"); //accept="image/*"

  real_ImgBtn.addEventListener('change', e => {
    if (real_ImgBtn.value) {
      var reader = new FileReader();
      var imgSize=e.target.files[0].size;
      var fname=e.target.files[0].name;
      
      if(imgSize > 6000000){
        MSG_SHOW(vbOk,"ERROR: ","File is too big. Maximum is 6mb.",function(){},function(){});
        return;
      }
      reader.onload = e => {
        //alert('onload '+targ_div+' old targ: '+o_targ.substr(4)+'  curr_ite:'+curr_item);
        if(targ_div.substr(4)==curr_item){
          //alert(imgSize+ ' fname: '+fname);    
          var output = document.getElementById(targ_div);          
          if(likod){          
            output.style.backgroundImage='url('+reader.result+')';
            output.style.backgroundRepeat='no-repeat';
            output.style.backgroundSize="auto 100%";
          }else{
            output.src = reader.result;
          }
          var fn = window[cb];
          if (typeof fn === "function") fn(reader.result);
          THISFILE[id]=this.files[0];          
          document.getElementById(targ_div).setAttribute('data-img',fname);
          real_ImgBtn.value=null;          
        }      
      };      
      reader.readAsDataURL(e.target.files[0]);
    }
  });
  real_ImgBtn.click();
}
// -------------------------------------------------------------------------------
function JBE_PICK_IMAGE(id,inp_file,targ_div,cb){
  //alert(id+' inp_file:'+inp_file+'\nt:'+targ_div);  
  //var closeDiv=document.getElementById('main_JBE_zoom').getAttribute('data-close');  
  THISFILE[id]=null;
  var real_ImgBtn = document.getElementById(inp_file);
  real_ImgBtn.setAttribute("accept","image/* capture"); //accept="image/*"    
  //real_ImgBtn.setAttribute("accept","image/*"); //accept="image/*"    

  real_ImgBtn.addEventListener("change", function() {
    if (real_ImgBtn.value) {
      var reader = new FileReader();
      var imgSize=event.target.files[0].size;
      reader.onload = function(){
        if(imgSize > 6000000){
          MSG_SHOW(vbOk,"ERROR: ","File is too big. Maximum is 6mb.",function(){},function(){});
          return;
        }
        var output = document.getElementById(targ_div);
        output.src = reader.result;
        var fn = window[cb];
        if (typeof fn === "function") fn(reader.result);
        //document.getElementById('tmp').src=reader.result;
      };
      reader.readAsDataURL(event.target.files[0]);
      //id=this.files[0];
      THISFILE[id]=this.files[0];
      
      document.getElementById(targ_div).setAttribute('data-img',this.files[0].name);
      real_ImgBtn.value='';      
    } 
  });
  real_ImgBtn.click();
}

async function uploadNOW(file,newName,dir,ndiv,keepSize,likod){     
  /*
  alert(
    'file: '+file+
    '\n newName: '+newName+
    '\n dir: '+dir+
    '\n ndiv: '+ndiv+
    '\n keepSize: '+keepSize+
    '\n likod: '+likod
  );
  */ 
  
  var ddir=dir.substr(JBE_API.length); 
  var phpDir=ddir;

  var data = new FormData();  
  data.append('file', file, newName); 
  //data.append('dir', dir); 
  //data.append('keepSize', keepSize); 
  var config = {}; 
  showProgress(true);
  //axios.post(JBE_API+'z_load.php', data, config)
  await axios.post('/upload_IMG', data, config)
  .then(function (response) {
    console.log(response.data);    
    //alert(response.data[1]);    
    showProgress(false);
    /*
    if(response.data[0] == -1){
      MSG_SHOW(vbOk,"ERROR: Upload Failed",response.data[1],function(){},function(){return;});
      return;
    }  
    */
    if(ndiv.length != 0){ 
      for(var j=0;j<ndiv.length;j++){
        RefreshImage(likod,dir,newName,ndiv[j]['div']); 
      }
    } 
       
  })  
  .catch(function (err) {    
    console.log(err.message);
    showProgress(false);
    MSG_SHOW(vbOk,"ERROR: Upload Failed",err.message,function(){},function(){return;});
  });  
}

function RefreshImage(likod,dir,newName,ndiv){    
  var n = new Date().toLocaleTimeString('it-IT');
  var targ=dir+newName+'?'+n;
  if(likod){
    document.getElementById(ndiv).style.backgroundImage='url('+targ+')'; 
  }else{
    document.getElementById(ndiv).src=targ;
  }
}

function JBE_ZOOM(img,div_close){
  var dtl=      
    '<div id="main_JBE_zoom" data-zoom=0 data-close="'+div_close+'" style="width:100%;height:'+(H_BODY-30)+'px;text-align:center;background-color:none;">'+      
      '<img id="img_JBE_zoom" onclick="JBE_zoom2()" src="'+img+'" style="width:auto;height:100%;">'+      
    '</div>';  
  var dtl2=      
    '<div style="width:100%;height:30px;padding:5px 0 0 0;text-align:center;color:'+JBE_TXCLOR1+';background:none;">'+
      'Click the Image to Zoom In or Zoom Out'+      
    '</div>';   
  JBE_OPENBOX('main_JBE_zoom','Zoom Image',dtl,dtl2); 
}

function close_JBE_ZOOM(){
  var closeDiv=document.getElementById('main_JBE_zoom').getAttribute('data-close');
  var fn = window[closeDiv];
  if (typeof fn === "function") fn();
}

function JBE_OPENBOX(div,title,dtl,dtl2,func) {   
  var div_dtl=    
    '<div id="myJBox_main" data-open=0 data-close="'+func+'" class="bottom_box" style="width:100%;height:0px;border:0px solid red;background:'+JBE_CLOR+';">'+
      '<div id="hd_jbox" class="hd_box" style="width:100%;height:30px;font-size:15px;font-weight:bold;border:1px solid black;background:none;">'+        
        '<div style="float:left;width:10%;height:100%;text-align:left;padding:0 0 0 10px;background:none;">'+
          '<input type="button" onclick="JBE_CLOSEBOX()" style="width:28px;height:100%;font-size:14px;color:white;border-radius:50%;border:1px solid white;background:red;" value="X" />'+
        '</div>'+
        '<div id="cap_jbox" style="float:right;text-align:right;width:90%;height:100%;padding:5px;color:'+JBE_TXCLOR1+';background:none;">'+title+'</div>'+
      '</div>'+      
      '<div id="dtl_jbox" style="width:100%;height:auto;padding:5px;overflow:auto;border:1px solid black;color:black;background:white;">'+
        dtl+
      '</div>'+
      '<div id="footer_jbox" class="jfooter" style="display:block;height:50px;width:100%;color:'+JBE_TXCLOR1+';background:'+JBE_CLOR+';">'+
        dtl2+
      '</div>'+    
    '</div>';
  
  document.getElementById("myJBox").innerHTML=div_dtl;  
  document.getElementById("myJBox").style.width='100%';
  document.getElementById("myJBox").style.height = window.innerHeight+'px';
  //document.getElementById("myJBox_main").setAttribute('data-close',xclose);  
  //document.getElementById("cap_jbox").innerHTML=title;
  //document.getElementById("dtl_jbox").innerHTML=dtl;
  
  var h=parseInt(document.getElementById(div).style.height); 
  var hh=h+30+50; //dtl height + box head height + paddings         
  document.getElementById("dtl_jbox").style.height = h+'px';
  document.getElementById("myJBox_main").style.height = hh+'px';    
  document.getElementById(div).style.height="auto";
  document.getElementById(div).style.width="100%";
  document.getElementById(div).style.height = (h-12)+'px';
}

function JBE_CLOSEBOX(){  
  var xclose=document.getElementById("myJBox_main").getAttribute('data-close'); 

  var fn = window[xclose];
  if (typeof fn === "function"){
    //var ret_func=fn(param);
    //if(!ret_func){ return; }
    if(fn()==false){ return; }
  }

  document.getElementById("myJBox").style.height=0+'px';
  document.getElementById("myJBox_main").style.height = 0+'px';       
  
  document.getElementById("myJBox").style.height = "0px";       
  document.getElementById("myJBox").setAttribute('data-open','0');   
}

function JBE_SORT_ARRAY(keys) {
  return function(a, b) {
      if (keys.length == 0) return 0; // force to equal if keys run out
      key = keys[0]; // take out the first key
      if(key.substr(0,1)=="*"){        
        key=key.substr(1);
        if (a[key] < b[key]) return 1; // will be 1 if DESC
        else if (a[key] > b[key]) return -1; // will be -1 if DESC
      }
      //if (a[key] < b[key]) return -1; // will be 1 if DESC
      //else if (a[key] > b[key]) return 1; // will be -1 if DESC
      //alert(key);
      if (a[key] < b[key]) return -1; // will be 1 if DESC
      else if (a[key] > b[key]) return 1; // will be -1 if DESC
      else return JBE_SORT_ARRAY(keys.slice(1))(a, b);
  }
}


function sortByMultipleKey(keys) {
  return function(a, b) {
      if (keys.length == 0) return 0; // force to equal if keys run out
      key = keys[0]; // take out the first key
      if(key.substr(0,1)=="*"){        
        key=key.substr(1);
        if (a[key] < b[key]) return 1; // will be 1 if DESC
        else if (a[key] > b[key]) return -1; // will be -1 if DESC
      }
      //if (a[key] < b[key]) return -1; // will be 1 if DESC
      //else if (a[key] > b[key]) return 1; // will be -1 if DESC
      //alert(key);
      if (a[key] < b[key]) return -1; // will be 1 if DESC
      else if (a[key] > b[key]) return 1; // will be -1 if DESC
      else return sortByMultipleKey(keys.slice(1))(a, b);
  }
}

function showProgress(v){
  var vd='block';
  if(!v){ vd='none'; }
  document.getElementById("loading").style.display=vd;
}




function JBE_zoom2(){
  var div=document.getElementById('main_JBE_zoom');
  var mod=parseInt(document.getElementById('main_JBE_zoom').getAttribute('data-zoom'));
  var divImg=document.getElementById('img_JBE_zoom').src;
  var img_w=0;
  var img_h=0;
  var ximg = new Image();
  ximg.src=divImg;  
  ximg.onload = function() {
    img_w=ximg.naturalWidth;
    img_h=ximg.naturalHeight;
    
    var imageratio = img_w/img_h;

    var new_width = H_BODY*imageratio;
    var new_height = H_BODY;

    if(mod==0){
      div.style.height=new_height+'px';
      div.style.width=new_width+'px';
      (document.getElementById('main_JBE_zoom').setAttribute('data-zoom',1));      
    }else{
      div.style.height="auto";
      div.style.width="100%";
      (document.getElementById('main_JBE_zoom').setAttribute('data-zoom',0));
    }
  }
}


function JBE_OPEN_VIEW(dtl,cap,xclose) {
  //alert(xclose);
  document.getElementById('page_main').style.display='none';
  //document.getElementById('div_nobar').style.display='block';
  var m=parseInt(document.getElementById("myView1").getAttribute('data-JBEpage'));  
  m++;
  //alert(m);
  document.getElementById("myView"+m).setAttribute('data-page',m);
  document.getElementById("myView"+m).setAttribute('data-close',xclose); 
  //document.getElementById('dtl_myView'+m).style.height=H_VIEW_DTL+'px';
  //alert(dtl);
  document.getElementById("dtl_myView"+m).innerHTML=dtl;  
  document.getElementById("cap_myView"+m).innerHTML=cap;  

  if(m==1){
    openPage('myView'+m);    
  }else{
    document.getElementById("myView"+(m-1)).style.display='none';
    //alert('second page view');
    document.getElementById("myView"+m).style.display='block';
  }
  document.getElementById("myView1").setAttribute('data-JBEpage',m);    
  //alert(document.getElementById("dtl_myView"+m).innerHTML);
  //document.getElementById("copyright").innerHTML=m;
  //alert('m:'+m);
}

function JBE_CLOSE_VIEW(){
  var m=parseInt(document.getElementById("myView1").getAttribute('data-JBEpage'));
  console.log('closeView # '+m);
  var xclose=document.getElementById("myView"+m).getAttribute('data-close');
  //var param=xclose.substr(xclose.lastIndexOf('|')+1);
  //xclose=xclose.substr(0,xclose.lastIndexOf('|')+0);
  var ndx=xclose.indexOf('|');
  var param='';
  //alert('ndx:'+ndx+' len xclose:'+xclose.length);
  if(ndx >= 0){
    //param=xclose.substr(ndx+1);
    //xclose=xclose.substr(0,ndx);
    param=xclose.substring(ndx+1,xclose.length);
    xclose=xclose.substring(0,ndx);
  }
  
  console.log('param:'+param);
  console.log('xclose:'+xclose);

  var fn = window[xclose];
  if (typeof fn === "function"){
    //alert('yawa na!');
    if(fn(param)==false){ console.log('hear this!');return; }
  }
  
  document.getElementById("myView"+m).setAttribute('data-open','0');
  document.getElementById("myView"+m).style.display='none';
  
  if(m > 1){
    document.getElementById("myView"+(m-1)).style.display='block';    
    document.getElementById("myView1").setAttribute('data-JBEpage',m-1);
  }else{
    document.getElementById("myView1").setAttribute('data-JBEpage',0);
    document.getElementById('back_view'+m).style.display='block';  
    document.getElementById('cap_viewMid'+m).innerHTML='';
  }
}

//function EP_SetColorByClass(cls,clr1,clr2){
function JBE_SET_COLOR_BY_CLASS(cls,clr1,clr2){	  
  document.querySelectorAll('.'+cls).forEach(function(el) {
    if(clr1){ el.style.color=clr1; }
    if(clr2){ el.style.backgroundColor=clr2; }
  });
}
  
function JBE_GETFLD(r_ret_str,r_arry,r_fld,r_key){   
  //alert(' JBE_GETFLD arry len: '+r_arry.length);
  var rval='';
  for(var i=0; i<r_arry.length; i++) {
    if(r_key==r_arry[i][r_fld]){
      rval=r_arry[i][r_ret_str];      
      break;
    }    
  }    
  return rval;
}

function JBE_GETFLD2(ret,db,cond){
  var rval='';
  var ctr_cond=cond.length;

  for(var i=0;i<db.length;i++){    
    var ctr_ix=0;
    for(var ix=0;ix<ctr_cond;ix++){
      if(db[i][(cond[ix]['fld'])]==cond[ix]['val']){
        ctr_ix++;
      }
    }
    if(ctr_ix==ctr_cond){ 
      //alert('ctr_ix '+ctr_ix);
      rval=db[i][ret];
      break;
    }
  } 
  return rval;
}

function JBE_FILTER_ARRAY(db,cond){  
  var aryDB=[];
  var ctr=0;
  var ctr_cond=cond.length;
  
  for(var i=0;i<db.length;i++){    
    var ctr_ix=0;
    for(var ix=0;ix<ctr_cond;ix++){
      if(db[i][(cond[ix]['fld'])]==cond[ix]['val']){
        ctr_ix++;
      }
    }
    if(ctr_ix==ctr_cond){ 
      aryDB[ctr]=db[i];
      ctr++;
    }
  } 
  alert('ctr:'+ctr+' \nLen:'+aryDB.length);
  return aryDB;
}

function JBE_GETARRY(r_arry,r_fld,r_key){   
  //JBE_GETFLD('usertype',DB_CLIENTS,'usercode',usercode);  
  var rval=[];
  for(var i=0; i<r_arry.length; i++) {    
    if(r_key==r_arry[i][r_fld]){
      rval=r_arry[i];
      //alert(rval['clientno']);
      break;
    }
  }      
  return rval;
}

function JBE_GETARRY2(db,cond){  
  var aryDB=[];
  var ctr=0;
  var ctr_cond=cond.length;
  
  for(var i=0;i<db.length;i++){    
    var ctr_ix=0;
    for(var ix=0;ix<ctr_cond;ix++){
      if(db[i][(cond[ix]['fld'])]==cond[ix]['val']){
        ctr_ix++;
      }
    }
    if(ctr_ix==ctr_cond){ 
      aryDB=db[i];
      //ctr++;
      break;
    }
  } 
  //alert('ctr:'+ctr+' \nLen:'+aryDB.length);
  console.log(aryDB);
  return aryDB;
}

function JBE_IMG_EXIST(v_img){
  var img = document.createElement('img');

  img.src=v_img;

  img.onload = function(e){
    //alert('Success!');
    return true;
  };

  img.onerror = function(e) {
    //alert('ERROR!');
    return false;
  };
}

var JBE_LAT, JBE_LNG;
var GEO_MODE=0;
function JBE_GETLOCATION() {
	
	//alert(vmode);
	//alert(m);
   showProgress(true);
  if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(jbe_updatePosition, jbe_showError);
  } else { 
     MSG_SHOW(vbOk,"ERROR:","Geolocation is not supported by this app.",function(){},function(){});
     //snackBar("Geolocation is not supported by this app.");
  }
  showProgress(false);
}

function jbe_updatePosition(position) {
    if(GEO_MODE==0){
        document.getElementById('flat2').value=position.coords.latitude;
        document.getElementById('flng2').value=position.coords.longitude;
        //alert('Mode: '+GEO_MODE);
        return;
    }
	showProgress(true);
    axios.post(JBE_API+'z_user.php', { clientno:CURR_CLIENT, request:302,         
        lat:position.coords.latitude,
        lng:position.coords.longitude,
        usercode: CURR_USER ,
    },JBE_HEADER)     
    .then(function (response) {        
        DB_USER = response.data;
        get_db_clients();     
        //alert(response.data.length);
        showProgress(false);
        if(GEO_MODE!=0){
            snackBar('Location Updated');
        }
    }).catch(function (error) { 
        snackBar('ERROR: '+error);  
        showProgress(false);
    });    
}

function jbe_showError(error) {
  //var vmode=document.getElementById('div_admin_profile').getAttribute('data-mode');
  if(GEO_MODE==0){
     return;
  }
  var msg='XXX';
  switch(error.code) {
    case error.PERMISSION_DENIED:
      msg = "Please turn on your Location."
      break;
    case error.POSITION_UNAVAILABLE:
      msg = "Location information is unavailable."
      break;
    case error.TIMEOUT:
      msg = "The request to get user location timed out."
      break;
    case error.UNKNOWN_ERROR:
      msg = "An unknown error occurred."
      break;
  }
  showProgress(false);
  MSG_SHOW(vbOk,"ERROR:",msg,function(){},function(){});
}


function JBE_BASE64(src,callback){
	//alert(src);
    var img = new Image();
    img.src = src;
    img.onload = function() {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var dataURL ;
        
        canvas.height = this.naturalHeight;
        canvas.width = this.naturalWidth;
        ctx.drawImage(this, 0, 0);
         
        dataURL = canvas.toDataURL();  
        //alert(dataURL);
        callback(src);
    };
    
}

function JBE_BLOB(n,img) {
  return new Promise(resolve => {
    JBE_getBLOB(n,img,function(uurl){       
      resolve(uurl);       
    });           
  });
}

function JBE_getBLOB(n,jimg,callback){
  //alert(n+'  JBE_getBLOB : '+jimg);
  var canvas = document.createElement("canvas");
  const context = canvas.getContext('2d');  
  const img = new Image();
  img.crossOrigin = "anonymous";
  //img.src = "https://somesite.com/someimage.jpg"  
  //img.setAttribute('crossorigin', 'anonymous'); // works for me
  img.src=jimg;
  if(!JBE_ONLINE){
    img.onerror=img.onerror=null;img.src="gfx/jsite.png"; 
  }

  img.onload =  function() {
    canvas.width=img.width;
    canvas.height=img.height;
    context.drawImage(img, 0, 0);

    canvas.toBlob(function (blob) {        // get content as JPEG blob      
        var reader = new FileReader();
        reader.readAsBinaryString(blob);
        reader.onload = function(e) {    
            var bits = e.target.result;
            callback(bits);
        }
    });     
  }       
}

function JBE_AUDIO(s,d){
	navigator.vibrate(d);
	var xx = document.getElementById("myAudio"); 
	xx.pause();
	xx.src=s+'.mp3';
	xx.src=s+'.ogg';
	xx.load();
	xx.play();
}

function snackBar(s) {
  if(s==''){ return; }
  var x = document.getElementById("snackbar");    
  x.innerHTML=s;
  x.className = "show";
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

function JBE_SEEK_ARRAY(db,fld,seek){
  var rval=false;
  for(var i=0;i<db.length;i++){
    if(db[i][fld]==seek){
      rval=true;
      break;
    }
  }
  return rval;
}

function clear_THISFILE(){
  //snackBar('clear thisfile');
  //alert('thisfile activated');
  for(var i=0;i<25;i++){
    THISFILE[i]=null;
  }
}

function JBE_FORMAT_INT_TO_STR(num) {
  if(isNaN(num)){ num=0; }
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}
function JBE_FORMAT_DOUBLE_TO_STR(num) {
  if(isNaN(num)){ num=0; }
  num=Number(num);
  return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

function JBE_FORMAT_STR_TO_NUMBER(num){
  //return parseInt(num.replace(/,/g, ''));
  return parseInt(num.replaceAll(',', ''));
}

function JBE_FORMAT_STR_TO_DOUBLE(num){
  return parseFloat(num.replaceAll(',', ''));
}

function jeffNumber(mode,div) {  
  var vv = document.getElementById(div).value;
  if(vv==''){ vv='0'; }
  //alert('jeffNumber vv='+vv);
  var v = vv.replace(/,/g, '');
  //var res = str.replace(/,/g, ".");
  
  if(mode==1) {
    v=parseInt(v);
    var rval = JBE_FORMAT_INT_TO_STR(v);
  } else if(mode==2) {
    v=parseFloat(v);
    rval=JBE_FORMAT_DOUBLE_TO_STR(v);
  }
  
  document.getElementById(div).value=rval;
  return;
}

function JBE_DATE_FORMAT(d,f) {
  if(!d){ return ''; }
  if(d > 0) {
    var date=d;    
  }else{
    var date=new Date(d); 
  }
  var rval=date;
  if(isNaN(rval)){ return ''; }
  
  var monthNames = JBE_ARY_MONTH;
  var monthFullNames = JBE_ARY_FULLMONTH;
  let year = date.getFullYear();
  let month = (1 + date.getMonth()).toString().padStart(2, '0');
  let day = date.getDate().toString().padStart(2, '0');  
  if(f=='MMM DD, YYYY'){
    rval=monthNames[date.getMonth()] + ' ' + day + ', ' + year;
  }else if(f=='MM-DD-YYYY'){
    rval=month + '-' + day + '-' + year;
  }else if(f=='MM/DD/YYYY'){
    rval=month + '/' + day + '/' + year;
  }else if(f=='YYYY-MM-DD'){
    rval=year + '-' + month + '-' + day;  
  }else if(f=='YYYY/MM/DD'){
    rval=year + '/' + month + '/' + day;
  }else if(f=='DD-MMM-YYYY'){
    rval=day + '-' + monthNames[date.getMonth()] + '-' + year;  
  }else if(f=='YYYY-MM'){
    rval=year + '-' + month;  
  }else if(f=='MMM YYYY'){
    rval=monthNames[date.getMonth()] + ' ' + year;
  }else if(f=='MMMM YYYY'){
    rval=monthFullNames[date.getMonth()] + ' ' + year;
  }

  //if(isNaN(rval)){ return 'zzzz'; }
  return rval;
}

function JBE_SEARCH_BOX2(filterInput,cls_names,vKeyFld){
  //alert('vKeyFld '+vKeyFld);
  let vfilterInput=document.getElementById(filterInput);  
  vfilterInput.autocomplete = "off";
  vfilterInput.addEventListener('keyup',jfilterNames);  
  if(!JBE_MOBILE){ vfilterInput.focus(); }

  vfilterInput.value=vKeyFld;
    
  function jfilterNames(){
    //alert('jfilterNames '+v);
    var filterValue=document.getElementById(filterInput).value.toUpperCase();      
    var li=document.getElementsByClassName(cls_names);

    for(var i=0;i<li.length;i++){
      var a=li[i];
      if(a.innerHTML.toUpperCase().indexOf(filterValue) > -1){
        li[i].style.display='';
      }else{
        li[i].style.display='none';
      }        
    }
  }
}

function JBE_SEARCH_BOX(filterInput,cls_names,vKeyFld){
  //alert('vKeyFld '+vKeyFld);
  let vfilterInput=document.getElementById(filterInput);  
  vfilterInput.autocomplete = "off";
  vfilterInput.addEventListener('keyup',jfilterNames);  
  if(!JBE_MOBILE){ vfilterInput.focus(); }
  
  if(vKeyFld){ 
    vfilterInput.value=vKeyFld;    
    var li=document.getElementsByClassName(cls_names);    
    for(var i=0;i<li.length;i++){
      var val=document.getElementById('dd_'+i).innerHTML;
      if(!val){
        alert(i+' = '+cls_names);
        break;
      }
      //if(i>2){ break; }
      if(val == vKeyFld){
        document.getElementById('d_'+i).scrollIntoView();        
        document.getElementById('d_'+i).style.color='white';
        document.getElementById('d_'+i).style.backgroundColor='black';
        break;
      }        
    }
  }
  
  function jfilterNames(){
    //alert('jfilterNames '+v);
    var filterValue=document.getElementById(filterInput).value.toUpperCase();      
    var li=document.getElementsByClassName(cls_names);

    for(var i=0;i<li.length;i++){
      var a=li[i];
      if(a.innerHTML.toUpperCase().indexOf(filterValue) > -1){
        li[i].style.display='';
      }else{
        li[i].style.display='none';
      }        
    }
  }
}

async function JBE_PRINT_PDF(divName,title) {  
  document.getElementById(divName).style.border='0px';
  let opt = {
    margin:       .10,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },    
    jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
  };
  let element = document.getElementById(divName);    


  // Save current title
  var originalTitle = document.title;

  // Change title
  document.title = 'Generating PDF...';

  await html2pdf().set(opt).from(element).toPdf().output('blob').then((data) => {
    console.log(document.title);    
    document.title = originalTitle;
    let fileURL = URL.createObjectURL(data);
    window.open(fileURL);
    //var newWindow= window.open(fileURL);
    //newWindow.document.title = "xxxx";
    document.getElementById(divName).style.border='2px solid black';
  });
}

function JBE_PRINTDIV(divName,title) {  
  var JBE_CHROME_MOBILE=false;
  if (/Android|iPhone/i.test(navigator.userAgent)) { // This checks if the current device is in fact mobile
    JBE_CHROME_MOBILE=true;
  }
  var divToPrint=document.getElementById(divName);
  var printWindow = window.open(divName, 'PRINT', 'height=500,width=1000');
  printWindow.document.write('<html><head><title>'+title+'</title>');
  printWindow.document.write('</style>');
  printWindow.document.write('</head>');
  printWindow.document.write('<body>');
  printWindow.document.write(divToPrint.innerHTML);
  if(!JBE_CHROME_MOBILE){
    printWindow.document.write('<scr' + 'ipt type="text/javascript">' + 'window.onload = function() { window.print(); self.close(); };' + '</sc' + 'ript>');
  }else{
    printWindow.document.write('<scr' + 'ipt type="text/javascript">' + 'window.onload = function() { window.print(); };' + '</sc' + 'ript>');
  }
  printWindow.document.write('</body>');
  printWindow.document.write('</html>');
  printWindow.document.close();
  if(JBE_CHROME_MOBILE){
    //alert('print Mobile');    
    //printWindow.print();
    //window.close();
    //setTimeout(function(){web_window.close();},1000);
  }
}

function iif(cond,t,f){
  var rval;
  if(cond){
    rval=t;
  }else{
    rval=f;
  }
  return rval;
}

var JBE_COLORHEX = x => '#' + x.match(/\d+/g).map(y = z => ((+z < 16)?'0':'') + (+z).toString(16)).join('');

//======================================
function JBE_LOOKUP(mode,div_Search,DB,tilt,func,code,hdgs,flds) {  
  if(!mode){
    //document.getElementById('lookup').style.display='none';    
    JBE_CLOSEBOX();
    return;
  }    

  //alert('flds len:'+flds.length);
  //console.log('tulok:'+flds[0].fld);
  //return;
  
  var box2=0; 
  var box1=H_VIEW-(60+box2);
  
  var dtl=          
    '<div id="div_name" data-zoom=0 style="width:100%;height:'+box1+'px;font-text:14px;padding:0px;background-color:white;">'+         
      '<div style="width:100%;height:40px;padding:2px;text-align:center;color:'+JBE_TXCLOR1+';background:'+JBE_CLOR+';">'+
         '<input id="filterInput" type="text" style="float:left;width:100%;height:100%;text-align:center;" value="" placeholder="Search here..."/>'+      
      '</div>'+    
      '<div style="margin-top:5px;width:100%;height:30px;padding:5px;text-align:center;color:'+JBE_TXCLOR1+';background:'+JBE_CLOR+';">';
        //var colWidth=100/hdgs.length;
        for(var i=0;i<hdgs.length;i++){
          dtl+='<div style="float:left;width:'+hdgs[i].width+';height:100%;text-align:'+hdgs[i].align+';padding:0px;border:0px solid black;">'+hdgs[i].title+'</div>';
        }
        dtl+=
      '</div>'+          
      '<div style="width:100%;height:'+(box1-87+5)+'px;padding:0px;border:0px solid red;overflow:auto;">';
        var ddd='';
        for(var i=0;i<DB.length;i++){   
          ddd+=
          '<div id="d_'+i+'" class="cls_names" onclick="'+func+'(&quot;'+flds[0].fld+'&quot;,&quot;'+DB[i][code]+'&quot;);JBE_CLOSEBOX();" style="cursor:pointer;font-size:12px;width:100%;height:25px;padding:5px;border:1px solid gray;">';
            
            let z_dtl='';
            for(var z=0;z<flds.length;z++){
              //console.log('tulok:'+flds[z].fld);
              let fld=flds[z].fld;
              let fld_type=flds[z].type;
              let fld_val=DB[i][fld];
              
              //console.log('>>>  fld_val:'+fld_val+'   fld_type:'+fld_type);
              if(fld_type=='date'){ fld_val=JBE_DATE_FORMAT(fld_val,'YYYY-MM-DD'); }
              //console.log('fm2_lookup : '+z+': '+DB[i][flds[z]]+' isDate:'+Date.parse(DB[i][flds[z]]));
              if(z==1){
                z_dtl+='<div id="dd_'+i+'" style="float:left;width:'+hdgs[z].width+';padding:0 0 0 '+z+'%;text-align:'+hdgs[z].align+';background:none;">'+fld_val+'</div>';
              }else{
                z_dtl+='<div style="float:left;width:'+hdgs[z].width+';padding:0 0 0 '+z+'%;text-align:'+hdgs[z].align+';background:none;">'+fld_val+'</div>';
              }
              
            }
                          
            ddd+=z_dtl+
          '</div>';          
        }
        dtl+=ddd+
      '</div>'+    
    '</div>';
     
  
  var dtl2=
    '<div style="width:100%;height:100%;padding:12px 0 0 0;text-align:center;background:none;">'+
      'Look Up Module ver. 2.0'+
    '</div>';

  JBE_OPENBOX('div_name',tilt,dtl,dtl2); 
  //alert('div_Search '+div_Search);
  JBE_SEARCH_BOX('filterInput','cls_names',div_Search);
}

function JBE_REC_EXIST(tbl,fld,val,retfld){
  let rval='';
  for(var i=0;i<tbl.length;i++){
    if(tbl[i][fld]==val){
      rval=tbl[i][retfld];
      break;
    }
  }
  return rval;
}

function JBE_CHK_USER(axtype){
  if(!CURR_USER){
    snackBar('Please Log In...');
    return false;
  }

  if(CURR_AXTYPE < axtype){
    snackBar('Access Denied...');
    return false;
  }
  return true;
}

function JBE_LOGGER_SAVE(usercode,mode,trano,trans,details){
  /*
  alert(
    'usercode:'+usercode+'\n'+
    'trans:'+trans+'\n'+
    'details:'+details
  );
  */
  //let mode=iif(FM_ADD_FLAG,1,2);
  //alert(FM_ADD_FLAG);
  var d = new Date();
  let date=JBE_DATE_FORMAT(d,'YYYY-MM-DD');
  let time= d.toLocaleTimeString('it-IT');
  let LOG_AXIOS_PARA1=[];
  let LOG_AXIOS_SQL='';
  let LOG_TABLE_NAME='logger';
  var fldnames=["usercode","mode","trano","date","time","trans","details"];
  var fldvals=[usercode,mode,trano,date,time,trans,details];
  var vsql='';
  var vcommas='';
  showProgress(true);      
  for(var i=0;i<fldnames.length;i++){
    vsql+=fldnames[i]+',';
    vcommas=vcommas+'?,';
  }      
  vsql=vsql.substring(0,vsql.length-1);
  vcommas=vcommas.substring(0,vcommas.length-1);
  LOG_AXIOS_SQL='INSERT INTO '+LOG_TABLE_NAME+' ('+vsql+') VALUES ('+vcommas+')';
  LOG_AXIOS_PARA1=fldvals;
  
  axios.post('/api/fmlib_save', {headers: { 'Content-Type': 'application/json' }}, { params: { sql:LOG_AXIOS_SQL,fld:LOG_AXIOS_PARA1,tbl:LOG_TABLE_NAME,fm_mode:1 } })    
  .then(function (response) {           
    showProgress(false);      
    //console.log(response.data);        
    DB_LOGGER=response.data;
  })
  .catch(function (error) {
    console.log(error);
    showProgress(false);
  });
}

function JBE_SHOW_LOGGER(trano,trans){
  //alert(trano);
  if(!trano){ return; }
  //alert('JBE_SHOW_LOGGER: '+trano);
  //return;
  var tilt='Record Logger';
  DB_LOGGER.sort(JBE_SORT_ARRAY(['*date','*time','trano']));
  let date_create='';
  let time_create='';
  let file_create='';
  let ctr=0;
  
  var dtl=
    '<div id="div_showlog" data-zoom=0 style="width:100%;height:'+(H_BODY-200)+'px;text-align:center;padding:0px;border:1px solid green;background-color:white;">'+

      '<div style="width:100%;height:25%;padding:5px;text-align:center;color:black;background:none;">'+
        '<div style="float:left;width:50%;height:50%;;border:0px solid blue;text-align:left;padding:0px;">'+
          '<div style="float:left;width:auto;height:100%;border:0px solid red;">Ref. No: </div>'+
          '<div id="file_trano" style="float:left;border:1px solid lightgray;width:59%;height:100%;margin-left:1%;overflow:auto;">'+trano+'</div>'+
        '</div>'+
        '<div style="float:left;width:50%;height:50%;text-align:left;padding:5px;">Trans: <span style="height:100%;overflow:auto;">'+trans+'</span></div>'+
        '<div style="float:left;width:50%;height:50%;text-align:left;padding:5px;">Created by: <span id="file_create" style="height:100%;overflow:auto;"></span></div>'+
        '<div style="float:left;width:50%;height:50px;text-align:left;padding:5px;">Date: <span id="date_create" style="height:100%;overflow:auto;"></span></div>'+
      '</div>'+   

      '<div style="width:100%;height:10%;padding:2px;text-align:center;color:'+JBE_TXCLOR1+';background:'+JBE_CLOR+';">'+        
        '<div style="float:left;width:50%;height:50%;padding:5px;">Editors</div>'+
        '<div style="float:left;width:50%;height:50%;padding:5px;">Date</div>'+
      '</div>'+ 

      '<div style="width:100%;height:65%;padding:2px;text-align:center;overflow:auto;color:black;background:none;">';
        for(var i=0;i<DB_LOGGER.length;i++){
          if(!(DB_LOGGER[i].trano == trano && DB_LOGGER[i].trans == trans)){ continue; }

          //console.log('>>> '+DB_LOGGER[i].usercode);
          if(DB_LOGGER[i].mode==1){
            file_create=JBE_GETFLD('username',DB_USER,'usercode',DB_LOGGER[i].usercode);
            date_create=DB_LOGGER[i].date;
            time_create=DB_LOGGER[i].time;
          }else{ 
            dtl+=
              '<div style="float:left;width:50%;height:25px;margin:0px;padding:2px;border:1px solid lightgray;">'+JBE_GETFLD('username',DB_USER,'usercode',DB_LOGGER[i].usercode)+'</div>'+
              '<div style="float:left;width:50%;height:25px;margin:0px;padding:2px;border:1px solid lightgray;">'+JBE_DATE_FORMAT(DB_LOGGER[i].date,'MM-DD-YYYY')+' | '+DB_LOGGER[i].time+'</div>';
          }
        }
          
      dtl+=
    '</div>';
  
  var dtl2=      
    '<div style="width:100%;height:100%;padding:11px 0 0 0;text-align:center;color:'+JBE_TXCLOR1+';background:none;">'+
      tilt+      
    '</div>';   

  JBE_OPENBOX('div_showlog','Logger',dtl,dtl2); 
  document.getElementById('file_create').innerHTML=file_create;
  document.getElementById('date_create').innerHTML=JBE_DATE_FORMAT(date_create,'MM-DD-YYYY')+'  '+time_create;
}
//enad
