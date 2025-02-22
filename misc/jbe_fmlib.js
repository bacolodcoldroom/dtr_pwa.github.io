var FM_RKEY=''; var FM_RKEY2='';
var FM_TABLE=[]; var FM_TABLE2=[];
var FM_TABLE_NAME=''; var FM_TABLE_NAME2='';
var FM_FIELDS=[]; var FM_FIELDS2=[];
var FM_TITLE='';
var FM_TRANS='';
var FM_FM_MODE=1;
var FM_FM_STATUS=0;
var FM_BTN_LEVEL=1;
var FM_AXIOS_SQL='';
var FM_AXIOS_PARA1=[];
var FM_AXIOS_PARA2=[];

var FM_ADD_FLAG=false;
var FM_ADD_FLAG2=false;

var FM_FUNC=[];
var FM_CB='';

function FM_MAIN(fm_ob,fm_layout){    
  if(!JBE_CHK_USER(0)){ return; };
  f_MainPage=false;
  var h=parseInt(fm_ob.height);  
  var h_head=H_HEADER;
  var h_foot=fm_ob.foot;
  var h_body=H_BODY-(h_head+h_foot)-1;

  var dtl=
    
    '<div id="DIV_FM_MAIN" style="width:100%;height:100%;font-size:12px;border:0px solid green;background:white;">'+ 
    
      '<div id="FM_HEAD" data-recno="" style="display:none;z-index:10;width:100%;height:25px;padding:0px;color:white;background:'+JBE_CLOR+';">'+
        //'<div style="width:100%;height:100%;padding:5px;background:'+JBE_CLOR2+';">'+fm_ob.title+'888</div>'+
        //'<span style="float:right;">FM Library version 1.1</span>'+
      '</div>'+    
      '<div id="FM_MODE" style="width:100%;height:25px;text-align:center;padding:5px 15px 5px 5px;text-align:right;color:white;font-weight:bold;background:'+JBE_CLOR2+';"></div>'+
      '<div id="FM_BODY" style="width:100%;height:'+h_body+'px;border:0px solid red;background:white;"></div>'+
      '<div id="FM_FOOT" style="width:100%;height:'+h_foot+'px;border:0px solid blue;padding:0px;background:none;"></div>'+

    '</div>';
  
  JBE_OPEN_VIEW(dtl,'','closeFM_MAIN');  
  var m=parseInt(document.getElementById("myView1").getAttribute('data-JBEpage'));
  document.getElementById('back_view'+m).style.display='none';  
  document.getElementById('cap_viewMid'+m).innerHTML=fm_ob.title;
  document.getElementById('cap_viewMid'+m).style.color='white';
  document.getElementById('cap_viewMid'+m).style.fontWeight='bold';

  document.getElementById('FM_BODY').innerHTML=
  '<div style="width:100%;height:100%;margin-top:0px;text-align:left;padding:5px;background:white;">'+
    fm_layout+
    '<div id="div_FM_dtl" class="cls_fm_dtl" style="display:'+iif(FM_FM_MODE==2,'block','none')+';height:100%;margin:0;padding:0px;margin-top:5px;border:1px solid lightgray;background:'+JBE_CLOR+';">'+
      '<div id="div_FM_dtl_div1" style="width:100%;height:40px;font-size:12px;border:0px solid yellow;"></div>'+
      '<div id="div_FM_dtl_div2" data-row=0 style="width:100%;height:'+(h_body-40)+'px;overflow:auto;border:0px solid pink;background:white;"></div>'+
    '</div>'+
  '</div>';
  /*
  var fm_layout_height=H_BODY-parseInt(document.getElementById('div_FM_head').style.height);
  document.getElementById('div_FM_dtl').style.height=(fm_layout_height-70)+'px';
  document.getElementById('div_FM_dtl_div2').style.height=(parseInt(document.getElementById('div_FM_dtl').style.height)-40)+'px';  
  */
  //alert(document.getElementById('div_FM_head').style.height);
  let h_fm_head=parseInt(document.getElementById('div_FM_head').style.height);
  let h_fm_dtl=h_body-(h_fm_head+15);
  document.getElementById('div_FM_dtl_div2').style.height=h_fm_dtl-42+'px';    
  document.getElementById('div_FM_dtl').style.height=h_fm_dtl+'px';
  if(fm_ob.foot){ document.getElementById('FM_FOOT').innerHTML=fm_ob.foot_dtl; }

  FM_fm_menu();
  FM_INIT_REC();
}

function closeFM_MAIN(){
  if(!FM_CB){ showMainPage(); return; }

  var cb = window[FM_CB];
  if (typeof cb === "function"){ 
    cb();
  }
}

function FM_PRN_REC(){
  var fn = window[FM_FUNC.prn]; 
  if(typeof fn === "function") fn(); 
}

