// Fetch states or provinces from the states.js file
async function fetchStates() {
    const response = await fetch('script/states.js');
    const states = await response.json();
    return states;
}

// Initialize the gallery
async function initializeGallery() {
    const states = await fetchStates();
    populateStateSelector(states);

    const form = document.getElementById('uploadForm');
    form.addEventListener('submit', handleImageUpload);

    displayImages();
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

async function populateStateSelector() {
    try {
        const statesByCountry = await fetchStatesByCountry();
        const stateSelector = document.getElementById('stateSelector');

        // Iterate through each country and its states/provinces
        Object.keys(statesByCountry).forEach(country => {
            statesByCountry[country].forEach(state => {
                const option = document.createElement('option');
                option.value = state.name;
                option.textContent = state.name;
                stateSelector.appendChild(option);
            });
        });
    } catch (error) {
        console.error('Error populating state selector:', error);
    }
}

async function initializeGallery() {
    await populateStateSelector();

    const form = document.getElementById('uploadForm');
    form.addEventListener('submit', handleImageUpload);

    displayImages();
}

async function handleImageUpload(event) {
    event.preventDefault();
    const imageInput = document.getElementById('imageInput');
    const stateSelector = document.getElementById('stateSelector');

    const formData = new FormData();
    formData.append('image', imageInput.files[0]);
    formData.append('state', stateSelector.value);

    const response = await fetch('/upload', {
        method: 'POST',
        body: formData
    });

    if (response.ok) {
        alert('Image uploaded successfully!');
        displayImages();
    } else {
        alert('Error uploading image.');
    }
}

async function displayImages() {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';

    const response = await fetch('/get-images');
    const images = await response.json();

    images.forEach(image => {
        const imgContainer = document.createElement('div');
        imgContainer.className = 'image-container';

        const img = document.createElement('img');
        img.src = `assets/gallery/${image.filename}`;
        img.alt = image.state;

        const caption = document.createElement('p');
        caption.textContent = image.state;

        imgContainer.appendChild(img);
        imgContainer.appendChild(caption);

        gallery.appendChild(imgContainer);
    });
}

document.addEventListener('DOMContentLoaded', initializeGallery);

// Populate the state/province dropdown
function populateStateSelector(states) {
    const stateSelector = document.getElementById('stateSelector');
    states.forEach(state => {
        const option = document.createElement('option');
        option.value = state.code;
        option.textContent = state.name;
        stateSelector.appendChild(option);
    });
}

// Handle image upload
async function handleImageUpload(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const response = await fetch('/upload', { // Update this to match your backend upload URL
        method: 'POST',
        body: formData
    });

    if (response.ok) {
        alert('Image uploaded successfully!');
        displayImages(); // Refresh gallery
    } else {
        alert('Error uploading image.');
    }
}

// Display uploaded images
async function displayImages() {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = ''; // Clear existing images

    const response = await fetch('/get-images'); // Update this to match your backend API
    const images = await response.json();

    images.forEach(image => {
        const imgContainer = document.createElement('div');
        imgContainer.className = 'image-container';

        const img = document.createElement('img');
        img.src = `assets/gallery/${image.filename}`;
        img.alt = image.tag;

        const tag = document.createElement('p');
        tag.textContent = image.tag;

        imgContainer.appendChild(img);
        imgContainer.appendChild(tag);

        gallery.appendChild(imgContainer);
    });
}

// Initialize the gallery script on page load
document.addEventListener('DOMContentLoaded', initializeGallery);
