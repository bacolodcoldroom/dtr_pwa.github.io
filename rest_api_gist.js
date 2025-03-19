//const GITHUB_TOKEN = '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'; // Never expose in client-side code!
// Function to fetch Gist data
async function fetchGist(gistId) {
  const response = await fetch(`https://api.github.com/gists/${gistId}`, {
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });
  if (!response.ok) {
    throw new Error(`Error fetching gist: ${response.status}`);
  }
  return await response.json();
}
//------------------------------------------------------------------
async function addNewGist(gistId, filename, newContent) {
  const apiUrl = `https://api.github.com/gists/${gistId}`;
  try {
    const response = await fetch(apiUrl, {
      method: 'PATCH',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify({
        files: {
          [filename]: {
            content: JSON.stringify(newContent, null, 2)
          }
        },
        description: 'Updated gist file'
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`GitHub API error: ${errorData.message}`);
    }

    const updatedGist = await response.json();
    console.log('Gist updated 1 successfully:', updatedGist);
    return updatedGist;
  } catch (error) {
    console.error('Error updating gist:', error);
    throw error;
  }
}

// Function to update the Gist with new content
async function updateGist(gistId, fileName, newContent) {
  const response = await fetch(`https://api.github.com/gists/${gistId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github.v3+json'
    },
    body: JSON.stringify({
      files: {
        [fileName]: { content: JSON.stringify(newContent, null, 2) }
      }
    })
  });
  if (!response.ok) {
    throw new Error(`Error updating gist: ${response.status}`);
  }
  const result=response.json();
  //console.log(result);
  return result;
}

// Function to delete a record (by recordId) from the JSON file in the Gist
async function deleteRecordFromGist(gistId, fileName,fld,val) {    
  try {
    // 1. Fetch current Gist data
    const gistData = await fetchGist(gistId);
    const fileContent = gistData.files[fileName].content;
    let jsonData = JSON.parse(fileContent);
    console.log('===jsonData===',jsonData);
    
    // 2. Assume jsonData is an array and filter out the record with the matching id.
    // Adjust this logic as needed based on your data structure.
    
    const filteredData = jsonData.filter(record => String(record[fld]) !== val);
    //const filteredData = jsonData.filter(record => String(record.usercode) !== val);
    console.log(val+':::filteredData===>',filteredData);
    //const finalData = jsonData.concat(filteredData); 
    //console.log('final data===>',finalData);
    // 3. Update the Gist with the new filtered data
    //const updatedGist = await updateGist(gistId, fileName, filteredData);
    
    //const updatedGist = await updateGist(gistId, fileName, filteredData);
    
    const updatedGist = await update_GistFile(gistId, fileName, filteredData);
    //displayOutput(updatedGist);
    console.log('updatedGist:',updatedGist);
    //console.log(JSON.parse(updatedGist));
    //console.log(filteredData);
    //await addNewGist(gistId, fileName, finalData);
  } catch (error) {
    //displayOutput({ error: error.message });
    console.log({ error: error.message });
  }
}

//
async function update_GistFile(gistId,FILENAME,content) {
  const url = `https://api.github.com/gists/${gistId}`;

  // Fetch the current Gist data
  const response = await fetch(url, {
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });

  if (!response.ok) {
    console.error('Error fetching Gist:', response.status, response.statusText);
    return;
  }

  const gistData = await response.json();

  // Update the specific file content
  gistData.files[FILENAME].content = JSON.stringify(content, null, 2);

  // Prepare the payload for the update request
  const updatePayload = {
    files: {
      [FILENAME]: {
        content: gistData.files[FILENAME].content
      }
    }
  };

  // Send the update request
  const updateResponse = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatePayload)
  });

  if (updateResponse.ok) {
    console.log('Gist updated 2 successfully!');
  } else {
    console.error('Error updating Gist:', updateResponse.status, updateResponse.statusText);
  }
}