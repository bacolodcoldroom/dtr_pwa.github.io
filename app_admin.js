function showLogin(){ 
  if(!JBE_ONLINE){
    snackBar('OFFLINE');
    return;
  }
  window.history.pushState({ noBackExitsApp: true }, '');
  f_MainPage=false;

  document.getElementById('img_avatar').src=document.getElementById('bar_avatar').src; 
  document.getElementById('div_avatar').style.display='none';
  document.getElementById("firstlogin").style.height='310px';
  document.getElementById('fmsg').innerHTML="Make sure your password is more than 10 or at least 8 characters."; 
  document.getElementById('fmsg').style.display='block';
  document.getElementById("fmsg").style.color="black";

  document.getElementById('logpanel').style.display='block';
  document.getElementById('log_1').style.display='block';

  if(CURR_USER){
    document.getElementById('log_1').style.display='none';
    document.getElementById('logpanel').style.display='none';   
  }
   
  document.getElementById('page_login').style.display='block'; 
  document.getElementById("firstlogin").style.display='block'; 
  document.getElementById("firstlogin").setAttribute('data-mod',1); 
  init_lognow();
}

function init_lognow(){
  var d = new Date(); 
  var n = d.toLocaleTimeString('it-IT');
  var sagb=d.toString().substring(0,25);

  document.getElementById('fuser').value='';
  document.getElementById('fpass').value='';
  document.getElementById('fmsg').innerHTML="Make sure your password is more than 10 or at least 8 characters."+
                                            "<br><br><center>Today is: "+sagb+"</center>";
  document.getElementById("fmsg").style.color="black";

  document.getElementById('signUp').style.pointerEvents='auto';
  document.getElementById('signUp').style.color='red';
   
  document.getElementById('fuser').disabled=false;
  document.getElementById('fpass').disabled=false;
  document.getElementById("lognow").value="Log In";
  document.getElementById('fuser').focus();   
  var jbepass='JBE'+sagb.substring(6,7).toUpperCase()+sagb.substring(19,21)+sagb.substring(2,3).toUpperCase();   
  jbepass=jbepass.toUpperCase();
  document.getElementById("page_login").disabled=false;
  document.getElementById("page_login").setAttribute('data-jbepass',jbepass);
  //document.getElementById("div_today").innerHTML=sagb;

}

function chk_lognow(){
  if(document.getElementById("lognow").value=="Try Again"){
    init_lognow();
    return;
  }
  var u=document.getElementById('fuser').value;
  var p=document.getElementById('fpass').value;
  p=p.toUpperCase();
  var jbepass=document.getElementById("page_login").getAttribute('data-jbepass');
 
  if(p==jbepass){
    CURR_USER='JBE';
    CURR_NAME='MR. PROGRAMMER';
    CURR_AXTYPE=9;          
    document.getElementById('logger').innerHTML="Hi!, "+CURR_NAME;   
    login_ok(1);
    return;
  }
  rest_api_lognow(u,p);
}

function greetings(){
  let hour = new Date().getHours();
  let msg="Good " + (hour<12 && "Morning" || hour<18 && "Afternoon" || "Evening")+" "+CURR_NAME2;
  speakText(msg);
}

