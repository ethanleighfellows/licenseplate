const apiKey = 'patkHvP79DLxdSXdS.f5426d3dede7ffc9f385aca56989548f5dea2946ae1ddf8813e3a43b857a81d1';
const baseId = 'appyrizLAyOlYArpI';
const tableName = 'License Tracker';

const trackerContainer = document.getElementById("tracker-container");
const searchInput = document.getElementById("search-input");

// Map to store state names to their corresponding Airtable Record IDs
const stateToRecordIdMap = {};

// Helper function to get image path based on state name
function getImageForState(stateName) {
    for (const country in statesByCountry) {
        const stateObj = statesByCountry[country].find(state => state.name === stateName);
        if (stateObj) {
            return stateObj.image;
        }
    }
    return ""; // Return empty string if no image is found
}

// Consolidated function to fetch data from Airtable, populate `stateToRecordIdMap`, and display states
async function fetchData() {
    try {
        const response = await fetch(`https://api.airtable.com/v0/${baseId}/${tableName}`, {
            headers: { Authorization: `Bearer ${apiKey}` }
        });
        const data = await response.json();
        
        // Populate the stateToRecordIdMap with state names and their record IDs
        data.records.forEach(record => {
            const state = record.fields.Region;
            const recordId = record.id;
            stateToRecordIdMap[state] = recordId; // Map state name to Record ID
        });

        // Display the states with the fetched data
        displayStates(data.records);
    } catch (error) {
        console.error("Error fetching data from Airtable:", error);
    }
}

// Display states grouped by country and sorted alphabetically
function displayStates(records) {
    trackerContainer.innerHTML = ""; // Clear previous content

    const groupedData = {};

    records.forEach(record => {
        const state = record.fields.Region;
        const count = record.fields.Count;
        const imagePath = getImageForState(state);

        // Find the country for the state and group accordingly
        for (const country in statesByCountry) {
            if (statesByCountry[country].some(s => s.name === state)) {
                if (!groupedData[country]) groupedData[country] = [];
                groupedData[country].push({ state, count, imagePath, recordId: record.id });
                break;
            }
        }
    });

    // Display each country with states sorted alphabetically
    for (const country in groupedData) {
        const countryHeader = document.createElement("h2");
        countryHeader.className = "country-header";
        countryHeader.textContent = country;
        trackerContainer.appendChild(countryHeader);

        groupedData[country]
            .sort((a, b) => a.state.localeCompare(b.state)) // Sort alphabetically
            .forEach(({ state, count, imagePath, recordId }) => {
                const trackerDiv = document.createElement("div");
                trackerDiv.className = "tracker";

                const stateImage = document.createElement("img");
                stateImage.src = imagePath || "assets/default.png";
                stateImage.alt = `${state} license plate`;

                const stateLabel = document.createElement("span");
                stateLabel.textContent = state;

                const countLabel = document.createElement("span");
                countLabel.className = "counter";
                countLabel.id = `count-${recordId}`;
                countLabel.textContent = count;

                const decrementButton = document.createElement("button");
                decrementButton.textContent = "-";
                decrementButton.onclick = () => updateCount(recordId, count - 1);

                const incrementButton = document.createElement("button");
                incrementButton.textContent = "+";
                incrementButton.onclick = () => updateCount(recordId, count + 1);

                trackerDiv.appendChild(stateImage);
                trackerDiv.appendChild(stateLabel);
                trackerDiv.appendChild(decrementButton);
                trackerDiv.appendChild(countLabel);
                trackerDiv.appendChild(incrementButton);
                trackerContainer.appendChild(trackerDiv);
            });
    }
}

// Function to update the count in Airtable using Record ID
async function updateCount(recordId, newCount) {
    try {
        const response = await fetch(`https://api.airtable.com/v0/${baseId}/${tableName}/${recordId}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fields: { Count: newCount } })
        });
        const data = await response.json();
        
        // Update the displayed count
        document.getElementById(`count-${recordId}`).textContent = data.fields.Count;
    } catch (error) {
        console.error("Error updating count in Airtable:", error);
    }
}

// Search functionality
searchInput.addEventListener('input', (event) => {
    const searchText = event.target.value.toLowerCase();
    const filteredRecords = [];

    // Filter states based on search input
    Object.values(statesByCountry).forEach(states => {
        states.forEach(state => {
            if (state.name.toLowerCase().includes(searchText)) {
                filteredRecords.push(state.name);
            }
        });
    });

    fetchData().then(() => {
        displayStates(
            filteredRecords.map(stateName => ({
                fields: {
                    Region: stateName,
                    Count: document.getElementById(`count-${stateToRecordIdMap[stateName]}`).textContent || 0
                }
            }))
        );
    });
});

// Initial data fetch
fetchData();
