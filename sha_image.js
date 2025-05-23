async function jeff_uploadImage(IMAGE_URL,TARGET_FILENAME) {
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

async function jeff_getImage(FILE_PATH) {
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

function isJpegDataUrl(str) {
  const pattern = /^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/;
  return (typeof str === 'string') && pattern.test(str);
}

/**
 * Resizes an image file to fit within maxWidth and maxHeight while preserving aspect ratio.
 * @param {File} file - The original image file.
 * @param {number} maxWidth - Maximum width of the resized image.
 * @param {number} maxHeight - Maximum height of the resized image.
 * @returns {Promise<Blob>} - A promise that resolves to the resized image as a Blob.
 */
function resizeImage(file, maxWidth = 1024, maxHeight = 1024) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = event => {
      const img = new Image();
      
      img.onload = () => {
        let { width, height } = img;

        // Calculate the scaling factor to maintain aspect ratio
        const scale = Math.min(maxWidth / width, maxHeight / height, 1);
        width *= scale;
        height *= scale;

        // Create a canvas and draw the resized image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert the canvas to a Blob
        canvas.toBlob(
          blob => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Canvas is empty'));
            }
          },
          'image/jpeg',
          0.8 // Quality parameter (0.0 to 1.0)
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = event.target.result;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}


/**
 * Resizes an image from a div's background or img tag.
 * @param {HTMLElement} div - The div containing the image.
 * @param {number} maxWidth - Maximum width for the resized image.
 * @param {number} maxHeight - Maximum height for the resized image.
 * @returns {Promise<Blob>} - A promise that resolves to the resized image as a Blob.
 */
function resizeImageFromDiv(div, maxWidth = 800, maxHeight = 800) {
  return new Promise((resolve, reject) => {
    let imageUrl = '';

    // Check for background-image
    const bgImage = window.getComputedStyle(div).backgroundImage;
    if (bgImage && bgImage !== 'none') {
      imageUrl = bgImage.slice(5, -2); // Remove url("...") wrapper
    } else {
      // Check for img tag inside the div
      const img = div.querySelector('img');
      if (img && img.src) {
        imageUrl = img.src;
      } else {
        return reject(new Error('No image found in the provided div.'));
      }
    }

    const img = new Image();
    img.crossOrigin = 'Anonymous'; // To handle cross-origin images

    img.onload = () => {
      let { width, height } = img;

      // Calculate scaling factor to maintain aspect ratio
      const scale = Math.min(maxWidth / width, maxHeight / height, 1);
      width *= scale;
      height *= scale;

      // Create a canvas and draw the resized image
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      // Convert the canvas to a Blob
      canvas.toBlob(
        blob => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Canvas is empty'));
          }
        },
        'image/jpeg',
        0.8 // Quality parameter (0.0 to 1.0)
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageUrl;
  });
}