function refreshNOTIF(v){ 
  var ctrCHAT=0;
  var ctrCART=0;
  var ctrORDER=0;
  var ctrBELL=0;
 
  document.getElementById('div_notifs').style.display='block';

  if(CURR_AXTYPE > 0){  // OWNERS ONLY
    document.getElementById('div_notifs').style.display='none';
    //count chat   
    if(v=='chat' || v=='ALL'){
      for(var i=0;i<DB_CHAT.length;i++){     
        if(DB_CHAT[i]['sender']=='1') { continue; }
        if(DB_CHAT[i]['unread']=='1') { continue; }
        ctrCHAT++;
      } 
      document.getElementById('ntf_chat_owner').innerHTML=ctrCHAT;     
      document.getElementById('ntf_chat_owner').style.display='block';
      if(ctrCHAT==0){
        document.getElementById('ntf_chat_owner').style.display='none';
      }else{
          JBE_AUDIO('inbox',300);
      }
    }
  
    if(v=='order' || v=='ALL'){
      var aryORD=DB_ORDER;
      aryORD.sort(sortByMultipleKey(['trano']));      
      for(var i=0;i<aryORD.length;i++){
        if(aryORD[i]['stat'] != 0) { continue; }
        //if(aryORD[i]['unread']=='1') { continue; }
        ctrORDER++;
      }
      document.getElementById('ntf_order_owner').innerHTML=ctrORDER;     
      document.getElementById('ntf_order_owner').style.display='block';
      if(ctrORDER==0){
        document.getElementById('ntf_order_owner').style.display='none';
      }else{
          JBE_AUDIO('chimes',300);
      }
    }
    return;
  }

  if(v=='cart' || v=='ALL'){
    for(var i=0;i<DB_CART.length;i++){
      if(DB_CART[i]['usercode']!=CURR_USER) { continue; }
      ctrCART++;
    } 
    document.getElementById('ntf_cart').style.display='block';
    document.getElementById('ntf_cart').innerHTML=ctrCART;
    document.getElementById('notif_cart').style.display='block';
    if(ctrCART==0){
      document.getElementById('ntf_cart').style.display='none';
    }else{
          JBE_AUDIO('cart',0);
    }
  }

  //count chat   
  if(v=='chat' || v=='ALL'){
    for(var i=0;i<DB_CHAT.length;i++){  
      if(DB_CHAT[i]['usercode']!=CURR_USER) { continue; }
      if(DB_CHAT[i]['sender']=='0') { continue; }
      if(DB_CHAT[i]['unread']=='1') { continue; }
      ctrCHAT++; 
    }     
    document.getElementById('ntf_chat').style.display='block';
    document.getElementById('ntf_chat').innerHTML=ctrCHAT; 
    document.getElementById('notif_chat').style.display='block';
    if(ctrCHAT==0){
      document.getElementById('notif_chat').style.display='none';
    }else{
          JBE_AUDIO('inbox',300);
    }
  }

  //count bell   
  if(v=='bell' || v=='ALL'){
    for(var i=0;i<DB_BELL.length;i++){  
      if(DB_BELL[i]['usercode'] != CURR_USER) { continue; } 
      if(DB_BELL[i]['unread']=='1') { continue; }
      ctrBELL++; 
    }     
    document.getElementById('ntf_bell').style.display='block';
    document.getElementById('ntf_bell').innerHTML=ctrBELL; 
    document.getElementById('notif_bell').style.display='block';
    if(ctrBELL==0){
      document.getElementById('ntf_bell').style.display='none';
    }else{
          JBE_AUDIO('insight',300);
    }
  } 
}


function login_ok(v){
  //clearStore(JBE_STORE_IDX[1]['flename']); saveDataToIDX(DB_USER,1);
  createCookie('cok_client_'+CURR_CLIENT,CURR_CLIENT,1);
  createCookie('cok_user_'+CURR_CLIENT,CURR_USER,1);
  createCookie('cok_axtype_'+CURR_CLIENT,CURR_AXTYPE,1);
  createCookie('cok_name_'+CURR_CLIENT,CURR_NAME,1);
  createCookie('cok_name2_'+CURR_CLIENT,CURR_NAME2,1);
  //alert(CURR_NAME+' vs '+CURR_NAME2);
  var vmenu='mnu_main';
  /*       
  if(CURR_AXTYPE > 0){
    document.getElementById("menu_open").style.display='block';
    vmenu='mnu_main_owner';
  }else{
    document.getElementById("menu_open").style.display='none';
  }
  */
  dispMenu(true,vmenu);
  //get_db_user(CURR_USER,true);
  closeLogin();
  //get_app_var(CURR_USER,true);
  //refreshNOTIF('');
  //document.getElementById("logger").innerHTML="Hi!, "+CURR_NAME;
  dispHeaderMode();
  refresh_sidenav();
}

function main_login(){
  if(!JBE_ONLINE){
    snackBar('OFFLINE');
    return;
  }

  if(!CURR_USER){
    showLogin();
  }else{
    fm_admin();
  }
}
function closeLogin(){
  document.getElementById("page_login").style.display="none";
}
function preLogOut(){
  MSG_SHOW(vbYesNo,"CONFIRM:","Are you sure to Log Out now?",
    function(){ logout(); },function(){});
  return;
}

