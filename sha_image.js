async function uploadImage(IMAGE_URL,TARGET_FILENAME) {
  const GITHUB_BRANCH = "main";
  const output = document.getElementById("output");

  // Fetch image as blob
  const imageRes = await fetch(IMAGE_URL);
  const imageBlob = await imageRes.blob();

  // Convert to base64
  const base64Content = await blobToBase64(imageBlob);

  // Check if file already exists to get SHA (needed to update)
  const fileUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${TARGET_FILENAME}`;
  let sha = null;

  const existingRes = await fetch(fileUrl, {
    headers: { Authorization: `token ${GITHUB_TOKEN}` }
  });

  if (existingRes.ok) {
    const existingData = await existingRes.json();
    sha = existingData.sha;
  }

  // Prepare GitHub API payload
  const payload = {
    message: `Upload image ${TARGET_FILENAME}`,
    content: base64Content,
    branch: GITHUB_BRANCH,
    ...(sha && { sha })
  };

  const res = await fetch(fileUrl, {
    method: "PUT",
    headers: {
      "Authorization": `token ${GITHUB_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  //const result = await res.json();
  //output.innerText = JSON.stringify(result, null, 2);
}

// Convert Blob to base64
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result.split(',')[1]; // Strip data:image/... prefix
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

//const imageUrl = "https://raw.githubusercontent.com/your-username/your-repo/main/images/my-image.png";
//const imageUrl = "https://raw.githubusercontent.com/updesktop/JDB/main/images/VAXi.jpg";

async function displayPrivateImage(IMAGE_PATH,TARGET_FILENAME) {
  //const fileUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${TARGET_FILENAME}`;
  try {
    const response = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${IMAGE_PATH}`,      
      {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'User-Agent': 'Private-Image-Display'
        }
      }
    );
    
    const data = await response.json();
    const img = document.createElement('img');
    img.src = `data:${data.type};base64,${data.content}`;
    document.getElementById('image-container').appendChild(img);
  } catch (error) {
    console.error('Error:', error);
  }
}

async function getPrivateImage(IMAGE_PATH) {
  //const fileUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${TARGET_FILENAME}`;
  try {
    const response = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${IMAGE_PATH}`,      
      {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'User-Agent': 'Private-Image-Display'
        }
      }
    );
    
    const data = await response.json();    
    const img = document.createElement('img');
    img.src = `data:${data.type};base64,${data.content}`;    
    return img.src;
  } catch (error) {
    console.error('Error:', error);
  }
}

async function jeff_get_GitHubImage(FILE_PATH) {
  const BRANCH = 'main';
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}?ref=${BRANCH}`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`
      }
    });

    if (!res.ok) {
      throw new Error(`GitHub API Error: ${res.status}`);
    }

    const data = await res.json();
    const base64 = data.content.replace(/\n/g, "");
    const mimeType = getMimeType(FILE_PATH);
    const dataURL = `data:${mimeType};base64,${base64}`;
    /*
    const img = document.createElement("img");    
    img.src = dataURL;
    img.alt = data.name;
    img.style.maxWidth = "400px";
    img.style.border = "1px solid #ccc";
    
    const container = document.getElementById("imageContainer");
    container.innerHTML = ""; // Clear previous
    container.appendChild(img);
    */
    return dataURL;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

function getMimeType(filePath) {
  const ext = filePath.split('.').pop().toLowerCase();
  switch (ext) {
    case 'png': return 'image/png';
    case 'jpg':
    case 'jpeg': return 'image/jpeg';
    case 'gif': return 'image/gif';
    case 'svg': return 'image/svg+xml';
    default: return 'application/octet-stream';
  }
}