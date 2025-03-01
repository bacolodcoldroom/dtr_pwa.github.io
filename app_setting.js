function fm_setting(){
  window.history.pushState({ noBackExitsApp: true }, '');
  f_MainPage=false;
  var jmode=0;
  var repTilt='SETTINGS';
    
  document.getElementById('back_view1').style.display='none';  
  //document.getElementById('cap_viewMid2').innerHTML=repTilt;
  let pa_height=H_VIEW-30;
  let h_head=40;
  if(JBE_MOBILE){ pa_height=H_VIEW-30;h_head=80; }

  //alert('CURR_DATE:'+JBE_DATE_FORMAT(CURR_DATE,'YYYY-MM-DD'));

  let dtl=  
  '<div  data-mode='+jmode+' data-opt=0 style="height:100%;width:100%;font-family:Arial Narrow,Arial,sans-serif;font-size:12px;padding:10px;border:0px solid lightgray;background:white;">'+

    '<div style="height:35px;width:100%;text-align:center;padding:5px;font-size:16px;border:1px solid lightgray;color:white;background:'+JBE_CLOR+';">'+   
      'SETTINGS'+
    '</div>'+    

    '<div style="width:100%;height:'+pa_height+'px;padding:10px;border:1px solid lightgray;">'+      

      '<div class="cls_title0" style="width:100%;font-size:16px;padding:5px;margin-top:30px;text-align:center;border-radius:0px;border:1px solid black;background:none;">'+      
        '<div class="cls_title">'+        
          '<span>Current DTR Month: </span>'+
          '<input id="inp_curdate" type="month" onchange="disp_setting(this.value);toggle_setting(false);mnu_edit_setting();" value=""/>'+
        '</div>'+
        '<div class="cls_title">'+                
          '<span>DTR Title: </span>'+
          '<input id="inp_title" type="text" value=""/>'+        
        '</div>'+
      '</div>'+
      
      '<div style="width:100%;height:40px;font-size:16px;padding:10px 0 0 0;margin-top:30px;text-align:center;border-radius:0px;border:0px solid black;background:'+JBE_CLOR+';">'+      
        '<span style="width:100%;height:100%;padding:10px;">H O L I D A Y S</span>'+        
      '</div>'+
      '<div style="width:100%;height:auto;font-size:16px;padding:0px 0 0 0;margin-top:0px;text-align:center;border-radius:0px;border:1px solid lightgray;background:none;">'+ 

        '<div id="div_dtl" style="width:100%;height:250px;padding:5px;margin-top:0px;overflow:auto;text-align:center;border:0px solid lightgray;">'+
        '</div>'+        

        '<div id="div_dtl2" style="width:100%;height:45px;font-size:16px;padding:0px 0 0 0;margin-top:0px;text-align:center;border-radius:0px;border:1px solid lightgray;background:'+JBE_CLOR2+';">'+
          
        '</div>'+

      '</div>'+  

    '</div>'+
        
  '</div>';
  
  JBE_OPEN_VIEW(dtl,'SETTING','closeSETTING');  
  
  inp_curdate.value=JBE_DATE_FORMAT(CURR_DATE,'YYYY-MM');
  disp_setting(CURR_DATE);
}

