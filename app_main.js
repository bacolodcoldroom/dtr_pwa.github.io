var JBE_EMPTY_IMG='gfx/jimg_error.png';
var arySysColors=[
  '#ef6f26','#8abdff','#d5658b','#9fbc2c','#8a2be2','#ff1493',
  '#a52a2a','#039be5','#ff4500','#20b2aa','#8a2be2','#f000ff'
];

function start_app(){
  //allow_start(false);
  JBE_ONLINE_NAVI=navigator.onLine;   
  JBE_ONLINE=false;  
  //****************
  JBE_ONLINE_NAVI=true;
  //****************

  isAppOffline().then(offline => {
    if (offline) {
      console.log("The app is offline!");
    } else {
      console.log("The app is online!");
      document.getElementById('online_status').style.display='none';      
    }
  });

  //get_lock();
  //put_lock();

  if(!CURR_NAME2){ CURR_NAME2=''; }
  //speakText('Hello '+CURR_NAME2+'! Welcome to the Bahcolod City Cold Chain Facility.');
  JBE_ONLINE=true; 
  document.getElementById('div_bar').style.display='block';
  get_app_default();

  //document.getElementById('online_status').innerHTML='';  
  dispHeaderMode();
  showMainPage();
 
  // Page is loaded
  const objects = document.getElementsByClassName('asyncImage');
  Array.from(objects).map((item) => {
    // Start loading image
    const img = new Image();
    img.src = item.dataset.src;
    // Once image is loaded replace the src of the HTML element
    img.onload = () => {
      item.classList.remove('asyncImage');
      return item.nodeName === 'IMG' ?
        item.src = item.dataset.src :       
        item.style.backgroundImage = `url(${item.dataset.src})`;
    };
  }); 
  
}



function allow_start(v){
  var vv='none';
  showProgress(true);
  if(v){ vv='auto'; showProgress(false); }
  document.getElementById('wrapper').style.pointerEvents=vv;
}

function refresh_all_db(){
  get_app_default();
  snackBar('Refreshed...');
}


function jeff(){ 
  alert(          
    'DB_DAILY: '+DB_DAILY.length+
    '\nDB_MONTHLY: '+DB_MONTHLY.length+
    '\nDB_USER: '+DB_USER.length+
    '\nDB_CLIENTS: '+DB_CLIENTS.length
  );
}

//=======APP DB AND DISPLAY==========================================================
function get_app_default(){   
  rest_api_start();
}

function get_app_var(u,f_showprofile){ 
  //get_db_clients(u);
  //get_db_all('user');
  //get_db_chat(u);
  //get_db_user(u,f_showprofile);
}

function get_db_users(){
  DB_USER=[]; 
  axios.get('/api/get_users', JBE_HEADER)
  .then(function (response) {
    console.log(response.data);
    DB_USER = response.data;
    //refreshNOTIF('chat');
    //alert('DB_USER len:'+DB_USER.length);
  })   
  .catch(function (error) { console.log(error); });
}


function get_db_userOnly(){
  DB_USER=[]; 
  axios.get('/api/get_userOnly', { params: { usercode:CURR_USER} }, JBE_HEADER)
  .then(function (response) {   
    DB_USER = response.data;
  })   
  .catch(function (error) { console.log('DB_USER: '+error); });
}

function get_db_sys(){ 
  //alert('get_db_sys:  clientno: '+CURR_CLIENT);
  DB_SYS=[]; DB_SLIDER=[];
  axios.post(JBE_API+'z_sysfile.php', { clientno:CURR_CLIENT,site:CURR_SITE,request: 1 },JBE_HEADER)
  .then(function (response) {
    console.log(DB_SYS);            
    //alert('get_db_sys:  Slider : '+response.data.length);
    DB_SYS = response.data[0];
    DB_SLIDER = response.data[1];
    if(DB_SYS.length > 0){
      //alert('xxxcopy sysfile to idx '+DB_SYS.length);     
      clearStore(JBE_STORE_IDX[0]['flename']); saveDataToIDX(DB_SYS,0);      
    }    
    showSystem();
  })   
  .catch(function (error) { showOffline(); console.log(error); });
}
function get_db_order(u){
  DB_ORDER=[];DB_ORDER2=[];
  var req=1;
  if(CURR_AXTYPE > 0){
    req=0;
  }
  axios.post(JBE_API+'z_order.php', { clientno:CURR_CLIENT,request: req, usercode: u },JBE_HEADER)    
  .then(function (response) {
    console.log(response.data);
    DB_ORDER = response.data[0];
    DB_ORDER2 = response.data[1];
    refreshNOTIF('order');    
    //alert(DB_ORDER.length+' vs '+DB_ORDER2.length);
  })   
  .catch(function (error) { console.log(error); });
}

function get_db_bell(u){
  DB_BELL=[];
  var req=1;
  if(CURR_AXTYPE > 0){
    req=0;
  }
  axios.post(JBE_API+'z_bell.php', { clientno:CURR_CLIENT,request: req, usercode: u },JBE_HEADER)    
  .then(function (response) { console.log(response.data); DB_BELL = response.data; refreshNOTIF('bell'); })   
  .catch(function (error) { console.log(error); });
}

function getExt(filename){
  var ext = filename.split('.').pop();
  if(ext == filename) return "";
  return ext;
}

