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
  console.log('DB_SIG',DB_SIG.length);
  await fetch('./DBF/sig.json').then(res => res.json()).then(data => { DB_SIG=data;saveDataToIDX(data,2); })
  GITHUB_TOKEN = DB_SIG[0].sys_pat.substring(3);
  console.log('GITHUB_TOKEN:',GITHUB_TOKEN);
  dispHeaderMode();

  let currentData = await getFile('dtr/daily.json');
  let data2=currentData.content;
  console.log('All Data',data2);
  let arr=[]; let arr_ctr=0;
  for(let i=0;i<data2.length;i++){
    if(data2[i].usercode != CURR_USER){ continue; }
    arr[arr_ctr]=data2[i];
    arr_ctr++;
  }
  console.log('Current content:',arr);  
  
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
  let h=420;
  if(JBE_MOBILE){ h=220; }
  let date=new Date();
  let dtl=     
    '<div id="div_updownForm" data-zoom=0 data-close="" style="width:100%;height:'+h+'px;text-align:center;padding:10px;background-color:none;">'+     
      '<div style="width:100%;height:45%;padding:2px;background:'+JBE_CLOR+';">'+
        '<div style="width:100%;height:50%;padding:3%;">From Date:</div>'+
        '<input id="d1" style="width:100%;height:50%;text-align:center;" onchange="chg_date_updownForm('+jmode+',d1.value,d2.value)" type="month" value="'+JBE_DATE_FORMAT(date,'YYYY-MM')+'"  placeholder="Date" />'+              
      '</div>'+
      '<div style="margin-top:5%;width:100%;height:45%;padding:2px;background:'+JBE_CLOR+';">'+
        '<div style="width:100%;height:50%;padding:3%;"> To Date:</div>'+
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
        '<div id="div_tot_entries"></div>'+
        '<span id="div_tot_label" style="padding:5px;color:black;background:green;">Entries to '+lb_mode+'</span>'+
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

  let ctr=0;

  if(jmode==1){ //upload
    for(var i=0;i<DB_DAILY.length;i++){
      if(DB_DAILY[i].usercode != CURR_USER){ continue; }
      let vdate=JBE_DATE_FORMAT(DB_DAILY[i].date,'YYYY-MM-DD');    
      if( vdate < s_date || vdate > e_date){ continue; }

      console.log(i,'vdate',vdate);
      ctr++;
    }  
  }else if(jmode==2){
    //let tbl_daily = await jeff_get_gistFile('dtr_daily.json','da82f09bb9ba93d717271ff93a5c3e6c');    
    let currentData = await getFile('dtr/daily.json');
    let tbl_daily=currentData.content;

    for(var i=0;i<tbl_daily.length;i++){
      if(tbl_daily[i].usercode != CURR_USER){ continue; }
      if((JBE_DATE_FORMAT(tbl_daily[i].date,'YYYY-MM-DD') < s_date) || (JBE_DATE_FORMAT(tbl_daily[i].date,'YYYY-MM-DD') > e_date)){ continue; }      
      ctr++;
    }
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

  MSG_SHOW(vbYesNo,'CONFIRM:','Are you sure to Upload your Data?',function(){ 
    let fld='usercode';
    let val=CURR_USER;  
    const result = DB_DAILY.filter(item => 
      item.usercode === val && (JBE_DATE_FORMAT(item.date,'YYYY-MM-DD') >= s_date && JBE_DATE_FORMAT(item.date,'YYYY-MM-DD') <= e_date) && !time_empty(item.txt,item.time1,item.time2,item.time3,item.time4) 
    );
    console.log('For Upload ------:',result);
    //jeff_update_gistFile(gistId, fileName,result,fld,val);
    jeff_update_File('dtr/daily.json',result,fld,val);
    console.log(result);
    snackBar('Upload Successful...');    
  },function(){ return; });
  JBE_CLOSEBOX();
}

async function do_download(d1,d2){    
  let v_month=new Date(d2).getMonth()+1;
  let dum_date=(v_month+1).toString().padStart(2, '0')+'-01-'+new Date(d2).getFullYear();
  if(v_month==12){ dum_date='01-01-'+(new Date(d2).getFullYear()+1); }
  
  var dum2_date = new Date(dum_date);
  dum2_date.setDate(dum2_date.getDate()-1);

  let s_date=JBE_DATE_FORMAT(d1+'-01','YYYY-MM-DD');
  let e_date=JBE_DATE_FORMAT(dum2_date,'YYYY-MM-DD');

  console.log('download: s_date,e_date',s_date,e_date);
    
  //let tbl_daily = await jeff_get_gistFile('dtr_daily.json','da82f09bb9ba93d717271ff93a5c3e6c');
  let currentData = await getFile('dtr/daily.json');
  let tbl_daily=currentData.content;
  let arr=[]; let arr_ctr=0;
  console.log(s_date+' vs '+e_date);
  console.log('tbl_daily',tbl_daily);
  for(var i=0;i<tbl_daily.length;i++){
    if(tbl_daily[i].usercode != CURR_USER){ continue; }
    if((JBE_DATE_FORMAT(tbl_daily[i].date,'YYYY-MM-DD') < s_date) || (JBE_DATE_FORMAT(tbl_daily[i].date,'YYYY-MM-DD') > e_date)){ continue; }
    
    arr[arr_ctr]=tbl_daily[i];
    arr_ctr++;
  }
  console.log('new arr:',arr);
  DB_DAILY=arr;
  saveDataToIDX(arr,0);
  snackBar('Download Successful...');
  JBE_CLOSEBOX();
}




