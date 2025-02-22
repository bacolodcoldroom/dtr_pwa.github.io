function rest_api_start(){  
  //alert('JBE_API:'+JBE_API);
  axios.post(JBE_API+'z_user.php', { request:0 }, JBE_HEADER).then(function (response){ mod1(response); }).catch(function (error) { console.log(error); });
  function mod1(response){
    console.log(response.data); 
    DB_USER = response.data;     
    
    if(DB_USER.length > 0 && JBE_ONLINE_NAVI){         
      showOnline();
    }else{
      showOffline();
    }
    showProgress(false);  
    allow_start(true);
  }
}

function rest_api_get_all_tables(){  
  axios.post(JBE_API+'z_tanan.php', { request: 0 }, JBE_HEADER).then(function (response){ mod2(response); }).catch(function (error) { console.log(error); });
  function mod2(response){
    let aryDB = response.data;    
    DB_DAILY=aryDB[0];
    DB_MONTHLY=aryDB[1];
    DB_SIG=aryDB[2];
    DB_SYS=aryDB[3]; 
    DB_CLIENTS=aryDB[4];
    console.log(DB_DAILY);
    saveDataToIDX(DB_DAILY,0);
    saveDataToIDX(DB_MONTHLY,1);
    saveDataToIDX(DB_SIG,2);
    saveDataToIDX(DB_SYS,3);
    saveDataToIDX(DB_USER,4);

    CURR_DATE=DB_SYS[0].sys_date;
    document.getElementById('online_status').innerHTML=JBE_DATE_FORMAT(CURR_DATE,'MMMM YYYY');
  }
}

function rest_api_lognow(u,p){
  if(DEBUG_NODE){
    axios.get('/api/get_user', { params: {userid:u,pword:p} } ).then(function (response){ api_lognow(response); }).catch(function (error) { console.log(error); });
  }else{
    axios.post('z_user.php', {request:101, userid:u, pword:p}, JBE_HEADER).then(function (response){ api_lognow(response); }).catch(function (error) { console.log(error); });
  }  
  function api_lognow(response){
    showProgress(false);
    DB_USER=response.data;
    //alert('DB_USER.length:'+DB_USER.length);        
    //console.log('atay:'+response.data.length);        
    if(response.data.length > 0){      
      CURR_USER=DB_USER[0]['usercode']; 
      CURR_NAME=DB_USER[0]['username']; 
      CURR_NAME2=DB_USER[0]['username2']; 
      CURR_AXTYPE=DB_USER[0]['usertype'];   
      login_ok(0);            
      greetings();
    }else{
      document.getElementById("fmsg").style.color="red";
      document.getElementById("fmsg").innerHTML="<b>INVALID USER ID OR PASSWORD</b>.<br>Please check your User ID and Password carefully.";    
      document.getElementById("lognow").value="Try Again";
      document.getElementById('fuser').disabled=true;
      document.getElementById('fpass').disabled=true;
      document.getElementById('signUp').style.pointerEvents='none';
      document.getElementById('signUp').style.color='gray';

      //document.getElementById("div_logo").style.width='100%';
      document.getElementById("menu_open").style.display='none';
      DB_USER=DB_CLIENTS;
    }
  }
}

function rest_api_chk_fld(u,p){
  if(DEBUG_NODE){
    axios.get('/api/get_user', { params: { userid:u,pword:p } }).then(function (response){ api_chk_fld(response); }).catch(function (error) { console.log(error); });
  }else{
    axios.post('z_user.php', { request: 101, userid: u, pword:p }, JBE_HEADER).then(function (response){ api_chk_fld(response); }).catch(function (error) { console.log(error); });
  }    
  function api_chk_fld(response){
    if(response.data.length > 0){
      snackBar('Record Already Exist. Change User ID and Password.');
      return;
    }
  }
}

