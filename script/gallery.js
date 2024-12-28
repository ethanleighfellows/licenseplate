// Fetch states or provinces from the states.js file
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

// Handle image upload
async function handleImageUpload(event) {
    event.preventDefault();
    const imageInput = document.getElementById('imageInput');
    const stateSelector = document.getElementById('stateSelector');

    const formData = new FormData();
    formData.append('image', imageInput.files[0]);
    formData.append('state', stateSelector.value);

    const response = await fetch('/upload', {
        method: 'POST',
        body: formData,
    });

    if (response.ok) {
        alert('Image uploaded successfully!');
        displayImages();
    } else {
        alert('Error uploading image.');
    }
}

// Display uploaded images
async function displayImages() {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = ''; // Clear existing images

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

// Initialize the gallery
async function initializeGallery() {
    await populateStateSelector();

    const form = document.getElementById('uploadForm');
    form.addEventListener('submit', handleImageUpload);

    displayImages();
}

document.addEventListener('DOMContentLoaded', initializeGallery);