function dispMenu(f_main,m){
  //alert('dispMenu activated... :'+m);
  document.querySelectorAll('.menu_class').forEach(function(el) {
    el.style.display = 'none'; 
  });
  document.getElementById('mnu_main').style.display='none';
  document.getElementById('mnu_main_owner').style.display='none';
  if(f_main){
    document.getElementById('mnu_mainmenu').style.display='block';   
    document.getElementById(m).style.display='block';
  }else{
    document.getElementById('mnu_submenu').style.display='block';   
    document.getElementById('mnu_submenu').innerHTML=m;
  }
}

//=================================================================================
//=======================show page=================================================
function showMainPage(){
  //alert('ako main page:'+CURR_AXTYPE);
  if(CURR_AXTYPE==5){
    //showLocks();
  }
  f_MainPage=true;
  document.getElementById("myView1").setAttribute('data-JBEpage',0); //reset openview page to 0
  if(f_reload){
    snackBar('Press Back key to Exit');   
    f_reload=false;
  }
 
  console.log('mainpage '+f_MainPage);
  openPage('page_main'); 
 
  var vmenu='mnu_main'; 
  var v_curr_user=CURR_USER;   
  if(CURR_AXTYPE > 0){
    v_curr_user='';
    vmenu='mnu_main_owner';
  }
  dispMenu(true,vmenu);
  if(!JBE_ONLINE) { return; }
}

function dispHeaderMode(){
  //var n = new Date().toLocaleTimeString('it-IT');
  let v_mphoto='gfx/avatar.png'; 
  if(!CURR_USER){
    document.getElementById('logger').style.color='navy';
    document.getElementById('logger').innerHTML="Please Log In";
    document.getElementById("page_login").style.display="none";     
  }else{
    document.getElementById('logger').style.color='navy';
    document.getElementById('logger').innerHTML='Hi!, '+CURR_NAME;     
    document.getElementById("page_login").style.display="none"; 
    v_mphoto='data:image/png;base64,' + btoa(JBE_GETFLD('photo',DB_CLIENTS,'usercode',CURR_USER));
  }
  document.getElementById('bar_avatar').src=v_mphoto;
  document.getElementById('owner').src=v_mphoto;
}

// ** ======================= SHOW ROUTINES ===================================
function showProfile(v){ 
  //alert('showprofile: '+v);
 
  document.getElementById('div_bar').style.display='block';
  var n = new Date().toLocaleTimeString('it-IT');
  var v_mphoto='gfx/avatar.png';
 
  dispHeaderMode();
 
  if(DB_USER.length==0 || !CURR_USER){
    return;
  }
  //v_mphoto='upload/users/'+CURR_USER+'.jpg?'+n;
  v_mphoto=JBE_API+'uploads/users/'+CURR_USER+'.jpg?'+n;
  v_mphoto=JBE_API+'uploadz/'+CURR_USER+'.jpg?'+n;
  if(!JBE_ONLINE){
    //v_mphoto='data:image/png;base64,' + btoa(DB_USER[0]['photo']);
  }
   
  document.getElementById('bar_avatar').src=v_mphoto;
  document.getElementById('log_avatar').src=v_mphoto;
}

function showSystem(){ 
  if(DB_SYS.length==0){ return; }
  var aryDB=DB_SYS;
  var n = new Date().toLocaleTimeString('it-IT');
  //alert('banner: '+aryDB[0]['banner']);

  //slide paint area==================
  //var v_banner='gfx/banner.jpg?'+n; 
  var v_banner=JBE_API+'gfx/banner.jpg?'+n; 
  //alert('showSystem JBE_ONLINE: '+JBE_ONLINE);
  if(!JBE_ONLINE){
    v_banner='data:image/png;base64,' + btoa(aryDB[0]['banner']);
  }  



  //slide paint area==================
  var dtl='';
  var idx=0;
  var v_slide;
  for(var i=0;i<3;i++){ 
      idx=(i+1);          
      v_slide=JBE_API+'gfx/slide'+idx+'.jpg?'+n;     
      //alert('v_slide '+v_slide);
      if(!JBE_ONLINE){       
          v_slide='data:image/png;base64,' + btoa(DB_SYS[0]['slide'+idx]);
      }
      dtl+=
          '<div id="ds'+idx+'" class="slideX" style="animation:fade'+idx+' 20s infinite;-webkit-animation:fade'+idx+' 20s infinite;'+
                'width:100%;height:100%;background:url('+v_slide+') center no-repeat;">'+                      
          '</div>';
                 
    document.getElementById('div_slider').innerHTML=dtl;   
  }
  document.getElementById('div_header').style.background='url("'+v_banner+'") center no-repeat';

  //header paint area==================
  for(var i=0;i<3;i++){
    //document.getElementById('header'+(i+1)).innerHTML=aryDB[0]['hd'+(i+1)];
  }

  //document.getElementById('div_pg_title').innerHTML=aryDB[0]['pg_title'];
  //if(!aryDB[0]['pg_title']){ document.getElementById('div_pg_title').innerHTML=aryDB[0]['clientname']; }
  //document.getElementById('div_pg_body').value=aryDB[0]['pg_body'];
 
  setSysColors();   
}

function imgOnError(dv){   
  dv.onerror=null;
  dv.src="gfx/jimg_error.png";
}

function jdebug(t){
  if(t){
    document.getElementById('jdebug').style.display='block';
  }else{
    document.getElementById('jdebug').style.display='none';
  }
}

