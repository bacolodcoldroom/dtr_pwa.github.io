async function rest_api_start(){   
 /*
  get_all_db_from_json();
  getAllDataFromIDX();
  return;
 */
  
  /*
  // Usage example:
  getTableData(CURR_IDX_DB, "user",1)
  .then((data) => {    
    DB_CLIENTS=data;
    //console.log("Data from IndexedDB:", DB_CLIENTS);
    if(data.length==0){
      MSG_SHOW(vbOk,'ERROR:','No Database Found. Create New one.',function(){ get_all_db_from_json(); },function(){});
    }
    getAllDataFromIDX();
    dispHeaderMode();
  })
  .catch((error) => {
    console.error("Error:", error);
  });
  */
  let data=await readAllRecords('user'); 
  DB_USER=data; DB_CLIENTS=data;
  //alert('do_start: '+data.length);
  if(data.length==0){
    MSG_SHOW(vbOk,'ERROR:','No Database Found. Create New one.',function(){ get_all_db_from_json(); },function(){});
  }
  getAllDataFromIDX();
  /*
  DB_DAILY=await readAllRecords('daily');
  DB_MONTHLY=await readAllRecords('monthly');
  DB_SIG=await readAllRecords('sig');
  */
  dispHeaderMode();
}

function do_start(j,data){
  DB_USER=data; DB_CLIENTS=data;
  alert('do_start: '+data.length);
  if(data.length==0){
    MSG_SHOW(vbOk,'ERROR:','No Database Found. Create New one.',function(){ get_all_db_from_json(); },function(){});
  }
  getAllDataFromIDX();
  /*
  readAllRecords('daily','ttest(0)');
  readAllRecords('monthly','ttest(1');
  readAllRecords('sig','ttest(2)');
  */
  let jdb=readAllRecords('daily');
  alert(jdb);
  dispHeaderMode();
}

function ttest(tbl,data){
  console.log('ttest: '+tbl+' ::: '+data);
  if(tbl=='daily'){
    DB_DAILY=data;
    console.log('ttest Daily: '+DB_DAILY.length);
  }
}
 

function getTableData(dbName, storeName, dbVersion = 1) {
  return new Promise((resolve, reject) => {
    // Open the database (and create it if it doesn't exist)
    const request = indexedDB.open(dbName, dbVersion);

    request.onerror = (event) => {
      reject(`Error opening database: ${event.target.errorCode}`);
    };

    request.onupgradeneeded = (event) => {
      // This callback is triggered if the database is being created or upgraded.
      // Make sure the object store exists or create it here if needed.
      const db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });
      }
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      // Start a read-only transaction on the desired object store.
      const transaction = db.transaction(storeName, "readonly");
      const objectStore = transaction.objectStore(storeName);

      // Retrieve all records from the object store.
      const getAllRequest = objectStore.getAll();

      getAllRequest.onerror = (event) => {
        reject(`Error retrieving data: ${event.target.errorCode}`);
      };

      getAllRequest.onsuccess = (event) => {
        resolve(event.target.result);
      };
    };
  });
}

function get_all_db_from_json(){  
  fetch('./DBF/daily.json').then(res => res.json()).then(data => { DB_DAILY=data;saveDataToIDX(data,0); })  
  fetch('./DBF/monthly.json').then(res => res.json()).then(data => { DB_MONTHLY=data;saveDataToIDX(data,1); })
  fetch('./DBF/sig.json').then(res => res.json()).then(data => { DB_SIG=data;saveDataToIDX(data,2); })
  fetch('./DBF/user.json').then(res => res.json()).then(data => { DB_USER=data;DB_CLIENTS=data;saveDataToIDX(data,3); })
}

function rest_api_lognow(u,p){
  //alert(u+' vs '+p+'  clients:'+DB_CLIENTS.length);
  let f_found=false;
  for(var i=0;i<DB_CLIENTS.length;i++){
    if(DB_CLIENTS[i].userid.toUpperCase()==u && DB_CLIENTS[i].pword.toUpperCase()==p){
      f_found=true;
      break;
    }
  }

  if(f_found){      
    CURR_USER=DB_CLIENTS[i]['usercode']; 
    CURR_NAME=DB_CLIENTS[i]['username']; 
    CURR_NAME2=DB_CLIENTS[i]['username2']; 
    CURR_AXTYPE=DB_CLIENTS[i]['usertype'];   
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

    //document.getElementById("div_logo").style.width='100%';
    document.getElementById("menu_open").style.display='none';
    //DB_USER=DB_CLIENTS;
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

function rest_api_save_profile(vmode,usercode,u,p,n,n2,n2full,a,photo,c,lat,lng,d_active,usertype){
  let req=0;
  if(vmode==1){
    req=2; //add
  }else{
    req=3; //edit
  }
  let api='';
  if(DEBUG_NODE){
    api='/api/save_user';
    if(vmode!=1){ api='/api/upd_user'; }
    axios.put(api, {headers: { 'Content-Type': 'application/json' }},{ params: {
      usercode:usercode,
      userid:u,
      pword:p,
      username:n, 
      username2:n2, 
      fullname:n2full, 
      addrss:a,     
      photo:photo,
      celno:c,
      lat:lat,
      lng:lng,
      d_active:d_active,
      usertype:usertype
    }})
    .then(function (response){ api_save_user(response,req,n); }).catch(function (error) { console.log(error); });
  }else{ //PHP
    req=2;
    if(vmode!=1){ req=3; }
    axios.post('z_user.php', { request: req,  
      usercode:usercode,
      userid:u,
      pword:p,
      username:n, 
      username2:n2, 
      fullname:n2full, 
      addrss:a,     
      photo:photo,
      celno:c,
      lat:lat,
      lng:lng,
      d_active:d_active,
      usertype:0
    },JBE_HEADER)
    .then(function (response){ api_save_user(response,req,n); }).catch(function (error) { console.log(error); });
  }
  function api_save_user(response,req,n){
    showProgress(false);
    var usercode=document.getElementById('div_admin_profile').getAttribute('data-usercode');
    if(req==2){
      if(response.data=="EXIST"){        
        MSG_SHOW(vbOk,"ERROR:","User already exist!, Try Again...",function(){},function(){});
        return;
      }
      DB_USER=response.data;
      snackBar('Signing Up is successful...');    
    }else{
      DB_USER=response.data;
      snackBar('User Updated...');
      update_curr_user(usercode,n);
      document.getElementById('admin_username').innerHTML=n;     
    }    
    get_db_all('user');
    dispHeaderMode();
    JBE_CLOSE_VIEW();
  }
}