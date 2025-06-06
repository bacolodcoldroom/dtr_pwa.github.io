// GitHub API configuration
const API_BASE = 'https://api.github.com';
const REPO_OWNER = 'bacolodcoldroom';
const REPO_NAME = 'JDB';
var apiBase = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/`;

async function getFile(path) {
    
    try {
        const response = await fetch(apiBase+`${path}`, {
            headers: { Authorization: `token ${GITHUB_TOKEN}` }
        });
        if (!response.ok) throw new Error(`Failed to fetch file: ${response.status}`);
        const data = await response.json();        
        //return { content: JSON.parse(atob(data.content)), sha: data.sha };
        //return { content: JSON.parse(decodeURIComponent(escape(atob(data.content)))), sha: data.sha };
        const finalData=JSON.parse(decodeURIComponent(escape(atob(data.content))));
        //console.log('>>>>>getfile',path,finalData);
        return { content: finalData, sha: data.sha };
    } catch (error) {
        showProgress(false);
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
                //content: btoa(JSON.stringify(updatedContent, null, 2)),
                content: btoa(unescape(encodeURIComponent(JSON.stringify(updatedContent, null, 2)))),
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


async function xxjeff_update_File(fileName,newData,fld,val){
  try {
    const { content, sha } = await getFile(fileName);
    const filteredData = content.filter(record => String(record[fld]) !== val);
    //console.log('filteredData',filteredData);    
    const finalData = filteredData.concat(newData); 
    // Commit the updated array back to the file with a commit message.
    await updateFile(fileName,finalData, `Deleted item by value: ${val}`, sha);
    //console.log('finalData',finalData);    
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

////--------------------------------------

  // Configuration
  /*
  const GITHUB_TOKEN = 'your_personal_access_token'; // 🔒 Never expose this in production!
  const REPO_OWNER = 'your_username';
  const REPO_NAME = 'your_repo';
  */
  

async function updateJsonWithSpanishChars() {
  alert('sample activated...');
  
  let currentData = await getFile('dtr/samples.json');
  console.log('currentData',currentData.content);
  return;
  
  const FILE_PATH = 'dtr/sample.json'; // e.g., 'data/spanish.json'
  const BRANCH = 'main';
  try {
    // 1. Get existing file details (to retrieve the SHA hash)
    const getUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}?ref=${BRANCH}`;
    const getResponse = await fetch(getUrl, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });
    const fileInfo = await getResponse.json();

    // 2. Decode the file content (handling UTF-8)
    const currentContent = decodeBase64(fileInfo.content);
    const jsonData = JSON.parse(currentContent);

    // 3. Modify the JSON (add Spanish characters)
    jsonData.spanishExample = {
      text: "Texto en español con caracteres especiales: ñ, á, é, ¿, ¡",
      updatedAt: new Date().toISOString(),
    };

    // 4. Encode the updated content to Base64 (UTF-8 safe)
    const updatedContent = encodeBase64(JSON.stringify(jsonData, null, 2));

    // 5. Commit the changes to GitHub
    const putUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
    const commitResponse = await fetch(putUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Add Spanish characters to JSON',
        content: updatedContent,
        sha: fileInfo.sha, // Required to update existing file
        branch: BRANCH,
      }),
    });

    const result = await commitResponse.json();
    console.log('Commit successful:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

async function xxxupdateFile(path,updatedContent, message, sha) {
  try {
    const currentContent = decodeBase64(updatedContent);
    const jsonData = JSON.parse(currentContent);
      // 3. Modify the JSON (add Spanish characters)
      
      jsonData.spanishExample = {
        text: "Texto en español con caracteres especiales: ñ, á, é, ¿, ¡",
        updatedAt: new Date().toISOString(),
      };

      // 4. Encode the updated content to Base64 (UTF-8 safe)
      const updatedContent = encodeBase64(JSON.stringify(jsonData, null, 2));

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

// Base64 encoding/decoding with UTF-8 support
function decodeBase64(base64Str) {
  return decodeURIComponent(
    atob(base64Str).split('').map(c => 
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join('')
  );
}

function encodeBase64(str) {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    )
  );
}

// Run the update
//updateJsonWithSpanishChars();

async function writeFileToGitHub({ 
  owner, repo, filePath, content, branch = "main", token 
}) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
  
  // Get the existing file SHA (needed if updating)
  let sha = null;
  const getFileResponse = await fetch(url, {
      headers: { "Authorization": `token ${token}` }
  });

  if (getFileResponse.ok) {
      const fileData = await getFileResponse.json();
      sha = fileData.sha;
  }

  // Convert content to Base64
  const encodedContent = btoa(unescape(encodeURIComponent(content)));

  // Prepare payload
  const data = {
      message: `Updating ${filePath}`,
      content: encodedContent,
      branch,
      ...(sha && { sha })  // Include SHA if file exists
  };

  // Commit file to GitHub
  const response = await fetch(url, {
      method: "PUT",
      headers: {
          "Authorization": `token ${token}`,
          "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
  });

  if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
  }

  const result = await response.json();
  console.log("File committed:", result);
}

/*
// Example usage
writeFileToGitHub({
  owner: "your-github-username",
  repo: "your-repo-name",
  filePath: "test-folder/example.txt",
  content: "Hello, GitHub!",
  branch: "main",
  token: "your-personal-access-token"
}).catch(console.error);
*/

/*
 // 🔐 GitHub Configuration (Replace with your details)
 const REPO_OWNER = "your-github-username";
 const REPO_NAME = "your-repo-name";
 const GITHUB_FILE_PATH = "data/spanish.json"; // Path inside the repo
 const GITHUB_BRANCH = "main";
 const GITHUB_TOKEN = "your-personal-access-token"; // 🔥 Keep this secure!
*/


 // 📌 Function to Save JSON File to GitHub
 async function saveJson() {
     const GITHUB_FILE_PATH = "dtr/sample.json"; // Path inside the repo
     const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${GITHUB_FILE_PATH}`;

     // JSON Data with Spanish Characters
     const jsonData = {
         saludo: "¡Hola, cómo estás?",
         ciudad: "Málaga",
         símbolo: "€",
         preguntas: ["¿Qué tal?", "¿Cómo te llamas?"]
     };

     // Convert JSON to UTF-8 Base64
     const jsonString = JSON.stringify(jsonData, null, 2);
     const base64Content = btoa(unescape(encodeURIComponent(jsonString)));

     // Check if file exists (needed for updates)
     let sha = null;
     const getFileResponse = await fetch(url, {
         headers: { "Authorization": `token ${GITHUB_TOKEN}` }
     });

     if (getFileResponse.ok) {
         const fileData = await getFileResponse.json();
         sha = fileData.sha;
     }

     // Prepare Data for GitHub API
     const data = {
         message: "📝 Guardando JSON con caracteres españoles",
         content: base64Content,
         branch: 'main',
         ...(sha && { sha }) // Required for updating existing file
     };

     // Upload JSON File to GitHub
     const response = await fetch(url, {
         method: "PUT",
         headers: {
             "Authorization": `token ${GITHUB_TOKEN}`,
             "Content-Type": "application/json"
         },
         body: JSON.stringify(data)
     });

     if (!response.ok) {
         throw new Error(`GitHub API error: ${response.statusText}`);
     }

     //document.getElementById("output").innerText = "✅ JSON guardado en GitHub.";
     console.log("JSON file saved:", await response.json());
 }

 // 📌 Function to Read JSON File from GitHub
 async function readJson() {
    const GITHUB_FILE_PATH = "dtr/sample.json"; // Path inside the repo
     const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${GITHUB_FILE_PATH}`;

     const response = await fetch(url, {
         headers: { "Authorization": `token ${GITHUB_TOKEN}` }
     });

     if (!response.ok) {
         throw new Error(`GitHub API error: ${response.statusText}`);
     }

     const fileData = await response.json();
     const decodedContent = decodeURIComponent(escape(atob(fileData.content))); // UTF-8 decoding
     const jsonData = JSON.parse(decodedContent);

     //document.getElementById("output").innerText = JSON.stringify(jsonData, null, 2);
     console.log("Fetched JSON Data:", jsonData);
 }