function myResizeFunction(){   
  JBE_MOBILE=true;
  if(window.outerWidth > 500){
    JBE_MOBILE=false;
  }
   
  var H_BAR=parseInt(document.getElementById('div_bar').style.height); 
 
  H_HEADER=parseInt(document.getElementById('div_header').style.height); 
  H_FOOTER=parseInt(document.getElementById('div_footer').style.height);
 
  H_WRAPPER=window.innerHeight;
  H_BODY=window.innerHeight - (H_FOOTER);
  H_PAGE=window.innerHeight - (H_FOOTER);
  H_VIEW=window.innerHeight - (H_FOOTER+H_BAR);
  H_VIEW_DTL=window.innerHeight - (H_FOOTER);

  document.getElementById('wrapper').style.height=(window.innerHeight)+'px';
 
  //document.getElementById('user_main').style.display='none';

  document.querySelectorAll('.page_class').forEach(function(el) {   
    el.style.height=H_PAGE+'px';   
    //el.style.backgroundColor='blue';
  });
  document.querySelectorAll('.myView').forEach(function(el) {
    el.style.height=H_VIEW+'px';   
    el.style.width='100%';
    //el.style.background='yellow';
  });
  
  document.querySelectorAll('.myView_dtl').forEach(function(el) {   
    el.style.height=H_VIEW_DTL+'px';   
    //el.style.border='1px solid yellow';
    el.style.width='100%';
    //el.style.background='white';
  });

  //fix main screen
  let height_status=parseInt(document.getElementById('online_stat').style.height); 
  let height_img=parseInt(document.getElementById('img_main').style.height); 
  //let height_heed_main=parseInt(document.getElementById('heed_main').style.height); 
  let height_btns=420; 
 
  if(window.innerHeight < 700){ height_btns=280; }

  if(JBE_MOBILE){ height_btns=200; }
  height_btns=0; //override

  let height_filler=H_PAGE-(height_img+height_btns+height_status+0)-H_HEADER;
  let height_heed_main=height_filler-70-0;
  let height_heed_main_gfx=250;
 
  document.getElementById('img_main').style.height=height_img+'px'; 
  document.getElementById('filler').style.height=(height_filler)+'px'; 
  document.getElementById('heed_main').style.height=height_heed_main+'px'; 
  document.getElementById('heed_main').style.paddingTop=((height_heed_main-height_heed_main_gfx)/2)+'px';
  document.getElementById('btns').style.height=height_btns+'px';
 
  document.getElementById('user_main').style.height=window.innerHeight - (H_FOOTER+10)+'px'; 
  document.getElementById('mySidenav').style.height=(window.innerHeight-H_HEADER)+'px';
  document.getElementById('mySidenav').style.top=(H_HEADER)+'px';
}

/***************************************************** */
function openNav() {
  if(!JBE_CHK_USER(0)){ return; };
  if(!JBE_ONLINE){
    snackBar('OFFLINE');
    return;
  }
 
  if(document.getElementById('menu_open').getAttribute('data-open')=='1'){
    closeNav();
    return;
  }
  //document.getElementById('menu_open').innerHTML='&#8592;';
  document.getElementById('hd_img').src='gfx/jback.png';   
  //document.getElementById("mySidenav").style.display='none';
  document.getElementById("mySidenav").style.width = "100%";
  document.getElementById("menu_open").setAttribute('data-open','1');
  event.stopPropagation();   
}

function closeNav() {
  //document.getElementById('menu_open').innerHTML='&#9776;';
  document.getElementById('hd_img').src='gfx/jham.png';   
  document.getElementById("mySidenav").style.width = "0";  
  document.getElementById("menu_open").setAttribute('data-open','0');
  event.stopPropagation();   
}

window.onclick = function(event) { 
  //alert('alert:'+event.target.id); 
  //if(event.target.id !== 'mySidenav' && event.target.id !== 'menu_open') {      
 
  if(event.target.id !== 'mySidenav') {
    closeNav();
  }
  if (!event.target.matches('.dropbtn')) {
    closeDropdown();
  }
}

function myDropMenu(v) {
  closeDropdown();
  document.getElementById('myDropdown_'+v).classList.toggle("show");
}

function closeDropdown(){
  var dropdowns = document.getElementsByClassName("dropdown-content");
  var i;
  for (i = 0; i < dropdowns.length; i++) {
    var openDropdown = dropdowns[i];
    if (openDropdown.classList.contains('show')) {
      openDropdown.classList.remove('show');
    }
  }
}

function addAnimation(body) {
  let dynamicStyles = null;
  if (!dynamicStyles) {
    dynamicStyles = document.createElement('style');
    dynamicStyles.type = 'text/css';
    document.head.appendChild(dynamicStyles);
  }
 
  dynamicStyles.sheet.insertRule(body, dynamicStyles.length);
}

function clear_THISFILE(){
  snackBar('clear thisfile');
  for(var i=0;i<25;i++){
    THISFILE[i]=null;
  }
}

function openPage(m){
  document.querySelectorAll('.page_class').forEach(function(el) {
    //alert(el.id);
    el.style.display = 'none';
  });
  document.getElementById(m).style.display='block';       
}

