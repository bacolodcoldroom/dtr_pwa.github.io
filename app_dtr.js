function fm_dtr(){
  window.history.pushState({ noBackExitsApp: true }, '');
  f_MainPage=false;
  var n = new Date().toLocaleTimeString('it-IT');
  document.getElementById('back_view1').style.display='none';  
  mnu_fm_dtr();

  let pa_height=H_VIEW-20;
  
  var dtl= 
  '<div id="dv_dtr" data-maxdays=0 data-print=0  style="height:100%;width:100%;font-family:Arial Narrow,Arial,sans-serif;font-size:12px;padding:5px;border:1px solid lightgray;background:white;">'+

    '<div style="height:35px;width:100%;padding:0px;border:1px solid lightgray;background:none;">'+             
      
      '<div class="cls_daily" style="margin:0 auto;width:250px;height:100%;padding:4px;border:0px solid lightgray;">'+ 
        '<span style="float:left;width:40%;height:100%;padding:3px 0 0 0;font-size:14px;font-weight:bold;background:none;">DTR Month of:</span>'+ 
        '<input id="date_dtr" style="width:60%;height:100%;" onchange="chg_dtr_month(this.value)" type="month" value="'+JBE_DATE_FORMAT(CURR_DATE,'YYYY-MM')+'"  placeholder="Date" />'+       
      '</div>'+

    '</div>'+   

    '<div style="width:100%;height:'+pa_height+'px;border:1px solid lightgray;overflow:auto;padding:10px 0 10px 0;background:lightgray;">'+     
      '<div id="dv_ret_dtr" style="margin:0 auto;width:360px;height:745px;padding:5px;border:0px solid cyan;background:white;">'+
          ret_dtr(JBE_DATE_FORMAT(CURR_DATE,'YYYY-MM'),false)+
      '</div>'+
    '</div>'+
        
  '</div>';
  
  JBE_OPEN_VIEW(dtl,'My DTR','showMainPage');       
  querySel_dtr();
  
  disp_month(JBE_DATE_FORMAT(CURR_DATE,'YYYY-MM'));
  disp_user_time(JBE_DATE_FORMAT(CURR_DATE,'YYYY-MM'),false);
}

function disp_user_time(vDate,f){
  let str=vDate.split('-');
  let numDays = (y, m) => new Date(y, m, 0).getDate();
  let max_days=numDays(str[0], str[1]);
  let vDate2=vDate+'-01';
  let ctr=0;
  
  for(var i=0;i<DB_DAILY.length;i++){
    if(DB_DAILY[i].usercode != CURR_USER){ continue; }

    //let curdate=JBE_DATE_FORMAT(vDate2,'YYYY-MM');
    let curdate=vDate;
    let v_date=JBE_DATE_FORMAT(DB_DAILY[i].date,'YYYY-MM');
    let v_txt=DB_DAILY[i].txt;

    //console.log(CURR_USER+' - '+ctr+':: vdate:'+v_date+' vs curdate:'+curdate);
    
    if(v_date != curdate){ continue; }

    ctr++;
    //console.log(ctr+':: vdate:'+v_date+' vs curdate:'+curdate);
          
    let vdate=JBE_DATE_FORMAT(DB_DAILY[i].date,'YYYY-MM-DD');
    let vday=parseInt(vdate.substring(8,10));  
    
    //*** CHECK IF NON WORKING DAY */    
    let f_nowork=parseInt(document.getElementById('dtl_'+vday).getAttribute('data-work'));
    console.log(f_nowork);
    if( f_nowork != -1){
      document.getElementById('dtl_xx_'+vday).style.display='none';
    }
    
    //document.getElementById('dtl_ymd'+'_'+vday).innerHTML=vdate;
    if(DB_DAILY[i].time1){ document.getElementById('dtl_t1'+'_'+vday).innerHTML=DB_DAILY[i].time1.replace(/^0+/, "")+iif(f,' am',''); }
    if(DB_DAILY[i].time2){ document.getElementById('dtl_t2'+'_'+vday).innerHTML=DB_DAILY[i].time2.replace(/^0+/, "")+iif(f,' pm',''); }   
    if(DB_DAILY[i].time3){ document.getElementById('dtl_t3'+'_'+vday).innerHTML=DB_DAILY[i].time3.replace(/^0+/, "")+iif(f,' pm',''); }
    if(DB_DAILY[i].time4){ document.getElementById('dtl_t4'+'_'+vday).innerHTML=DB_DAILY[i].time4.replace(/^0+/, "")+iif(f,' pm',''); }   
    
    //console.log('====>>> Day '+vdate);
    let vtop=parseInt(DB_DAILY[i].txt_top);
    //if(f){ vtop-5 };
    document.getElementById('dtl_txt'+vday).innerHTML=v_txt;
    document.getElementById('dtl_txt'+vday).style.display='none';
    let dtl_txt_top=parseInt(vtop)+'px';
    let dtl_txt_left=parseInt(DB_DAILY[i].txt_left)+'px';
    let dtl_txt_width=parseInt(DB_DAILY[i].txt_width)+'px';
    let dtl_txt_fsize=parseInt(DB_DAILY[i].txt_fsize)+'px';
    document.getElementById('dtl_txt_top_'+vday).innerHTML=dtl_txt_top;
    document.getElementById('dtl_txt_left_'+vday).innerHTML=dtl_txt_left;
    document.getElementById('dtl_txt_width_'+vday).innerHTML=dtl_txt_width;
    document.getElementById('dtl_txt_fsize_'+vday).innerHTML=dtl_txt_fsize;

    if(v_txt){ 
      document.getElementById('dtl_txt'+vday).style.textAlign='left';
      document.getElementById('dtl_txt'+vday).style.display='block'; 
      document.getElementById('dtl_txt'+vday).style.top=dtl_txt_top;
      document.getElementById('dtl_txt'+vday).style.left=dtl_txt_left;
      document.getElementById('dtl_txt'+vday).style.width=dtl_txt_width;
      document.getElementById('dtl_txt'+vday).style.fontSize=dtl_txt_fsize;
    }

  }
  if(f){ ctr=0; }
  document.getElementById('div_total').innerHTML=ctr;
}