//************************************************************************************************ */
function fm_admin(){
  window.history.pushState({ noBackExitsApp: true }, '');
  f_MainPage=false;
  var n = new Date().toLocaleTimeString('it-IT');
  mnu_fm_admin();
  document.getElementById('back_view1').style.display='block';

  var menuMenu='';
 
  var profileImg=document.getElementById('bar_avatar').src;
  var username=CURR_NAME;
  var menuPurchase='';
  var menuEditStaff=
    '<div style="width:100%;height:auto;padding:10px;font-size:12px;">System Code: '+CURR_CLIENT+'</div>'+
    '<div onclick="editStaff()" style="width:100%;height:40px;margin-top:10px;padding:5px;cursor:pointer;background:none;">'+
      '<img src="gfx/jpurchase.png" style="float:left;height:100%;"/>'+
      '<span style="float:left;margin-left:5px;padding:5px;">Edit Users</span>'+
    '</div>'; 

  var menuEditProfile=
    '<div onclick="fm_profile(2)" style="width:100%;height:40px;margin-top:20px;padding:5px;cursor:pointer;background:none;">'+
      '<img src="gfx/avatar.png" style="float:left;height:100%;"/>'+
      '<span style="float:left;margin-left:5px;padding:5px;">Edit Profile</span>'+
    '</div>';
 
  menuMenu=menuPurchase+menuEditProfile;
  var vdisp_location='block';
  if(CURR_AXTYPE > 0){
      menuMenu=menuEditProfile;
      vdisp_location='none';
  }
  vdisp_location='block';
  if(CURR_AXTYPE == 5){ menuMenu=menuEditStaff+menuEditProfile; }
  if(CURR_AXTYPE == 9){ menuMenu=menuEditStaff }

  var dtl=
    '<div id="div_main_admin" style="width:100%;height:100%;padding:0px;overflow-x:hidden;overflow-y:auto;background:none;">'+
     
      '<div style="height:55px;width:100%;padding:5px;color:'+JBE_TXCLOR1+';background:'+JBE_CLOR+';">'+
        '<div style="float:right;height:100%;width:auto;border-radius:50%;border:2px solid white;background:none;">'+
          '<img id="admin_avatar" src="'+profileImg+'" style="height:100%;width:40px;border-radius:50%;border:1px solid black;background:none;" alt="ai" >'+
        '</div>'+
        '<div id="admin_username" style="float:right;height:100%;width:auto;margin-right:5px;padding:10px 0 0 0;font-weight:bold;font-size:18px;color:white;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;">'+
          username+
        '</div>'+
      '</div>'+

      '<div id="div_dtl_admin" style="width:100%;height:'+(H_VIEW-55)+'px;overflow-x:hidden;overflow-y:auto;background:white;padding:2px;">'+
        menuMenu+      
        //'<div onclick="upd_location()" style="display:'+vdisp_location+';width:100%;height:40px;margin-top:20px;padding:5px;cursor:pointer;background:none;">'
        '<div onclick="my_location()" style="display:'+vdisp_location+';width:100%;height:40px;margin-top:20px;padding:5px;cursor:pointer;background:none;">'+
          '<img src="gfx/landmark.png" style="float:left;height:100%;"/>'+
          '<span style="float:left;margin-left:5px;padding:5px;">My Location</span>'+
        '</div>'+
       
        '<div onclick="showQR()" style="width:100%;height:40px;margin-top:20px;padding:5px;cursor:pointer;background:none;">'+
          '<img src="gfx/qrcode.png" style="float:left;height:100%;"/>'+
          '<span style="float:left;margin-left:5px;padding:5px;">App QR-Code</span>'+
        '</div>'+
       
        '<div onclick="share_app()" style="width:100%;height:40px;margin-top:20px;padding:5px;cursor:pointer;background:none;">'+
          '<img src="gfx/jshare.png" style="float:left;height:100%;"/>'+
          '<span style="float:left;margin-left:5px;padding:5px;">Share the App</span>'+
        '</div>'+

        '<div onclick="layas()" style="width:100%;height:40px;margin-top:50px;padding:5px;cursor:pointer;background:none;">'+
          '<img src="gfx/jedit.png" style="float:left;height:100%;"/>'+
          '<span style="float:left;margin-left:5px;padding:5px;color:red;">Log Out</span>'+
        '</div>'+
        
      '</div>'+

    '</div>';       

  JBE_OPEN_VIEW(dtl,'My Account','close_admin');   
}

function close_admin(){
  showMainPage();
}