function callText(){
  if(!JBE_ONLINE){
    //snackBar('OFFLINE');
    //return;
  }
  var tilt='Call/Text Contact';
  var vimgCall='gfx/jcall.png';
  var vimgSms='gfx/jsms.png';
 
  var dtl=     
    //'<div id="div_calltext" data-zoom=0 style="width:100%;height:'+(H_BODY-350)+'px;overflow:auto;text-align:center;padding:0px;background-color:white;">'+
    '<div id="div_calltext" data-zoom=0 style="width:100%;height:'+105+'px;overflow:auto;text-align:center;padding:0px;background-color:white;">'+
      /*
      for(var i=0;i<DB_CLIENTS.length;i++){
       
        if(DB_CLIENTS[i]['usertype']=='0') { continue; }
        //alert(DB_CLIENTS[i]['username']);
        dtl+=
          '<div style="width:100%;height:40px;margin-top:5px;padding:5px;text-align:left;font-size:12px;background-color:lightgray;">'+
            '<div style="float:left;width:35%;height:100%;padding:8px 0 0 5px;background-color:none;">'+DB_CLIENTS[i]['username']+'</div>'+
            '<div style="float:left;width:35%;height:100%;padding:8px 0 0 5px;background-color:none;">'+DB_CLIENTS[i]['celno']+'</div>'+
            '<input onclick="callTextGO(&quot;call&quot;,&quot;'+DB_SYS[0]['telno']+'&quot;)" type="image" src="'+vimgCall+'" style="float:right;text-align:right;padding:0px 5px 0 0;height:100%;margin-left:10px;background:none;" />'+
            '<input onclick="callTextGO(&quot;txt&quot;,&quot;'+DB_SYS[0]['celno']+'&quot;)" type="image" src="'+vimgSms+'" style="float:right;text-align:right;padding:0px 5px 0 0;height:100%;background:none;" />'+
          '</div>';
      }
      */
     
      '<div style="width:100%;height:40px;margin-top:5px;padding:5px;text-align:left;font-size:12px;background-color:lightgray;">'+
            '<div style="float:left;width:35%;height:100%;padding:8px 0 0 5px;background-color:none;">Telephone</div>'+           
            '<div style="float:left;width:35%;height:100%;padding:8px 0 0 5px;background-color:none;">'+DB_USER.celno+'</div>'+
            '<input onclick="callTextGO(&quot;call&quot;,&quot;'+DB_USER.celno+'&quot;)" type="image" src="'+vimgCall+'" style="float:right;text-align:right;padding:0px 5px 0 0;height:100%;margin-left:10px;background:none;" />'+
            '<input onclick="callTextGO(&quot;txt&quot;,&quot;'+DB_USER.celno+'&quot;)" type="image" src="'+vimgSms+'" style="float:right;text-align:right;padding:0px 5px 0 0;height:100%;background:none;" />'+
      '</div>'+
      '<div style="width:100%;height:40px;margin-top:5px;padding:5px;text-align:left;font-size:12px;background-color:lightgray;">'+
            '<div style="float:left;width:35%;height:100%;padding:8px 0 0 5px;background-color:none;">Mobile</div>'+
            '<div style="float:left;width:35%;height:100%;padding:8px 0 0 5px;background-color:none;">'+DB_USER.celno+'</div>'+
            '<input onclick="callTextGO(&quot;call&quot;,&quot;'+DB_USER.celno+'&quot;)" type="image" src="'+vimgCall+'" style="float:right;text-align:right;padding:0px 5px 0 0;height:100%;margin-left:10px;background:none;" />'+
            '<input onclick="callTextGO(&quot;txt&quot;,&quot;'+DB_USER.celno+'&quot;)" type="image" src="'+vimgSms+'" style="float:right;text-align:right;padding:0px 5px 0 0;height:100%;background:none;" />'+
      '</div>';
         
    dtl+='</div>';
 
  var dtl2=     
    '<div style="width:100%;height:100%;padding:11px 0 0 0;text-align:center;color:'+JBE_TXCLOR1+';background:none;">'+
      tilt+     
    '</div>';  

  JBE_OPENBOX('div_calltext',tilt,dtl,dtl2);
  //showMenu('mnu_callText');
}
function callTextGO(m,celno){ 
  //alert(m+' vs '+celno); 
  if(celno.substring(0,1)=='0'){
    celno='+63'+celno.substring(1);
  }
 
  var vhref='';
  if(m=='call') {     
    //window.location.href="tel:+63-948-952-3337";
    vhref='tel:'+celno;
  }else if(m=='txt') {
    //window.location.href="sms://+639489523337?body=I%27m%20interested%20in%20your%20product.%20Please%20contact%20me."
    vhref='sms://'+celno+'?body=I%27m%20interested%20in%20your%20product.%20Please%20contact%20me.';
  } 
  window.location.href=vhref;
  //window.location.href="sms://+639489523337?body=I%27m%20interested%20in%20your%20product.%20Please%20contact%20me."
}
function close_calltext(){
  //showMenu('mnu_main');   
}