function chg_dtr_month(v){
  //alert('jbe: '+v);
  document.getElementById('dv_ret_dtr').innerHTML=ret_dtr(v,false);
  querySel_dtr();
  //disp_month(JBE_DATE_FORMAT(v,'YYYY-MM'));
  disp_month(v);
  disp_user_time(v,false);
}
function ret_weekend(myDate){
  var myDate = new Date();
  if(myDate.getDay() == 6){ return 'Saturday'; }
  if(myDate.getDay() == 0){ return 'Sunday'; }
}

function close_fm_dtr(){
  //JBE_CLOSE_VIEW();
  showMainPage();
  //mnu_main_repo();
}

function mnu_fm_dtr(){
  var jmenu=
    '<div style="width:100%;height:100%;">'+
      '<div onclick="refresh_dtr()" style="float:left;width:25%;height:100%;background:none;">'+
        '<div class="class_footer">'+
          '<img src="gfx/jrefresh.png" alt="call image" />'+
          '<span>Refresh</span>'+
        '</div>'+
      '</div>'+       
      '<div style="float:left;width:50%;height:100%;padding:12px 0 0 0;text-align:center;background:none;">'+
        'DTR File Maintenance'+
      '</div>'+
      '<div onclick="showMainPage()" style="float:right;width:25%;height:100%;background:none;">'+
        '<div class="class_footer">'+
          '<img src="gfx/jclose.png"  alt="home image" />'+
          '<span>Close</span>'+
        '</div>'+
      '</div>'+
    '</div>';
  dispMenu(false,jmenu);
}

function refresh_dtr(){
  ref_ctr(false);
  snackBar(`Refreshed...`);
}
 
function print_back(){
  //alert('rp_dtr');
  /*
  window.history.pushState({ noBackExitsApp: true }, '');
  f_MainPage=false;
  var repTilt='';
  */
  document.getElementById('back_view2').style.display='none';
  document.getElementById('cap_viewMid2').innerHTML='';
  
  let pa_height=H_VIEW-30;
  if(JBE_MOBILE){ pa_height=H_VIEW-30; }

  let dtl=
  '<div id="dv_dtr2" data-maxdays=0 data-print=1 style="height:100%;width:100%;font-family:Arial Narrow,Arial,sans-serif;font-size:12px;padding:10px;border:0px solid lightgray;background:white;">'+

    '<div id="printableBorder2" style="height:'+pa_height+'px;">'+    
      '<div id="printableArea2" style="width:705px;">'+
        '<div id="pa_dtl2">'+
        '</div>'+
      '</div>'+
    '</div>'+
      
  '</div>';

  JBE_OPEN_VIEW(dtl,'Print BACK PAGE','');
  mnu_repo2();
  let unod=
  '<div style="width:100%;height:1100px;margin-top:0px;font-size:14px;padding:0px;border:0px solid green;">'+  
    '<div id="dtr_b1" style="float:left;width:auto;height:800px;border:0px solid black;"></div>'+
    '<div id="dtr_b2" style="float:right;width:auto;height:800px;border:0px solid black;"></div>'+
  '</div>';
  document.getElementById('pa_dtl2').innerHTML=unod;
  ret_back_page();  
}