function FM_MAIN_BOX(mode){
  FM_FM_STATUS=mode;
  var len_dtls=document.querySelectorAll('.dtls').length;   
  //console.log('mode:'+mode+' vs len_dtls:'+len_dtls);
  var aryMode=[];
  aryMode[0]={  //init
    'mode':0, 'title':'* Ready Mode *','color':'black',
    'add':'block','refresh':'block','save':'none','edit':'none','del':'none','prn':'none','cancel':'none','close':'block'
  }
  aryMode[1]={  //disp
    'mode':1, 'title':'* Display Mode *','color':'white',
    'add':'none','refresh':'none','save':'none','edit':'block','del':'block','prn':'none','cancel':'block','close':'none'
  }
  aryMode[2]={  //add
    'mode':2, 'title':'* Add Mode *','color':'navy',
    'add':'none','refresh':'none','save':'block','edit':'none','del':'none','prn':'none','cancel':'block','close':'none'
  }
  aryMode[3]={  //edit
    'mode':3, 'title':'* Edit Mode *','color':'cyan',
    'add':'none','refresh':'none','save':'block','edit':'none','del':'none','prn':'none','cancel':'block','close':'none'
  }

  if(FM_FM_MODE==2){
    aryMode[2]={  //add
      'mode':2, 'title':'* Add Mode *','color':'navy',
      'add':iif(FM_ADD_FLAG,'block','none'),'save':'block','edit':'none','del':'none','prn':'none','cancel':'block','close':'none'
    }
    aryMode[3]={  //edit
      'mode':3, 'title':'* Edit Mode *','color':'cyan',
      'add':'block','save':'block','edit':iif(len_dtls,'block','block'),'del':iif(len_dtls,'block','block'),'prn':'none','cancel':'block','close':'none'
    }
  }

  document.getElementById('FM_BTNS').setAttribute('data-mode',aryMode[mode]['mode']);
  document.getElementById('FM_BTNS').style.color=aryMode[mode]['color'];
  document.getElementById('FM_MODE').innerHTML=aryMode[mode]['title'];
  
  document.querySelectorAll('.fm_class_box').forEach(function(el) {
    //el.style.pointerEvents='none';
    el.style.display='none';    
    //el.style.opacity=0.5;
  });
  document.getElementById('FM_ADD_BTN').style.display=aryMode[mode]['add']; 
  document.getElementById('FM_REFRESH_BTN').style.display=aryMode[mode]['refresh'];  
  document.getElementById('FM_EDIT_BTN').style.display=aryMode[mode]['edit'];
  document.getElementById('FM_DEL_BTN').style.display=aryMode[mode]['del'];
  document.getElementById('FM_PRN_BTN').style.display=aryMode[mode]['prn'];
  document.getElementById('FM_SAVE_BTN').style.display=aryMode[mode]['save'];
  document.getElementById('FM_CANCEL_BTN').style.display=aryMode[mode]['cancel'];
  document.getElementById('FM_CLOSE_BTN').style.display=aryMode[mode]['close'];  

  document.getElementById('img_FM_CANCEL_EXIT').src='gfx/jcancel.png';
  document.getElementById('txt_FM_CANCEL_EXIT').innerHTML='Cancel';

  if(mode==1){
    document.getElementById('img_FM_CANCEL_EXIT').src='gfx/jcancel.png';
    document.getElementById('txt_FM_CANCEL_EXIT').innerHTML='Exit';
  }
  
}

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById("FM_HEAD")) {
    // if present, the header is where you move the DIV from:
    document.getElementById("FM_HEAD").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function FM_fm_menu(){
  var fm_menu=
    '<div id="FM_BTNS" data-mode=0 style="width:100%;height:100%;color:red;">'+

      '<div id="FM_ADD_BTN" class="fm_class_box" onclick="FM_ADD_REC()" style="margin-left:0%;">'+
        '<div class="class_footer">'+
          '<img src="gfx/jadd.png" alt="call image" />'+
          '<span>Add</span>'+
        '</div>'+
      '</div>'+             
      '<div id="FM_EDIT_BTN" data-click=0 class="fm_class_box" onclick="FM_EDIT_REC()">'+
        '<div class="class_footer">'+
          '<img src="gfx/jedit.png"  alt="home image" />'+
          '<span>Edit</span>'+
        '</div>'+
      '</div>'+    
      '<div id="FM_REFRESH_BTN" data-click=0 class="fm_class_box" onclick="FM_REFRESH_REC()">'+
        '<div class="class_footer">'+
          '<img src="gfx/jrefresh.png"  alt="home image" />'+
          '<span>Refresh</span>'+
        '</div>'+
      '</div>'+   

      '<div id="FM_FUNC_BTN1" class="fm_class_box" onclick="FM_FUNC_REC(1)" style="display:none;width:200px;background:none;">'+
        '<div class="class_footer">'+
          '<img id="img_FM_FUNC_BTN1" src="gfx/jdele.png"  alt="home image" />'+
          '<span id="span_FM_FUNC_BTN1" style="width:auto;">FUNC</span>'+
        '</div>'+
      '</div>'+    
      '<div id="FM_FUNC_BTN2" class="fm_class_box" onclick="FM_FUNC_REC(2)" style="display:none;width:200px;background:none;">'+
        '<div class="class_footer">'+
          '<img id="img_FM_FUNC_BTN2" src="gfx/jdele.png"  alt="home image" />'+
          '<span id="span_FM_FUNC_BTN2" style="width:auto;">FUNC</span>'+
        '</div>'+
      '</div>'+    
      '<div id="FM_FUNC_BTN3" class="fm_class_box" onclick="FM_FUNC_REC(3)" style="display:none;width:200px;background:none;">'+
        '<div class="class_footer">'+
          '<img id="img_FM_FUNC_BTN3" src="gfx/jdele.png"  alt="home image" />'+
          '<span id="span_FM_FUNC_BTN3" style="width:auto;">FUNC</span>'+
        '</div>'+
      '</div>'+    

      '<div id="FM_DEL_BTN" class="fm_class_box" onclick="FM_DEL_REC()">'+
        '<div class="class_footer">'+
          '<img src="gfx/jdele.png"  alt="home image" />'+
          '<span>Del</span>'+
        '</div>'+
      '</div>'+    
      '<div id="FM_PRN_BTN" class="fm_class_box" onclick="FM_PRN_REC()">'+
        '<div class="class_footer">'+
          '<img src="gfx/jprn.png"  alt="home image" />'+
          '<span>Print</span>'+
        '</div>'+
      '</div>'+
      
      '<div id="FM_CANCEL_BTN" class="fm_class_box" onclick="FM_CANCEL()" style="display:none;float:right;">'+
        '<div class="class_footer">'+
          '<img id="img_FM_CANCEL_EXIT" src="gfx/jcancel.png"  alt="home image" />'+
          '<span id="txt_FM_CANCEL_EXIT">Cancel</span>'+
        '</div>'+
      '</div>'+  
      '<div id="FM_CLOSE_BTN" class="fm_class_box" onclick="JBE_CLOSE_VIEW()" style="float:right;">'+
        '<div class="class_footer">'+
          '<img src="gfx/jclose.png"  alt="home image" />'+
          '<span>Quit</span>'+
        '</div>'+
      '</div>'+   
      '<div id="FM_SAVE_BTN" class="fm_class_box" onclick="FM_SAVE_REC()" style="display:none;margin-left:0%;float:right;">'+
        '<div class="class_footer">'+
          '<img src="gfx/jsave.png" alt="call image" />'+
          '<span>Save</span>'+
        '</div>'+
      '</div>'+ 

    '</div>';
  dispMenu(false,fm_menu);
}

function FM_hl_row(v){
  //alert(FM_FM_STATUS+':  FM_hl_row:'+v);
  if(FM_FM_STATUS!=3){ return; }
  if(v==0){ return; }
  //console.log('row v:'+v);
  //if(document.getElementById('cap_viewMid1').innerHTML == 'Display'){ return; }
  
  var curRow=document.getElementById('div_FM_dtl_div2').getAttribute('data-row');  
    
  if(curRow > 0 && document.getElementById('dtl_'+curRow)){ 
    //console.log('watch error: curRow is:'+curRow);
    document.getElementById('dtl_'+curRow).style.color='black'; 
    document.getElementById('dtl_'+curRow).style.background='none'; 
  }
  document.getElementById('dtl_'+v).style.color='white';
  document.getElementById('dtl_'+v).style.background='black';
  document.getElementById('div_FM_dtl_div2').setAttribute('data-row',v);  
}

//======================================
function FM_LOOKUP(mode,div_Search,DB,arySort,tilt,func,div_Search2,flds,retFld,func2) { 
  alert('wala'); 
  if(!mode){
    //document.getElementById('lookup').style.display='none';    
    JBE_CLOSEBOX();
    return;
  }   

  var FM_newArr = [...DB];
  if(arySort.length==0){ arySort=[div_Search2[0]]; }
  FM_newArr.sort(JBE_SORT_ARRAY(arySort));
  
  var box2=0; 
  var box1=H_VIEW-(60+box2);
  
  var dtl=          
    '<div id="div_name" data-zoom=0 style="width:100%;height:'+box1+'px;font-text:14px;padding:0px;background-color:white;">'+         
      '<div style="width:100%;height:40px;padding:2px;text-align:center;color:'+JBE_TXCLOR1+';background:'+JBE_CLOR+';">'+
         '<input id="filterInput" type="text" style="float:left;width:100%;height:100%;text-align:center;" value="" placeholder="Search here..."/>'+      
      '</div>'+    
      '<div style="width:100%;height:30px;color:'+JBE_TXCLOR1+';background:'+JBE_CLOR+';">'+
        '<div id="dv_hd" style="margin-top:5px;width:100%;height:100%;padding:5px;text-align:center;">';          
          for(var i=0;i<flds.length;i++){
            let m_disp='block';
            if(!flds[i].title){ m_disp='none'; }
            dtl+='<div style="display:'+m_disp+';float:left;width:'+flds[i].width+';height:100%;text-align:'+flds[i].align+';margin:0px;padding:0px;border:0px solid black;overflow:auto;">'+flds[i].title+'</div>';
          }
          dtl+=
        '</div>'+
      '</div>'+          
      '<div id="dv_dt" style="width:100%;height:'+(box1-87+5)+'px;padding:0px;border:0px solid red;overflow:auto;">';
        var ddd='';
        for(var i=0;i<FM_newArr.length;i++){   
          ddd+=
          '<div id="d_'+i+'" class="cls_names" onclick="'+func+'('+i+',&quot;'+FM_newArr[i][retFld]+'&quot;);JBE_CLOSEBOX();" style="cursor:pointer;font-size:12px;width:100%;height:25px;padding:0px;border:1px solid gray;">';
            
            let z_dtl='';
            for(var z=0;z<flds.length;z++){
              //console.log('tulok:'+flds[z].fld);
              let fld=flds[z].fld;
              let fld_type=flds[z].type;
              let fld_val=FM_newArr[i][fld];

              //////////////////////////
              var ndx=fld.indexOf('|');
              var param='';
              if(ndx >= 0){
                param=fld.substr(ndx+1);
                fld=fld.substr(0,ndx);
              }      
              var fn = window[fld];
              let f_fn=false;
              if (typeof fn === "function"){ f_fn=true; fld_val=fn(FM_newArr[i][param]); }
              //////////////////////////
              
              //console.log('>>>  fld_val:'+fld_val+'   fld_type:'+fld_type);
              if(fld_type=='date'){ fld_val=JBE_DATE_FORMAT(fld_val,'YYYY-MM-DD'); }
              if(!fld_val){ fld_val='-'; }
              //console.log('fm2_lookup : '+z+': '+DB[i][flds[z]]+' isDate:'+Date.parse(DB[i][flds[z]]));
              let v_id='id="dd_'+fld+i+'"';
              //console.log(v_id);
              //alert(fld+' == '+div_Search2);
              if(fld==div_Search2){ v_id='id="dd_'+i+'"'; }
              //console.log('v_id:'+v_id);
              let m_disp='block';
              if(!flds[z].title){ m_disp='none'; }
              z_dtl+='<div '+v_id+' style="display:'+m_disp+';float:left;width:'+flds[z].width+';height:100%;padding:4px;border:0px solid red;overflow:auto;text-align:'+flds[z].align+';background:none;">'+fld_val+'</div>';
              //z_dtl+='<div '+v_id+' style="float:left;height:100%;width:'+flds[z].width+';border:0px solid red;overflow:auto;text-align:'+flds[z].align+';background:none;">'+fld_val+'</div>';
              //alert(z_dtl);
            }
                          
            ddd+=z_dtl+
          '</div>';          
        }
        dtl+=ddd+
      '</div>'+    
    '</div>';
     
  
  var dtl2=
    '<div style="width:100%;height:100%;text-align:center;padding:5px;background:none;">'+
      '<div style="float:left;width:50%;height:100%;text-align:left;padding:5px 0 0 0;">Look Up Mod ver. 2.2</div>'+
      '<div style="float:left;width:50%;height:100%;">'+
        '<input type="button" value="Clear" onclick="'+func+'('+(-1)+',&quot;&quot;);JBE_CLOSEBOX();" style="float:left;width:80px;height:100%;"/>'+
        '<input type="button" value="Close" onclick="JBE_CLOSEBOX()" style="float:right;width:80px;height:100%;"/>'+       
      '</div>'+
    '</div>';

  JBE_OPENBOX('div_name',tilt,dtl,dtl2); 
  let dv_hd=document.getElementById('dv_hd');
  let dv_dt=document.getElementById('dv_dt');
  dv_hd.style.width=dv_dt.clientWidth+'px';

  //alert('div_Search '+div_Search);
  var fn = window[func2];
  if (typeof fn === "function"){ fn(); }   
  JBE_SEARCH_BOX('filterInput','cls_names',div_Search);
}

function FM_Clear(div_Search,retFld){
  div_Search='';
  //retFld='';
  JBE_CLOSEBOX();
}

//======================================
function FM_CHK_REC(recno){  
  var rval=false;
  var fld=FM_FIELDS[0]['fld'];
  for(var i=0;i<FM_TABLE.length;i++){
    if(FM_TABLE[i][fld]==recno){
      rval=true;
      break;
    }
  }

  let div=FM_FIELDS[0].div;
  let old_docno=document.getElementById(div).getAttribute('data-docno');

  if(rval){    
    FM_DISP_REC(recno);    
    FM_FORCE_DELREC(FM_TRANS,old_docno);      
    FM_ADD_FLAG=false;
    return;
  }
  
  //var recno=document.getElementById(FM_FIELDS[0].div).value;
  axios.get('/api/get_rlock', { params: { trans:FM_TRANS,docno:recno } })
  .then(function (response) { 
    let arr=response.data;
    if(arr.length!=0){ 

      if(response.data['usercode'] != CURR_USER){
        MSG_SHOW(vbOk,"RECORD LOCKED!!!",
          "<center>Locked by: "+arr[0]['username']+"</center>",
          function(){},function(){}
        ); 
        FM_INIT_REC();
        FM_FORCE_DELREC(FM_TRANS,old_docno);
        FM_BTN_LEVEL=1;
        return;
      }

    }        
    FM_FORCE_CHG_DOCNO(FM_TRANS,old_docno,recno);
    console.log('chg old recno:'+old_docno+' to new:'+recno);
  })    
  .catch(function (error) { console.log(error); });    
}

function FM_ADD_REC(){ 
  if(!JBE_CHK_USER(1)){ return; }
  if(FM_BTN_LEVEL==1){
    FM_ADD_FLAG=true;
    var fn = window[FM_FUNC.add];
    if (typeof fn === "function"){ if(fn(1)==false){ return; }}  
    FM_MAIN_BOX(2);
    FM_ADD_FLAG2=false;
    for(var i=0;i<FM_FIELDS.length;i++){
      var div=FM_FIELDS[i]['div'];    
      var disp=FM_FIELDS[i]['disp'];      
      document.getElementById(div).value='';
      if(disp==1){     
        document.getElementById(div).disabled=false;
      }
    }  
    if(FM_FM_MODE==2){ FM_BTN_LEVEL=2; }    
  }else if(FM_BTN_LEVEL==2){
    FM_ADD_FLAG2=true;
    //document.getElementById('FM_HEAD').getAttribute('data-recno');
    //alert('2nd add btn, FM_ADD_FLAG2:'+FM_ADD_FLAG2);
    FM_ADD_ITEM(true); 
  }   
}
//
function FM_EDIT_REC(){
  if(!JBE_CHK_USER(1)){ return; }
  var fn = window[FM_FUNC.edit];
  if (typeof fn === "function"){ if(fn(1)==false){ return; }}  

  if(FM_BTN_LEVEL==1){
    var recno=document.getElementById(FM_FIELDS[0].div).value;
    FM_REC_LOCK(FM_TRANS,recno,'FM_2EDIT');    
  }else{
    let len_dtls=document.querySelectorAll('.dtls').length;  
    let new_len_dtls=0;
    for(var i=1;i<=len_dtls;i++){
      if(document.getElementById('dtl_'+i).style.display != 'none'){ new_len_dtls++; }
    }
    if(new_len_dtls==0){ 
      snackBar('No record to Edit.');
      return;
    }
    //alert('edit dtls');
    FM_ADD_FLAG2=false;
    FM_ADD_ITEM(false);
  }
  //if (typeof fn === "function") fn(2); 
}
//
function FM_2EDIT(){
  FM_MAIN_BOX(3);
  for(var i=1;i<FM_FIELDS.length;i++){
    var div=FM_FIELDS[i]['div'];
    var disp=FM_FIELDS[i]['disp'];
    if(disp == 1){
      document.getElementById(div).disabled=false;
    }else{
      document.getElementById(div).disabled=true;
    }
  }
  if(FM_FM_MODE==2){
    var len_dtls=document.querySelectorAll('.dtls').length;  
    if(len_dtls){ FM_hl_row(1); }      
  }
  FM_BTN_LEVEL=2;
}

function FM_save_item(f_add){
  let errMsg='';
  //console.clear();
  for(var i=0;i<FM_FIELDS2.length;i++){
    if(FM_FIELDS2[i].hd=='FILLER'){ continue; }

    let div='txt_'+FM_FIELDS2[i].fld;    
    let type=FM_FIELDS2[i].type;
    let vinput=FM_FIELDS2[i].input;
    if(FM_FIELDS2[i].fld.indexOf('|') >= 0){ continue; }
    
    let val;
    if(vinput){ val=document.getElementById(div).value; }
    else{ val=document.getElementById(div).innerHTML; }
    
    //console.log(type+':FM_save_item  div:'+div+' val:'+val+' vinput:'+vinput); 
    console.log('### '+vinput+':FM_save_item  div:'+div+' val:'+val); 
    //if(!val && vinput){  
    if(!val){
      errMsg=FM_FIELDS2[i].err;
      break;
    }
  }
  if(errMsg){
    snackBar(errMsg);
    return;
  }

  if(FM_dupli(f_add)){ return; }
  
  //let len_dtls=document.querySelectorAll('.dtls').length;     
  //alert('rval is true:'+len_dtls);
  //curRow=document.querySelectorAll('.dtls').length;

  var line_ctr=document.getElementById('div_FM_dtl_div2').getAttribute('data-row');   
  if(f_add){ line_ctr=document.querySelectorAll('.dtls').length+1; }
  line_ctr=parseInt(line_ctr);
  //console.clear();
  let hhdd='<div id="dtl_'+line_ctr+'" class="dtls" onclick="FM_hl_row('+line_ctr+')" style="width:100%;height:30px;margin:0;padding:0px;font-size:12px;color:black;background:none;">';
  for(var i=0;i<FM_FIELDS2.length;i++){
    let the_fld=FM_FIELDS2[i].fld;
    var the_div='txt_'+FM_FIELDS2[i].fld;
    var the_div2='dtl'+the_div.substring(3);
    var the_type=FM_FIELDS2[i].type;
    var the_input=FM_FIELDS2[i].input;
    var the_width=FM_FIELDS2[i].width;
    var the_align=FM_FIELDS2[i].align;

    if(FM_FIELDS2[i].hd=='FILLER'){
      the_div2='fil_'+the_fld;
    }
    //alert('the_type:'+the_type+'  the_div2:'+the_div2+' the_align:'+the_align);
    var the_val;

    //////////////////////////
    var ndx=the_fld.indexOf('|');
    var param='';
    var param_val='';
    if(ndx >= 0){
      param=the_fld.substr(ndx+1);
      the_fld=the_fld.substr(0,ndx);
    }      
    var fn = window[the_fld];
    
    if (typeof fn === "function"){ 
      param_val=document.getElementById('txt_'+param).value;
      //the_val=fn(FM_TABLE2[(line_ctr-1)][param]); 
      the_val=fn(param_val); 
      //console.log(param_val+' === the_fld:'+FM_TABLE2[line_ctr-1][param]+' fld:'+the_fld+' val:'+the_val);
    }else{
      if(!FM_FIELDS2[i].input){
        the_val=document.getElementById(the_div).innerHTML;
      }else{
        the_val=document.getElementById(the_div).value;
      }
    }
    //////////////////////////

    //console.log('save_item <><><> the_fld:'+the_fld+'  the_val:'+the_val);

    if(the_type=='date'){ the_val=JBE_DATE_FORMAT(the_val,'MM-DD-YYYY'); } //sagb
    else if(the_type=='double'){ the_val=JBE_FORMAT_DOUBLE_TO_STR(the_val); }
    else if(the_type=='number'){ the_val=JBE_FORMAT_INT_TO_STR(the_val); }    
          
    if(f_add){
      //hhdd+='<span id="'+the_div+'_'+line_ctr+'" class="class_mtr1" style="display:'+iif(the_disp==1,'block','none')+';width:'+the_width+';height:100%;text-align:'+the_align+';padding:4px;overflow:auto;border:1px solid lightgray;background:none;">'+the_val+'</span>';
      hhdd+='<span id="'+the_div2+'_'+line_ctr+'" class="class_mtr1" style="display:'+iif(FM_FIELDS2[i].disp==1,'block','none')+';width:'+the_width+';height:100%;text-align:'+the_align+';padding:5px;border:1px solid lightgray;background:none;">'+the_val+'</span>';
    }else{
      //console.log('****** the_div2'+the_div2);
      document.getElementById(the_div2+'_'+line_ctr).innerHTML=the_val;
    }
    //console.log('save_item --- the_fld:'+the_fld+'   the_val:'+the_val+'  disp:'+FM_FIELDS2[i].disp+'  the_div:'+the_div);  
  }
  hhdd+='</div>';
  //console.log('hhdd:'+hhdd);
  if(f_add){ document.getElementById('div_FM_dtl_div2').innerHTML+=hhdd; }
  
  //alert('line_ctr:'+line_ctr);
  JBE_CLOSE_VIEW()
  FM_fm_menu();
  FM_FM_MODE=2;
  FM_MAIN_BOX(3);
  FM_hl_row(line_ctr);
}

//
function FM_SAVE_REC(){  
  //alert('FM_SAVE_REC, FM_ADD_FLAG:'+FM_ADD_FLAG);
  var len_dtls=document.querySelectorAll('.dtls').length;  
  let new_len_dtls=0;
  for(var i=1;i<=len_dtls;i++){
    //console.log(i+' >>> '+document.getElementById('dtl_'+i).style.display);
    if(document.getElementById('dtl_'+i).style.display != 'none'){ new_len_dtls++; }
  }
  //alert(FM_FM_MODE+', len:'+new_len_dtls);
  if(FM_FM_MODE==2 && !new_len_dtls){ snackBar('ERROR: Empty Record.'); return; }

  var fn = window[FM_FUNC.save];
  if (typeof fn === "function"){ if(fn(1,'')==false){ return; }}  
  //alert('me here');
  //var recno=document.getElementById('FM_HEAD').getAttribute('data-recno');
  var recno=document.getElementById(FM_FIELDS[0].div).value;

  let recno_fld=''; let recno_val=''; let recno_div='';
  
  FM_AXIOS_PARA1=[];
  FM_AXIOS_SQL='';
  var fldnames=[]; var fldvals=[]; var ctr_fld=0;
  
  for(var i=0;i<FM_FIELDS.length;i++){    
    if(!FM_FIELDS[i]['save']){ continue; }

    var div=FM_FIELDS[i]['div'];
    var fld=FM_FIELDS[i]['fld'];
    var vtype=FM_FIELDS[i]['type'];
    var disp=parseInt(FM_FIELDS[i]['disp']);
    var val=document.getElementById(div).value;
    if(vtype=='date'){ val=JBE_DATE_FORMAT(val,'YYYY-MM-DD'); }
    else if(vtype=='number'){ val=JBE_FORMAT_STR_TO_NUMBER(val); }    
    else if(vtype=='double'){ val=JBE_FORMAT_STR_TO_DOUBLE(val); }    
        
    console.log('FM_SAVE_REC fld:'+fld+'  val:'+val);
    if(disp < 0){
      recno_fld=fld;
      recno_val=val;
      recno_div=div;
      //alert('equal:'+fld);
    }else{
      if(fld && fld==FM_RKEY){  
        recno_fld=fld;
        recno_val=val;
        recno_div=div;
      }
      fldnames[ctr_fld]=fld;
      fldvals[ctr_fld]=val;
      ctr_fld++;
    }
        
    if(!val && disp > 0){
      snackBar('ERROR: Empty Field: (<font color=red>'+document.getElementById(div).getAttribute('data-caption')+'</font>)');
      document.getElementById(div).focus();
      return;
    }
  }
    
  var vsql='';
  var vcommas='';
  var v_api='';
  FM_FORCE_DELREC(FM_TRANS,recno);
  if(FM_ADD_FLAG){    
    for(var i=0;i<ctr_fld;i++){
      vsql+=fldnames[i]+',';
      vcommas=vcommas+'?,';
    }
    vsql=vsql.substring(0,vsql.length-1);
    vcommas=vcommas.substring(0,vcommas.length-1);
    FM_AXIOS_SQL='INSERT INTO '+FM_TABLE_NAME+' ('+vsql+') VALUES ('+vcommas+')';
    FM_AXIOS_PARA1=fldvals;
    console.log('FM_AXIOS_SQL:'+FM_AXIOS_SQL);
    console.log('FM_AXIOS_PARA1:'+FM_AXIOS_PARA1);
    v_api='/api/fmlib_save';
    axios.post('/api/fmlib_save', {headers: { 'Content-Type': 'application/json' }}, { params: { sql:FM_AXIOS_SQL,fld:FM_AXIOS_PARA1,tbl:FM_TABLE_NAME,fm_mode:1 } })    
    .then(function (response) {
      //DB_PTR=response.data;
      FM_TABLE=response.data;
      fn(2,response.data);
      //alert(FM_TABLE.length);
      console.log('>>>> save:'+response.data.length);
      //console.log('add_ptr: '+DB_PTR.length);
      let newKey=FM_TABLE[FM_TABLE.length-1][FM_RKEY];
      //alert('newKey:'+newKey);
      JBE_LOGGER_SAVE(CURR_USER,1,newKey,FM_TRANS,'Created: '+FM_TRANS+'-'+newKey);
      if(FM_FM_MODE==1){ 
        if(!recno){ recno=FM_TABLE[FM_TABLE.length-1][FM_RKEY]; }
        FM_DISP_REC(recno); 
        return; 
      }
      FM_SAVE_REC2(recno);
    })
    .catch(function (error) { console.log(error); });
  }else{
    fldvals[ctr_fld]=recno_val;
    fldnames.shift();
    fldvals.shift();
    for(var i=0;i<(ctr_fld-1);i++){
      vsql+=fldnames[i]+'=?,';
    }    
    vsql=vsql.substring(0,vsql.length-1);
    //alert(vsql);
    FM_AXIOS_SQL='UPDATE '+FM_TABLE_NAME+' SET '+vsql+' WHERE '+FM_RKEY+'=?';
    FM_AXIOS_PARA1=fldvals;
    //console.log('fldnames:'+fldnames);
    //console.log('FM_AXIOS_SQL:'+FM_AXIOS_SQL);
    //console.log('FM_AXIOS_PARA1:'+FM_AXIOS_PARA1);
    v_api='/api/fmlib_update';
    axios.put('/api/fmlib_update', {headers: { 'Content-Type': 'application/json' }}, { params: { sql:FM_AXIOS_SQL,fld:FM_AXIOS_PARA1,tbl:FM_TABLE_NAME,fm_mode:1 } })    
    .then(function (response) {
      //DB_PTR=response.data;
      FM_TABLE=response.data;
      fn(2,response.data);
      console.log('>>>> update:'+response.data.length);
      //console.log('add_ptr: '+DB_PTR.length);
      JBE_LOGGER_SAVE(CURR_USER,2,recno,FM_TRANS,'Edited: '+FM_TRANS+'-'+recno);
      if(FM_FM_MODE==1){ 
        FM_DISP_REC(recno);         
        return; 
      }
      FM_SAVE_REC2(recno);
    })
    .catch(function (error) { console.log(error); });
  }  
}
//

function FM_SAVE_REC2(recno){    
  var len_dtls=document.querySelectorAll('.dtls').length;  
  /*
  for(var k=1;k<=len_dtls;k++){
    let jfk=document.getElementById('dtl_loc_'+k).innerHTML;
    let jfk2=document.getElementById('fil_loc_'+k).innerHTML;
    alert('jfk:'+jfk+' vs jfkOLD:'+jfk2);
  }
  */
  var fn = window[FM_FUNC.save];
  var ary=[]; ary=fn(0,'');
  //alert('ary.length:'+ary.length);
  if(ary.length){
    for(var k=1;k<=len_dtls;k++){
      for(var i=0;i<ary.length;i++){
        console.log('FM_SAVE_REC2 : '+'dtl_'+ary[i].fld+'_'+k);
        console.log('FM_SAVE_REC2 : '+document.getElementById('dtl_'+ary[i].fld+'_'+k).innerHTML);
        console.log('FM_SAVE_REC2 : val: '+ary[i].val);
        document.getElementById('dtl_'+ary[i].fld+'_'+k).innerHTML=ary[i].val;
      }
    }
  }
  
  FM_AXIOS_SQL='DELETE from '+FM_TABLE_NAME2+' WHERE '+FM_RKEY+'=?';
  FM_AXIOS_PARA1=recno;
  //console.clear();
  axios.delete('/api/fmlib_del', { params: { sql:FM_AXIOS_SQL,fld:FM_AXIOS_PARA1,tbl:FM_TABLE_NAME2,select:true } })    
  .then(async function (response) {
    //console.log('2nd del returns:'+response.data.length);
    //console.log('total len of dtls:'+len_dtls);

    for(var k=1;k<=len_dtls;k++){
      //console.log('saverec line:'+k);
      
      if(document.getElementById('dtl_'+k).style.display=='none'){ continue; }
      var fldnames=[]; var fldvals=[]; var ctr_fld=0;
      for(var i=0;i<FM_FIELDS2.length;i++){ 
        if(FM_FIELDS2[i].hd=='FILLER'){ continue; }
        if(!FM_FIELDS2[i].save){ continue; }
                
        var fld=FM_FIELDS2[i]['fld'];
        //if(FM_FIELDS2[i].fld.indexOf('|') >= 0){ continue; }
        var div='dtl_'+fld+'_'+(k);        

        var val=document.getElementById(div).innerHTML;

        if(FM_FIELDS2[i]['type']=='date'){ val=JBE_DATE_FORMAT(val,'YYYY-MM-DD'); }        
        else if(FM_FIELDS2[i]['type']=='double' || FM_FIELDS2[i]['type']=='doubleText'){ val=JBE_FORMAT_STR_TO_DOUBLE(val); }
        else if(FM_FIELDS2[i]['type']=='number' || FM_FIELDS2[i]['type']=='numberText'){ val=JBE_FORMAT_STR_TO_NUMBER(val); }
        fldnames[ctr_fld]=fld;
        fldvals[ctr_fld]=val;
        ctr_fld++;      
      }
      var vsql='';
      var vcommas='';
      
      //alert('ctr_fld '+ctr_fld);
      for(var i=0;i<ctr_fld;i++){
        vsql+=fldnames[i]+',';
        vcommas=vcommas+'?,';
        //alert('vcommas '+i+' : '+vcommas);
      }
      vsql=vsql.substring(0,vsql.length-1);
      vcommas=vcommas.substring(0,vcommas.length-1);
      FM_AXIOS_SQL='INSERT INTO '+FM_TABLE_NAME2+' ('+vsql+') VALUES ('+vcommas+')';
      FM_AXIOS_PARA1=fldvals;
      
      console.log('FM_AXIOS_SQL '+FM_AXIOS_SQL);
      console.log('FM_AXIOS_PARA1 '+FM_AXIOS_PARA1);
      //console.log('FM_ADD_FLAG '+FM_ADD_FLAG);
      
      await axios.post('/api/fmlib_save', {headers: { 'Content-Type': 'application/json' }}, { params: { sql:FM_AXIOS_SQL,fld:FM_AXIOS_PARA1,tbl:FM_TABLE_NAME,fm_mode:2 } })    
      .then(function (response) {    
        showProgress(false); 
        //FM_TABLE2=response.data;    
        //console.log('>>> FM_TABLE2 len = '+FM_TABLE2.length);  
      })    
      .catch(function (error) { console.log(error); });
    }      
    
    axios.get('/api/get_table', { params: {tbl:FM_TABLE_NAME2} })
    .then(function (response) { 
      //console.log(response.data); 
      FM_TABLE2 = response.data; 
      fn(3,FM_TABLE2);
      //console.log('>>> FM_TABLE22 len = '+FM_TABLE2.length);  
      if(!recno){ recno=FM_TABLE[FM_TABLE.length-1][FM_RKEY]; }
      FM_DISP_REC(recno);
      //console.log('tapos gd. '+recno);
    })    
    .catch(function (error) { console.log(error); });
  })  
  .catch(function (error) { console.log(error); });
   
}

function FM_no_item(){
  let vdisp='block';
  let len_dtls=document.querySelectorAll('.dtls').length;  
  let new_len_dtls=0;
  for(var i=1;i<=len_dtls;i++){
    //console.log(i+' >>> '+document.getElementById('dtl_'+i).style.display);
    if(document.getElementById('dtl_'+i).style.display != 'none'){ new_len_dtls++; }
  }
  //alert(new_len_dtls);
  if(new_len_dtls==0){ vdisp='none'; }
  document.getElementById('FM_EDIT_BTN').style.display=vdisp;
  document.getElementById('FM_DEL_BTN').style.display=vdisp;
}

function FM_del_item(){
  let len_dtls=document.querySelectorAll('.dtls').length;  
  let new_len_dtls=0;
  for(var i=1;i<=len_dtls;i++){
    if(document.getElementById('dtl_'+i).style.display != 'none'){ new_len_dtls++; }
  }
  if(new_len_dtls==0){ 
    snackBar('No record to delete.');
    return;
  }
  let row=parseInt(document.getElementById('div_FM_dtl_div2').getAttribute('data-row'));  
  //console.log('row:'+row);
  document.getElementById('dtl_'+row).style.display='none';
  let f_break=false;
  let f_break2=true;
  for(var i=(row+1);i<=len_dtls;i++){
    //console.log(i+' >>>> '+document.getElementById('dtl_'+i).style.display);
    if(document.getElementById('dtl_'+i).style.display != 'none'){
      //console.log('i row:'+i);
      FM_hl_row(i);
      f_break=true;
      break;
    }
  }
  if(!f_break){
    //console.log('EOF');
    f_break2=false;
    let xrow=len_dtls;
    for(var i=1;i<=len_dtls;i++){     
      if(document.getElementById('dtl_'+xrow).style.display != 'none'){
        FM_hl_row(xrow);
        f_break2=true;
        break;
      }
      xrow--;
    }
  }
  FM_no_item();
}

//
function FM_REFRESH_REC(){ 
  //alert('FM_REFRESH_REC:'+FM_TABLE);
  get_db_all(FM_TABLE_NAME);
  if(FM_FM_MODE==2){ get_db_all(FM_TABLE_NAME2); }
  snackBar('Refreshed...');
}

function FM_FUNC_REC(m){ 
  if(!JBE_CHK_USER(1)){ return; } 
  var fn = window[FM_FUNC.func];
  if (typeof fn === "function"){ 
    if(fn(m,'')==false){ return; }
  }   
}

//
function FM_DEL_REC(){ 
  if(!JBE_CHK_USER(1)){ return; } 
  var fn = window[FM_FUNC.del];
  if (typeof fn === "function"){ 
    if(fn(1,'')==false){ return; }
  } 
  //alert('going to lock');
  var recno=document.getElementById(FM_FIELDS[0].div).value;
  FM_REC_LOCK(FM_TRANS,recno,'FM_DEL2_REC');
}
function FM_DEL2_REC(){ 
  //alert('FM_BTN_LEVEL:'+FM_BTN_LEVEL);
  if(FM_BTN_LEVEL==2){
    FM_del_item();
    return;
  }
  
  var recno=document.getElementById(FM_FIELDS[0].div).value;
  
  MSG_SHOW(vbYesNo,'CONFIRM: ','Delete this Record? ['+recno+']',function(){  
    FM_AXIOS_SQL='DELETE from '+FM_TABLE_NAME+' WHERE '+FM_RKEY+'=?';    
    FM_AXIOS_PARA1=recno;
    showProgress(true);       
    axios.delete('/api/fmlib_del', { params: { sql:FM_AXIOS_SQL,fld:FM_AXIOS_PARA1,tbl:FM_TABLE_NAME,select:true } })    
    .then(function (response) {    
      showProgress(false);
      //console.log(response.data.length);
      FM_TABLE=response.data;
      if(FM_FM_MODE==2){ FM_DEL_REC2(recno); }
            
      if (typeof fn === "function") fn(2,response.data);   
      FM_FORCE_DELREC(FM_TRANS,recno);  
      FM_INIT_REC();
    })    
    .catch(function (error) { console.log(error); showProgress(false); });
    
  },function(){ FM_FORCE_DELREC(FM_TRANS,recno); });
}
//
async function FM_DEL_REC2(recno){ 
  //var recno=document.getElementById('FM_HEAD').getAttribute('data-recno');
  FM_AXIOS_SQL='DELETE from '+FM_TABLE_NAME2+' WHERE '+FM_RKEY+'=?';
  FM_AXIOS_PARA1=recno;
  showProgress(true);       
  await axios.delete('/api/fmlib_del', { params: { sql:FM_AXIOS_SQL,fld:FM_AXIOS_PARA1,tbl:FM_TABLE_NAME2,select:true } })    
  .then(function (response) {    
    showProgress(false);
    //console.log(response.data.length);
    //FM_TABLE2=response.data;
    //console.log('tapos delete2:'+FM_TABLE2.length);
  })    
  .catch(function (error) { console.log(error); showProgress(false); });
}
//
function FM_CANCEL(){    
  var m=document.getElementById('FM_BTNS').getAttribute('data-mode');
  var recno=document.getElementById(FM_FIELDS[0].div).value;

  //console.log('::: FM_CANCEL m='+m+' FM_ADD_FLAG:'+FM_ADD_FLAG);  
  
  if(m==1){         //display
    FM_INIT_REC();
  }else{            //add or edit
    FM_FORCE_DELREC(FM_TRANS,recno);
    if(FM_ADD_FLAG){   
      FM_INIT_REC();
    }else{
      FM_DISP_REC(recno);
    }
  }
  //alert('m:'+m+'  flag:'+FM_ADD_FLAG); //FM_ADD_FLAG
  FM_BTN_LEVEL=1;
  //var fn = window[FM_FUNC.cancel];  
  //if (typeof fn === "function") fn(recno,true);   
}
//
function FM_INIT_REC(){
  document.getElementById('FM_HEAD').setAttribute('data-recno','');
  console.log('FM_INIT_REC');
  //FM_FM_MODE=1;
  FM_REFRESH_REC();
  //get_db_all(FM_TABLE_NAME);
  //get_db_all(FM_TABLE_NAME2);
  FM_ADD_FLAG=false;
  FM_MAIN_BOX(0);
  
  for(var i=0;i<FM_FIELDS.length;i++){
    var div=FM_FIELDS[i]['div'];    
    var fld=FM_FIELDS[i]['fld'];
    var disp=parseInt(FM_FIELDS[i]['disp']);
    //console.log('div: '+div);
    
    if(disp <= 0){   
      document.getElementById(div).style.display='none';
      continue; 
    }   
    
    document.getElementById(div).disabled=true;
    document.getElementById(div).value='';
  }

  if(FM_FM_MODE==2){    
    //WRITE FIELDS HEADINGS
    var ctr_FM_FIELDS2=0;
    var aryHD=[];
    for(var i=0;i<FM_FIELDS2.length;i++){
      var dv=FM_FIELDS2[i]['fld'];
      var hd=FM_FIELDS2[i]['hd'];
      var wd=FM_FIELDS2[i]['width']; 
      var al=FM_FIELDS2[i]['align'];      
      var disp=parseInt(FM_FIELDS2[i]['disp']);
      if(disp <= 0){ continue; }   

      let ob={
        dv:dv,
        hd:hd,
        wd:wd,
        al:al
      }
    
      aryHD[ctr_FM_FIELDS2]=ob;
      ctr_FM_FIELDS2++;
    }
    //print grid headings
    let id_hd='';
    var hhdd='<div style="width:100%;height:100%;margin:0;padding:0px;color:white;background:'+JBE_CLOR+';">';
    for(var i=0;i<ctr_FM_FIELDS2;i++){
      id_hd=FM_FIELDS2[i].fld;
      id_hd=aryHD[i].dv;
      hhdd+='<div id="'+id_hd+'" style="width:'+aryHD[i].wd+';height:100%;text-align:'+aryHD[i].al+';padding:5px;overflow:auto;border:1px solid lightgray;">'+aryHD[i].hd+'</div>';
      //console.log('ctr:'+i+' == '+id_hd);
    }
    hhdd+='</div>';
    document.getElementById('div_FM_dtl_div1').innerHTML=hhdd;
    //initialize dtl div
    document.getElementById('div_FM_dtl_div2').innerHTML='';
    let dv_hd=document.getElementById('div_FM_dtl_div1');
    let dv_dt=document.getElementById('div_FM_dtl_div2');
    dv_hd.style.width=dv_dt.clientWidth+'px';
  }

  var fn = window[FM_FUNC.init];
  if (typeof fn === "function"){
    if(fn()==false){ return; }
  }  
}

function isTextOverflowing(element) {
  return (element.clientHeight < element.scrollHeight);
}

function FM_DISP_REC(recno){  
  //alert('FM_DISP_REC:'+recno);
  console.log('FM_DISP_REC;FM_FM_MODE: '+FM_FM_MODE+'\nRECNO:'+recno);
  FM_BTN_LEVEL=1;
  
  document.getElementById('FM_HEAD').setAttribute('data-recno',recno);
  document.getElementById('div_FM_dtl_div2').innerHTML='';

  FM_ADD_FLAG=false;
  var fld=FM_RKEY;  
  //var fld=FM_FIELDS[0]['fld'];  
  //alert('FM_TABLE.length:'+FM_TABLE.length);
  
  for(var i=0;i<FM_TABLE.length;i++){
    var tbl_recno=FM_TABLE[i][fld];
    if( tbl_recno != recno){ continue; } //if trano not the same

    //display em
    for(var ii=0;ii < FM_FIELDS.length;ii++){ 
      var vfld=FM_FIELDS[ii]['fld'];
      var vdiv=FM_FIELDS[ii]['div'];
      var vtype=FM_FIELDS[ii]['type'];
      var vval=FM_TABLE[i][vfld];  
      
      //console.log('>>> FM_DISP_REC vdiv: '+vdiv+': vval: '+vval+'\nFLD: '+vfld); 
      if(vtype=='date'){ vval=JBE_DATE_FORMAT(vval,'YYYY-MM-DD'); } //CORRECT
      else if(vtype=='double'){ vval=JBE_FORMAT_DOUBLE_TO_STR(vval); }
      else if(vtype=='number'){ vval=JBE_FORMAT_INT_TO_STR(vval); }
      //console.log(vtype,vval);
      document.getElementById(vdiv).value=vval;          
      document.getElementById(vdiv).disabled=true; 
    }                   
  }   

  if(FM_FM_MODE==2){ FM_DISP_REC2(recno); }
  FM_MAIN_BOX(1);
  var fn = window[FM_FUNC.disp]; 
  if(typeof fn === "function") fn(fld); 
}

function FM_DISP_REC2(recno){
  let v_dtl='';
  let line_ctr=1;
      
  for(var k=0;k<FM_TABLE2.length;k++){
    //alert(FM_TABLE2[k][FM_RKEY]+' vs '+recno);
    if(FM_TABLE2[k][FM_RKEY] != recno){ continue; }
    
    let hhdd='<div id="dtl_'+line_ctr+'" class="dtls" onclick="FM_hl_row('+line_ctr+')" style="width:100%;height:30px;font-size:12px;margin:0;padding:0px;cursor:context-menu;color:black;background:none;">';
    for(var i=0;i<FM_FIELDS2.length;i++){
      var the_fld=FM_FIELDS2[i].fld;
      var the_div='dtl_'+the_fld;
      var the_disp=FM_FIELDS2[i].disp;
      var the_type=FM_FIELDS2[i].type;
      var the_width=FM_FIELDS2[i].width;
      var the_align=FM_FIELDS2[i].align;
      var the_val=FM_TABLE2[k][the_fld];

      if(FM_FIELDS2[i].hd=='FILLER'){
        the_div='fil_'+the_fld;
      }

      //////////////////////////
      var ndx=the_fld.indexOf('|');
      var param='';
      if(ndx >= 0){
        param=the_fld.substr(ndx+1);
        the_fld=the_fld.substr(0,ndx);
      }      
      var fn = window[the_fld];
      //console.log('FM_DISP2 >>> the_fld:'+the_fld+'  the_val:'+the_val);
      let f_fn=false;
      if (typeof fn === "function"){ f_fn=true; the_val=fn(FM_TABLE2[k][param]); }
      //////////////////////////

      if(the_type=='date'){ the_val=JBE_DATE_FORMAT(the_val,'MM-DD-YYYY'); }
      else if(the_type=='double' || the_type=='doubleText'){ the_val=JBE_FORMAT_DOUBLE_TO_STR(the_val); }
      else if(the_type=='number' || the_type=='numberText'){ the_val=JBE_FORMAT_INT_TO_STR(the_val); }
      //console.log('--- the_fld:'+the_fld+'   the_val:'+the_val+'  disp:'+the_disp+'  the_div:'+the_div);
      hhdd+='<span id="'+the_div+'_'+line_ctr+'" class="class_mtr1" style="display:'+iif(the_disp==1,'block','none')+';width:'+the_width+';height:100%;text-align:'+the_align+';padding:4px;overflow:auto;border:1px solid lightgray;background:none;">'+the_val+'</span>';
      //console.log('disp2 : '+the_div+'_'+line_ctr);
    }
    hhdd+='</div>';
    v_dtl+=hhdd;
    line_ctr++;
    //console.log('disp2:'+hhdd);
  }   
  document.getElementById('div_FM_dtl_div2').innerHTML=v_dtl; 
  let dv_hd=document.getElementById('div_FM_dtl_div1');
  let dv_dt=document.getElementById('div_FM_dtl_div2');
  dv_hd.style.width=dv_dt.clientWidth+'px';

  /*
  let last_div=FM_FIELDS2[FM_FIELDS2.length-1].fld;
  //let last_div=id_hd;
  //console.log('last_div:'+last_div);

  const element = document.querySelector('#div_FM_dtl_div2');
  if(isTextOverflowing(element)){
    document.getElementById(last_div).style.border='0px solid lightgray';
    document.getElementById(last_div).style.borderLeft='1px solid lightgray';
  }else{
    document.getElementById(last_div).style.borderRight='1px solid lightgray';
  }
  */
}

function FM_ADD_ITEM(f_add){  
  var fn = window[FM_FUNC.add_item];  
  var rval=true;
  if(typeof fn === "function") rval=fn(f_add);
  if(!rval){ return; }
    
  var m=parseInt(document.getElementById("myView1").getAttribute('data-JBEpage'));
  
  var tilt=iif(f_add,'Add Item','Edit Item');  
  document.getElementById('back_view'+m).style.display='none';
  document.getElementById('cap_viewMid'+m).innerHTML=tilt;
  document.getElementById('cap_myView'+m).innerHTML=FM_TITLE;
  MNU_FM_ADD_ITEM(f_add);  
}

function MNU_FM_ADD_ITEM(f_add){
  var jmenu=  
  '<div style="width:100%;height:100%;">'+

    '<div onclick="FM_save_item('+f_add+')" style="float:left;width:25%;height:100%;background:none;">'+
      '<div class="class_footer">'+
        '<img src="gfx/jdown.png" alt="call image" />'+
        '<span>OK</span>'+
      '</div>'+
    '</div>'+
    '<div onclick="JBE_CLOSE_VIEW();FM_close_add_item();" style="float:right;width:25%;height:100%;background:none;">'+
      '<div class="class_footer">'+
        '<img src="gfx/jclose.png"  alt="home image" />'+
        '<span>Close</span>'+
      '</div>'+
    '</div>'+

  '</div>';
  dispMenu(false,jmenu);
}




function FM_close_add_item(){
  //alert(900);
  FM_fm_menu();
  FM_FM_MODE=2;
  FM_MAIN_BOX(3);
  FM_no_item();
}


////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
function FM_dupli(f_add){
  let rval=false;
  let ary_div=[]; let ctr_div=0;
  let cond='';
  for(var i=0;i<FM_FIELDS2.length;i++){
    let div=FM_FIELDS2[i].fld;
    let dupli=FM_FIELDS2[i].dupli;
    if(dupli==1){ //duplication flag
      let ob={
        fld:div,
        input:FM_FIELDS2[i].input,
        type:FM_FIELDS2[i].type
      }
      ary_div[ctr_div]=ob;
      ctr_div++;
      //cond+='dtl_'+div+
    }
  }
    
  if(ary_div.length==0){ return false; }

  //alert(f_add+'  the_div:'+the_div);
  let curRow=parseInt(document.getElementById('div_FM_dtl_div2').getAttribute('data-row'));  
  //let curVal=document.getElementById(ary_div).innerHTML;  
  
  let len_dtls=document.querySelectorAll('.dtls').length;  
  let ctr_chk=0; 
  let the_row=0;
  let f_found=false;
  //console.log('----------------');
  for(var i=1;i<=len_dtls;i++){
    the_row=0;
    ctr_chk=0;
    let d_dtl=document.getElementById('dtl_'+i).style.display;
    if(!d_dtl){ d_dtl='block'; }
    //console.log('<--- '+document.getElementById('dtl_'+i).style.display);
    for(var ii=0;ii<ary_div.length;ii++){
      
      //if(!d_dtl || d_dtl=='none'){ continue; }
      
      let v_dtl_val=document.getElementById('dtl_'+ary_div[ii].fld+'_'+i).innerHTML;
      //let v_dtl_display=document.getElementById(ary_div[i]+'_'+i).style.display;
      let v_txt_val=document.getElementById('txt_'+ary_div[ii].fld).value;
      if(!ary_div[ii].input){ v_txt_val=document.getElementById('txt_'+ary_div[ii].fld).innerHTML; }
      if(v_dtl_val==v_txt_val && d_dtl=='block'){
        ctr_chk++;
      }
    }

    if(ctr_chk==ary_div.length){
      the_row=i;
      //console.log('BREAK YES');
      f_found=true;
      break;
    }
    
  }
  
  if(f_found){
    /*
    alert(
      'f_add: '+f_add+'\n'+
      'f_found: '+f_found+'\n'+
      'the_row: '+the_row+'\n'+
      'd_dtl: '+d_dtl
    );
    */
    //console.log(f_add,ctr_chk,the_row,curRow);
    if(!f_add && the_row==curRow){
      rval=false;
    }else{
      snackBar('ERROR: Item already EXIST!');
      rval=true;
    }
  }else{
    rval=false;
  }
  return rval;
}

//////////////////////////////////////////////////////
async function FM_FORCE_ADDREC(trans,docno,func_edit,div){
  showProgress(true);
  var fn = window[func_edit];
  if (typeof fn === "function"){ fn(); }
  
  await axios.get('/api/get_latest', { params: { trans:trans,docno:docno } })
  .then(function (response) {     
    let ndocno=response.data;
    //alert('force Add docno:'+docno+' vs ndocno:'+ndocno);
    if(ndocno){
      //alert('latest trano from locker table:'+ndocno);
      if(ndocno > docno){
        ndocno=make_new_trano(trans,ndocno);        
        //alert('greater');
      }else{        
        ndocno=make_new_trano(trans,docno);
        //alert('lesser');
      }      
    }else{
      ndocno=docno;
    }
    //alert('ndocno:'+ndocno);
    document.getElementById(div).value=ndocno;
    document.getElementById(div).setAttribute('data-docno',ndocno);
    FM_ADD_LOCK(trans,ndocno,'ADD');   
    showProgress(false);
  })    
  .catch(function (error) { showProgress(false); console.log(error); });
}

//////////////////////////////////////////////////////
async function FM_ADD_LOCK(trans,docno,status){  
  var vDate=new Date();  
  var vTime = vDate.toLocaleTimeString('it-IT');  
  let arr={
    "trans": trans,
    "docno": docno,
    "status": status,
    "usercode":CURR_USER,
    "username": JBE_GETFLD('username',DB_USER,'usercode',CURR_USER),
    "date": JBE_DATE_FORMAT(vDate,'MM-DD-YYYY'),
    "time": vTime,
    "locked": true
  }; 
  
  //await axios.put('/api/add_rlock', {headers: { 'Content-Type': 'application/json' }}, { params: { arr:arr } })
  //await axios.put('/api/add_rlock', {headers: { 'Content-Type': 'application/json' }}, { params: { arr:arr } })

  let vsql='';
  let vcommas='';
  let fldnames=[
    "trans","docno","status","usercode","username","date","time","locked"
  ];
  let fldvals=[
    trans,docno,status,CURR_USER,JBE_GETFLD('username',DB_USER,'usercode',CURR_USER),
    JBE_DATE_FORMAT(vDate,'YYYY-MM-DD'),vTime,true
  ];

  for(var i=0;i<fldnames.length;i++){
    vsql+=fldnames[i]+',';
    vcommas=vcommas+'?,';
    //console.log('>>> '+fldnames[i]);
    //console.log('>>>>> '+fldvals[i]);
  }
  vsql=vsql.substring(0,vsql.length-1);
  vcommas=vcommas.substring(0,vcommas.length-1);
  FM_AXIOS_SQL='INSERT INTO locker ('+vsql+') VALUES ('+vcommas+')';  
  FM_AXIOS_PARA1=fldvals;
  //console.log(FM_AXIOS_SQL);
  //console.log(FM_AXIOS_PARA1);
  axios.post('/api/fmlib_save', {headers: { 'Content-Type': 'application/json' }}, { params: { sql:FM_AXIOS_SQL,fld:FM_AXIOS_PARA1,tbl:'locker',fm_mode:1 } })    
  .then(function (response) {  
    snackBar('Lock:'+status);
  })    
  .catch(function (error) { console.log(error); });  
}

//
async function FM_REC_LOCK(trans,docno,func_edit2){    
  var fn = window[func_edit2];
  /*
  await axios.get('/api/get_rlock', { params: { trans:trans,docno:docno } })
  .then(function (response) { 
    if(response.data.length==0){ 
      FM_ADD_LOCK(trans,docno,'EDIT'); 
      if (typeof fn === "function"){ fn(); }
      return; 
    }
    
    if(response.data['usercode'] != CURR_USER){
      MSG_SHOW(vbOk,"RECORD LOCKED!!!",
        "<center>Locked by: "+response.data['username']+"</center>",
        function(){},function(){}
      ); 
      return;
    }else{
      //snackBar('9');
      if (typeof fn === "function"){ fn(); }
      return;
    }
    
  })    
  .catch(function (error) { console.log(error); });
  */
  await axios.get('/api/get_rlock', { params: { trans:trans,docno:docno } })
  .then(function (response) { 
    //console.log(response.data);
    if(response.data.length==0){ 
      FM_ADD_LOCK(trans,docno,'EDIT'); 
      if (typeof fn === "function"){ fn(); }
      return; 
    }
    //alert(response.data[0]['usercode']+' vs '+CURR_USER);
    if(response.data[0]['usercode'] != CURR_USER){
      MSG_SHOW(vbOk,"RECORD LOCKED!!!",
        "<center>Locked by: "+response.data[0]['username']+"</center>",
        function(){},function(){}
      ); 
      return;
    }else{
      if (typeof fn === "function"){ fn(); }
      return;
    }
    
  })    
  .catch(function (error) { console.log(error); });
}

function FM_FORCE_DELREC(trans,docno){
  if(!docno){ 
    console.log(':::FM_FORCE_DELREC: Trans:'+trans+'  No Delete...');
    return; 
  }
  console.log(':::FM_FORCE_DELREC: Trans:'+trans+'  DocNo:'+docno);
  axios.delete('/api/del_rlock', { params: { trans:trans,docno:docno,usercode:CURR_USER } })    
  .then(function (response) { 
    console.log(response.data);
  })    
  .catch(function (error) { console.log(error); });  
}  

async function FM_FORCE_CHG_DOCNO(trans,docno,new_docno){ 
  //alert('CHANGE TRIGGERED: '+trans+' new_docno:'+new_docno+'  DocNo:'+docno);
  await axios.put('/api/chg_rlock', {headers: { 'Content-Type': 'application/json' }}, { params: { trans:trans,docno:docno,new_docno:new_docno } })    
  .then(function (response) { 
    console.log(response.data);
  })    
  .catch(function (error) { console.log(error); });  
}  

function make_new_trano(trans,trano){
  var new_trano='';
  var prfx='';
  var lenmax=0;
  var v_num=0;

  if(trans=='NIP'){
    prfx=trano.substring(0,15);
    lenmax=2;
    v_num=parseInt(trano.substring(15,17))+1;
  }else if(trans=='COVAC'){
    prfx='C19 '+trano.substring(4,15);
    lenmax=2;
    v_num=parseInt(trano.substring(15,17))+1;
  }else if(trans=='RR'){
    prfx=trano.substring(0,3);
    lenmax=5;
    v_num=parseInt(trano.substring(3,17))+1;
  }else if(trans=='ADJ'){
    prfx=trano.substring(0,3);
    lenmax=4;
    v_num=parseInt(trano.substring(3,17))+1;
  }else if(trans=='RT'){
    prfx=trano.substring(0,3);
    lenmax=4;
    v_num=parseInt(trano.substring(3,17))+1;    
  }else if(trans=='xRET'){
    prfx=trano.substring(0,4);
    lenmax=4;
    v_num=parseInt(trano.substring(4,17))+1;
  }else if(trans=='RET'){
    prfx='RET '+trano.substring(4,15);
    lenmax=2;
    v_num=parseInt(trano.substring(15,17))+1;
  }
  //alert(trans+' v_num:'+v_num);
  new_trano=prfx+v_num.toString().padStart(lenmax,0); 
  //new_trano=new_trano+v_num.toString().padStart(4,0); 
  //console.clear();
  console.log('trans:'+trans+' v_num:'+v_num);
  console.log('new_trano:'+new_trano);
  //alert(trans+':  prfx:'+prfx+'\nNum:'+v_num);
  //alert('old:'+trano+'\nNew:'+new_trano);
  //alert('old:'+trano+'\nNew:'+new_trano);
  return new_trano;
}

///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
function xzxFM_LOOKUP2(mode,val_Search,div_Search,DB,arySort,tilt,func,flds,func2) { 
  if(!mode){
    //document.getElementById('lookup').style.display='none';    
    JBE_CLOSEBOX();
    return;
  }   

  //console.clear();

  var FM_newArr = [...DB];
  FM_newArr.sort(JBE_SORT_ARRAY(arySort));

  if(!FM_newArr.length){ 
    MSG_SHOW(vbOk,"EMPTY: ","Nothing to show.",function(){},function(){}); 
    return;
  }
  
  var box2=0; 
  var box1=H_VIEW-(60+box2);
  var v_line=0;
  
  var dtl=          
    '<div id="div_name" data-zoom=0 style="width:100%;height:'+box1+'px;font-text:14px;padding:0px;background-color:white;">'+         
      '<div style="width:100%;height:40px;padding:2px;text-align:center;color:'+JBE_TXCLOR1+';background:'+JBE_CLOR+';">'+
         '<input id="filterInput" type="text" style="float:left;width:100%;height:100%;text-align:center;" value="" placeholder="Search here..."/>'+      
      '</div>'+    
      '<div style="width:100%;height:30px;color:'+JBE_TXCLOR1+';background:'+JBE_CLOR+';">'+
        '<div id="dv_hd" style="margin-top:5px;width:100%;height:100%;padding:5px;text-align:center;">';          
          for(var i=0;i<flds.length;i++){
            let m_disp='block';
            if(!flds[i].title){ m_disp='none'; }
            dtl+='<div style="display:'+m_disp+';float:left;width:'+flds[i].width+';height:100%;text-align:'+flds[i].align+';margin:0px;padding:0px;border:0px solid black;overflow:auto;">'+flds[i].title+'</div>';
          }
          dtl+=
        '</div>'+
      '</div>'+          
      '<div id="dv_dt" data-line=0 style="width:100%;height:'+(box1-87+5)+'px;padding:0px;border:0px solid red;overflow:auto;">';
        var ddd='';
        
        let sel_color='black';
        let max_arySearch_len=div_Search.length;
        //alert('ob len:'+max_arySearch_len);
        //console.clear();
        for(var i=0;i<FM_newArr.length;i++){   
          ddd+=
          '<div id="d_'+i+'" class="cls_names" onclick="'+func+'('+i+');JBE_CLOSEBOX();" style="cursor:pointer;font-size:12px;width:100%;height:25px;padding:0px;border:1px solid gray;">';
            
            let z_dtl='';
            let cntr_fld=0;
            for(var z=0;z<flds.length;z++){
              //console.log('tulok:'+flds[z].fld);
              let fld=flds[z].fld;
              let fld_type=flds[z].type;
              let fld_val=FM_newArr[i][fld];

              //////////////////////////
              var ndx=fld.indexOf('|');
              var param='';
              if(ndx >= 0){
                param=fld.substr(ndx+1);
                fld=fld.substr(0,ndx);
              }      
              //console.log('the_fld:'+fld+'  the_val:'+fld_val);
              var fn = window[fld];
              let f_fn=false;
              if (typeof fn === "function"){ f_fn=true; fld_val=fn(FM_newArr[i][param]); }
              //////////////////////////
              
              //console.log('>>>  fld_val:'+fld_val+'   fld_type:'+fld_type);
              if(fld_type=='date'){ fld_val=JBE_DATE_FORMAT(fld_val,'YYYY-MM-DD'); }
              else if(fld_type=='double'){ fld_val=iif(fld_val,JBE_FORMAT_DOUBLE_TO_STR(fld_val),'0.00'); }
              else if(fld_type=='number'){ fld_val=iif(fld_val,JBE_FORMAT_INT_TO_STR(fld_val),'0'); }
              else if(fld_val==undefined){ fld_val=''; }

              let v_id='id="dd_'+fld+i+'"';
              sel_color='black';      
              //if(cntr_fld < max_arySearch_len && z!=flds.length){

              /*
              if(cntr_fld < max_arySearch_len){
                console.log('maxLen:'+max_arySearch_len+' ==*** fld:'+fld+' val:'+fld_val+' == '+div_Search[cntr_fld].val);
                if(fld=='loc'){ console.log('-----------> '+fld_val); }
                
                if(fld==div_Search[cntr_fld].fld && fld_val==div_Search[cntr_fld].val){ 
                  console.log(i+' ### fld:'+fld+' ### fld_val:'+fld_val+' == '+div_Search[cntr_fld].val);
                  cntr_fld++;
                }
                
                if(cntr_fld >= max_arySearch_len){ 
                  //alert('i:'+i);
                  v_line=i;
                  //document.getElementById('dv_dt').setAttribute('data-line',i);
                  
                  //v_id='id="dd_'+i+'"'; 
                  sel_color='violet';
                  console.log('matched: '+cntr_fld+':  Y Y Y --> '+i);
                  cntr_fld=max_arySearch_len; 
                }
              }
              */
              if(cntr_fld < max_arySearch_len){
                for(kk=0;kk<max_arySearch_len;kk++){
                  if(fld==div_Search[kk].fld && fld_val==div_Search[kk].val){ 
                    console.log(i+' ### fld:'+fld+' ### fld_val:'+fld_val+' == '+div_Search[kk].val);
                    cntr_fld++;
                  }
                }                
              }
              

              let m_disp='block';
              if(!flds[z].title){ m_disp='none'; }
              z_dtl+='<div '+v_id+' style="display:'+m_disp+';float:left;width:'+flds[z].width+';height:100%;padding:4px;border:0px solid red;overflow:auto;text-align:'+flds[z].align+';background:none;">'+fld_val+'</div>';
            
            }
            
            if(cntr_fld == max_arySearch_len){ 
              console.log(cntr_fld+' vs line:'+i);
              v_line=i;
              sel_color='violet';
              console.log('matched: '+cntr_fld+':  Y Y Y --> '+i);
              cntr_fld=max_arySearch_len+1; 
            }
                          
            ddd+=z_dtl+
          '</div>';          
        }
        dtl+=ddd+
      '</div>'+    
    '</div>';
     
  
  var dtl2=
    '<div style="width:100%;height:100%;text-align:center;padding:5px;background:none;">'+
      '<div style="float:left;width:50%;height:100%;text-align:left;padding:5px 0 0 0;">Look Up Mod ver. 2.2</div>'+
      '<div style="float:left;width:50%;height:100%;">'+
        '<input type="button" value="Clear" onclick="'+func+'('+(-1)+');JBE_CLOSEBOX();" style="float:left;width:80px;height:100%;"/>'+
        '<input type="button" value="Close" onclick="JBE_CLOSEBOX()" style="float:right;width:80px;height:100%;"/>'+       
      '</div>'+
    '</div>';

  JBE_OPENBOX('div_name',tilt,dtl,dtl2); 
  let dv_hd=document.getElementById('dv_hd');
  let dv_dt=document.getElementById('dv_dt');
  dv_hd.style.width=dv_dt.clientWidth+'px';

  if(div_Search[0].val){
    document.getElementById('d_'+v_line).scrollIntoView();        
    document.getElementById('d_'+v_line).style.color='white';
    document.getElementById('d_'+v_line).style.backgroundColor='black';
  }
        
  var fn = window[func2];
  if (typeof fn === "function"){ fn(); }   
  JBE_SEARCH_BOX2('filterInput','cls_names',val_Search);
}
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
function FM_LOOKUP2(mode,val_Search,div_Search,DB,arySort,tilt,func,flds,func2) { 
  if(!mode){
    //document.getElementById('lookup').style.display='none';    
    JBE_CLOSEBOX();
    return;
  }   

  //console.clear();

  var FM_newArr = [...DB];
  FM_newArr.sort(JBE_SORT_ARRAY(arySort));

  if(!FM_newArr.length){ 
    MSG_SHOW(vbOk,"EMPTY: ","Nothing to show.",function(){},function(){}); 
    return;
  }
  
  var box2=0; 
  var box1=H_VIEW-(60+box2);
  var v_line=0;
  
  var dtl=          
    '<div id="div_name" data-zoom=0 style="width:100%;height:'+box1+'px;font-text:14px;padding:0px;background-color:white;">'+         
      '<div style="width:100%;height:40px;padding:2px;text-align:center;color:'+JBE_TXCLOR1+';background:'+JBE_CLOR+';">'+
         '<input id="filterInput" type="text" style="float:left;width:100%;height:100%;text-align:center;" value="" placeholder="Search here..."/>'+      
      '</div>'+    
      '<div style="width:100%;height:30px;color:'+JBE_TXCLOR1+';background:'+JBE_CLOR+';">'+
        '<div id="dv_hd" style="margin-top:5px;width:100%;height:100%;padding:5px;text-align:center;">';          
          for(var i=0;i<flds.length;i++){
            let m_disp='block';
            if(!flds[i].title){ m_disp='none'; }
            dtl+='<div style="display:'+m_disp+';float:left;width:'+flds[i].width+';height:100%;text-align:'+flds[i].align+';margin:0px;padding:0px;border:0px solid black;overflow:auto;">'+flds[i].title+'</div>';
          }
          dtl+=
        '</div>'+
      '</div>'+          
      '<div id="dv_dt" data-line=0 style="width:100%;height:'+(box1-87+5)+'px;padding:0px;border:0px solid red;overflow:auto;">';
        var ddd='';
        
        let sel_color='black';
        let max_arySearch_len=div_Search.length;
        //alert('ob len:'+max_arySearch_len);
        //console.clear();
        for(var i=0;i<FM_newArr.length;i++){   
          ddd+=
          '<div id="d_'+i+'" class="cls_names" onclick="'+func+'('+i+');JBE_CLOSEBOX();" style="cursor:pointer;font-size:12px;width:100%;height:25px;padding:0px;border:1px solid gray;">';
            
            let z_dtl='';
            let cntr_fld=0;
            for(var z=0;z<flds.length;z++){
              //console.log('tulok:'+flds[z].fld);
              let fld=flds[z].fld;
              let fld_type=flds[z].type;
              let fld_val=FM_newArr[i][fld];

              //////////////////////////
              var ndx=fld.indexOf('|');
              var param='';
              if(ndx >= 0){
                param=fld.substr(ndx+1);
                fld=fld.substr(0,ndx);
              }      
              //console.log('the_fld:'+fld+'  the_val:'+fld_val);
              var fn = window[fld];
              let f_fn=false;
              if (typeof fn === "function"){ f_fn=true; fld_val=fn(FM_newArr[i][param]); }
              //////////////////////////
              
              //console.log('>>>  fld_val:'+fld_val+'   fld_type:'+fld_type);
              if(fld_type=='date'){ fld_val=JBE_DATE_FORMAT(fld_val,'YYYY-MM-DD'); }
              else if(fld_type=='double'){ fld_val=iif(fld_val,JBE_FORMAT_DOUBLE_TO_STR(fld_val),'0.00'); }
              else if(fld_type=='number'){ fld_val=iif(fld_val,JBE_FORMAT_INT_TO_STR(fld_val),'0'); }
              else if(fld_val==undefined){ fld_val=''; }

              let v_id='id="dd_'+fld+i+'"';
              sel_color='black';     
              
              if(cntr_fld < max_arySearch_len){
                for(kk=0;kk<max_arySearch_len;kk++){
                  if(fld==div_Search[kk].fld && fld_val==div_Search[kk].val){ 
                    console.log(i+' ### fld:'+fld+' ### fld_val:'+fld_val+' == '+div_Search[kk].val);
                    cntr_fld++;
                  }
                }                
              }
              

              let m_disp='block';
              if(!flds[z].title){ m_disp='none'; }
              z_dtl+='<div '+v_id+' style="display:'+m_disp+';float:left;width:'+flds[z].width+';height:100%;padding:4px;border:0px solid red;overflow:auto;text-align:'+flds[z].align+';background:none;">'+fld_val+'</div>';
            
            }
            
            if(cntr_fld == max_arySearch_len){ 
              console.log(cntr_fld+' vs line:'+i);
              v_line=i;
              sel_color='violet';
              console.log('matched: '+cntr_fld+':  Y Y Y --> '+i);
              cntr_fld=max_arySearch_len+1; 
            }
                          
            ddd+=z_dtl+
          '</div>';          
        }
        dtl+=ddd+
      '</div>'+    
    '</div>';
     
  
  var dtl2=
    '<div style="width:100%;height:100%;text-align:center;padding:5px;background:none;">'+
      '<div style="float:left;width:50%;height:100%;text-align:left;padding:5px 0 0 0;">Look Up Mod ver. 2.2</div>'+
      '<div style="float:left;width:50%;height:100%;">'+
        '<input type="button" value="Clear" onclick="'+func+'('+(-1)+');JBE_CLOSEBOX();" style="float:left;width:80px;height:100%;"/>'+
        '<input type="button" value="Close" onclick="JBE_CLOSEBOX()" style="float:right;width:80px;height:100%;"/>'+       
      '</div>'+
    '</div>';

  JBE_OPENBOX('div_name',tilt,dtl,dtl2); 
  let dv_hd=document.getElementById('dv_hd');
  let dv_dt=document.getElementById('dv_dt');
  dv_hd.style.width=dv_dt.clientWidth+'px';

  if(div_Search[0].val){
    document.getElementById('d_'+v_line).scrollIntoView();        
    document.getElementById('d_'+v_line).style.color='white';
    document.getElementById('d_'+v_line).style.backgroundColor='black';
  }
        
  var fn = window[func2];
  if (typeof fn === "function"){ fn(); }   
  JBE_SEARCH_BOX2('filterInput','cls_names',val_Search);
}