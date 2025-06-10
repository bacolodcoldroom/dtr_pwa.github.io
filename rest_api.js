//const token='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';
async function rest_api_start(){  
  if(!JBE_MOBILE){
    document.getElementById('wrapper').innerHTML=
    '<div style="height:auto;width:100%;padding:25% 0 0 0;font-size:56px;font-weight:bold;text-align:center;">This software can only run in mobile phones.</div>';
    return;
  }
    
  DB_DAILY=await readAllRecords('daily');
  DB_MONTHLY=await readAllRecords('monthly');
  console.log('------------DB_MONTHLY ',DB_MONTHLY);
  DB_SIG=await readAllRecords('sig');  
  console.log('DB_SIG',DB_SIG.length);
  console.log('DB_SIG',DB_SIG);
  if(!DB_SIG[0].sys_pat || DB_SIG.length==0){ await fetch('./DBF/sig.json').then(res => res.json()).then(data => { DB_SIG=data;saveDataToIDX(data,2); }) }
  //alert(DB_SIG[0].sys_pat);
  GITHUB_TOKEN = DB_SIG[0].sys_pat.substring(3);
  console.log('GITHUB_TOKEN:',GITHUB_TOKEN);

  DB_USER=await readAllRecords('user'); 
  console.log('>>> axtype',CURR_AXTYPE);
  console.log('start db_user',DB_USER);
  if(DB_USER.length==0){
    MSG_SHOW(vbOk,'ERROR:','No Database Found. Create New one.', async function(){ await get_all_db_from_cloud(); },function(){});
  }
  //getAllDataFromIDX();

  JBE_CLOUD=false;
  JBE_API='';
  //if(JBE_CLOUD){ JBE_API='dtr/'; }
  console.log('**************************************');
  console.log('JBE_CLOUD',JBE_CLOUD);
  console.log('JBE_API',JBE_API);
  console.log('**************************************');
  
  
  let data=await api_readfile(false,JBE_API+'user');   DB_USER=data.content;   
  let data2=await api_readfile(false,JBE_API+'daily');   DB_DAILY=data2.content;   

  //await fetch('./DBF/sig.json').then(res => res.json()).then(data => { DB_SIG=data;saveDataToIDX(data,2); })

  dispHeaderMode();

  //let currentData = await getFile('dtr/daily.json');
  //let data2=currentData.content;
  //console.log('All Data',data2);
  let arr=[]; let arr_ctr=0;
  for(let i=0;i<data2.length;i++){
    if(data2[i].usercode != CURR_USER){ continue; }
    arr[arr_ctr]=data2[i];
    arr_ctr++;
  }
  //console.log('Current content:',arr);    
}

async function get_all_db_from_json(){  
  await fetch('./DBF/monthly.json').then(res => res.json()).then(data => { DB_MONTHLY=data;saveDataToIDX(data,1); })
  await fetch('./DBF/sig.json').then(res => res.json()).then(data => { DB_SIG=data;saveDataToIDX(data,2); })
  await fetch('./DBF/user.json').then(res => res.json()).then(data => { DB_USER=data;saveDataToIDX(data,3); })
}