function ret_back_page(){
  let dtl=
  '<div style="width:320px;height:1100px;font-family:Times New Roman, Times, serif, sans-serif; font-size:14px; font-weight:bold; text-align:left;border:0px solid gold;">'+

    '<div style="height:60px;padding:10px;font-size:18px;text-align:center; text-decoration-line:underline;background:none;">I N S T R U C T I O N S</div>'+

    '<div style="text-indent:20px;">'+
      "Civil Service Form No. 48, after completion, should be filed in the records of the Bureau or Office which submits the monthly report on Civil Service Form No. 3 to the Bureau of Civil Service."+
    '<div>'+
    '<div style="text-indent:20px;">'+
      "In lieu of the above, court interpreters and stenographers who accompany the judges of the Court of First Instance will fill out the daily time reports on this form in triplicate, after which they should be approved by the judge with whom service has been rendered, or by an officer of the Department of Justice authorized to do so.  The original should be forwarded promptly after the end of the month to the Bureau of Civil Service, thru the Department of Justice, the duplicate to be kept in the Department of Justice; and the triplicate, in the office of the Clerk of Court where service was rendered."+
    '<div>'+
    '<div style="text-indent:20px;">'+
      'In the space provided for the purpose on the other side will be indicated the office hours the employee is required to observe, as for example, "Regular days, 8:00 to 12:00 and 1:00 to 4:00; Saturdays 8:00 to 1:00."'+
    '<div>'+
    '<div style="text-indent:20px;">'+
      'Attention is invited to paragraph 3, Civil Service Rule XV, Executive Order No. 5, series of 1909, which reads as follows:'+
    '<div>'+
    '<div style="text-indent:20px;">'+
      '"Each chief of a Bureau or Office shall require a daily record of attendance of all the officers and employees under him entitled to leave or absence or vacation (including teachers) to be kept on the proper form and also a systematic office record showing for each day all absences from duty from any cause whatever.  At the beginning of each month he shall report to the Commissioner on the proper form of all absences from any cause whatever, including the exact amount of undertime of each person for each day.  Officers or employees serving in the field or on the water need not be required to keep a daily record, but all absences of such employees must be included in the monthly report of changes and absences.  Falsification of time records will render the offending officers or employee liable to summary removal from the service and criminal prosecution.'+
    '<div>'+

    '<div style="margin-top:20px;text-indent:20px;">'+
      '<div style="margin-top:20px;width:100%;height:10px;border-bottom:2px solid black;"></div>'+
      '<div style="margin-top:2px;font-weight:normal;font-style:italic;font-size:13px;padding:5px;">'+
        '(NOTE - A record made from memory at sometime subsequent to the occurrence of as event is not reliable. Non observance of office hours deprives the employee of the leave privileges although he may have rendered overtime service. '+
        'Where sservice rendered outside of the Office for the whole morning or afternoon, notation to that effect should be made clearly.)'+
      '<div>'+
    '<div>'+

    '<div style="margin-top:30px;width:100%;height:auto;font-style:normal;background:violet;">'+
      '<div style="float:right;width:200px;height:100px;text-align:center;border:0px solid red;background:none;">'+
        '<div style="width:100%;height:20%;">'+
          '<img style="height:100%;" src="gfx/choAdmin.png" />'+
        '</div>'+
        '<div style="width:100%;height:80%;padding:0px;">CHO-Admin</div>'+
      '</div>'+
    '<div>'+

  '</div>';
  //return dtl;
  dtr_b1.innerHTML=dtl;
  dtr_b2.innerHTML=dtl;
}