function reportHead(tilt,date){
  let xdtl=
  '<div style="width:100%;height:60px;border:0px solid green;">'+
    '<div style="float:left;width:25%;height:100%;text-align:right;"><img src="gfx/logoCHO.png" style="height:100%;" /></div>'+
    '<div style="float:left;width:50%;height:100%;text-align:center;">'+
      '<div style="font-size:22px;font-weight:bold;padding:0px 0 0 0;">'+tilt+'</div>'+
      '<div style="font-size:16px;font-weight:bold;padding:0px 0 0 0;">As of: '+JBE_DATE_FORMAT(new Date(),'DD-MMM-YYYY')+'</div>'+
      '<div style="font-size:16px;font-weight:bold;padding:0px 0 0 0;">Bacolod Cold Chain Facility</div>'+
    '</div>'+      
    '<div style="float:left;width:24%;height:100%;text-align:left;"><img src="gfx/logoNGC.png" style="height:100%;" /></div>'+
  '</div>';

  let dtl=
  '<div style="width:100%;height:60px;font-family:Times New Roman, Times, serif;">'+
    '<div style="float:left;width:auto;height:100%;text-align:left;"><img src="gfx/icon-192x192.png" style="height:100%;" /></div>'+
    '<div style="float:left;margin-left:20px;width:auto;height:100%;text-align:left;">'+
      '<div style="font-size:20px;font-weight:bold;padding:5px 0 0 0;">'+tilt+'</div>'+
      '<div style="font-size:14px;padding:0px 0 0 0;">Bacolod Cold Chain Facility</div>'+
      '<div style="font-size:14px;font-weight:bold;padding:0px 0 0 0;">As of: <span id="repo_date">'+JBE_DATE_FORMAT(date,'DD-MMM-YYYY')+'</span></div>'+     
    '</div>'+              
  '</div>'+
  '<div style="width:100%;height:10px;border-bottom:2px solid lightgray;"></div>';
  return dtl;
}

function repl_fld_data(db,fld,val,cond_fld,cond_val){
  axios.put('/api/upd_repl_fld_data', {headers: { 'Content-Type': 'application/json' }}, { params: { db:db,fld:fld,data:val,fld2:cond_fld,data2:cond_val } })
  .then(function (response) {
    db=response.data;
    console.log('upd_repl_fld_data: '+db.length);
  })
  .catch(function (error) { console.log(error); });
}

function getStockBal(s_stockno,s_lotno,e_date){
  //=================================================================================================   
  //================BEGIN PREPARE DIS ARRAY
  //=================================================================================================
  var v_returned=0;
  var v_dispensed=0;
  var v_bal=0;
  let v_debit=0;
  let v_credit=0;
  //let e_date=JBE_DATE_FORMAT(document.getElementById('date_to').value,'YYYY-MM-DD');

  //=================================================================================================   
  //================RECEIVAL
  //=================================================================================================   
  //je_msg('w',0);
  for(var i = 0; i < DB_RECEIVE2.length; i++){
    var v_stockno=DB_RECEIVE2[i].stockno;
    var v_lotno=DB_RECEIVE2[i].lotno;
    if(v_stockno != s_stockno){ continue; }
    if(s_lotno && v_lotno != s_lotno){ continue; }
   
    var v_date=JBE_DATE_FORMAT(DB_RECEIVE2[i].date,'YYYY-MM-DD'); 
    if(v_date > e_date){ continue; }
   
    var v_received=DB_RECEIVE2[i].qty;
    v_debit+=v_received;
    v_bal+=v_received;
  }     

  //=================================================================================================   
  //================WITHDRAWALS
  //=================================================================================================   
  //je_msg('w',0);
  for(var i = 0; i < DB_PTR2.length; i++){
    //if(chk_cancelPTR(DB_PTR2[i].trano)){ continue; }  
    
    var v_stockno=DB_PTR2[i].stockno;
    if(v_stockno != s_stockno){ continue; }      

    var v_date=JBE_DATE_FORMAT(DB_PTR2[i].date_rel,'YYYY-MM-DD');
    if(v_date > e_date){ continue; }

    if(DB_PTR2[i].trans=='XXX'){ continue; } 

    var v_dispensed=DB_PTR2[i].qty;
    var v_lotno=DB_PTR2[i].lotno;
   
    v_returned=0;
    v_wastage=0;
    v_credit+=v_dispensed;   
    v_bal-=(v_dispensed-v_returned);
  }     
 
  //=================================================================================================   
  //================RETURNS
  //=================================================================================================   
  //je_msg('w',0);
  //alert('date1:'+v_date+' less 1:'+new_date(v_date,-1));
  for(var i = 0; i < DB_RETURNS2.length; i++){
    if(DB_RETURNS2[i].rti != 'YES'){ continue; }

    var v_stockno=DB_RETURNS2[i].stockno;
    if(v_stockno != s_stockno){ continue; }

    var v_date=JBE_DATE_FORMAT(DB_RETURNS2[i].ret_date,'YYYY-MM-DD');    
    if(v_date > e_date){ continue; }
   
    var v_returned=DB_RETURNS2[i].qty;
    v_debit+=v_returned;
    v_bal+=v_returned;         
  }     

  //=================================================================================================   
  //================RETURNS II (RET2)
  //=================================================================================================   
  //je_msg('w',0);
  //alert('date1:'+v_date+' less 1:'+new_date(v_date,-1));
  for(var i = 0; i < DB_RET2.length; i++){
    if(DB_RET2[i].rti != 'YES'){ continue; }

    var v_stockno=DB_RET2[i].stockno;
    if(v_stockno != s_stockno){ continue; }

    var v_date=JBE_DATE_FORMAT(DB_RET2[i].ret_date,'YYYY-MM-DD');    
    if(v_date > e_date){ continue; }
   
    var v_returned=DB_RET2[i].qty;
    v_debit+=v_returned;
    v_bal+=v_returned;         
  }     

  //=================================================================================================   
  //================ADJUSTMENTS
  //=================================================================================================   
  //je_msg('w',0);
  for(var i = 0; i < DB_ADJ2.length; i++){
    var v_stockno=DB_ADJ2[i].stockno;
    if(v_stockno != s_stockno){ continue; }  

    var v_date=JBE_DATE_FORMAT(DB_ADJ2[i].date,'YYYY-MM-DD');
    if(v_date > e_date){ continue; }
   
    let vv_debit=DB_ADJ2[i].qty;
    let vv_credit=0;
    let v_drcr=1;
    var v_mode=DB_ADJ2[i].drcr;
   
    if(v_mode != 'Debit'){
      vv_debit=0;
      vv_credit=DB_ADJ2[i].qty;
      v_drcr=2;
    }
    v_debit+=vv_debit; v_credit+=vv_credit;  
    v_bal+=(vv_debit-vv_credit);
  }
  //console.log('return:'+v_bal,v_debit,v_credit); 
  return [v_bal,v_debit,v_credit];
}

