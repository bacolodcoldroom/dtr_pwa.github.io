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
async function readAllRecords(tbl) {
  return openDatabase(tbl).then(db => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(tbl, "readonly");
      const store = transaction.objectStore(tbl);
      const request = store.getAll();

      request.onsuccess = (event) => {
        let jres=event.target.result;
        resolve(jres);
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

async function clearAllRecords(tbl) {
  return openDatabase(tbl).then(db => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(tbl, "readwrite");
      const store = transaction.objectStore(tbl);
      const request = store.clear();

      request.onsuccess = (event) => {
        let jres=event.target.result;
        console.log(event.target.result);
        resolve(jres);
      };

      request.onerror = (event) => {
        reject(`Error clearing all records: ${event.target.error}`);
      };
    });
  });
}


async function fetchTextPortion(url, start, end) {
  try {
      // Validate parameters
      const startNum = Number(start);
      if (isNaN(startNum)) {
          throw new Error('Start must be a valid number');
      }
     
      let endNum;
      if (typeof end !== 'undefined') {
          endNum = Number(end);
          if (isNaN(endNum)) {
              throw new Error('End must be a valid number');
          }
      }

      // Fetch the file
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
     
      // Get full text
      const fullText = await response.text();
     
      // Calculate indices
      const startIndex = Math.max(0, startNum);
      let endIndex = typeof end !== 'undefined' ? endNum : fullText.length;
      endIndex = Math.min(endIndex, fullText.length);

      // Handle invalid range
      if (startIndex >= endIndex) {
          return '';
      }

      // Return the requested portion
      return fullText.substring(startIndex, endIndex);
     
  } catch (error) {
      console.error('Error fetching text portion:', error);
      throw error; // Re-throw for caller to handle
  }
}