function disp_setting(vdate){
  //let vdate2=JBE_DATE_FORMAT(vdate,'YYYY-MM-DD');
  //alert('disp_setting:'+vdate);
  //inp_curdate.value=JBE_DATE_FORMAT(CURR_DATE,'YYYY-MM');
  let dtl='';
  let lctr=0;
  let cur_date=JBE_DATE_FORMAT(vdate,'YYYY-MM');
  for(var j=0;j<DB_MONTHLY.length;j++){
    let mon_date=JBE_DATE_FORMAT(DB_MONTHLY[j].date,'YYYY-MM');    
    if(mon_date != cur_date){ continue; }

    lctr++;
    
    dtl+=
          '<div id="dv_main_dtl_'+lctr+'" class="dtls" style="display:block;width:100%;height:45px;padding:5px;font-size:16px;margin-top:0px;text-align:center;border:1px solid darkgray;">'+
            '<span style="float:left;width:10%;padding:6px;">'+lctr+'.) </span>'+
            '<span id="lbl_date'+lctr+'" style="float:left;width:55%;height:100%;padding:6px 0 0 0;margin-top:0px;">'+JBE_DATE_FORMAT(DB_MONTHLY[j].date,'MM-DD-YYYY')+'</span>'+            
            '<input id="btn_del'+lctr+'" type="image" src="gfx/jdele.png" onclick="del_holiday('+lctr+')" style="display:none;float:right;width:auto;height:100%;text-align:center;padding:2px;margin-left:5px;border:1px solid black;background:none;" />'+
            '<input id="btn_edit'+lctr+'" type="image" src="gfx/jedit.png" onclick="add_holiday(false,'+lctr+')" style="display:none;float:right;width:auto;height:100%;text-align:center;padding:2px;border:1px solid black;background:none;" />'+
          '</div>';
   }
   document.getElementById('div_dtl').innerHTML=dtl;
   let dtl2='<div style="width:100%;height:100%;padding:10px 0 0 0;margin-top:0px;background:none;">Version 1.01</div>';
   document.getElementById('div_dtl2').innerHTML=dtl2;
   toggle_setting(true);
   mnu_setting();
}
//
function add_holiday(f_add,row){  
  //false::edit mode  
  let dval=JBE_DATE_FORMAT(document.getElementById('inp_curdate').value+'-01','YYYY-MM-DD');
  let lctr=row;  
  let bg=JBE_CLOR3;
  if(f_add){ 
    lctr=document.querySelectorAll('.dtls').length+1;  
    bg='violet'; 
  }else{
    lctr=row;
    dval=JBE_DATE_FORMAT(document.getElementById('lbl_date'+lctr).innerHTML,'YYYY-MM-DD');
  }
  
  let dtl=
  '<div style="width:100%;height:100%;padding:5px;font-size:16px;margin-top:0px;text-align:center;border:1px solid darkgray;background:'+bg+';">'+
    '<span style="float:left;width:10%;padding:2px;">'+lctr+'.) </span>'+
    '<input id="inp_date" type="date" style="float:left;width:55%;height:100%;padding:2px 0 0 0;margin-top:0px;" value="'+dval+'" />'+            
    '<input id="btn_cancel" type="image" src="gfx/jcancel.png" onclick="close_holiday('+lctr+')" style="float:right;width:auto;height:100%;text-align:center;padding:2px;margin-left:9px;margin-right:4px;border:1px solid black;background:none;" />'+
    '<input id="btn_save" type="image" src="gfx/jsave.png" onclick="save_holiday('+f_add+','+lctr+')" style="float:right;width:auto;height:100%;text-align:center;padding:2px;border:1px solid black;background:none;" />'+
  '</div>';
  document.getElementById('div_dtl2').innerHTML=dtl;
  dv_save.style.pointerEvents='none';
  dv_save.style.opacity=0.5;
  dv_cancel.style.pointerEvents='none';
  dv_cancel.style.opacity=0.5;
}
//
function close_holiday(){
  dv_save.style.pointerEvents='auto';
  dv_save.style.opacity=1;
  dv_cancel.style.pointerEvents='auto';
  dv_cancel.style.opacity=1;
  let dtl2=
  '<div style="width:100%;height:100%;padding:5px;text-align:center;background:darkgray;">'+
    '<button onclick="add_holiday(true,0)" style="width:100px;height:100%;">Add Holiday</button>'+
  '</div>';
  document.getElementById('div_dtl2').innerHTML=dtl2;   
}
//
function save_holiday(f_add,lctr){
  //alert(f_add+' vs lctr:'+lctr);
  let svdata=JBE_DATE_FORMAT(document.getElementById('inp_date').value,'MM-DD-YYYY');
  let vdate=JBE_DATE_FORMAT(inp_curdate.value+'-01','MM-DD-YYYY');
  
  if(!svdata){ 
    document.getElementById('inp_date').focus();
    snackBar('ERROR: Invalid Entry.');
    return; 
  }
  //check if within the month scope
  //alert('inp_date:'+svdata+' vs inp_curdate.value:'+vdate);
  if(JBE_DATE_FORMAT(svdata,'YYYY-MM') != JBE_DATE_FORMAT(vdate,'YYYY-MM')){    
    let month = new Date(vdate).toLocaleString('default', { month: 'long' });    
    let msg='Date entry is out of scope for the month of '+month+'. Try Again.';
    MSG_SHOW(vbOk,'ERROR','<center>'+msg+'</center>', function(){},function(){});
    return;
  }
  
  
  //check existing entries 
  let len_dtls=document.querySelectorAll('.dtls').length;  
  
  for(let j=1;j<=len_dtls;j++){    
    if(document.getElementById('dv_main_dtl_'+j).style.display=='none'){ continue; }
    
    if(document.getElementById('lbl_date'+j).innerHTML==svdata){
      MSG_SHOW(vbOk,'ERROR','<center>Entry Already Exist in line: '+j+'</center>', function(){},function(){});
      return; 
    }    
  }
  
  if(f_add){   
    let dtl=
      '<div id="dv_main_dtl_'+lctr+'" class="dtls" style="width:100%;height:45px;padding:5px;font-size:16px;margin-top:0px;text-align:center;border:1px solid darkgray;">'+
        '<span style="float:left;width:10%;padding:6px;">'+lctr+'.) </span>'+
        '<span id="lbl_date'+lctr+'" type="date" style="float:left;width:55%;height:100%;padding:6px 0 0 0;margin-top:0px;color:red;">'+svdata+'</span>'+            
        '<input id="btn_del'+lctr+'" type="image" src="gfx/jdele.png" onclick="del_holiday('+lctr+')" style="float:right;width:auto;height:100%;text-align:center;padding:2px;margin-left:5px;border:1px solid black;background:none;" />'+
        '<input id="btn_edit'+lctr+'" type="image" src="gfx/jedit.png" onclick="add_holiday(false,'+lctr+')" style="float:right;width:auto;height:100%;text-align:center;padding:2px;border:1px solid black;background:none;" />'+
      '</div>';
    document.getElementById('div_dtl').innerHTML+=dtl;   
  }else{
    document.getElementById('lbl_date'+lctr).innerHTML=svdata;
  }
  close_holiday();
}
//
function del_holiday(v){
  document.getElementById('lbl_date'+v).value="";
  document.getElementById('dv_main_dtl_'+v).style.display='none';
}