function rest_api_save_profile(vmode,usercode,u,p,n,n2,n2full,a,photo,c,lat,lng,d_active,usertype){
  let req=0;
  if(vmode==1){
    req=2; //add
  }else{
    req=3; //edit
  }
  let api='';
  if(DEBUG_NODE){
    api='/api/save_user';
    if(vmode!=1){ api='/api/upd_user'; }
    axios.put(api, {headers: { 'Content-Type': 'application/json' }},{ params: {
      usercode:usercode,
      userid:u,
      pword:p,
      username:n, 
      username2:n2, 
      fullname:n2full, 
      addrss:a,     
      photo:photo,
      celno:c,
      lat:lat,
      lng:lng,
      d_active:d_active,
      usertype:usertype
    }})
    .then(function (response){ api_save_user(response,req,n); }).catch(function (error) { console.log(error); });
  }else{ //PHP
    req=2;
    if(vmode!=1){ req=3; }
    axios.post('z_user.php', { request: req,  
      usercode:usercode,
      userid:u,
      pword:p,
      username:n, 
      username2:n2, 
      fullname:n2full, 
      addrss:a,     
      photo:photo,
      celno:c,
      lat:lat,
      lng:lng,
      d_active:d_active,
      usertype:0
    },JBE_HEADER)
    .then(function (response){ api_save_user(response,req,n); }).catch(function (error) { console.log(error); });
  }
  function api_save_user(response,req,n){
    showProgress(false);
    var usercode=document.getElementById('div_admin_profile').getAttribute('data-usercode');
    if(req==2){
      if(response.data=="EXIST"){        
        MSG_SHOW(vbOk,"ERROR:","User already exist!, Try Again...",function(){},function(){});
        return;
      }
      DB_USER=response.data;
      snackBar('Signing Up is successful...');    
    }else{
      DB_USER=response.data;
      snackBar('User Updated...');
      update_curr_user(usercode,n);
      document.getElementById('admin_username').innerHTML=n;     
    }    
    get_db_all('user');
    dispHeaderMode();
    JBE_CLOSE_VIEW();
  }
}
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
function rest_api_save_setting(vdate){
  if(DEBUG_NODE){
    axios.put('/api/save_setting1',{headers: { 'Content-Type': 'application/json' }},{ params: { sysdate:vdate } }).then(function (response){ api_save_setting(response); }).catch(function (error) { console.log(error); });
  }else{
    axios.put('z_setting.php',{ request:2, sysdate:vdate },JBE_HEADER).then(function (response){ api_save_setting(response); }).catch(function (error) { console.log(error); });
  }  
  function api_save_setting(response){
    DB_SYS = response.data; 
    
    let aryItems=[];
    var len_dtls=document.querySelectorAll('.dtls').length;  
    let ob_ctr=0;
    for(var j=1;j<=len_dtls;j++){
      if(document.getElementById('dv_main_dtl_'+j).style.display=='none'){ continue; }
      
      let mon_date=JBE_DATE_FORMAT(document.getElementById('lbl_date'+j).innerHTML,'YYYY-MM-DD');
      let ob = {
        date:mon_date,
        descrp:"ara"
      }
      aryItems[ob_ctr]=ob;       
      ob_ctr++;   
    }
    //alert('api_save_setting aryitems:'+aryItems.length);
    /*
    if(aryItems.length==0){
      snackBar('DTR DATE Saved Successfullly...');
      toggle_setting(true);
          
      CURR_DATE = vdate;
      document.getElementById('online_status').innerHTML=JBE_DATE_FORMAT(CURR_DATE,'MMMM YYYY');
      disp_setting(CURR_DATE);
      return;
    }
    */

    let str=inp_curdate.value.split('-');
    let yyyy=str[0]; let mm=str[1];  
    
    if(DEBUG_NODE){
      axios.put('/api/save_setting2',{headers: { 'Content-Type': 'application/json' }},{ params: { yyyy:yyyy,mm:mm, aryItems:JSON.stringify(aryItems) } }).then(function (response){ api_save_setting2(response); }).catch(function (error) { console.log(error); });
    }else{
      axios.put('z_setting2.php',{ request:2, yyyy:yyyy,mm:mm, aryItems:JSON.stringify(aryItems) },JBE_HEADER).then(function (response){ api_save_setting2(response); }).catch(function (error) { console.log(error); });
    }   
  }

  function api_save_setting2(response){    
    console.log('api_save_setting2:'+response.data.length);
    showProgress(false);      
    let vdate=inp_curdate.value+'-01';      
    DB_MONTHLY = response.data; 
    snackBar('DTR DATE Saved Successfullly...');
    toggle_setting(true);
        
    CURR_DATE = vdate;
    document.getElementById('online_status').innerHTML=JBE_DATE_FORMAT(CURR_DATE,'MMMM YYYY');
    disp_setting(CURR_DATE);
  }
}