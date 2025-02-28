var ob_work=[
  { workcode:-1,workstat:"Regular",work_fg:"black",work_bg:"white" },
  { workcode:6,workstat:"Saturday",work_fg:"blue",work_bg:"white" },
  { workcode:0,workstat:"Sunday",work_fg:"red",work_bg:"white" },
  { workcode:1,workstat:"Holiday",work_fg:"gold",work_bg:"white" }
];

function rp_dtr(){
  window.history.pushState({ noBackExitsApp: true }, '');
  f_MainPage=false;
  var repTilt='';
  
  document.getElementById('back_view1').style.display='none';
  let pa_height=H_VIEW-30;
  if(JBE_MOBILE){ pa_height=H_VIEW-30; }

  var dtl=
  '<div id="dv_dtr" data-maxdays=0 data-print=1 style="height:100%;width:100%;font-family:Arial Narrow,Arial,sans-serif;font-size:12px;padding:10px;border:0px solid lightgray;background:white;">'+

    '<div style="height:35px;width:100%;text-align:center;padding:0px;font-size:16px;border:1px solid lightgray;background:none;">'+ 
       '<div class="cls_daily" style="margin:0 auto;width:250px;height:100%;padding:4px;border:0px solid lightgray;">'+ 
          '<span style="float:left;width:40%;height:100%;padding:3px 0 0 0;font-size:14px;font-weight:bold;background:none;">DTR Month of:</span>'+ 
          '<input id="date_dtr" style="width:60%;height:100%;" onchange="chg_repdtr_month(this.value)" type="month" value="'+JBE_DATE_FORMAT(CURR_DATE,'YYYY-MM')+'"  placeholder="Date" />'+       
        '</div>'+
    '</div>'+  

    '<div id="printableBorder" style="height:'+pa_height+'px;">'+    
      '<div id="printableArea" style="width:705px;">'+
        '<div id="pa_dtl">'+
        '</div>'+
      '</div>'+
    '</div>'+
      
  '</div>';

  JBE_OPEN_VIEW(dtl,'PRINTER','showMainPage');
  mnu_repo();

  let vDate=JBE_DATE_FORMAT(CURR_DATE,'YYYY-MM');
  var unod=
  '<div style="width:100%;height:950px;margin-top:0px;font-size:14px;padding:0px;border:0px solid green;">'+  
    '<div id="dtr1" style="float:left;width:auto;height:800px;border:0px solid black;"></div>'+
    '<div id="dtr2" style="float:right;width:auto;height:800px;border:0px solid black;"></div>'+
  '</div>';
  document.getElementById('pa_dtl').innerHTML=unod;
  chg_repdtr_month(vDate);  
}

function chg_repdtr_month(v){
    document.getElementById('dtr1').innerHTML=ret_dtr(v,true);
    querySel_dtr();
    disp_month(v);
    disp_user_time(v,true);
    dtr2.innerHTML=dtr1.innerHTML;
}

