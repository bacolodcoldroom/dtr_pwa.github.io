
function fm_daily(){  
  //snackBar('Under construction... -JBE');
  //return;

  if(!JBE_CHK_USER(0)){ 
    speakText("Please Log-In.");
    return; 
  }
  
  let tilt='Time In';
  let f_found=false;
  let v_date=JBE_DATE_FORMAT(new Date(),'YYYY-MM-DD');
  let v_date2=JBE_DATE_FORMAT(v_date,'YYYY-MM');
  let row=Number(v_date.substring(8));

  let aryDAILY=JBE_GETARRY2(DB_DAILY,[
    { "fld":"usercode","val":CURR_USER },
    { "fld":"date","val":v_date2 },
    { "fld":"row","val":row }
  ]); 
  console.log('>>>> times :',aryDAILY);

  let v_time1=format_12(aryDAILY.time1);
  let v_time2=format_12(aryDAILY.time2);
  let v_time3=format_12(aryDAILY.time3);
  let v_time4=format_12(aryDAILY.time4);
  
  let v_save='TIME IN';
  let bgsave='white';

  //DB_DAILY.sort(JBE_SORT_ARRAY(['time1']));
  var dtl=     
    '<div id="div_timeIN" style="width:100%;height:230px;text-align:center;padding:0px;background-color:white;">'+

      '<div style="width:100%;height:100%;padding:10px;border:1px solid gray;">'+
    
        '<div style="margin:0 auto;width:80%;height:85px;margin-top:10px;border:1px solid '+JBE_CLOR+';color:white;font-size:11px;background:'+JBE_CLOR4+';">'+  
          '<div style="width:100%;height:30%;margin-top:0px;padding:3px;font-size:16px;font-weight:bold;background:'+JBE_CLOR+';">AM</div>'+
          '<div style="width:100%;height:70%;margin-top:0px;padding:0px;background:none;">'+
            '<div style="float:left;width:50%;height:100%;margin-top:0px;padding:5px;border:0px solid gold;">'+
              '<div style="float:left;width:100%;height:100%;margin-top:0px;text-align:center;padding:0px;border:0px solid red;background:'+JBE_CLOR+';">'+
                '<div style="width:100%;height:30%;margin-top:0px;padding:2px;background:none;">Arrival</div>'+
                '<div style="width:100%;height:70%;margin-top:0px;padding:2px;background:none;">'+
                  '<input id="inp_time1" type="time" onchange="chg_time(this.id,this.value)" data-otime1="" style="width:100%;height:100%;text-align:center;padding:5px;" value="'+v_time1+'" />'+
                '</div>'+   
              '</div>'+   
            '</div>'+
            '<div style="float:left;width:50%;height:100%;margin-top:0px;padding:5px;border:0px solid gold;">'+
              '<div style="float:left;width:100%;height:100%;margin-top:0px;text-align:center;padding:0px;border:0px solid red;background:'+JBE_CLOR+';">'+
              '<div style="width:100%;height:30%;margin-top:0px;padding:2px;background:none;">Departure</div>'+
              '<div style="width:100%;height:70%;margin-top:0px;padding:2px;background:none;">'+
                '<input id="inp_time2" type="time" style="pointer-events:auto;width:100%;height:100%;text-align:center;padding:5px;" value="'+v_time2+'" />'+
              '</div>'+   
            '</div>'+    
            '</div>'+
          '</div>'+   
        '</div>'+

        '<div style="margin:0 auto;width:80%;height:85px;margin-top:10px;border:1px solid '+JBE_CLOR+';color:white;font-size:11px;background:'+JBE_CLOR3+';">'+  
          '<div style="width:100%;height:30%;margin-top:0px;padding:3px;font-size:16px;font-weight:bold;background:'+JBE_CLOR+';">PM</div>'+
          '<div style="width:100%;height:70%;margin-top:0px;padding:0px;background:none;">'+
            '<div style="float:left;width:50%;height:100%;margin-top:0px;padding:5px;border:0px solid gold;">'+
              '<div style="float:left;width:100%;height:100%;margin-top:0px;text-align:center;padding:0px;border:0px solid red;background:'+JBE_CLOR+';">'+
                '<div style="width:100%;height:30%;margin-top:0px;padding:2px;background:none;">Arrival</div>'+
                '<div style="width:100%;height:70%;margin-top:0px;padding:2px;background:none;">'+
                  '<input id="inp_time3" type="time" style="pointer-events:auto;width:100%;height:100%;text-align:center;padding:5px;" value="'+v_time3+'" />'+
                '</div>'+   
              '</div>'+   
            '</div>'+
            '<div style="float:left;width:50%;height:100%;margin-top:0px;padding:5px;border:0px solid gold;">'+
              '<div style="float:left;width:100%;height:100%;margin-top:0px;text-align:center;padding:0px;border:0px solid red;background:'+JBE_CLOR+';">'+
              '<div style="width:100%;height:30%;margin-top:0px;padding:2px;background:none;">Departure</div>'+
              '<div style="width:100%;height:70%;margin-top:0px;padding:2px;background:none;">'+
                '<input id="inp_time4" type="time" style="pointer-events:auto;width:100%;height:100%;text-align:center;padding:5px;" value="'+v_time4+'" />'+
              '</div>'+   
            '</div>'+    
            '</div>'+
          '</div>'+   
        '</div>'+

      '</div>'+
    '</div>';
    var dtl2=     
    '<div style="width:100%;height:100%;padding:0px 0 0 0;text-align:center;color:'+JBE_TXCLOR1+';background:none;">'+
      '<input type="button" id="btn_save" data-found=false value="Save" onclick="save_daily()" style="float:left;width:80px;height:100%;border-radius:10px;background:'+bgsave+';"/>'+
      '<input type="button" value="Cancel" onclick="JBE_CLOSEBOX()" style="float:right;width:80px;height:100%;border-radius:10px;background:white;"/>'+      
    '</div>';  

  let formatter = Intl.DateTimeFormat(
    "default", // a locale name; "default" chooses automatically
    {
      weekday: "short", 
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric"
    }
  );
  tilt=formatter.format(new Date());
  JBE_OPENBOX('div_timeIN',tilt,dtl,dtl2);
  console.log(v_date,v_time1,v_time2,v_time3,v_time4);
  //show_daily(v_date,v_time1,v_time2,v_time3,v_time4);
}

