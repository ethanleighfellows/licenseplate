// Hardcoded GitHub credentials and repo details
const GOOGLE_DOC_URL = 'https://docs.google.com/document/d/1-qG2JoPtLwe04661yKhnlZo0-d3MMSgHBEY-waE3qzE/export?format=txt';
const REPO_NAME = 'licenseplate';
const USERNAME = 'ethanleighfellows';
const BRANCH = 'main';

async function getGithubToken() {
    try {
        const response = await fetch(GOOGLE_DOC_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch API key from Google Doc.');
        }
        const text = await response.text();
        const token = text.match(/GITHUB_TOKEN=(.+)/)?.[1]?.trim();
        if (!token) {
            throw new Error('API key not found in Google Doc.');
        }
        return token;
    } catch (error) {
        console.error('Error fetching GitHub token:', error);
        alert('Failed to retrieve the API key. Please check the document and try again.');
    }
}

async function fetchStatesByCountry() {
    const response = await fetch('script/states.js');
    const scriptText = await response.text();

    // Extract the object definition for statesByCountry
    const match = scriptText.match(/const\s+statesByCountry\s+=\s+(\{[\s\S]*?\});/);
    if (!match) {
        throw new Error('Failed to extract statesByCountry from states.js');
    }

    // Use Function to safely evaluate the matched object
    const statesByCountry = Function(`return ${match[1]}`)();
    return statesByCountry;
}

// Populate the state/province dropdown
async function populateStateSelector() {
    try {
        const statesByCountry = await fetchStatesByCountry();
        const stateSelector = document.getElementById('stateSelector');

        // Iterate through each country and its states/provinces
        Object.keys(statesByCountry).forEach(country => {
            const optgroup = document.createElement('optgroup');
            optgroup.label = country;

            statesByCountry[country].forEach(state => {
                const option = document.createElement('option');
                option.value = state.name;
                option.textContent = state.name;
                optgroup.appendChild(option);
            });

            stateSelector.appendChild(optgroup);
        });
    } catch (error) {
        console.error('Error populating state selector:', error);
    }
}

async function uploadToGitHub(file, stateName, dateCaptured) {
    const token = await getGithubToken();
    if (!token) return;

    const metadata = {
        state: stateName,
        date: dateCaptured
    };
    const metadataContent = btoa(JSON.stringify(metadata));

    const filePath = `assets/gallery/${file.name}`;
    const base64Content = await fileToBase64(file);

    const url = `https://api.github.com/repos/${USERNAME}/${REPO_NAME}/contents/${filePath}`;
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: `Upload ${file.name} for state ${stateName}`,
            content: base64Content,
            branch: BRANCH,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        console.error('Error uploading file:', error);
        alert(`Failed to upload ${file.name}.`);
        return;
    }

    // Upload metadata to a separate folder
    const metadataPath = `assets/gallery/meta/${file.name}.meta.json`;
    await fetch(`https://api.github.com/repos/${USERNAME}/${REPO_NAME}/contents/${metadataPath}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: `Upload metadata for ${file.name}`,
            content: metadataContent,
            branch: BRANCH,
        }),
    });

    alert(`Successfully uploaded ${file.name} with metadata.`);
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]); // Remove `data:` prefix
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Handle image upload
async function handleImageUpload(event) {
    event.preventDefault();
    const imageInput = document.getElementById('imageInput');
    const stateSelector = document.getElementById('stateSelector');
    const dateCaptured = new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    const file = imageInput.files[0];
    const stateName = stateSelector.value;

    if (!file) {
        alert('Please select an image.');
        return;
    }

    if (!stateName) {
        alert('Please select a state or province.');
        return;
    }

    await uploadToGitHub(file, stateName, dateCaptured);
    displayImages(); // Refresh gallery after upload
}

// Display uploaded images
async function displayImages() {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = ''; // Clear existing images

    const token = await getGithubToken();
    if (!token) return;

    const url = `https://api.github.com/repos/${USERNAME}/${REPO_NAME}/contents/assets/gallery`;
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        console.error('Error fetching images:', await response.text());
        return;
    }

    const files = await response.json();
    const imageFiles = files.filter(file => file.type === 'file' && file.name.match(/\.(png|jpe?g|gif)$/i));

    imageFiles.forEach(file => {
        const imgContainer = document.createElement('div');
        imgContainer.className = 'image-container';

        const img = document.createElement('img');
        img.src = file.download_url;
        img.alt = file.name;
        img.classList.add('clickable-image');

        const metadataPath = `assets/gallery/meta/${file.name}.meta.json`;

        fetch(`https://api.github.com/repos/${USERNAME}/${REPO_NAME}/contents/${metadataPath}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        }).then(metaResponse => {
            if (!metaResponse.ok) return null;
            return metaResponse.json();
        }).then(metaFile => {
            if (metaFile) {
                const metadata = JSON.parse(atob(metaFile.content));
                const caption = document.createElement('p');
                caption.textContent = `State: ${metadata.state}, Date: ${metadata.date}`;
                imgContainer.appendChild(caption);
            }
        });

        imgContainer.appendChild(img);
        gallery.appendChild(imgContainer);

        img.addEventListener('click', () => openFullscreen(img.src));
    });
}

function openFullscreen(imageSrc) {
    const overlay = document.createElement('div');
    overlay.id = 'fullscreen-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '1000';

    const img = document.createElement('img');
    img.src = imageSrc;
    img.style.maxWidth = '90%';
    img.style.maxHeight = '90%';
    img.style.border = '5px solid white';
    overlay.appendChild(img);

    overlay.addEventListener('click', () => {
        document.body.removeChild(overlay);
    });

    document.body.appendChild(overlay);
}

// Initialize the gallery
async function initializeGallery() {
    await populateStateSelector();

    const form = document.getElementById('uploadForm');
    form.addEventListener('submit', handleImageUpload);

    displayImages();
}

document.addEventListener('DOMContentLoaded', initializeGallery);
