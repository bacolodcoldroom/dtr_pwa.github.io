// Open (or create) the database
function openDatabase(tbl) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(CURR_IDX_DB, 1);

    // Create the object store if this is the first time opening or if a version change occurs.
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(tbl)) {
        // keyPath is "id" and autoIncrement is enabled.
        const store = db.createObjectStore(tbl, { keyPath: "id", autoIncrement: true });
        // Optional: create an index on "name"
        //store.createIndex("name", "name", { unique: false });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(`Database error: ${event.target.errorCode}`);
    };
  });
}

// ------------------------------
// Create (Add) a new record
// ------------------------------
async function createRecord(data,tbl) {
  return openDatabase(tbl).then(db => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(tbl, "readwrite");
      const store = transaction.objectStore(tbl);
      const request = store.add(data);

      request.onsuccess = (event) => {
        resolve(event.target.result); // Returns the generated key (id)
        
      };

      request.onerror = (event) => {
        reject(`Error adding record: ${event.target.error}`);
      };
    });
  });
}

// ------------------------------
// Read (Get) a single record by key
// ------------------------------
async function readRecord(id,tbl) {
  return openDatabase(tbl).then(db => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(tbl, "readonly");
      const store = transaction.objectStore(tbl);
      const request = store.get(id);

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };

      request.onerror = (event) => {
        reject(`Error reading record: ${event.target.error}`);
      };
    });
  });
}

// ------------------------------
// Read (Get) all records
// ------------------------------
async function readAllRecords(tbl,func) {
  return openDatabase(tbl).then(db => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(tbl, "readonly");
      const store = transaction.objectStore(tbl);
      const request = store.getAll();

      request.onsuccess = (event) => {
        let jres=event.target.result;
        resolve(jres);
        console.log(jres);
        
        //var fn = window[func];
        //if (typeof fn === "function") fn(tbl,jres); 
      };

      request.onerror = (event) => {
        reject(`Error reading all records: ${event.target.error}`);
      };
    });
  });
}

// ------------------------------
// Update an existing record
// ------------------------------
async function updateRecord(record,tbl,func) {
  return openDatabase(tbl).then(db => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(tbl, "readwrite");
      const store = transaction.objectStore(tbl);
      const request = store.put(record); // 'put' updates if key exists, or adds if not

      request.onsuccess = () => {
        resolve(`Record updated successfully`);
        var fn = window[func];
        if (typeof fn === "function") fn();          
      };

      request.onerror = (event) => {
        reject(`Error updating record: ${event.target.error}`);
      };
    });
  });
}

// ------------------------------
// Delete a record by key
// ------------------------------
async function deleteRecord(id,tbl) {
  return openDatabase(tbl).then(db => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(tbl, "readwrite");
      const store = transaction.objectStore(tbl);
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve(`Record with id ${id} deleted successfully`);
      };

      request.onerror = (event) => {
        reject(`Error deleting record: ${event.target.error}`);
      };
    });
  });
}