function chk_cancelPTR(trano){
  let xxx=JBE_GETFLD('trans',DB_PTR,'trano',trano);
  //alert('chk_cancelPTR:'+xxx);
  if(xxx=='XXX'){
    return true;
  }else{
    return false;
  }
}

//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
function printToNewTab(content) {
  const newWindow = window.open('', '_blank');
  newWindow.document.write(content);
  newWindow.document.close();

  newWindow.onload = function () {
    newWindow.print();
  };
}

//const contentToPrint = "<h1>Hello, this will be printed!</h1>";
//printToNewTab(contentToPrint);

async function showLocks(){
  return;
  await axios.get('/api/get_tot_lock')
  .then(function (response) {
    if(response.data.length==0){
      document.getElementById('online_status').innerHTML='';
      DB_LOCKERS=[];
      return;
    }

    document.getElementById('online_status').innerHTML='<div style="cursor:pointer;" onclick="showLocks_dtl();">Total Locks: '+response.data.length+'</div>';
    DB_LOCKERS=response.data;
  })   
  .catch(function (error) { console.log(error); });
}


async function dropLocks(){
  await MSG_SHOW(vbYesNo,'CONFIRM: ','Delete All Record Locks?',function(){   
    axios.delete('/api/drop_rlock')
    .then(function (response) {    
      DB_LOCKERS=response.data;
      JBE_CLOSEBOX();
      showLocks();
      snackBar('All Locks Deleted successfully...');
    })   
    .catch(function (error) { console.log(error); });
  },function(){return;});
}
 
function showLocks_dtl(){
  var dtl=     
    '<div id="main_lockers" data-zoom=0 data-close="" style="width:100%;height:'+(H_BODY-300)+'px;text-align:center;background-color:none;">'+
      '<div style="width:100%;height:25px;border:1px solid lightgray;padding:2px;color:white;background:'+JBE_CLOR+';">'+
        '<div style="float:left;text-align:left;width:50%;height:100%;">Username</div>'+
        '<div style="float:left;text-align:left;width:50%;height:100%;">Doc. No.</div>'+
      '</div>'+
      '<div style="width:100%;height:'+(H_BODY-300-37)+'px;overflow:auto;padding:0px;border:1px solid lightgray;">';
        for(var i=0;i<DB_LOCKERS.length;i++){
          dtl+=
          '<div style="width:100%;height:25px;padding:2px;border:1px solid lightgray;">'+
            '<div style="float:left;text-align:left;width:50%;height:100%;">'+DB_LOCKERS[i].username+'</div>'+
            '<div style="float:left;text-align:left;width:50%;height:100%;">'+DB_LOCKERS[i].docno+'</div>'+
          '</div>';  
        }
    dtl+=
      '</div>'+
    '</div>'; 
  var dtl2=     
    '<div style="width:100%;height:100%;padding:6px;color:'+JBE_TXCLOR1+';background:none;">'+
      '<input type="button" onclick="dropLocks()" style="float:left;width:100px;height:100%;" value="Delete All" />'+     
    '</div>';  
  JBE_OPENBOX('main_lockers','Record Lockers',dtl,dtl2);
}

function quit_app(){
  if(f_MainPage){               
    //refreshIDX();
    MSG_SHOW(vbYesNo,"CONFIRM: ","Close the App?",function(){                   
      window.history.go(0);
      f_reload=true;
    },function(){});                 
  }
}