function mnu_fm_admin(){
  var jmenu=
    '<div style="width:100%;height:100%;">'+
      '<div style="width:100%;height:100%;padding:12px 0 0 0;text-align:center;background:none;">'+
        'Account Menu'+
      '</div>'+
    '</div>';
  dispMenu(false,jmenu);
}

function layas(){
  MSG_SHOW(vbYesNo,"CONFIRM:","Are you sure to Log Out now?",
    function(){ logout(); close_admin(); },function(){});
  return;
}
function logout(){
  document.getElementById("logger").innerHTML="Log In";     
  eraseCookie('cok_user_'+CURR_CLIENT);
  eraseCookie('cok_axtype_'+CURR_CLIENT);
  eraseCookie('cok_name_'+CURR_CLIENT);
  eraseCookie('cok_name2_'+CURR_CLIENT);
  CURR_USER=null;
  CURR_NAME=null;
  CURR_AXTYPE=null;   
  //DB_USER=[];
  DB_CART=[];
  JBE_TRANS=[];
  JBE_TRANS2=[];   
  showProfile(5);
  //refreshNOTIF('');
  closeLogin();

  var vmenu='mnu_main';
  if(CURR_AXTYPE > 0){ vmenu='mnu_main_owner'; } 
  dispMenu(true,vmenu);
}

