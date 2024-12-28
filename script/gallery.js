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
    displayCarousel(); // Refresh gallery after upload
}

async function displayCarousel() {
    const carouselTrack = document.querySelector('.carousel-track');
    const indicatorsContainer = document.querySelector('.carousel-indicators');
    const metadataDisplay = document.querySelector('.metadata-display');
    const prevButton = document.querySelector('.carousel-arrow.prev');
    const nextButton = document.querySelector('.carousel-arrow.next');

    carouselTrack.innerHTML = '';
    indicatorsContainer.innerHTML = '';
    metadataDisplay.textContent = '';

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

        if (metadataResponse.ok) {
            const metadataFile = await metadataResponse.json();
            const metadata = JSON.parse(atob(metadataFile.content));
            if (index === 0) {
                metadataDisplay.textContent = `State: ${metadata.state}, Date: ${metadata.date}`;
            }

            slide.dataset.state = metadata.state;
            slide.dataset.date = metadata.date;
        } else {
            if (index === 0) {
                metadataDisplay.textContent = 'Metadata not available';
            }
        }

        slide.appendChild(img);
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

        const activeSlide = slides[index];
        const state = activeSlide.dataset.state;
        const date = activeSlide.dataset.date;
        metadataDisplay.textContent = `State: ${state || 'Unknown'}, Date: ${date || 'Unknown'}`;

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
    form.addEventListener('submit', handleImageUpload);

    displayCarousel();
}

document.addEventListener('DOMContentLoaded', initializeGallery);