function get_bal_stock(v_loc,v_stockno,v_lotno,v_rundate){ 
  let v_in=0;
  let v_out=0;
  let v_bal=0;
 
  let v_ris=0;
  let v_ret=0;
  let v_tf=0;
  let v_adj=0;
  let v_date='';
  let v_trandate='';
  for(var i=0;i<DB_TRANSFER2.length;i++){
    if(DB_TRANSFER2[i].loc==v_loc && DB_TRANSFER2[i].stockno==v_stockno && DB_TRANSFER2[i].lotno==v_lotno){
      if(v_rundate && DB_TRANSFER2[i].date_tf > v_rundate){ continue; }
      v_tf=parseInt(DB_TRANSFER2[i].qty);
      v_date=JBE_DATE_FORMAT(DB_TRANSFER2[i].date_tf,'YYYY-MM-DD');
      break;
    }
  } 
  for(var i=0;i<DB_RETURNS2.length;i++){
    if(!(DB_RETURNS2[i].loc==v_loc && DB_RETURNS2[i].stockno==v_stockno && DB_RETURNS2[i].lotno==v_lotno)){ continue; }
    if(DB_RETURNS2[i].rti != 'YES'){ continue; }
    v_trandate=JBE_DATE_FORMAT(DB_RETURNS2[i].date,'YYYY-MM-DD');
    if(v_date && DB_RETURNS2[i].date <= v_date){ continue; }
    if(v_rundate && v_trandate <= v_rundate){ continue; }
    v_ret+=parseInt(DB_RETURNS2[i].qty);
  } 
  //RET2
  for(var i=0;i<DB_RET2.length;i++){
    if(!(DB_RET2[i].loc==v_loc && DB_RET2[i].stockno==v_stockno && DB_RET2[i].lotno==v_lotno)){ continue; }
    if(DB_RET2[i].rti != 'YES'){ continue; }
    v_trandate=JBE_DATE_FORMAT(DB_RET2[i].date,'YYYY-MM-DD');
    if(v_date && DB_RET2[i].date <= v_date){ continue; }
    //if(v_rundate && DB_RET2[i].date > v_rundate){ continue; }   
    if(v_rundate && v_trandate <= v_rundate){ continue; }
    v_ret+=parseInt(DB_RET2[i].qty);
  } 
  //RIS
  for(var i=0;i<DB_PTR2.length;i++){
    if(!(DB_PTR2[i].loc==v_loc && DB_PTR2[i].stockno==v_stockno && DB_PTR2[i].lotno==v_lotno)){ continue; }
    if(DB_PTR2[i].trans=='XXX'){ continue; }
    v_trandate=JBE_DATE_FORMAT(DB_PTR2[i].date_rel,'YYYY-MM-DD');
    if(v_date && DB_PTR2[i].date <= v_date){ continue; }
    //if(v_rundate && DB_PTR2[i].date > v_rundate){ continue; }
    //console.log('ptr2 rundate:'+v_rundate);
    //console.log('ptr2 date_rel:'+v_trandate);
    if(v_rundate && v_trandate <= v_rundate){ continue; }
    v_ris+=parseInt(DB_PTR2[i].qty);
  }
  //adjustments
  for(var i=0;i<DB_ADJ2.length;i++){
    if(!(DB_ADJ2[i].loc==v_loc && DB_ADJ2[i].stockno==v_stockno && DB_ADJ2[i].lotno==v_lotno)){ continue; }
    v_trandate=JBE_DATE_FORMAT(DB_ADJ2[i].date,'YYYY-MM-DD');
    if(v_date && DB_ADJ2[i].date <= v_date){ continue; }
    //if(v_rundate && DB_ADJ2[i].date > v_rundate){ continue; }
    if(v_rundate && v_trandate <= v_rundate){ continue; }
    if(DB_ADJ2[i].drcr=='Debit'){     
      v_adj+=parseInt(DB_ADJ2[i].qty);
    }else{
      v_adj-=parseInt(DB_ADJ2[i].qty);
    }
  }
 
  v_in=v_tf+v_ret;
  v_out=v_ris; 
  v_bal=(v_in-v_out)+v_adj;
 
  let ob={
    "bal":v_bal,"tf":v_tf,"ris":v_ris,"ret":v_ret,"adj":v_adj
  };
  console.log(ob);
  console.log('v_rundate:'+v_rundate);
  return ob; //v_bal;
}

function get_loc(whcode){
  return JBE_GETFLD('name',DB_WHOUSE,'whcode',whcode);
}
function get_area(v){
  return JBE_GETFLD('name',DB_AREA,'areano',v);
}
function get_prod(v){
  return JBE_GETFLD('prodname',DB_PRODUCT,'prodno',v);
}

function get_descrp(stockno){
  return JBE_GETFLD('descrp',DB_STOCK,'stockno',stockno);
}

function UPDATE_LOC_STOCKBAL(loc,stockno,lotno,qty,qty_old){
  //alert(qty);
  let ddate=new Date();
  ddate=JBE_GETFLD2('date_tf',DB_TRANSFER2, [
    { "fld":"loc","val":loc },
    { "fld":"stockno","val":stockno },
    { "fld":"lotno","val":lotno }
  ]);
  let rundate=JBE_DATE_FORMAT(ddate,'YYYY-MM-DD');
  let arr=get_bal_stock(parseInt(loc),stockno,lotno,rundate);
  let v_bal=parseInt(arr.bal);
  let v_tf=parseInt(arr.tf);
  let v_ris=parseInt(arr.ris);
  let v_ret=parseInt(arr.ret);
  //let the_qty=(v_tf+qty_old)-(v_ris+v_ret+qty);
  let the_qty=(v_bal+qty_old)-qty;
  if(qty){ v_bal=(v_bal+qty_old)-qty; }

  console.log(
    '*** UPDATE_LOC_STOCKBAL'+
    '\nloc: '+loc+   
    '\nstockno: '+stockno+
    '\nbal: '+v_bal+
    '\nlotno: '+lotno+
    '\nqty: '+qty+
    '\nold qty: '+qty_old+
    '\n\nthe_qty: '+the_qty+
    '\n\nv_tf: '+v_tf+
    '\n\nv_ris: '+v_ris+
    '\n\nv_ret: '+v_ret
  );
 
  axios.put('/api/upd_loc_stock', {headers: { 'Content-Type': 'application/json' }}, { params: {
    bal:v_bal,
    loc:loc,
    stockno: stockno,
    lotno:lotno
  }})
  .then(function (response) {  
    DB_TRANSFER2=response.data;       
    showProgress(false);    
  })
  .catch(function (error) { console.log(error); });
}