function disp_month(vDate){
  //alert('disp_month: '+vDate);
  //let f_print=iif(document.getElementById('dv_dtr').getAttribute('data-print')==0,false,true);
  //alert(f_print);
  let str=vDate.split('-');
  let numDays = (y, m) => new Date(y, m, 0).getDate();
  let max_days=numDays(str[0], str[1]);
  document.getElementById('dv_dtr').setAttribute('data-maxdays',max_days);

  for(var j=1;j<=max_days;j++){
    let vDate2=str[0]+'-'+str[1]+'-'+j.toString().padStart(2, '0'); 
    document.getElementById('dtl_ymd_'+j).innerHTML=vDate2;
    document.getElementById('dtl_dd_'+j).innerHTML=j.toString().padStart(2, '0');
    let vday=new Date(vDate2).getDay();
    if(vday == 0 ||  vday == 6){ no_work(j,vday); }    
  }

  
  //display holidays
  //alert('DB_MONTHLY.length: '+DB_MONTHLY.length);
  let v_seldate=JBE_DATE_FORMAT(vDate,'YYYY-MM');
  for(var j=0;j<DB_MONTHLY.length;j++){
    let v_date=JBE_DATE_FORMAT(DB_MONTHLY[j].date,'YYYY-MM-DD');
    
    if(JBE_DATE_FORMAT(v_date,'YYYY-MM') != v_seldate){ continue; }

    let row=parseInt(v_date.substring(8,10));
    
    let fg=JBE_GETFLD('work_fg',ob_work,'workcode',1);
    let bg=JBE_GETFLD('work_bg',ob_work,'workcode',1);

    let f_print=iif(document.getElementById('dv_dtr').getAttribute('data-print')==0,false,true);
    if(f_print){
      fg='black'; bg='white';
    }
    
    //document.getElementById('dtl_'+row).style.backgroundColor=bg;

    document.getElementById('dtl_xx_'+row).style.display='block';
    document.getElementById('dtl_dd_'+row).style.color=fg;
    document.getElementById('dtl_nn_'+row).style.color=fg;
    document.getElementById('dtl_xx_'+row).innerHTML='HOLIDAY';
    document.getElementById('dtl_xx_'+row).style.backgroundColor='none';
   
    for(var jj=1;jj<=4;jj++){
      //document.getElementById('dtl_t'+jj+'_'+row).style.display='none';
      //document.getElementById('dtl_t'+jj+'_'+row).style.color=fg;
    }
    //document.getElementById('dtl_hh_'+row).style.display='none';
    document.getElementById('dtl_mm_'+row).style.display='none';
    document.getElementById('dtl_'+row).setAttribute('data-work',1);    
  }  
}

function close_edit_dtr(){
  return;
}

function chk_dtr_dtl_empty(row){
  let rval=false;
  let ctr=0;
  let txt=document.getElementById('dtl_txt'+row).innerHTML;
  //check if empty fields 
  for(var i=1;i<=4;i++){
    if(document.getElementById('dtl_t'+i+'_'+row).innerHTML){ ctr++; } 
  }
  //if(txt && ctr==0){ rval=true; }  
  if(!txt && ctr==0){ rval=true; }  
  return rval;
}

function clear_dtr_entry(row){
  for(var i=1;i<=4;i++){
    document.getElementById('inp_t'+i).value='';
  } 
}

function xtoggle_dtl_dtr(row,v_empty){ 
  let v_disp_nn='none'; let v_disp_tt='block';
  if(v_empty){ v_disp_nn='block'; v_disp_tt='none';}

  document.getElementById('dtl_nn_'+row).style.display=v_disp_nn;
  for(var j=1;j<=4;j++){
    document.getElementById('dtl_t'+j+'_'+row).style.display=v_disp_tt;
  }
  //document.getElementById('dtl_hh_'+row).style.display=v_disp_tt;
  document.getElementById('dtl_mm_'+row).style.display=v_disp_tt;

  //document.getElementById('dtl_'+row).setAttribute('data-work',work_stat);
  document.getElementById('dtl_xx_'+row).style.display=v_disp_nn;
}

function toggle_dtl_dtr(row,v_empty){ 
  //alert('togggle_dtl_dtr:'+v_empty);  
  let v_disp_xx='block';
  if(v_empty){ v_disp_xx='none'; }
  document.getElementById('dtl_xx_'+row).style.display=v_disp_xx;
  document.getElementById('dtl_txt'+row).style.display='block';
}

