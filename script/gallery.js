const GOOGLE_DOC_URL = 'https://docs.google.com/document/d/1-qG2JoPtLwe04661yKhnlZo0-d3MMSgHBEY-waE3qzE/export?format=txt';
const REPO_NAME = 'licenseplate';
const USERNAME = 'ethanleighfellows';
const BRANCH = 'main';

async function getGithubToken() {
    try {
        const response = await fetch(GOOGLE_DOC_URL);
        console.log('Fetching token:', response.status); // Debug response status
        if (!response.ok) {
            throw new Error('Failed to fetch API key from Google Doc.');
        }
        const text = await response.text();
        console.log('Google Doc content:', text);
        const token = text.match(/GITHUB_TOKEN=(.+)/)?.[1]?.trim();
        console.log('Extracted token:', token);
        if (!token) {
            throw new Error('API key not found in Google Doc.');
        }
        return token;
    } catch (error) {
        console.error('Error fetching GitHub token:', error);
        alert('Failed to retrieve the API key. Please check the document and try again.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('fullscreenOverlay');
    const fullscreenImage = document.getElementById('fullscreenImage');
    const closeButton = document.getElementById('fullscreenClose');

    // Open full-screen view
    document.body.addEventListener('click', (event) => {
        if (event.target.tagName === 'IMG' && event.target.closest('.carousel-slide')) {
            fullscreenImage.src = event.target.src;
            overlay.style.display = 'flex';
        }
    });

    // Close full-screen view
    closeButton.addEventListener('click', () => {
        overlay.style.display = 'none';
    });

    // Close on overlay click
    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            overlay.style.display = 'none';
        }
    });
});

async function displayFilterOptions() {
    console.log('Starting displayFilterOptions'); // Check function is called
    const filterContainer = document.getElementById('filterContainer');
    filterContainer.innerHTML = ''; // Clear existing filters

    const token = await getGithubToken();
    if (!token) {
        console.error('No GitHub token found.');
        return;
    }

    const url = `https://api.github.com/repos/${USERNAME}/${REPO_NAME}/contents/assets/gallery/meta`;
    console.log('Fetching metadata from:', url);
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        console.error('Error fetching metadata:', await response.text());
        return;
    }

    const files = await response.json();
    console.log('Fetched metadata files:', files);

    const metadataFiles = files.filter(file => file.type === 'file' && file.name.endsWith('.json'));
    console.log('Filtered metadata files:', metadataFiles);

    // Extract unique states
    const statesSet = new Set();
    for (const file of metadataFiles) {
        try {
            const metadataResponse = await fetch(file.download_url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (metadataResponse.ok) {
                const metadata = await metadataResponse.json();
                console.log('Metadata content:', metadata);
                if (metadata.state) {
                    statesSet.add(metadata.state);
                }
            } else {
                console.error(`Failed to fetch metadata for ${file.name}`);
            }
        } catch (error) {
            console.error('Error processing metadata file:', file.name, error);
        }
    }

    const states = Array.from(statesSet).sort();
    console.log('Extracted states:', states);

    if (states.length === 0) {
        filterContainer.innerHTML = '<p>No filters available. Please upload images with metadata.</p>';
        return;
    }

    // Populate filter options
    states.forEach(state => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'state-checkbox';
        checkbox.value = state;
        checkbox.checked = true;
        checkbox.addEventListener('change', filterGallery);

        const label = document.createElement('label');
        label.textContent = state;
        label.style.marginLeft = '5px';

        filterContainer.appendChild(checkbox);
        filterContainer.appendChild(label);
        filterContainer.appendChild(document.createElement('br'));
    });
}

async function filterGallery() {
    const selectedStates = Array.from(document.querySelectorAll('.state-checkbox:checked')).map(cb => cb.value);
    const carouselTrack = document.querySelector('.carousel-track');
    carouselTrack.innerHTML = ''; // Clear the gallery

    const token = await getGithubToken();
    if (!token) return;

    const url = `https://api.github.com/repos/${USERNAME}/${REPO_NAME}/contents/assets/gallery/meta`;
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        console.error('Error fetching metadata:', await response.text());
        return;
    }

    const files = await response.json();
    const metadataFiles = files.filter(file => file.type === 'file' && file.name.endsWith('.json'));

    for (const file of metadataFiles) {
        const metadataResponse = await fetch(file.download_url, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (metadataResponse.ok) {
            const metadata = await metadataResponse.json();
            if (selectedStates.includes(metadata.state)) {
                // Add the image to the gallery
                const imagePath = file.download_url.replace('/meta/', '/').replace('.json', ''); // Derive image path
                const img = document.createElement('img');
                img.src = imagePath;
                img.alt = metadata.state;
                img.style.maxWidth = '80%';
                img.style.margin = 'auto';
                img.style.display = 'block';

                const slide = document.createElement('div');
                slide.className = 'carousel-slide';
                slide.style.position = 'relative';
                slide.appendChild(img);

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
                caption.textContent = `State: ${metadata.state}, Date: ${metadata.date}`;

                slide.appendChild(caption);
                carouselTrack.appendChild(slide);
            }
        }
    }
}

async function initializeGallery() {
    console.log('Initializing gallery');
    await displayFilterOptions();
    document.getElementById('uploadForm').addEventListener('submit', handleImageUpload);
    filterGallery(); // Initialize gallery display
}

document.addEventListener('DOMContentLoaded', initializeGallery);