function fm_profile(vmode){
  //alert('fm_profile:'+vmode+'  len USER:'+DB_USER.length);
  if(vmode==1){
      GEO_MODE=0;
      JBE_GETLOCATION();
      document.getElementById('page_login').style.display='none';
  }
  var n = new Date().toLocaleTimeString('it-IT');
  var jmenu=
    '<div style="width:100%;height:100%;color:'+JBE_TXCLOR1+';">'+
      '<div id="lognow2" onclick="save_profile()" style="float:left;width:25%;height:100%;color:'+JBE_TXCLOR1+';background:none;">'+       
        '<div class="footer_gfxs">'+
          '<img src="gfx/jsave.png" style="height:100%;" alt="save image" />'+
        '</div>'+
        '<span class="footer_fonts">Save</span>'+
      '</div>'+
      '<div onclick="JBE_CLOSE_VIEW();" style="float:left;width:25%;height:100%;margin-left:50%;color:'+JBE_TXCLOR1+';background:none;">'+       
        '<div class="footer_gfxs">'+
          '<img src="gfx/jcancel.png"  style="height:100%;" alt="del image" />'+
        '</div>'+
        '<span class="footer_fonts">Cancel</span>'+
      '</div>'+
    '</div>';
  dispMenu(false,jmenu);

  var vDate=new Date(); 
  var vTime = vDate.toLocaleTimeString('it-IT');
  vDate = new Date(vDate.getTime() - (vDate.getTimezoneOffset() * 60000 )).toISOString().split("T")[0]; 
  var usercode='U_'+vDate+'_'+vTime;
  usercode = usercode.replace(/-/g, "").replace(/:/g, "").replace("T", "-");  


  var profileImg='gfx/avatar.png'+'?'+n;
  var userid='';
  var username='';
  username2='';
  fullname='';
  var pword='';
  var addrss='';
  var celno='';
  var foto='';
  var lat=0;
  var lng=0;
  var d_active=JBE_DATE_FORMAT(vDate,'YYYY-MM-DD');
  var v_disabled='';

  if(vmode==2){
    //alert('CURR_USER:'+CURR_USER);
    //alert('exist:'+usercode);
    var aryDB=JBE_GETARRY(DB_USER,'usercode',CURR_USER);
    profileImg=document.getElementById('bar_avatar').src;
    usercode=aryDB['usercode'];
    userid=aryDB['userid'];
    pword=aryDB['pword'];
    username=aryDB['username'];
    username2=aryDB['username2'];
    fullname=aryDB['fullname'];
    addrss=aryDB['addrss'];
    celno=aryDB['celno'];
    foto=aryDB['photo'];
    lat=parseFloat(aryDB['lat']);
    lng=parseFloat(aryDB['lng']);
    d_active=JBE_DATE_FORMAT(aryDB['d_active'],'YYYY-MM-DD');
    v_disabled='disabled';
   
  }

  //alert(vmode+' usercode:'+usercode+' CURR_USER:'+CURR_USER);
 
  //alert('Mode: '+vmode+' : '+ lat+' vs '+lng);
 
  var dtl=
    '<div id="div_admin_profile" data-mode='+vmode+' data-usercode="'+usercode+'" style="width:100%;height:100%;padding:0px;overflow-x:hidden;overflow-y:auto;background:white;">'+
           
      '<div style="height:100px;width:100%;margin-top:20px;text-align:center;padding:5px;color:black;background:none;">'+

        '<div id="dv_avatar" style="position:relative;width:100%;height:75px;text-align:center;background:none;">'+
          '<img id="img_eavatar'+vmode+'" data-img="'+foto+'" name="img_eavatar'+vmode+'" src="'+profileImg+'" style="border-radius:50%;height:75px;width:75px;border:1px solid gray;"/>'+
          '<div id="div_avatar" style="position:absolute;top:50%;left:50%;cursor:pointer;border-radius:50%;border:1px solid black;'+
                'height:30px;width:30px;padding:3px;background:#434343;">'+           
            '<input type="file" id="id_efile'+vmode+'" data-orig="" data-sel=0 name="id_efile'+vmode+'" hidden="hidden" />'+
            '<img src="gfx/jcam.png" onclick="JBE_GET_IMAGE(0,id_efile'+vmode+'.id,img_eavatar'+vmode+'.id,&quot;&quot;,false)" style="width:95%;"/>'+
          '</div>'+
        '</div>'+

        //'<form onsubmit="return false" class="class_admin" style="font-size:12px;margin-top:20px;margin-bottom:10px;height:auto;background:none;">'+
        '<div class="class_admin" style="font-size:12px;margin-top:20px;margin-bottom:10px;height:auto;background:none;">'+

          '<div id="dv_usercode" style="margin-top:10px; height:auto; width:100%;background:none;">'+
            '<span style="height:15px; width:100%; background:none;">USER CODE</span>'+
            '<input id="fusercode" disabled class="class_profile" value="'+usercode+'"/>'+           
          '</div>'+

          '<div id="dv_uid2" style="margin-top:10px; height:auto; width:100%;background:none;">'+
            '<span style="height:15px; width:100%; background:none;">User ID</span>'+
            '<input id="fuser2" class="class_profile" onchange="chk_fld(this.value,fpass2.value,'+vmode+')" type="text"  placeholder="User ID (Name, Email or Phone Number)" maxlength=20 onkeydown="javascript:if(event.keyCode==13) document.getElementById(&quot;fpass2&quot;).focus();"'+
                'value="'+userid+'"/>'+           
          '</div>'+
 
          '<div id="dv_pass" style="margin-top:10px; height:auto; width:100%;background:none;">'+
            '<span style="height:15px; width:100%;background:none;">Password</span>'+           
            '<input id="fpass2" class="class_profile" onchange="chk_fld(this.value,fpass2.value,'+vmode+')" name="fpass" autocomplete="off" type="password" placeholder="Password" maxlength=20 onkeydown="javascript:if(event.keyCode==13) document.getElementById(&quot;faddrss2&quot;).focus()"'+
                'value="'+pword+'"/>'+           
          '</div>'+

          '<div style="margin-top:10px; height:auto; width:100%;background:none;">'+
            '<span style="height:15px; width:100%; background:none;">Username</span>'+
            '<input id="fname2" class="class_profile" type="text" placeholder="User Name"  maxlength=50 onkeydown="javascript:if(event.keyCode==13) document.getElementById(&quot;faddrss2&quot;).focus()" '+
                'value="'+username+'"/>'+           
          '</div>'+
         
          '<div style="margin-top:10px; height:auto; width:100%;background:none;">'+
            '<span style="height:15px; width:100%; background:none;">Name 2</span>'+
            '<input id="fname22" class="class_profile" type="text" placeholder="User Name2"  maxlength=50 onkeydown="javascript:if(event.keyCode==13) document.getElementById(&quot;faddrss2&quot;).focus()" '+
                'value="'+username2+'"/>'+           
          '</div>'+
         
          '<div style="margin-top:10px; height:auto; width:100%;background:none;">'+
            '<span style="height:15px; width:100%; background:none;">Fullname</span>'+
            '<input id="ffullname22" class="class_profile" type="text" placeholder="User Full Name"  maxlength=50 onkeydown="javascript:if(event.keyCode==13) document.getElementById(&quot;faddrss2&quot;).focus()" '+
                'value="'+fullname+'"/>'+           
          '</div>'+

          '<div style="margin-top:10px; height:auto; width:100%;background:none;">'+
            '<span style="height:15px; width:100%; background:none;">Address</span>'+
            '<textarea id="faddrss2" class="class_profile" name="faddrss" rows="4" cols="50" maxlength=300 placeholder="Address" style="resize:none;height:70px;">'+
              addrss+'</textarea>'+   
          '</div>'+

          '<div style="margin-top:10px; height:auto; width:100%;background:none;">'+
            '<span style="height:15px; width:100%; background:none;">Celphone</span>'+
            '<input id="fcelno2" class="class_profile" type="number" placeholder="Contact Number"  maxlength=11" '+
                'value="'+celno+'"/>'+           
          '</div>'+

          '<div style="display:none;margin-top:10px; height:40px; width:100%;background:none;">'+
            '<div style="float:left;height:100%; width:49.5%;background:none;">'+
              '<div style="height:15px; width:100%; background:none;">Latitude</div>'+
              '<input id="flat2" class="class_profile" type="number" readonly placeholder="Latitude" '+
                  'value="'+lat+'"/>'+           
            '</div>'+
            '<div style="float:right;height:100%; width:49.5%;background:none;">'+
              '<div style="height:15px; width:100%; background:none;">Longitude</div>'+
              '<input id="flng2" class="class_profile" type="number" readonly placeholder="Longitude" '+
                  'value="'+lng+'"/>'+ 
            '</div>'+
          '</div>'+

          '<div id="dv_d_active" style="display:none;margin-top:10px; height:auto; width:100%;background:none;">'+
            d_active+
          '</div>'+

        '</div>'+

      '</div>'+

    '</div>';       

  JBE_OPEN_VIEW(dtl,'My Profile','close_profile');
 
}
function chk_fld(u,p,vmode){
  if(vmode != 1) { return; };
  if(u=='' || p==''){
    //alert('blank u:'+u+'  p:'+p);
    return;
  }
 
  rest_api_chk_fld(u,p);
}