function save_dtr(row,v_work){ 
  alert('save_dtr');
  //display and save
  let ctr=0;
  let f_empty=false;
  aryTime=[];
  for(var j=1;j<=4;j++){  
    //document.getElementById('dtl_t'+j+'_'+row).innerHTML=document.getElementById('inp_t'+j).value.replace(/^0+/, ""); 
    //let joras=format_12(document.getElementById('inp_t'+j).value);
    let joras=format_12(document.getElementById('inp_t'+j).value);
    if(!joras){ joras=''; }else{ ctr++; }
    console.log('joras:'+joras);
    aryTime[(j-1)]=joras;
    //document.getElementById('dtl_t'+j+'_'+row).innerHTML=joras.replace(/^0+/, ""); 
    console.log('ai:'+aryTime[j-1]);
  }
  //check t2 and t3 ////////////////////////////
  if(aryTime[1] && aryTime[1] > '12:30'){ 
    MSG_SHOW(vbOk,"ERROR: AM Departure Time","<center>Allowed time is less than or equal to 12:30 pm.</center>",function(){ document.getElementById('inp_t2').focus(); },function(){});    
    return; 
  }
  if(aryTime[2] && aryTime[2] < '12:31'){ 
    //snackBar('ERROR: PM Arrival Time: '+aryTime[2]); 
    MSG_SHOW(vbOk,"ERROR: PM Arrival Time","<center>Time should be greater than 12:30</center>",function(){ document.getElementById('inp_t3').focus(); },function(){});    
    return; 
  }
  //////////////////////////////////////
  document.getElementById('dtl_t1'+'_'+row).innerHTML=aryTime[0].replace(/^0+/, ""); 
  document.getElementById('dtl_t2'+'_'+row).innerHTML=aryTime[1].replace(/^0+/, ""); 
  document.getElementById('dtl_t3'+'_'+row).innerHTML=aryTime[2].replace(/^0+/, ""); 
  document.getElementById('dtl_t4'+'_'+row).innerHTML=aryTime[3].replace(/^0+/, ""); 

  console.log('ctr:'+ctr);
  let v_date=document.getElementById('dtl_ymd_'+row).innerHTML;
  let dtl_txt=document.getElementById('inp_txt').value;

  if(dtl_txt.trim().length==0 && ctr==0){ f_empty=true; }
  //alert('v_work:'+v_work+' f_empty:'+f_empty);
  if(v_work != -1){
    toggle_dtl_dtr(row,!f_empty);
  }
  
  let dtl_txt_top=inp_txt_top.value;
  let dtl_txt_left=inp_txt_left.value;
  let dtl_txt_width=inp_txt_width.value;
  let dtl_txt_fsize=inp_txt_fsize.value;

  document.getElementById('dtl_txt'+row).innerHTML=dtl_txt;
  document.getElementById('dtl_txt'+row).style.backgroundColor='gold';
  document.getElementById('dtl_txt_top_'+row).innerHTML=dtl_txt_top;
  document.getElementById('dtl_txt_left_'+row).innerHTML=dtl_txt_left;
  document.getElementById('dtl_txt_width_'+row).innerHTML=dtl_txt_width;
  document.getElementById('dtl_txt_fsize_'+row).innerHTML=dtl_txt_fsize;
  alert('dtl_txt: '+dtl_txt);
  document.getElementById('dtl_txt'+row).innerHTML=dtl_txt;
  document.getElementById('dtl_txt'+row).style.top=dtl_txt_top+'px';
  document.getElementById('dtl_txt'+row).style.left=dtl_txt_left+'px';
  document.getElementById('dtl_txt'+row).style.width=dtl_txt_width+'px';
  document.getElementById('dtl_txt'+row).style.fontSize=dtl_txt_fsize+'px';

  document.getElementById('dtl_txt'+row).style.border=iif(dtl_txt,'1','0')+'px solid green';
  
  //alert('dtl_txt_left:'+inp_txt.value);
  /*
  document.getElementById('dtl_txt'+row).style.textAlign='left';
  document.getElementById('dtl_txt'+row).style.display='block'; 
  document.getElementById('dtl_txt'+row).style.top=dtl_txt_top;
  document.getElementById('dtl_txt'+row).style.left=dtl_txt_left;
  document.getElementById('dtl_txt'+row).style.width=dtl_txt_width;
  document.getElementById('dtl_txt'+row).style.fontSize=dtl_txt_fsize;
  */

  save_entry(row,v_date,CURR_USER,aryTime[0], aryTime[1], aryTime[2], aryTime[3],dtl_txt,dtl_txt_top,dtl_txt_left,dtl_txt_width,dtl_txt_fsize);
}