//‐-------
function edit_dtr(row,f_print){
  //alert('edit_dtr');
  let max_days=document.getElementById('dv_dtr').getAttribute('data-maxdays');
  if(row > max_days){ return; }
  //alert(row+' max:'+max_days);
  let v_date=document.getElementById('dtl_ymd_'+row).innerHTML;
  
  let v_work=document.getElementById('dtl_'+row).getAttribute('data-work');
  if(f_print){ return; }

  var tilt='Edit DTR';
  //////////////////////////////////////////////////////////////
  let orec=document.getElementById('dtl_dtr').getAttribute('data-rec');
  if(orec==0){ orec=1; }
  console.log('orec:'+orec);
  //document.getElementById('dtl_'+orec).style.backgroundColor='white';
  document.getElementById('dtl_'+row).style.backgroundColor=JBE_CLOR4;
  document.getElementById('dtl_dtr').setAttribute('data-rec',row);
  //////////////////////////////////////////////////////////////

  let v_work_stat=JBE_GETFLD('workstat',ob_work,'workcode',v_work);
  let v_work_bg=JBE_GETFLD('work_bg',ob_work,'workcode',v_work);
 
  let t1=JBE_FORMAT_TIME(document.getElementById('dtl_t1_'+row).innerHTML);
  let t2=JBE_FORMAT_TIME(document.getElementById('dtl_t2_'+row).innerHTML);
  let t3=JBE_FORMAT_TIME(document.getElementById('dtl_t3_'+row).innerHTML);
  let t4=JBE_FORMAT_TIME(document.getElementById('dtl_t4_'+row).innerHTML);
  //console.log(t1,t2,t3,t4);
  let txt=document.getElementById('dtl_txt'+row).innerHTML;
  let dtl_txt_top=parseInt(document.getElementById('dtl_txt_top_'+row).innerHTML);
  let dtl_txt_left=parseInt(document.getElementById('dtl_txt_left_'+row).innerHTML);
  let dtl_txt_width=parseInt(document.getElementById('dtl_txt_width_'+row).innerHTML);
  let dtl_txt_fsize=parseInt(document.getElementById('dtl_txt_fsize_'+row).innerHTML);

  let disp_txt='block';
  let vheight=163;
  if(!txt){ disp_txt='none'; vheight=98; }
  var dtl=       
    '<div id="div_edit_dtr" style="width:100%;height:'+vheight+'px;text-align:center;padding:0px;background-color:none;">'+
     
        '<div style="width:100%;height:40px;color:black;margin-top:0px;font-size:12px;font-weight:bold;padding:0px;border:0px solid black;background:none;">'+
          '<div style="float:left;width:12%;height:100%;margin-right:1%;padding:6px 0 0 0;font-size:12px;font-weight:bold;color:white;background:'+JBE_CLOR+';">DAY<br>'+row+'</div>'+      
          '<input id="inp_t1" type="time" onchange="chg_time(this.id,this.value)" style="float:left;width:21%;height:100%;font-size:18px;font-weight:bold;pointer-events:auto;text-align:center;margin-right:1%;" value="'+t1+'" />'+
          '<input id="inp_t2" type="time" onchange="chg_time(this.id,this.value)" style="float:left;width:21%;height:100%;font-size:18px;font-weight:bold;pointer-events:auto;text-align:center;margin-right:1%;" value="'+t2+'" />'+
          '<input id="inp_t3" type="time" onchange="chg_time(this.id,this.value)" style="float:left;width:21%;height:100%;font-size:18px;font-weight:bold;pointer-events:auto;text-align:center;margin-right:1%;" value="'+t3+'" />'+
          '<input id="inp_t4" type="time" onchange="chg_time(this.id,this.value)" style="float:left;width:21%;height:100%;font-size:18px;font-weight:bold;pointer-events:auto;text-align:center;" value="'+t4+'" />'+
        '</div>'+

        '<div id="box_hd" style="display:'+disp_txt+';width:100%;height:20px;color:black;margin-top:5px;padding:5px;text-align:center;border:1px solid black;color:white;background:black;">'+
          //'<div style="float:left;width:10%;height:100%;margin-right:1%;padding:6px 0 0 0;font-size:12px;font-weight:bold;color:white;background:none;">Text :</div>'+                
          '<div style="float:left;width:56%;height:100%;margin-right:1%;">Text</div>'+
          '<div style="float:left;width:10%;height:100%;margin-right:1%;">Top</div>'+
          '<div style="float:left;width:10%;height:100%;margin-right:1%;">Left</div>'+
          '<div style="float:left;width:10%;height:100%;margin-right:1%;">Width</div>'+
          '<div style="float:left;width:10%;height:100%;margin-right:0%;">Size</div>'+
        '</div>'+

        '<div id="box_txt" style="display:'+disp_txt+';width:100%;height:40px;color:black;margin-top:0px;padding:5px;text-align:center;border:1px solid black;background:black;">'+
          //'<div style="float:left;width:10%;height:100%;margin-right:1%;padding:6px 0 0 0;font-size:12px;font-weight:bold;color:white;background:none;">Text :</div>'+                
          '<input id="inp_txt" type="text" style="float:left;width:56%;height:100%;margin-right:1%;" value="'+txt+'" placeholder="Text Here" />'+
          '<input id="inp_txt_top" type="number" style="float:left;width:10%;height:100%;text-align:center;margin-right:1%;" value="'+dtl_txt_top+'" placeholder="Top" />'+
          '<input id="inp_txt_left" type="number" style="float:left;width:10%;height:100%;text-align:center;margin-right:1%;" value="'+dtl_txt_left+'" placeholder="Left" />'+
          '<input id="inp_txt_width" type="number" style="float:left;width:10%;height:100%;text-align:center;margin-right:1%;" value="'+dtl_txt_width+'" placeholder="Width" />'+
          '<input id="inp_txt_fsize" type="number" style="float:left;width:10%;height:100%;text-align:center;margin-right:0%;" value="'+dtl_txt_fsize+'" placeholder="Size" />'+
        '</div>'+
       
        '<div style="width:100%;height:40px;color:black;margin-top:5px;padding:10px;text-align:left;border:2px solid black;color:black;background:none;">'+
          new Date(v_date).toLocaleString('en-us', {weekday:'long'})+' - ('+v_work_stat+')'+
        '</div>'+
     
    '</div>';

  var dtl2=   
    '<div style="width:100%;height:100%;text-align:center;color:'+JBE_TXCLOR1+';background:none;">'+
      '<div style="width:100%;height:100%;">'+      
        '<div onclick="save_dtr('+row+','+v_work+')" style="float:left;width:25%;height:100%;background:none;">'+
          '<div class="class_footer">'+
            '<img src="gfx/jsave.png"  alt="home image" />'+
            '<span>Save</span>'+
          '</div>'+
        '</div>'+
        '<div onclick="clear_dtr_entry('+row+')" style="float:left;width:25%;height:100%;background:none;">'+
          '<div class="class_footer">'+
            '<img src="gfx/jdele.png"  alt="home image" />'+
            '<span>Clear</span>'+
          '</div>'+
        '</div>'+
        '<div id="id_clk_text" onclick="clk_text('+row+')" style="display:'+iif(txt,'none','block')+';float:left;width:25%;height:100%;background:none;">'+
          '<div class="class_footer">'+
            '<img src="gfx/jcategory.png"  alt="home image" />'+
            '<span>Text</span>'+
          '</div>'+
        '</div>'+
        '<div style="float:right;width:25%;height:100%;background:none;">'+
          '<div onclick="JBE_CLOSEBOX()" class="class_footer">'+
            '<img src="gfx/jclose.png"  alt="home image" />'+
            '<span>Close</span>'+
          '</div>'+
        '</div>'+
      '</div>';  
    '</div>';

  JBE_OPENBOX('div_edit_dtr',tilt,dtl,dtl2,'close_edit_dtr');
  let f_empty=chk_dtr_dtl_empty(row);
  //alert('f_empty: '+f_empty);
  //if(chk_dtr_dtl_empty(row)){  
  if(f_empty){  
    let ary=ret_clocks();
    for(var i=1;i<=4;i++){
       document.getElementById('inp_t'+i).value=ary[(i-1)];
       console.log(ary[(i-1)]+'\n');
    }    
  }
  /*
  let o_work=document.getElementById('dtl_'+orec).getAttribute('data-work');  
  v_work_bg=JBE_GETFLD('work_bg',ob_work,'workcode',o_work);
  //alert(v_work_bg);
  //document.getElementById('dtl_'+orec).style.backgroundColor=v_work_bg;
  */
  if(orec != row){
    //alert(orec);
    document.getElementById('dtl_'+orec).style.backgroundColor='white';  
  }
}

function clk_text(row){
  document.getElementById('box_txt').style.display='block';
  document.getElementById('dtl_jbox').style.height='163px';
  document.getElementById("myJBox_main").style.height='217px';
}
