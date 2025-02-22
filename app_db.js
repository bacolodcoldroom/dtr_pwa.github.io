var dbVersion = 1;
var dbReady = false;
var db;

if (navigator.storage && navigator.storage.persist)
  navigator.storage.persist().then(granted => {
    if (granted){
      //alert("Storage will not be cleared except by explicit user action");
      PERSIST_GRANTED=true;
    }else{
      //alert("Storage may be cleared by the UA under storage pressure.");
      PERSIST_GRANTED=false;
    }
  }
);

var CURR_IDX_DB='IDB_'+CURR_CLIENT;
initDb();

function initDb() {
  //console.log('initDb activated...'+JBE_ONLINE);
  var request = indexedDB.open(CURR_IDX_DB, dbVersion);
  
  request.onerror = function(e) {    
    console.error('Unable to open database.');
  }

  request.onsuccess = function(e) {
    db = e.target.result;
    console.log('db opened');  
  }

  request.onupgradeneeded = function(e) {
    db = e.target.result;
    db.createObjectStore('daily', { keyPath:'id' });
    db.createObjectStore('monthly', { keyPath:'id' });    
    db.createObjectStore('sig', { keyPath:'id' });    
    db.createObjectStore('sysfile', { keyPath:'id' });
    db.createObjectStore('user', { keyPath:'id' });    
    dbReady = true;
  }
}

function clearStore(jstore){   
  //alert(jstore);
  var request = indexedDB.open(CURR_IDX_DB, dbVersion);
  request.onerror = function(e) {    
    console.error('Unable to open database.');
  }
  request.onsuccess = function(e) {
    var db1 = e.target.result;  
    var trans = db1.transaction([jstore], 'readwrite');
    var req = trans.objectStore(jstore).clear();
  
    //alert(111);
    req.onerror = function(e) {
      console.log('error clearing storeobject');
      console.error(e);
      //alert('error');
    }

    req.onsuccess = function(e) {
      console.log('objectStore Cleared');
      //alert('success');
    }
  }
}


/****************************************/
function countRecordIDX(n){  
  var request = indexedDB.open(CURR_IDX_DB, dbVersion);
  request.onerror = function(e) {    
    console.error('Unable to open database.');
  }
  request.onsuccess = function(e) {
    var db1 = e.target.result;
    var flename=JBE_STORE_IDX[n]['flename'];   
    //alert('countRecordIDX: '+flename);
    var jstore = db1.transaction([flename]).objectStore(flename); 
    var count = jstore.count();
    count.onsuccess = function() {      
      JBE_STORE_IDX[n]['numrec']=count.result;
      console.log('countRecordIDX: '+JBE_STORE_IDX[n]['flename']+' '+count.result);
    }
  }
}

/****************************************/
function getAllDataFromIDX(vmode) {   
  //alert('getAllDataFromIDX: '+JBE_STORE_IDX.length);
  var request = indexedDB.open(CURR_IDX_DB, dbVersion);  
  request.onerror = function(e) {    
    console.error('Unable to open database.');
  }

  var ctr=0;
  request.onsuccess = function(e) {
    var db2 = e.target.result;
    for(var i=0;i < JBE_STORE_IDX.length;i++){
      //if(!vmode && JBE_STORE_IDX[i]['init'] == 0) { continue; }
      //if(parseInt(JBE_STORE_IDX[i]['init']) != vmode) { continue; }
      //alert(JBE_STORE_IDX[i]['flename']+' = '+JBE_STORE_IDX[i]['numrec']);
      //alert('i = '+i);
      getDataFromIDX(i,db2);  
      ctr++;
    }
  }
  //alert('total: '+ctr);
}  

function getDataFromIDX(i,db2) {  
  var idx=0;
  var aryIDB=[]; 
  var flename=JBE_STORE_IDX[i]['flename'];
      
  var trans = db2.transaction([flename]);
  var object_store = trans.objectStore(flename);
  var request1 = object_store.openCursor();

  request1.onerror = function(event) {
    console.err("error fetching data");
    //alert("error fetching data");
  };
  
  request1.onsuccess = function(event) {        
    var cursor = event.target.result;    
    if (cursor) {
      var key = cursor.primaryKey;
      var ob;
      if(i==0){ //Sysfile
        ob = {
          id:i,
          banner:cursor.value.banner,
          hd1:cursor.value.hd1,
          hd2:cursor.value.hd2,
          hd3:cursor.value.hd3,
          pg_title:cursor.value.pg_title,
          pg_body:cursor.value.pg_body,
          clor1:cursor.value.clor1,
          clor2:cursor.value.clor2, 
          clor3:cursor.value.clor3,
          clor4:cursor.value.clor4,
          txclor1:cursor.value.txclor1,
          txclor2:cursor.value.txclor2, 
          txclor3:cursor.value.txclor3,
          txclor4:cursor.value.txclor4,
          telno:cursor.value.telno,
          celno:cursor.value.celno,
          slide1:cursor.value.slide1, 
          slide2:cursor.value.slide2, 
          slide3:cursor.value.slide3
        };  
      }else if(i==1){ //User
        ob = {
          id:i,
          usercode:cursor.value.usercode,
          username:cursor.value.username,            
          photo:cursor.value.photo
        };        
      }

      aryIDB[idx]=ob;    
      idx++;
      cursor.continue();
    }else{
      if(i==0){     
        DB_SYS=[]; DB_SYS=aryIDB;
        showSystem();
      }else if(i==1){          
        DB_USER=[]; DB_USER=aryIDB;
        showProfile(2);      
      }
      //alert(JBE_STORE_IDX[i]['flename']+aryIDB.length);
      JBE_STORE_IDX[i]['numrec']=aryIDB.length;
    }    
  }
}  