function chg_time(id,v){  
  v=format_12(v);
  //if(id=='inp_t2' && v > '12:30'){ snackBar('error'); document.getElementById(id).focus(); return; }  
  //if(id=='inp_t3' && v < '12:31'){ snackBar('error'); document.getElementById(id).focus(); return; }  
  document.getElementById(id).value=v;
}
  
function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function save_daily(){
  f_found=btn_save.getAttribute('data-found');
  let v_date=JBE_DATE_FORMAT(new Date(),'YYYY-MM-DD');
  let row=parseInt(v_date.substring(8,10));
  v_date=v_date.substring(0,7);
  //alert(v_date.substring(0,7)+' :::save_daily row: '+row);
  let time1=format_12(document.getElementById('inp_time1').value);  
  let time2=format_12(document.getElementById('inp_time2').value);
  let time3=format_12(document.getElementById('inp_time3').value);
  let time4=format_12(document.getElementById('inp_time4').value); 
  let dtl_txt='';
  let dtl_txt_top=0;
  let dtl_txt_left=0;
  let dtl_txt_width=100;
  let dtl_txt_fsize=11;
  //check t2 and t3 ////////////////////////////
  if(time2 && time2 > '12:30'){ 
    MSG_SHOW(vbOk,"ERROR: AM Departure Time","<center>Allowed time is less than or equal to 12:30 pm.</center>",function(){ document.getElementById('inp_time2').focus(); },function(){});    
    return; 
  }
  if(time3 && time3 < '12:31'){ 
    //snackBar('ERROR: PM Arrival Time: '+aryTime[2]); 
    MSG_SHOW(vbOk,"ERROR: PM Arrival Time","<center>Time should be greater than 12:30</center>",function(){ document.getElementById('inp_time3').focus(); },function(){});    
    return; 
  }
  //////////////////////////////////////  
  save_entry(row,v_date,CURR_USER,time1, time2, time3, time4,dtl_txt,dtl_txt_top,dtl_txt_left,dtl_txt_width,dtl_txt_fsize);
  JBE_CLOSEBOX();
  let msg="Congratulations! You're time entries are saved.";
  if(f_found){    
    msg="Time changed successfully!";
  }
  console.log(msg);
  speakText(msg);
}
