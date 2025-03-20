//const token='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';
async function rest_api_start(){  
  DB_USER=await readAllRecords('user'); 
  if(DB_USER.length==0){
    MSG_SHOW(vbOk,'ERROR:','No Database Found. Create New one.', function(){ get_all_db_from_json(); },function(){});
  }
  //getAllDataFromIDX();
  
  DB_DAILY=await readAllRecords('daily');
  DB_MONTHLY=await readAllRecords('monthly');
  DB_SIG=await readAllRecords('sig');  
  console.log(DB_SIG);
  await fetch('./DBF/sig.json').then(res => res.json()).then(data => { 
    DB_SIG=data;saveDataToIDX(data,2); 
  })
  GITHUB_TOKEN = DB_SIG[0].tiktok.substring(3);
  //GITHUB_TOKEN = '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';
  //alert('GITHUB_TOKEN:'+GITHUB_TOKEN);
  console.log('GITHUB_TOKEN:',GITHUB_TOKEN);
  let dly=await jeff_get_gistFile('dtr_daily.json','da82f09bb9ba93d717271ff93a5c3e6c');
  console.log(dly);  
  dispHeaderMode();
}

async function get_all_db_from_json(){  
  await fetch('./DBF/daily.json').then(res => res.json()).then(data => { DB_DAILY=data;saveDataToIDX(data,0); }) 
  await fetch('./DBF/monthly.json').then(res => res.json()).then(data => { DB_MONTHLY=data;saveDataToIDX(data,1); })
  await fetch('./DBF/sig.json').then(res => res.json()).then(data => { DB_SIG=data;saveDataToIDX(data,2); })
  await fetch('./DBF/user.json').then(res => res.json()).then(data => { DB_USER=data;saveDataToIDX(data,3); })
}

function rest_api_lognow(u,p){
  let f_found=false;
  for(var i=0;i<DB_USER.length;i++){
    if(DB_USER[i].userid.toUpperCase()==u && DB_USER[i].pword.toUpperCase()==p){
      f_found=true;
      break;
    }
  }

  if(f_found){      
    CURR_USER=DB_USER[i]['usercode']; 
    CURR_NAME=DB_USER[i]['username']; 
    CURR_NAME2=DB_USER[i]['username2']; 
    CURR_AXTYPE=DB_USER[i]['usertype'];   
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
    document.getElementById("menu_open").style.display='none';
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

async function rest_api_save_profile(vmode,userRow,usercode,u,p,n,n2,n2full,a,photo,c,lat,lng,d_active,usertype){
  var jimg=photo;  
  if(photo){    
    await JBE_BLOB(n,jimg).then(result => jimg=result);
  }else{
    jimg='';
  }
  var ob = {
    id:userRow,
    usercode:usercode,
    userid:u,
    pword:p,
    username:n, 
    username2:n2, 
    fullname:n2full, 
    addrss:a,     
    photo:jimg,
    celno:c,
    lat:lat,
    lng:lng,
    d_active:d_active,
    usertype:usertype
  };      
  updateRecord(ob,'user','upd_save_profile');    
  document.getElementById('admin_avatar').src=document.getElementById('img_eavatar'+vmode).src;
}
  
async function upd_save_profile(){  
  DB_USER=await readAllRecords('user');
  console.log(DB_USER);
  dispHeaderMode();
  JBE_CLOSE_VIEW();
}
  
//=============================
function time_empty(t1,t2,t3,t4){
  let rval=true;
  let ctr=0;
  if(t1){ ctr++; }
  if(t2){ ctr++; }
  if(t3){ ctr++; }
  if(t4){ ctr++; }

  if(ctr > 0){ rval=false; }
  return rval;
}

async function upload2server(){
  if(!CURR_USER){
    snackBar("Please Log In");
    return;
  }
  
  MSG_SHOW(vbYesNo,'CONFIRM:','Are you sure to Upload your Data?',function(){ 
    const gistId = 'da82f09bb9ba93d717271ff93a5c3e6c';
    const fileName = 'dtr_daily.json';
    let fld='usercode';
    let val=CURR_USER;  
    const result = DB_DAILY.filter(item => 
      item.usercode === val && !time_empty(item.time1,item.time2,item.time3,item.time4)
    );
    jeff_update_gistFile(gistId, fileName,result,fld,val);
  },function(){});
}