function add_to_transfer2(ob){
  //alert('going to add to transfer2 ');
  axios.post('/api/save_transfer2', {headers: { 'Content-Type': 'application/json' }}, { params: {
    trano:ob.trano,
    loc:ob.loc,
    stockno:ob.stockno,
    lotno:ob.lotno,
    refno:ob.refno,       
    qty:ob.qty
  }})
  .then(function (response) { 
    DB_TRANSFER2=response.data;       
    //alert(DB_TRANSFER2.length);
    showProgress(false);    
  })
  .catch(function (error) { console.log(error); });
}

function isMobileDevice() {
  return /Mobi|Android/i.test(navigator.userAgent);
}

/*
// Example usage
if (isMobileDevice()) {
  console.log("User is using a mobile device.");
} else {
  console.log("User is not using a mobile device.");
}
*/

function exit_app(){
  let msg='Are you sure you want to exit the application?';
  MSG_SHOW(vbOkAbort,'EXIT APP','<center>'+msg+'</center>', function(){ do_exit(); },function(){});
  
  function do_exit(){
    if (window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches) {
      window.close(); // This works for installed PWAs on some platforms
      window.location.href = 'about:blank'; // Fallback
    } else {
      window.location.href = 'about:blank'; // For browsers
    }
  }
}

function formatPhoneNumber(phoneNumber) {
  // Remove non-digit characters from the input
  phoneNumber = phoneNumber.replace(/\D/g, '');
  // Format the phone number
  const formattedPhoneNumber = phoneNumber.replace(/(\d{4})(\d{3})(\d{4})/, '$1-$2-$3'); 
  return formattedPhoneNumber;
}

function showQR(){
  var h=H_BODY-100;
  var txt='https://updesktop.github.io/estore/app/';
  //txt=window.location.origin;
  txt=CURR_SITE;
  var dtl=     
    '<div id="main_qr" data-zoom=0 data-close="" style="width:100%;height:'+h+'px;text-align:center;background-color:white;">'+     
      '<div style="width:100%;height:90%;padding:2px;background:none">'+
          '<div id="qrcode" style="margin:0 auto;margin-top:'+((h-300)/2)+'px;width:250px;height:250px;padding:2px;background:none;"></div>'+         
      '</div>'+
      '<div style="width:100%;height:10%;padding:2px;font-size:12px;background:none;">'+txt+'</div>'+         
    '</div>';
  var dtl2=     
    '<div style="width:100%;height:100%;padding:11px 0 0 0;text-align:center;color:'+JBE_TXCLOR1+';background:none;">'+
      'Scan this QR Code'+     
    '</div>';  
  JBE_OPENBOX('main_qr','App QR Code',dtl,dtl2);
  var qrcode = new QRCode(document.getElementById("qrcode"), {
    width: 246,
    height: 246
  });
  //https://updesktop.github.io/estore/app/ee/
  //alert(txt);
  qrcode.makeCode(txt);
}

function share_app(){
  if(navigator.share) {
    navigator.share({
      title: document.title,
      //text: 'E-Store App',
      text: document.title,
      url: location.href,
    })
    .then(() => console.log('Successful share'))
    .catch((error) => {
      snackBar(error);
      //console.log('Error sharing', error);
      //MSG_SHOW(vbOk,"Error sharing:",error,function(){},function(){});
     })
  }
}

function not_yet(){
  MSG_SHOW(vbOk,"SORRY:","Still under construction.",function(){},function(){});
}

function speakText(text) {
  // Get the text from the textarea
  //var text = document.getElementById('text-to-speak').value;

  // Create a new SpeechSynthesisUtterance object
  var utterance = new SpeechSynthesisUtterance(text);

  // Use the default voice
  utterance.voice = speechSynthesis.getVoices()[0];

  // Speak the text
  speechSynthesis.speak(utterance);
  console.log('speak:'+text);
} 

async function isAppOffline(timeout = 3000) {
  // Basic check using navigator.onLine
  if (!navigator.onLine) {
    return Promise.resolve(true);
  }

  // Optional: Perform a network request to confirm connectivity
  const controller = new AbortController();
  const signal = controller.signal;

  // Set a timer to abort the fetch if it takes too long.
  const timer = setTimeout(() => controller.abort(), timeout);

  // Here we use a HEAD request to a lightweight resource (favicon)
  return fetch('https://www.google.com/favicon.ico', {
    mode: 'no-cors',
    method: 'HEAD',
    cache: 'no-cache',
    signal: signal
  })
  .then(response => {
    clearTimeout(timer);
    // If the response is OK, the app is online; otherwise, we treat it as offline.
    console.log(response.ok+' ::: ayos! online kita....');
    //return !response.ok;
    return false;
  })
  .catch(() => {
    clearTimeout(timer);
    // On error (including timeout), assume offline.
    console.log('wala gd. offline here....');
    return true;
  });
}