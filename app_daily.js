
function fm_daily(){  
  //snackBar('Under construction... -JBE');
  //return;

  if(!JBE_CHK_USER(0)){ 
    speakText("Please Log-In. Thank you.");
    return; 
  }
  
  let tilt='Time In';
  let f_found=false;
  let v_date=new Date();  
  let minutos = v_date.getMinutes().toString().padStart(2, '0');
  v_date=JBE_DATE_FORMAT(v_date,'YYYY-MM-DD');

  ary=ret_clocks();
  ary=[];
  let v_time1=ary[0];
  let v_time2=ary[1];
  let v_time3=ary[2];
  let v_time4=ary[3];
  
  let v_save='TIME IN';
  let bgsave='white';

  DB_DAILY.sort(JBE_SORT_ARRAY(['time1']));
  var dtl=     
    '<div id="div_timeIN" style="width:100%;height:230px;text-align:center;padding:0px;background-color:white;">'+
      //'<div id="div_date" style="display:none;">'+v_date+'</div>'+
      //  '<div id="dtls_timeIN" style="display:none;width:100%;height:'+(H_BODY-260)+'px;overflow:auto;text-align:center;padding:0px;border:1px solid black;">'+
      //'</div>'+
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
  show_daily(v_date,v_time1,v_time2,v_time3,v_time4);
}

function show_daily(v_date,v_time1,v_time2,v_time3,v_time4){
  let f_found=false;
  DB_DAILY.sort(JBE_SORT_ARRAY(['time1']));
  dtl='';
  let v_save='Save';
  let bgsave='red';
  let sv_last=v_time1;
  let ctr=0;
  for(var i=0;i<DB_DAILY.length;i++){
    if(JBE_DATE_FORMAT(DB_DAILY[i].date,'YYYY-MM-DD') != v_date){ continue; }
    
    let v_username=JBE_GETFLD('username',DB_USER,'usercode',DB_DAILY[i].usercode);
    let v_color='black';
    ctr++;
    
    if(DB_DAILY[i].usercode==CURR_USER){
      f_found=true;
      v_color='red';
      v_time1=DB_DAILY[i].time1;
      v_time2=DB_DAILY[i].time2;
      v_time3=DB_DAILY[i].time3;
      v_time4=DB_DAILY[i].time4;
      v_save='Save';
      bgsave='white';
      inp_time1.setAttribute('data-otime1',v_time1);
    }
      
    sv_last=DB_DAILY[i].time1;
    dtl+=
      '<div style="width:100%;height:40px;margin-top:5px;padding:5px;text-align:left;font-size:12px;color:'+v_color+';background-color:'+JBE_CLOR2+';">'+
        '<div style="float:left;width:5%;height:100%;padding:8px 0 0 0px;text-align:right;">'+ctr+'. </div>'+
        '<div style="float:left;width:35%;height:100%;padding:8px 0 0 5px;">'+v_username+'</div>'+
        '<div style="float:left;width:30%;height:100%;padding:8px 0 0 5px;">'+DB_DAILY[i].time1+'</div>'+
      '</div>';        
  }
   /*
  if(!f_found){ 
    let oras = sv_last.split(':');
    let hh = oras[0].padStart(2, '0');
    let mm = oras[1].padStart(2, '0');
    
    let xhh=Number(hh);
    let xmm=Number(mm)+1;
    if(xmm==60){ 
      xmm=1;  xhh++;
      if(xhh > 12){ xhh=1; }
    }
    v_time1=xhh.toString().padStart(2, '0')+':'+xmm.toString().padStart(2, '0');
  }
  */
  //alert('v_time1:'+v_time1);        
  //dtls_timeIN.innerHTML=dtl;
  btn_save.value=v_save;
  btn_save.style.backgroundColor=bgsave;
  btn_save.setAttribute('data-found',f_found);
  inp_time1.value=v_time1;
  inp_time2.value=v_time2;
  inp_time3.value=v_time3;
  inp_time4.value=v_time4;
  
  //let hour = new Date().getHours();
  //let msg="Good " + (hour<12 && "Morning" || hour<18 && "Afternoon" || "Evening"); 
  //msg = msg+' '+CURR_NAME2+"!"; 
  //alert('sv_last:'+sv_last);
  let msg="Please enter your time in today.";  
  if(f_found){ msg="Time Edit is activated."; }
  speakText(msg); 
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
  alert('save_daily row: '+row);
  let otime1=inp_time1.getAttribute('data-otime1');
  let time1=format_12(document.getElementById('inp_time1').value);
  
  //if(!time1){ speakText("Invalid Entry: Please enter the correct time."); inp_time1.focus(); return; }

  //console.log('time1:'+time1+' otime1:'+otime1+'  f_found:'+f_found);
  //if((time1==otime1)){ speakText('Time unchanged.');JBE_CLOSEBOX(); return; }
  
  let time2=document.getElementById('inp_time2').value;
  let time3=document.getElementById('inp_time3').value;
  let time4=document.getElementById('inp_time4').value; 
  save_entry(row,v_date,CURR_USER,time1, time2, time3, time4);
  let msg="Congratulations! You're time entries are saved.";
  if(f_found){    
    msg="Time changed successfully!";
  }
  console.log(msg);
  speakText(msg);
}
