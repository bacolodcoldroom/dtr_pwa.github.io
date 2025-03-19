const GITHUB_TOKEN = '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'; // Never expose in client-side code!
async function jeff_get_gistFile(fileName,gistId) {
  const response = await fetch(`https://api.github.com/gists/${gistId}`, {
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });
  if (!response.ok) {
    throw new Error(`Error fetching gist: ${response.status}`);
  }
  const gistData=await response.json();  
  const fileContent = gistData.files[fileName].content;
  console.log('get_gistFile::: ',JSON.parse(fileContent));
  return JSON.parse(fileContent);
}

//------------------------------------------------------------------
async function jeff_add_gistFile(gistId, filename, newContent) {
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

async function jeff_update_gistFile(gistId,fileName,newData,fld,val){
  try {
    let jsonData = await jeff_get_gistFile(fileName,gistId);
    console.log('===jsonData===',jsonData);
    
    const filteredData = jsonData.filter(record => String(record[fld]) !== val);
    console.log('filteredData',filteredData);    
    const finalData = filteredData.concat(newData); 
    await jeff_add_gistFile(gistId, fileName, finalData);
    console.log('finalData',finalData);    
    speakText('Data Uploaded to Server');
  } catch (error) {
    //displayOutput({ error: error.message });
    console.log({ error: error.message });
  }
}