function close_profile(){
  var vmode=document.getElementById('div_admin_profile').getAttribute('data-mode');
  if(vmode==1){
    //document.getElementById('page_login').style.display='none';
    showMainPage();
  }else{
    mnu_fm_admin();
  }
}

function save_profile(){ 
  var vmode=document.getElementById('div_admin_profile').getAttribute('data-mode');
  //alert('going to save. data mode:'+vmode);

  if(vmode==1){ GEO_MODE=0; }
  var profileImg=document.getElementById('bar_avatar').src;
  var usercode=document.getElementById('div_admin_profile').getAttribute('data-usercode');
  var u=document.getElementById('fuser2').value;
  var p=document.getElementById('fpass2').value;
  var n=document.getElementById('fname2').value;
  var n2=document.getElementById('fname22').value;
  var n2full=document.getElementById('ffullname22').value;
  var a=document.getElementById('faddrss2').value;
  var c=document.getElementById('fcelno2').value; 
  var lat=document.getElementById('flat2').value; 
  var lng=document.getElementById('flng2').value; 
  var d_active=document.getElementById('dv_d_active').innerHTML; 
 
  var foto=document.getElementById('img_eavatar'+vmode).getAttribute('data-img');
  foto=profileImg;
  //alert('profileImg:'+profileImg);

 
  if(u=='' || p=='' || n=='' || c=='' || a=='' || foto==''){
    var vmsg='';
    //if(lat==0 || lng==0){ vmsg="Location Can't be Found!<br>Please Turn On your Location."; }
    if(foto==''){ vmsg='Image Profile is Empty'; }
    else if(u==''){ vmsg='User ID is Empty'; }
    else if(p==''){ vmsg='User Password is Empty'; }
    else if(n==''){ vmsg='User Name is Empty'; }
    else if(c==''){ vmsg='User Celfone is Empty'; }
    else if(a==''){ vmsg='User address is Empty'; }
    else if(foto==''){ vmsg='Image Profile is Empty'; }
    MSG_SHOW(vbOk,"ERROR: Pls. complete the form.",vmsg,function(){},function(){});
    return;
  }
   
  var photo=usercode+'.jpg';  
 
  var targetDIR='uploadz/'; 
  if(THISFILE[0]){
    let ob = [
      { "div":"bar_avatar" },
      { "div":"admin_avatar" }
    ];
    if(vmode==1){ ob=[]; }
    uploadNOW(THISFILE[0],photo,targetDIR,ob,false,false);
  } 
  rest_api_save_profile(vmode,usercode,u,p,n,n2,n2full,a,photo,c,lat,lng,d_active,0);
}
 
