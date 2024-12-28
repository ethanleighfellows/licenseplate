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

        // Add Diplomatic Plate option
        const diplomaticOption = document.createElement('option');
        diplomaticOption.value = 'Diplomatic Plate';
        diplomaticOption.textContent = 'Diplomatic Plate';
        stateSelector.appendChild(diplomaticOption);
    } catch (error) {
        console.error('Error populating state selector:', error);
    }
}


function createDiplomaticInput() {
    const diplomaticInput = document.createElement('input');
    diplomaticInput.type = 'text';
    diplomaticInput.id = 'diplomaticInput';
    diplomaticInput.placeholder = 'Enter country name';
    diplomaticInput.style.padding = '10px';
    diplomaticInput.style.backgroundColor = '#2a2a2a';
    diplomaticInput.style.color = '#ffffff';
    diplomaticInput.style.border = '1px solid #444';
    diplomaticInput.style.borderRadius = '5px';
    diplomaticInput.style.marginTop = '10px';
    diplomaticInput.style.width = '100%';
    diplomaticInput.style.maxWidth = '300px';
    diplomaticInput.style.display = 'none';

    return diplomaticInput;
}

async function uploadToGitHub(file, stateName, dateCaptured, diplomaticInfo) {
    const token = await getGithubToken();
    if (!token) return;

    // Construct the final state value based on diplomatic info
    const finalState = stateName === 'Diplomatic Plate' && diplomaticInfo
        ? `Diplomatic Plate: ${diplomaticInfo}`
        : stateName;

    // Build the metadata object with the correct state value
    const metadata = {
        state: finalState,
        date: dateCaptured
    };
    const metadataContent = btoa(JSON.stringify(metadata));

    const filePath = `assets/gallery/${file.name}`;
    const base64Content = await fileToBase64(file);

    // Upload the image file
    const url = `https://api.github.com/repos/${USERNAME}/${REPO_NAME}/contents/${filePath}`;
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: `Upload ${file.name} for state ${finalState}`,
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

    // Upload the metadata file
    const metadataPath = `assets/gallery/meta/${file.name}.meta.json`;
    const metadataResponse = await fetch(`https://api.github.com/repos/${USERNAME}/${REPO_NAME}/contents/${metadataPath}`, {
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

    if (!metadataResponse.ok) {
        console.error('Error uploading metadata:', await metadataResponse.text());
        alert(`Failed to upload metadata for ${file.name}.`);
        return;
    }

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

async function handleImageUpload(event) {
    event.preventDefault();
    const imageInput = document.getElementById('imageInput');
    const stateSelector = document.getElementById('stateSelector');
    const diplomaticInput = document.getElementById('diplomaticInput'); // Get the diplomatic input field
    const dateCaptured = new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    const file = imageInput.files[0];
    const stateName = stateSelector.value;
    const diplomaticInfo = diplomaticInput && diplomaticInput.style.display === 'block' ? diplomaticInput.value.trim() : null;

    if (!file) {
        alert('Please select an image.');
        return;
    }

    if (!stateName) {
        alert('Please select a state or province.');
        return;
    }

    await uploadToGitHub(file, stateName, dateCaptured, diplomaticInfo);
    displayCarousel(); // Refresh gallery after upload
}

async function displayCarousel() {
    const carouselTrack = document.querySelector('.carousel-track');
    const indicatorsContainer = document.querySelector('.carousel-indicators');
    const prevButton = document.querySelector('.carousel-arrow.prev');
    const nextButton = document.querySelector('.carousel-arrow.next');

    carouselTrack.innerHTML = '';
    indicatorsContainer.innerHTML = '';

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

    let currentIndex = 0;

    for (const [index, file] of imageFiles.entries()) {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        slide.style.position = 'relative';

        const img = document.createElement('img');
        img.src = file.download_url;
        img.alt = file.name;
        img.style.maxWidth = '80%';
        img.style.margin = 'auto';
        img.style.display = 'block';

        const metadataPath = `assets/gallery/meta/${file.name}.meta.json`;
        const metadataResponse = await fetch(`https://api.github.com/repos/${USERNAME}/${REPO_NAME}/contents/${metadataPath}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        const caption = document.createElement('div');
        caption.style.position = 'absolute';
        caption.style.top = '10px';
        caption.style.left = '50%';
        caption.style.transform = 'translateX(-50%)';
        caption.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        caption.style.color = '#fff';
        caption.style.padding = '5px 10px';
        caption.style.borderRadius = '5px';
        caption.style.fontSize = '14px';
        caption.style.textAlign = 'center';

        if (metadataResponse.ok) {
            const metadataFile = await metadataResponse.json();
            const metadata = JSON.parse(atob(metadataFile.content));
            caption.textContent = `State: ${metadata.state}, Date: ${metadata.date}`;
        } else {
            caption.textContent = 'Metadata not available';
        }

        slide.appendChild(img);
        slide.appendChild(caption);
        carouselTrack.appendChild(slide);

        const indicator = document.createElement('div');
        indicator.className = 'carousel-indicator';
        if (index === 0) indicator.classList.add('active');
        indicator.dataset.index = index;
        indicatorsContainer.appendChild(indicator);
    }

    const slides = Array.from(carouselTrack.children);
    const indicators = Array.from(indicatorsContainer.children);

    function updateCarousel(index) {
        const slideWidth = slides[0].getBoundingClientRect().width;
        carouselTrack.style.transform = `translateX(-${slideWidth * index}px)`;
        indicators.forEach(ind => ind.classList.remove('active'));
        indicators[index].classList.add('active');
        currentIndex = index;
    }

    prevButton.addEventListener('click', () => {
        const nextIndex = (currentIndex === 0) ? slides.length - 1 : currentIndex - 1;
        updateCarousel(nextIndex);
    });

    nextButton.addEventListener('click', () => {
        const nextIndex = (currentIndex === slides.length - 1) ? 0 : currentIndex + 1;
        updateCarousel(nextIndex);
    });

    indicatorsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('carousel-indicator')) {
            updateCarousel(Number(e.target.dataset.index));
        }
    });

    updateCarousel(currentIndex);
}

async function initializeGallery() {
    await populateStateSelector();

    const form = document.getElementById('uploadForm');
    const stateSelector = document.getElementById('stateSelector');
    let diplomaticInput = document.getElementById('diplomaticInput');

    // If the input box doesn't exist, create it
    if (!diplomaticInput) {
        diplomaticInput = createDiplomaticInput();
        form.appendChild(diplomaticInput);
    }

    // Show or hide the input box based on selection
    stateSelector.addEventListener('change', () => {
        if (stateSelector.value === 'Diplomatic Plate') {
            diplomaticInput.style.display = 'block'; // Show the input
        } else {
            diplomaticInput.style.display = 'none'; // Hide the input
            diplomaticInput.value = ''; // Clear any entered value
        }
    });

    form.addEventListener('submit', handleImageUpload);

    displayCarousel();
}

function createDiplomaticInput() {
    const diplomaticInput = document.createElement('input');
    diplomaticInput.type = 'text';
    diplomaticInput.id = 'diplomaticInput';
    diplomaticInput.placeholder = 'Enter country name';
    diplomaticInput.style.padding = '10px';
    diplomaticInput.style.backgroundColor = '#2a2a2a';
    diplomaticInput.style.color = '#ffffff';
    diplomaticInput.style.border = '1px solid #444';
    diplomaticInput.style.borderRadius = '5px';
    diplomaticInput.style.marginTop = '10px';
    diplomaticInput.style.width = '100%';
    diplomaticInput.style.maxWidth = '300px';
    diplomaticInput.style.display = 'none'; // Hidden by default

    return diplomaticInput;
}


document.addEventListener('DOMContentLoaded', initializeGallery);