function refreshIDX(){    
  return;
  //alert('refreshIDX '+DB_SYS.length+' = '+DB_SYS[0]['clientname']);  
  if(JBE_STORE_IDX[0]['numrec'] != DB_SYS.length){ clearStore(JBE_STORE_IDX[2]['flename']); saveDataToIDX(DB_SYS,0); }
  if(JBE_STORE_IDX[1]['numrec'] != DB_USER.length){ clearStore(JBE_STORE_IDX[3]['flename']); saveDataToIDX(DB_USER,1); }         
  //jdata();  
}

function jdata(){
  //if(CURR_AXTYPE < 9){ return; }
  var jd=
    'From IDX '+JBE_STORE_IDX[0]['flename']+' : '+JBE_STORE_IDX[0]['numrec']+' vs '+DB_CAT.length+' Array<br>'+
    'From IDX '+JBE_STORE_IDX[1]['flename']+' : '+JBE_STORE_IDX[1]['numrec']+' vs '+DB_STOCK.length+' Array<br>'+
    'From Array CLIENTS '+DB_CLIENTS.length+' Array<br>'+
    'From Array BELLS '+DB_BELL.length+' Array<br>';    

  MSG_SHOW(vbOk,"DATA:",jd,function(){},function(){}); 
}

function saveDataToIDX(aryDB,n) {    
  //alert('saveDataToIDX '+n);
  JBE_STORE_IDX[n]['numrec']=aryDB.length;
  for(var i=0;i<aryDB.length;i++){     
    //if(aryDB[i]['clientno']!=CURR_CLIENT){ continue; }
    putDataToIDX(i,aryDB,n);
  }
}
async function putDataToIDX(i,aryDB,n){   
  //alert('i: '+i+' file#:'+n);
  if(n != 0){ return; }
  if(n==0){ //daily   
    ob = {
      id:i,
      date:aryDB[i]['date'],
      rank:aryDB[i]['rank'],
      usercode:aryDB[i]['usercode'],
      day:aryDB[i]['day'],
      time1:aryDB[i]['time1'],
      time2:aryDB[i]['time2'],
      time3:aryDB[i]['time3'],
      time4:aryDB[i]['time4'],

      txt:aryDB[i]['txt'],
      txt_top:aryDB[i]['txt_top'],
      txt_left:aryDB[i]['txt_left'],
      txt_width:aryDB[i]['txt_width'],
      txt_fsize:aryDB[i]['txt_fsize']
    };
  }else if(n==3){ //sysfile
    var jimg=JBE_API+'gfx/banner.jpg';
    //var jimg='gfx/banner.jpg';
    await JBE_BLOB(n,jimg).then(result => jimg=result);
    var slide1,slide2,slide3; 
    //var jimg2='gfx/'; 
    var jimg2=JBE_API+'gfx/';    
    await JBE_BLOB(n,jimg2+'slide1.jpg').then(result => slide1=result);
    await JBE_BLOB(n,jimg2+'slide2.jpg').then(result => slide2=result);
    await JBE_BLOB(n,jimg2+'slide3.jpg').then(result => slide3=result);
    ob = {
      id:i,
      banner:jimg,
      hd1:aryDB[i]['hd1'],
      hd2:aryDB[i]['hd2'],
      hd3:aryDB[i]['hd3'],              
      pg_title:aryDB[i]['pg_title'],
      pg_body:aryDB[i]['pg_body'],
      clor1:aryDB[i]['clor1'],
      clor2:aryDB[i]['clor2'],
      clor3:aryDB[i]['clor3'],
      clor4:aryDB[i]['clor4'],
      txclor1:aryDB[i]['txclor1'],
      txclor2:aryDB[i]['txclor2'],
      txclor3:aryDB[i]['txclor3'],
      txclor4:aryDB[i]['txclor4'],
      telno:aryDB[i]['telno'],
      celno:aryDB[i]['celno'],
      slide1:slide1,
      slide2:slide2,
      slide3:slide3
    };  
  }else if(n==4){ //user
    //var jimg='upload/users/'+aryDB[i]['photo'];
    var jimg=JBE_API+'upload/users/'+aryDB[i]['photo'];   
    await JBE_BLOB(n,jimg).then(result => jimg=result);
    ob = {
      id:i,
      usercode:aryDB[i]['usercode'],
      username:aryDB[i]['username'],            
      photo:jimg
    };
  }

  var trans = db.transaction([JBE_STORE_IDX[n]['flename']], 'readwrite');
  var addReq = trans.objectStore(JBE_STORE_IDX[n]['flename']).put(ob);
  addReq.onerror = function(e) {
    //console.log('error storing data');
    console.log('ERROR: putToIDX '+JBE_STORE_IDX[n]['flename']);
    console.error(e);
  }

  trans.oncomplete = function(e) {
    //alert(n+': putToIDX '+JBE_STORE_IDX[n]['flename']+' with value '+JBE_STORE_IDX[n]['numrec']);  
    //alert(xox);
  }
}
