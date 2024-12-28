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