function format_12(timeString){
  if(!timeString){ return ''; }
  let oras = timeString.split(':');
  let hh = oras[0].padStart(2, '0');
  let mm = oras[1].padStart(2, '0');
  let xhh=Number(hh);
  //alert(xhh);
    
  if(xhh > 12){
    hh=(xhh - 12).toString().padStart(2, '0');
  }
  if(xhh == 0){
    hh=(12).toString().padStart(2, '0');
  }
  //alert("hh:"+hh);
  return hh+':'+mm;
}

function xsave_entry(vdate,usercode,time1, time2, time3, time4, dtl_txt,dtl_txt_top,dtl_txt_left,dtl_txt_width,dtl_txt_fsize){
  //alert(dtl_txt_left);
  if(DEBUG_NODE){
    axios.post('/api/save_entry', {headers: { 'Content-Type': 'application/json' }},{ params: {vdate:vdate, usercode:usercode,
      time1:time1,time2:time2,time3:time3,time4:time4,
      dtl_txt:dtl_txt,
      dtl_txt_top:dtl_txt_top,
      dtl_txt_left:dtl_txt_left,
      dtl_txt_width:dtl_txt_width,
      dtl_txt_fsize:dtl_txt_fsize
    } })
    .then(function (response){ api_save_entry(response); }).catch(function (error) { console.log(error); });
  }else{
    axios.post('z_tanan.php', { request: 200,  vdate:vdate, usercode:usercode,
      time1:time1,time2:time2,time3:time3,time4:time4,
      dtl_txt:dtl_txt,
      dtl_txt_top:dtl_txt_top,
      dtl_txt_left:dtl_txt_left,
      dtl_txt_width:dtl_txt_width,
      dtl_txt_fsize:dtl_txt_fsize
     }, JBE_HEADER)
    .then(function (response){ api_save_entry(response); }).catch(function (error) { console.log(error); });
  }  
  
  function api_save_entry(response){
    showProgress(false);       
    DB_DAILY=response.data;
    JBE_CLOSEBOX(); 
    ref_ctr(false);
   }
}

function ref_ctr(f_print){
  //alert(f_print); 
  let ctr=0;
  for(var i=0;i<DB_DAILY.length;i++){
    if(DB_DAILY[i].usercode != CURR_USER){ continue; }
    //if(chk_dtr_dtl_empty(i)){ continue; }

    let v_date=JBE_DATE_FORMAT(DB_DAILY[i].date,'YYYY-MM');
    //console.log(v_date+' <<<vs date_dtr:'+date_dtr.value);
    if(v_date != date_dtr.value){ continue; }

    ctr++;
  }
  if(f_print){ ctr=0; }
  document.getElementById('div_total').innerHTML=ctr;
  //snackBar('Refreshed...');
}

function querySel_dtr(){
  document.querySelectorAll('.rightBox').forEach(function(el) {  
    el.style.borderRight='1px solid black';
  });
  document.querySelectorAll('.bottomBox').forEach(function(el) {  
    el.style.borderBottom='1px solid black';
  });

  document.querySelectorAll('.hd0_Box').forEach(function(el) {  
    el.style.padding='12px 0px 0px 0px';
    el.style.height='100%';
    el.style.cssFloat='left';  
    el.style.margin=0;
    el.style.borderBottom='none';
    el.style.textAlign='center';
    el.style.color='black';  
    el.style.borderBottom='0px solid black';
  });

  document.querySelectorAll('.pBox').forEach(function(el) {
    //el.style.color='gold';
    el.style.height='100%';
    el.style.cssFloat = 'left';  
    el.style.margin=0;
    //el.style.padding='1px 0px 0px 0px';
    el.style.borderBottom='0px solid black';
    el.style.textAlign='center';
    //el.style.color='black';
    //el.style.backgroundColor='pink';
    el.style.fontSize='11px';
    //el.style.overflowY='hidden';  el.style.overflowX='auto';
  });
 
  document.querySelectorAll(".pp").forEach(function(el) {  
    //el.style.height='100%';
    //el.style.color='black';
    el.style.padding='3px 0px 0px 0px';  
    //el.style.cssFloat='left';
    el.style.textAlign='center';
    el.style.fontSize='9px';
  });
  document.querySelectorAll(".pp2").forEach(function(el) {  
    //el.style.height='100%';
    el.style.color='black';
    el.style.padding='5px 0px 0px 0px';  
    //el.style.cssFloat='left';
    el.style.textAlign='center';
    el.style.fontSize='7px';
  });
}

