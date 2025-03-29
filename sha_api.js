/*
const owner = "your-github-username"; // Your GitHub username
const repo = "your-repo-name"; // Your GitHub repo name
const path = "data.json"; // Path to your JSON file
const token = "your-personal-access-token"; // Your GitHub PAT
*/

//const apiBase = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
// GitHub API configuration
const API_BASE = 'https://api.github.com';
const REPO_OWNER = 'bacolodcoldroom';
const REPO_NAME = 'JDB';
var apiBase = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/`;

async function getFile(path) {
    console.log('>>>>>getfile',path);
    try {
        const response = await fetch(apiBase+`${path}`, {
            headers: { Authorization: `token ${GITHUB_TOKEN}` }
        });
        if (!response.ok) throw new Error(`Failed to fetch file: ${response.status}`);
        const data = await response.json();        
        return { content: JSON.parse(atob(data.content)), sha: data.sha };
    } catch (error) {
        console.error("Error fetching file:", error);
    }
}

async function updateFile(path,updatedContent, message, sha) {
    try {
        const response = await fetch(apiBase+`${path}`, {
            method: "PUT",
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message,
                content: btoa(JSON.stringify(updatedContent, null, 2)),
                sha
            })
        });

        if (!response.ok) throw new Error(`Failed to update file: ${response.status}`);
        console.log("File updated successfully");
    } catch (error) {
        console.error("Error updating file:", error);
    }
}

async function addEntry(path,newEntry) {
    try {
        const { content, sha } = await getFile(path);
        console.log('addEntry content:',content);
        //content.items.push(newEntry);
        content.push(newEntry);
        await updateFile(path,content, "Added new entry", sha);
    } catch (error) {
        console.error("Error adding entry:", error);
    }
}

async function updateEntry(path,index, updatedData) {
    try {
        const { content, sha } = await getFile(path);
        if (index < 0 || index >= content.items.length) throw new Error("Invalid index");
        
        content.items[index] = updatedData;
        await updateFile(path,content, "Updated an entry", sha);
    } catch (error) {
        console.error("Error updating entry:", error);
    }
}

async function deleteEntry(path,index) {
    try {
        const { content, sha } = await getFile(path);
        if (index < 0 || index >= content.items.length) throw new Error("Invalid index");

        content.items.splice(index, 1);
        await updateFile(path,content, "Deleted an entry", sha);
    } catch (error) {
        console.error("Error deleting entry:", error);
    }
}

// Example Usage:
// getFile().then(data => console.log(data)); // Fetch all data
// addEntry({ id: 1, name: "Sample Item" }); // Add an entry
// updateEntry(0, { id: 1, name: "Updated Item" }); // Update an entry
// deleteEntry(0); // Delete an entry


async function jeff_update_File(fileName,newData,fld,val){
  try {
    const { content, sha } = await getFile(fileName);
    const filteredData = content.filter(record => String(record[fld]) !== val);
    console.log('filteredData',filteredData);    
    const finalData = filteredData.concat(newData); 
    // Commit the updated array back to the file with a commit message.
    await updateFile(fileName,finalData, `Deleted item by value: ${val}`, sha);
    console.log('finalData',finalData);    
    speakText('Data Uploaded to Server');
  } catch (error) {
    MSG_SHOW(vbOk,"ERROR:",error.message,function(){},function(){});
  }
}

async function deleteItemByValue(value) {
  try {
      // Retrieve the file and its SHA
      const { content, sha } = await getFile();

      // Filter out any items that match the given value.
      // Modify this logic if your JSON structure is different.
      const updatedArray = content.filter(item => item !== value);
      ////const filteredData = jsonData.filter(record => String(record[fld]) !== val);

      // Check if any item was removed; if not, log and exit.
      if (updatedArray.length === content.length) {
          console.log("No matching item found to delete.");
          return;
      }

      // Commit the updated array back to the file with a commit message.
      await updateFile(updatedArray, `Deleted item by value: ${value}`, sha);
  } catch (error) {
      console.error("Error deleting item by value:", error);
  }
}