//
function closeSETTING(){
  //JBE_CLOSE_VIEW();
  showMainPage();
}

function mnu_setting(){  
  var jmenu=  
  '<div style="width:100%;height:100%;">'+
    '<div onclick="edit_setting()" style="float:left;width:25%;height:100%;">'+
      '<div class="class_footer">'+
        '<img src="gfx/jedit.png" alt="call image" />'+
        '<span>Edit</span>'+
      '</div>'+
    '</div>'+                
    '<div onclick="closeSETTING()" style="float:right;width:25%;height:100%;background:none;">'+
      '<div class="class_footer">'+
        '<img src="gfx/jclose.png"  alt="home image" />'+
        '<span>Close</span>'+
      '</div>'+
    '</div>'+
  '</div>';
  dispMenu(false,jmenu);  
}

function mnu_edit_setting(){  
  var jmenu=  
  '<div style="width:100%;height:100%;">'+
    '<div id="dv_save" onclick="save_setting()" style="float:left;width:25%;height:100%;">'+
      '<div class="class_footer">'+
        '<img src="gfx/jsave.png" alt="call image" />'+
        '<span>Save</span>'+
      '</div>'+
    '</div>'+                
    '<div id="dv_cancel" onclick="cancel_setting()" style="float:right;width:25%;height:100%;background:none;">'+
      '<div class="class_footer">'+
        '<img src="gfx/jcancel.png"  alt="home image" />'+
        '<span>Cancel</span>'+
      '</div>'+
    '</div>'+
  '</div>';
  dispMenu(false,jmenu);  
}

function cancel_setting(){
  disp_setting(inp_curdate.value);
  mnu_setting();
}

function edit_setting(){
  toggle_setting(false);
  
  mnu_edit_setting();
}
function toggle_setting(v){
  inp_curdate.disabled=v;   
  var len_dtls=document.querySelectorAll('.dtls').length;  
  for(var j=1;j<=len_dtls;j++){
    document.getElementById('btn_edit'+j).style.display=iif(!v,'block','none');
    document.getElementById('btn_del'+j).style.display=iif(!v,'block','none');
  } 
  
  if(!v){
    let dtl2=
    '<div style="width:100%;height:100%;padding:5px;text-align:center;">'+
      '<button onclick="add_holiday(true,0)" style="width:100px;height:100%;">Add Holiday</button>'+
    '</div>';
    document.getElementById('div_dtl2').innerHTML=dtl2;   
  }
}

function save_setting(){
  let vdate=inp_curdate.value+'-01';
  rest_api_save_setting(vdate);  
}
