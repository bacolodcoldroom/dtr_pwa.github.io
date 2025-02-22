async function get_lock(){
  await axios.get('/api/get_rlock', { params: {tbl:'ptr2'} })
  .then(function (response) { 
    console.log('axios:'+response.data.length);     
    let Ary=response.data;
    for(var i=0;i<Ary.length;i++){
      console.log('get_lock >>>:'+Ary[i].status);
    }
  })    
  .catch(function (error) { console.log(error); });
}

async function put_lock(){
  let arr={
    "trans": "xxx",
    "docno": 12,
    "status": "Del",
    "locked": false
  };  

  await axios.put('/api/put_rlock', {headers: { 'Content-Type': 'application/json' }}, { params: { pra:arr }} )
  //axios.put('/api/fmlib_update', {headers: { 'Content-Type': 'application/json' }}, { params: { sql:FM_AXIOS_SQL,fld:FM_AXIOS_PARA1,tbl:FM_TABLE_NAME,fm_mode:1 } }) 
  .then(function (response) {   
    let Ary=response.data;
    alert(Ary);
  })    
  .catch(function (error) { console.log(error); });
}

async function add_lock(){
  let arr={
    "trans": "xxx",
    "docno": 12,
    "status": "Del",
    "locked": false
  };  

  await axios.put('/api/put_rlock', {headers: { 'Content-Type': 'application/json' }}, { params: { pra:arr }} )
  //axios.put('/api/fmlib_update', {headers: { 'Content-Type': 'application/json' }}, { params: { sql:FM_AXIOS_SQL,fld:FM_AXIOS_PARA1,tbl:FM_TABLE_NAME,fm_mode:1 } }) 
  .then(function (response) {   
    let Ary=response.data;
    alert(Ary);
  })    
  .catch(function (error) { console.log(error); });
}