function JBE_FORMAT_TIME(timeString) {
  if(!timeString || timeString.trim()==''){ return ''; }
  // Split the time string into hours and minutes
  var parts = timeString.split(':');

  // Ensure both hours and minutes have leading zeros if necessary
  var hours = parts[0].padStart(2, '0');
  var minutes = parts[1].padStart(2, '0');

  // Return the time with leading zeros
  return hours + ':' + minutes;
} 

function ret_clocks(){
  let aryTime=[];
  let minutos = new Date().getMinutes().toString().padStart(2, '0');
  aryTime[0]='07:'+minutos;
  aryTime[1]='12:'+randomInteger(1,9).toString().padStart(2, '0');
  aryTime[2]='12:'+randomInteger(45,59).toString().padStart(2, '0');
  aryTime[3]='05:'+randomInteger(1,10).toString().padStart(2, '0');
  return aryTime;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function ret_dtr(vDate,f_print){
  vDate=vDate+'-01';
  let v_width='100%';
  if(f_print){ v_width='320px'; }
  v_width='320px';
  let max_days=31;
  let aryUSER=JBE_GETARRY(DB_USER,'usercode',CURR_USER);
  let empname=aryUSER.lastname+', '+aryUSER.firstname+' '+aryUSER.midname.substring(0,1)+'.';

  //let max_days=document.getElementById('dv_dtr').getAttribute('data-maxdays');
  var dtl=
  '<div style="width:'+v_width+';height:'+iif(f_print,960,730)+'px;margin:0 auto;font-family:Lato, sans-serif;text-align:left;border:1px solid white;">'+
  
    //'<div style="width:100%;height:20px;font-size:10px;font-style:italic;border:0px solid black;">Civil Service Form No. 48</div>'+
    '<div style="width:85%;height:20px;margin-top:'+iif(f_print,80,20)+'px;text-align:center;font-size:14px;font-weight:bold;border:0px solid black;">DAILY TIME RECORD</div>'+   

    '<div style="width:100%;height:45px;margin-top:5px;font-size:12px;border:0px solid violet;">'+   
      '<div style="float:left;width:84%;height:100%;text-align:center;font-size:12px;border-bottom:2px solid black;background:none;">'+   
        '<div style="width:100%;height:15px;text-align:center;margin-top:20px;font-size:14px;font-weight:bold;background:none;">'+empname.toUpperCase()+'</div>'+           
      '</div>'+ 
      '<div style="float:right;width:15%;height:100%;text-align:right;font-size:12px;background:none;">'+   
        '<img src="gfx/logoCHO.png" style="height:100%;width:100%;" />'+
      '</div>'+   
    '</div>'+   

    '<div style="width:100%;height:15px;margin-top:40px;font-size:11px;background:none;">'+
      '<div style="float:left;width:27%;height:100%;background:none;">For the month of</div>'+
      '<div id="month_of" style="float:right;width:65%;height:100%;font-size:12px;font-weight:bold;text-align:left;padding:0 0 0 10px;border-bottom:2px solid lightblue;">'+JBE_DATE_FORMAT(vDate,'MMMM YYYY')+'</div>'+
    '</div>'+   

    '<div style="width:100%;height:10px;margin-top:6px;font-size:10px;font-style:italic;background:none;">'+
      '<div style="float:left;width:43%;height:100%;text-align:center;background:none;">Official hours for</div>'+        
      '<div style="float:left;width:22%;height:100%;background:none;">Regular Days:</div>'+        
      '<div style="float:left;width:35%;height:100%;font-size:8px;border-bottom:1px solid black;text-align:center;background:none;">8:00-12am 1:00pm-5:00pm</div>'+        
    '</div>'+    
    '<div style="width:100%;height:12px;margin-top:3px;font-size:10px;font-style:italic;background:none;">'+
      '<div style="float:left;width:43%;height:100%;text-align:center;background:none;">arrival and departure</div>'+        
      '<div style="float:left;width:22%;height:100%;background:none;">Saturdays:</div>'+        
      '<div style="float:left;width:35%;height:100%;border-bottom:1px solid black;text-align:center;background:none;">As requested</div>'+        
    '</div>'+    
    
  
    //head dtl

    '<div style="width:90%;height:10px;margin-top:5px;border-bottom:1px solid black;"></div>'+      
  
    '<div style="width:100%;height:30px;margin-top:2px;font-size:11px;border:1px solid black;border-bottom:0px">'+

      '<div class="rightBox" style="float:left;width:6%;height:100%;">'+
        '<div class="xhd0_Box" style="width:100%;height:50%;border-bottom:1px solid black;background:none;"></div>'+
      '</div>'+ 

      '<div class="rightBox" style="float:left;width:'+iif(!f_print,42.1,42.3)+'%;height:100%;">'+        
        '<div style="width:100%;height:50%;border-bottom:1px solid black;background:none;"><div class="pp">A. M.</div></div>'+
        '<div style="width:100%;height:50%;background:none;">'+
          '<div style="float:left;width:'+iif(!f_print,50,49)+'%;height:100%;border-right:1px solid black;background:none;"><div class="pp">ARRIVAL</div></div>'+
          '<div style="float:right;width:'+iif(!f_print,50,50)+'%;height:100%;background:none;"><div class="pp">DEPARTURE</div></div>'+
        '</div>'+ 
      '</div>'+ 

      '<div class="rightBox" style="float:left;width:'+iif(!f_print,41.8,42.3)+'%;height:100%;">'+
        '<div style="width:100%;height:50%;border-bottom:1px solid black;background:none;"><div class="pp">P. M.</div></div>'+
        '<div style="width:100%;height:50%;border-bottom:0px;background:none;">'+
          '<div style="float:left;width:50%;height:100%;border-right:1px solid black;background:none;"><div class="pp">ARRIVAL</div></div>'+
          '<div style="float:right;width:49%;height:100%;background:none;"><div class="pp">DEPARTURE</div></div>'+
        '</div>'+ 
      '</div>'+ 

      '<div style="float:left;width:8.0%;height:100%;background:none;">'+
        '<div style="width:100%;height:50%;border-bottom:1px solid black;background:none;"><div class="pp"></div></div>'+        
        '<div style="width:100%;height:50%;background:none;"><div class="pp">MIN</div></div>'+
      '</div>'+

    '</div>'+     
      
    '<div id="dtl_dtr" data-rec=0 style="width:100%;height:auto;margin-top:0px;font-size:13px;border:0px solid red;border-bottom:1px solid black;">';
    let rowHeight=15; let rowPad=1;
    //if(!f_print){ rowHeight=25; rowPad=6; }
    for(var i=1;i<=max_days;i++){
      dtl+=
      '<div id="dtl_'+i+'" data-work = -1 onclick="edit_dtr('+i+','+f_print+')" style="position:relative;width:100%;height:'+rowHeight+'px;cursor:pointer;text-align:center;border:1px solid black;border-bottom:0px;">'+        
        '<div id="dtl_ymd_'+i+'" style="display:none;"></div>'+
        '<div id="dtl_dd_'+i+'" class="pBox rightBox" style="width:6%;padding:'+rowPad+'px 0 0 0;"></div>'+
        '<div id="dtl_nn_'+i+'" class="pBox" style="display:none;width:89%;padding:'+rowPad+'px 0 0 0;"></div>'+
        '<div id="dtl_t1_'+i+'" class="pBox rightBox" style="display:block;width:21%;padding:'+rowPad+'px 0 0 0;"></div>'+
        '<div id="dtl_t2_'+i+'" class="pBox rightBox" style="display:block;width:21%;padding:'+rowPad+'px 0 0 0;"></div>'+
        '<div id="dtl_t3_'+i+'" class="pBox rightBox" style="display:block;width:21%;padding:'+rowPad+'px 0 0 0;"></div>'+
        '<div id="dtl_t4_'+i+'" class="pBox rightBox" style="display:block;width:21%;padding:'+rowPad+'px 0 0 0;"></div>'+
        
        '<div id="dtl_mm_'+i+'" class="pBox" style="display:block;width:8%;"></div>'+
        '<div id="dtl_xx_'+i+'" class="pBox" style="position:absolute;display:none;left:6%;width:84%;font-weight:bold;padding:'+rowPad+'px 0 0 0;border:0px solid cyan;background:none;"></div>'+
        '<div id="dtl_txt'+i+'" class="pBox" style="position:absolute;display:none;width:auto;height:auto;font-weight:bold;text-align:left;border:'+iif(!f_print,1,0)+'px solid green;background:none;"></div>'+
        '<div id="dtl_txt_top_'+i+'" style="display:none;">0</div>'+
        '<div id="dtl_txt_left_'+i+'" style="display:none;">19</div>'+
        '<div id="dtl_txt_width_'+i+'" style="display:none;">100</div>'+
        '<div id="dtl_txt_fsize_'+i+'" style="display:none;">11</div>'+
      '</div>';
    }
  
    dtl+=   
    '</div>'+

    '<div style="display:block;width:100%;height:15px;margin-top:2px;padding:px5 0 0 0;font-size:11px;border:0px solid red;">'+
      '<div style="float:left;width:90%;height:100%;margin-top:0px;border-top:1px solid black;border-bottom:1px solid black;">Total</div>'+      
      '<div id="div_total" style="float:right;width:auto;text-align:right;background:none;"></div>'+
    '</div>'+

    '<div style="display:'+iif(!f_print,'none','block')+';width:100%;height:auto;margin-top:10px;text-align:center;font-size:10px;border:0px solid black;">'+
      '<div style="width:100%;padding:1px;font-size:9px;text-align:left;">'+
        '<div>I certify on my honor that the above is a true and correct report of the hours of</div>'+
        '<div>work performed, record of which was made daily at the time of arrival and</div>'+
        '<div>departure from office.</div>'+
      '</div>'+
    
      '<div style="width:100%;height:20px;margin-top:20px;border-top:1px solid black;">VERIFIED as to the prescribed office hours:</div>'+

      //'<div style="width:100%;height:20px;margin-top:20px;border-bottom:2px solid black;"></div>'+
      //'<div style="margin-top:2px;">In Charge</div>'+
      '<div style="width:100%;height:15px;font-size:13px;font-weight:bold;margin-top:20px;border-bottom:2px solid lightblue;">'+DB_SIG[0].head+'</div>'+
      '<div style="width:100%;height:auto;font-size:11px;font-weight:bold;margin-top:2px;">'+
        '<div>'+DB_SIG[0].position+'</div>'+
        '<div>'+DB_SIG[0].office+'</div>'+
        '<div>'+DB_SIG[0].license+'</div>'+
      '</div>'+
    '</div>'+
  '</div>';

  return dtl;
}

function no_work(row,vday){
  let bg=JBE_GETFLD('work_bg',ob_work,'workcode',vday);
  let fg=JBE_GETFLD('work_fg',ob_work,'workcode',vday);
  
  let ddd='SATURDAY';
  if(vday==0){ ddd='SUNDAY'; } 
  let f_print=iif(document.getElementById('dv_dtr').getAttribute('data-print')==0,false,true);
  if(f_print){
    fg='black'; bg='white';
  }
  document.getElementById('dtl_'+row).style.color=fg; 
  document.getElementById('dtl_dd_'+row).style.color=fg; 
  document.getElementById('dtl_nn_'+row).style.color=fg;
  document.getElementById('dtl_xx_'+row).innerHTML=ddd;
  document.getElementById('dtl_'+row).style.backgroundColor='none';

  document.getElementById('dtl_xx_'+row).style.display='block';
  document.getElementById('dtl_'+row).setAttribute('data-work',vday);
}