function update_curr_user(usercode,n){
  CURR_USER=usercode; CURR_NAME=n; CURR_NAME2=n;
  createCookie('cok_client_'+CURR_CLIENT,CURR_CLIENT,1);
  createCookie('cok_user_'+CURR_CLIENT,CURR_USER,1);
  createCookie('cok_axtype_'+CURR_CLIENT,CURR_AXTYPE,1);
  createCookie('cok_name_'+CURR_CLIENT,CURR_NAME,1);
  createCookie('cok_name2_'+CURR_CLIENT,CURR_NAME2,1);
  //get_app_var(usercode,false);
}

/************************************** */
function editStaff(){ 
  //get_db_clients(); 
  window.history.pushState({ noBackExitsApp: true }, '');
  f_MainPage=false;
 
  usercode=CURR_USER;
  //alert(usercode);

  mnu_editStaff();

  var dtl=
    '<div id="div_main_editStaff" data-usercode="'+usercode+'" style="width:100%;height:100%;padding:5px;overflow-x:hidden;overflow-y:auto;background:white;">'+
      '<div style="width:100%;height:20px;margin-top:5px;color:navy;font-weight:bold;background:white;">'+
        '<span style="float:left;width:65%;text-align:center;">User Name</span>'+
        '<span style="float:right;width:35%;text-align:right;padding:0 13px 0 0;background:none;">User Level</span>'+
      '</div>'+
      '<div id="div_editStaff" style="width:100%;height:'+(H_VIEW-35)+'px;margin-top:0px;padding:0px;overflow-x:hidden;overflow-y:auto;background:whitesmoke;"></div>'+
    '</div>';       
 
  JBE_OPEN_VIEW(dtl,'Edit Users','close_editStaff');
  disp_editStaff(); 
}
function mnu_editStaff(){
  var jmenu=
    '<div style="width:100%;height:100%;">'+
      '<div style="width:100%;height:100%;padding:12px 0 0 0;text-align:center;background:none;">'+
        'Users Facility'+
      '</div>'+
    '</div>';
  dispMenu(false,jmenu);
}
function close_editStaff(){
  mnu_fm_admin();
}

function disp_editStaff(){ 
  var aryDB=DB_CLIENTS; 
  aryDB.sort(sortByMultipleKey(['usertype','username']));
  var n = new Date().toLocaleTimeString('it-IT');
  //document.getElementById('div_sel_orders').innerHTML=newOptionsHtml1; 
  var dtl='';
  for(var i=0;i<aryDB.length;i++){ 
    var newOptionsHtml='';
    for(var y=0;y<6;y++){
      if(parseInt(aryDB[i]['usertype'])==y){
        newOptionsHtml += '<option selected value='+y+'> Level '+y+'</option>';  
      }else{
        newOptionsHtml += '<option value='+y+'> Level '+y+'</option>';  
      }
    }

    //alert(aryDB[i]['photo']);
   
    dtl+=
      '<div style="width:100%;height:40px;margin-top:10px;padding:0px;background:none;">'+
        '<div style="float:left;height:100%;width:45px;background:none;">'+         
          //'<img src="'+JBE_API+'upload/users/'+aryDB[i]['usercode']+'.jpg?'+n+'" class="asyncImage" style="float:left;height:100%;width:40px;border-radius:50%;border:2px solid black;background:none;"/>'+
          '<img src="uploadz/'+aryDB[i]['usercode']+'.jpg?'+n+'" class="asyncImage" style="float:left;height:100%;width:40px;border-radius:50%;border:2px solid black;background:none;"/>'+
        '</div>'+
        '<div id="staff_name_width" style="float:left;height:100%;text-align:center;padding:2px;background:black;">'+
          '<div style="width:100%;height:50%;padding:0px;color:white;background:none;">'+aryDB[i]['username']+'</div>'+
          '<div style="width:100%;height:50%;padding:0px;font-size:12px;background:darkgray;">'+
            '<span style="float:left;width:50%;height:100%;padding:2px;background:lightgray;">'+aryDB[i]['userid']+'</span>'+
            '<span style="float:left;width:50%;height:100%;padding:2px;">'+aryDB[i]['pword']+'</span>'+
          '</div>'+               
        '</div>'+
        '<div style="float:left;height:100%;margin-left:5px;width:35px;background:none;"/>'+
            '<img src="gfx/landmark.png" onclick="showMap(1,&quot;'+aryDB[i]['usercode']+'&quot;)" style="height:100%;width:100%;background:none;"/>'+
        '</div>'+
        '<div style="float:right;width:100px;height:100%;text-align:right;background:none;">'+
          '<select value="Level'+aryDB[i]['usertype']+'" id="div_sel_level'+i+'" name="div_sel_level" onchange="chgLevel(&quot;'+aryDB[i]['usercode']+'&quot;,this.value)" style="width:70px;height:100%;">'+
            newOptionsHtml+
          '</select>'+
          '<input type="button" onclick="del_staff(&quot;'+aryDB[i]['usercode']+'&quot;)" style="width:auto;height:100%;margin-left:2px;" value="X" />'+
        '</div>'+
      '</div>';
  }  
  document.getElementById('div_editStaff').innerHTML=dtl;
}