async function get_all_db_from_cloud(){  
  let data=await api_readfile(true,'dtr/user');   DB_USER=data.content;  
  await saveDataToIDX(DB_USER,3);
  await fetch('./DBF/sig.json').then(res => res.json()).then(data => { DB_SIG=data;saveDataToIDX(data,2); }) 
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

function JBE_CHK_BASE64(img){
  let rval=false;
  if(img.substring(0,11)=='data:image/'){ rval=true; }
  return rval;
}

async function rest_api_save_profile(vmode,userRow,usercode,u,p,n,n2,fullname,lastname,firstname,middlename,a,photo,c,lat,lng,d_active,usertype){  
  fullname=lastname+', '+firstname+' '+middlename;
  var jimg=photo;  
  if(JBE_CHK_BASE64(photo)){    
    await JBE_BLOB(n,jimg).then(result => jimg=result);
  }else{
    jimg='';
  }
  var ob = {
    id:userRow, 
    clientno:CURR_CLIENT,    
    usercode:usercode,
    userid:u,
    username:n,
    username2:n2,
    pword:p,
    fullname:fullname,
    lastname:lastname,
    firstname:firstname,
    midname:middlename,
    photo:jimg,    
    usertype:usertype,
    addrss:a,
    celno:c,
    fb:'',
    email:'',
    d_active:d_active,
    lat:lat,
    lng:lng
  };      

  showProgress(true);
  
  //alert('save: usercode: '+usercode+' curr_user:'+CURR_USER);    
  //alert('offline:'+ob.photo);
  await api_save(false,'user',[ob],record => !(record.usercode === usercode));
  
  showProgress(false);  
  document.getElementById('admin_avatar').src=photo;
  document.getElementById('bar_avatar').src=photo;
  document.getElementById('owner').src=photo;
  
  let data=await api_readfile(false,JBE_API+'user');   DB_USER=data.content;
  console.log('save profile:',DB_USER);

  if(JBE_ONLINE){ 
    await jeff_uploadImage(photo,'dtr/images/'+usercode+'.jpg'); 
    ob.photo='';
    await api_save(true,'dtr/'+'user',[ob],record => !(record.usercode === usercode));
  }
  JBE_CLOSE_VIEW();
}
  
async function upd_save_profile(){  
  DB_USER=await readAllRecords('user');
  console.log('upd_save_profile',DB_USER);
  dispHeaderMode();
  JBE_CLOSE_VIEW();
}
  
//=============================
function time_empty(txt,t1,t2,t3,t4){
  let rval=true;
  let ctr=0;
  if(txt){ ctr++; }
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
  updownForm(1); // 1=upload 2=download
}

function updownForm(jmode){
  let lb_mode='Upload'; let vgfx='jupload.png';  
  if(jmode==2){ lb_mode='Download';vgfx='jdownload.png'; }
  let h=220;
  let date=new Date();
  let dtl=     
    '<div id="div_updownForm" data-zoom=0 data-close="" style="width:100%;height:'+h+'px;text-align:center;padding:10px;background-color:none;">'+     
      '<div style="width:100%;height:45%;padding:2px;background:'+JBE_CLOR+';">'+
        '<div style="width:100%;height:50%;padding:10px;">From Date:</div>'+
        '<input id="d1" style="width:100%;height:50%;text-align:center;" onchange="chg_date_updownForm('+jmode+',d1.value,d2.value)" type="month" value="'+JBE_DATE_FORMAT(date,'YYYY-MM')+'"  placeholder="Date" />'+              
      '</div>'+
      '<div style="margin-top:15px;width:100%;height:45%;padding:2px;background:'+JBE_CLOR+';">'+
        '<div style="width:100%;height:50%;padding:10px;"> To Date:</div>'+
        '<input id="d2" style="width:100%;height:50%;text-align:center;" onchange="chg_date_updownForm('+jmode+',d1.value,d2.value)" type="month" value="'+JBE_DATE_FORMAT(date,'YYYY-MM')+'"  placeholder="Date" />'+              
      '</div>'+     
    '</div>';
  let dtl2=     
    '<div style="width:100%;height:100%;padding:0px 0 0 0;text-align:center;color:'+JBE_TXCLOR1+';background:none;">'+      
      '<div class="class_footer" style="float:left;width:25%;" onclick="func_updownForm('+jmode+',d1.value,d2.value)">'+
        '<img src="gfx/'+vgfx+'" alt="call image" />'+
        '<span>'+lb_mode+'</span>'+
      '</div>'+
      '<div class="class_footer" style="float:left;width:50%;">'+
        '<div id="div_tot_entries" style="width:100%;height:50%;"></div>'+
        '<span id="div_tot_label" style="width:100%;height:50%;text-align:center;padding:2px;font-size:12px;color:black;">Entries to '+lb_mode+'</span>'+
      '</div>'+
      '<div class="class_footer" style="float:right;width:25%;" onclick="JBE_CLOSEBOX()">'+
        '<img src="gfx/jclose.png" alt="call image" />'+
        '<span>Close</span>'+
      '</div>'+
    '</div>';  
  JBE_OPENBOX('div_updownForm',lb_mode+' Data',dtl,dtl2);
  chg_date_updownForm(jmode,d1.value,d2.value);
}

async function chg_date_updownForm(jmode,d1,d2){
  //console.log('chg_date_updownForm',d1,d2);
  document.getElementById('div_tot_entries').innerHTML=0;
  if(d1 > d2){ snackBar('ERROR: Invalid Dates'); return; }
  let v_month=new Date(d2).getMonth()+1;
  let dum_date=(v_month+1).toString().padStart(2, '0')+'-01-'+new Date(d2).getFullYear();
  if(v_month==12){ dum_date='01-01-'+(new Date(d2).getFullYear()+1); }
  
  var dum2_date = new Date(dum_date);
  dum2_date.setDate(dum2_date.getDate()-1);

  let s_date=JBE_DATE_FORMAT(d1+'-01','YYYY-MM-DD');
  let e_date=JBE_DATE_FORMAT(dum2_date,'YYYY-MM-DD');
  console.log(s_date,' vs ',e_date);

  let ctr=0;

  if(jmode==1){ //upload
    let result = DB_DAILY.filter(item => 
      item.usercode === CURR_USER && (JBE_DATE_FORMAT(item.date,'YYYY-MM-DD') >= s_date && JBE_DATE_FORMAT(item.date,'YYYY-MM-DD') <= e_date) && !time_empty(item.txt,item.time1,item.time2,item.time3,item.time4) 
    );
    ctr=result.length;
  }else if(jmode==2){
    //let currentData = await getFile('dtr/daily.json'); 
    let currentData=await api_readfile(true,'dtr/'+'daily'); 
    let tbl_daily=currentData.content;
    let result = tbl_daily.filter(item => 
      item.usercode === CURR_USER && (JBE_DATE_FORMAT(item.date,'YYYY-MM-DD') >= s_date && JBE_DATE_FORMAT(item.date,'YYYY-MM-DD') <= e_date) && !time_empty(item.txt,item.time1,item.time2,item.time3,item.time4) 
    );
    ctr=result.length;
  }
  document.getElementById('div_tot_entries').innerHTML=ctr;
}

function func_updownForm(jmode,d1,d2){
  if(jmode==1){
    do_upload(d1,d2);
  }else if(jmode==2){
    do_download(d1,d2);
  }
}

function do_upload(d1,d2){
  if(parseInt(document.getElementById('div_tot_entries').innerHTML)==0){ 
    snackBar('Nothing to Upload...');
    return; 
  }
  let v_month=new Date(d2).getMonth()+1;
  let dum_date=(v_month+1).toString().padStart(2, '0')+'-01-'+new Date(d2).getFullYear();
  if(v_month==12){ dum_date='01-01-'+(new Date(d2).getFullYear()+1); }
  
  var dum2_date = new Date(dum_date);
  dum2_date.setDate(dum2_date.getDate()-1);

  let s_date=JBE_DATE_FORMAT(d1+'-01','YYYY-MM-DD');
  let e_date=JBE_DATE_FORMAT(dum2_date,'YYYY-MM-DD');
  console.log('UPLOAD: s_date,e_date',s_date,e_date);

  MSG_SHOW(vbYesNo,'CONFIRM:','Are you sure to Upload your Data?',function(){ do2_upload(s_date,e_date); },function(){ return; });
  JBE_CLOSEBOX();
}

async function do2_upload(s_date,e_date){
  let fld='usercode';
  let val=CURR_USER;  
  const result = DB_DAILY.filter(item => 
    item.usercode === val && (JBE_DATE_FORMAT(item.date,'YYYY-MM-DD') >= s_date && JBE_DATE_FORMAT(item.date,'YYYY-MM-DD') <= e_date) && !time_empty(item.txt,item.time1,item.time2,item.time3,item.time4) 
  );
  showProgress(true);
  console.log('For Upload ------:',result);
  //jeff_update_gistFile(gistId, fileName,result,fld,val);
  //await jeff_update_File('dtr/daily.json',result,fld,val);
  //
  //await jeff_update_File(JBE_API+'daily.json',result,fld,val);
  await api_save(true,'dtr/'+'daily',result,record => !(record.usercode === CURR_USER && record.date >= s_date && record.date <= e_date));
  showProgress(false);
  //console.log(result);
  snackBar('Upload Successful...');    
}

async function do_download(d1,d2){    
  let v_month=new Date(d2).getMonth()+1;
  let dum_date=(v_month+1).toString().padStart(2, '0')+'-01-'+new Date(d2).getFullYear();
  if(v_month==12){ dum_date='01-01-'+(new Date(d2).getFullYear()+1); }
  
  var dum2_date = new Date(dum_date);
  dum2_date.setDate(dum2_date.getDate()-1);

  let s_date=JBE_DATE_FORMAT(d1+'-01','YYYY-MM-DD');
  let e_date=JBE_DATE_FORMAT(dum2_date,'YYYY-MM-DD');

  //let currentData = await getFile('dtr/daily.json');
  let currentData=await api_readfile(true,'dtr/'+'daily');  
  let tbl_daily=currentData.content;
  let arr=[]; let arr_ctr=0;
  for(var i=0;i<tbl_daily.length;i++){
    if(tbl_daily[i].usercode != CURR_USER){ continue; }
    if((JBE_DATE_FORMAT(tbl_daily[i].date,'YYYY-MM-DD') < s_date) || (JBE_DATE_FORMAT(tbl_daily[i].date,'YYYY-MM-DD') > e_date)){ continue; }
    
    arr[arr_ctr]=tbl_daily[i];
    arr_ctr++;
  }
  DB_DAILY=arr;
  saveDataToIDX(arr,0);
  snackBar('Download Successful...');
  JBE_CLOSEBOX();
}