function chgLevel(usercode,usertype){ 
  FM_AXIOS_PARA1=[];
  FM_AXIOS_SQL='';
  FM_TABLE_NAME='user';
  var fldnames=["usertype"];
  var fldvals=[usertype]; fldvals[1]=usercode;
  var vsql='';
  showProgress(true);     
  for(var i=0;i<1;i++){
    vsql+=fldnames[i]+'=?,';
  }   
  vsql=vsql.substring(0,vsql.length-1);
 
  FM_AXIOS_SQL='UPDATE user SET '+vsql+' WHERE usercode = ?';
  FM_AXIOS_PARA1=fldvals;
 
  axios.put('/api/fmlib_update', {headers: { 'Content-Type': 'application/json' }}, { params: { sql:FM_AXIOS_SQL,fld:FM_AXIOS_PARA1,tbl:FM_TABLE_NAME,fm_mode:1 } })
  .then(function (response) {          
    showProgress(false);     
    console.log(response.data);       
    DB_CLIENTS=response.data;
    CURR_AXTYPE=usertype;
  })
  .catch(function (error) {
    console.log(error);
    showProgress(false);
  });
}

function del_staff(usercode){
  var axlevel=JBE_GETFLD('usertype',DB_CLIENTS,'usercode',usercode);
  if(axlevel=='5'){
    snackBar('Access Denied...');
    return;
  }
  var username=JBE_GETFLD('username',DB_CLIENTS,'usercode',usercode);
  var photo=JBE_GETFLD('photo',DB_CLIENTS,'usercode',usercode);
  var ddir='upload/users/';

  MSG_SHOW(vbYesNo,"CONFIRM: ","Are you sure to Delete user: "+username+"?",function(){
    showProgress(true);     
    /*
    axios.post(JBE_API+'z_user.php', { clientno:CURR_CLIENT, request: 4,
      usercode: usercode,
      photo: photo,
      ddir:ddir
    },JBE_HEADER)
    */
    FM_AXIOS_SQL='DELETE from user WHERE usercode = ?';
    FM_AXIOS_PARA1=usercode;
   
    axios.delete('/api/fmlib_del', { params: { sql:FM_AXIOS_SQL,fld:FM_AXIOS_PARA1,tbl:"user",select:true } })   
    .then(function (response) {
      showProgress(false);     
      console.log(response.data);       
      DB_CLIENTS=response.data; 
      disp_editStaff(); 
    })
    .catch(function (error) {
      console.log(error);
      showProgress(false);
    });
  },function(){return;});
}

function upd_location(){
GEO_MODE=1;
JBE_GETLOCATION();
}

function my_location(){
//GEO_MODE=1;
//JBE_GETLOCATION();
showMap(2,CURR_USER);
}



function refresh_sidenav(){
  //alert('CURR_AXTYPE: '+CURR_AXTYPE);
  document.getElementById('id_setting').style.display='none'; 
  if(CURR_AXTYPE==5){ document.getElementById('id_setting').style.display='block'; }
} 