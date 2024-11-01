const apiKey = 'patkHvP79DLxdSXdS.f5426d3dede7ffc9f385aca56989548f5dea2946ae1ddf8813e3a43b857a81d1';
const baseId = 'appyrizLAyOlYArpI';
const tableName = 'License Tracker';

async function fetchAirtableData() {
    try {
        const response = await fetch(`https://api.airtable.com/v0/${baseId}/${tableName}`, {
            headers: { Authorization: `Bearer ${apiKey}` }
        });
        const data = await response.json();
        console.log("Fetched Data:", data.records);
        processAirtableData(data.records);
    } catch (error) {
        console.error('Error fetching data from Airtable:', error);
    }
}

// Manually Defined Arrays
const usStates = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
    "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
    "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
    "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
    "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
    "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
    "Wisconsin", "Wyoming"
];

const canadaProvinces = [
    "Alberta", "British Columbia", "Manitoba", "New Brunswick",
    "Newfoundland and Labrador", "Nova Scotia", "Ontario",
    "Prince Edward Island", "Quebec", "Saskatchewan",
    "Northwest Territories", "Nunavut", "Yukon"
];

const mexicoProvinces = [
    "Aguascalientes", "Baja California", "Baja California Sur",
    "Campeche", "Chiapas", "Chihuahua", "Coahuila", "Colima",
    "Durango", "Guanajuato", "Guerrero", "Hidalgo", "Jalisco",
    "Mexico City", "Mexico State", "Michoacán", "Morelos",
    "Nayarit", "Nuevo León", "Oaxaca", "Puebla", "Querétaro",
    "Quintana Roo", "San Luis Potosí", "Sinaloa", "Sonora",
    "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz",
    "Yucatán", "Zacatecas"
];
function isUSState(region) {
    return usStates.includes(region);
}

function isCanadaProvince(region) {
    return canadaProvinces.includes(region);
}

function isMexicoProvince(region) {
    return mexicoProvinces.includes(region);
}

function processAirtableData(records) {
    let usStatesSeen = new Set();
    let canadaProvincesSeen = new Set();
    let mexicoProvincesSeen = new Set();
    let stateCounts = {};

    records.forEach(record => {
        const region = record.fields ? record.fields['Region'] : null;
        const count = record.fields ? record.fields['Count'] : 0;

        if (region && count > 0) {
            stateCounts[region] = (stateCounts[region] || 0) + count;
            if (isUSState(region)) {
                usStatesSeen.add(region);
            } else if (isCanadaProvince(region)) {
                canadaProvincesSeen.add(region);
            } else if (isMexicoProvince(region)) {
                mexicoProvincesSeen.add(region);
            }
        }
    });

    displayLeaderboard(stateCounts);
    updateProgressBars(usStatesSeen.size, canadaProvincesSeen.size, mexicoProvincesSeen.size);
}

function updateProgressBars(usCount, canadaCount, mexicoCount) {
    // Calculate progress percentages
    const usProgress = Math.min((usCount / 50) * 100, 100);
    const canadaProgress = Math.min((canadaCount / 13) * 100, 100);
    const mexicoProgress = Math.min((mexicoCount / 32) * 100, 100);

    // Get progress bar elements
    const usProgressBar = document.getElementById('us-progress');
    const canadaProgressBar = document.getElementById('canada-progress');
    const mexicoProgressBar = document.getElementById('mexico-progress');

    const usProgressText = document.getElementById('us-progress-text');
    const canadaProgressText = document.getElementById('canada-progress-text');
    const mexicoProgressText = document.getElementById('mexico-progress-text');

    // Update the height of the liquid progress bars to reflect progress
    if (usProgressBar && usProgressText) {
        usProgressBar.style.height = `100%`; // Set height, not width
        usProgressBar.style.width = `${usProgress}%`;
        usProgressText.textContent = `${usCount}/50`;
    }

    if (canadaProgressBar && canadaProgressText) {
        canadaProgressBar.style.height = `100%`; // Set height, not width
        canadaProgressBar.style.width = `${canadaProgress}%`;
        canadaProgressText.textContent = `${canadaCount}/13`;
    }

    if (mexicoProgressBar && mexicoProgressText) {
        mexicoProgressBar.style.width = `${mexicoProgress}%`;
        mexicoProgressBar.style.height = `100%`; // Set height, not width
        mexicoProgressText.textContent = `${mexicoCount}/32`;
    }
}


function displayLeaderboard(stateCounts) {
    const sortedStates = Object.entries(stateCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);
    const leaderboard = document.getElementById('leaderboard');

    if (leaderboard) {
        leaderboard.innerHTML = sortedStates.map(([region, count]) => {
            // Construct the image URL based on the region name
            const imageUrl = `assets/flags/${region.toLowerCase().replace(/ /g, '_')}.png`;

            return `
                <div class="leaderboard-item">
                    <img src="${imageUrl}" alt="${region} Flag" class="flag-icon" />
                    <span>${region}</span>
                    <span>${count}</span>
                </div>
            `;
        }).join('');
    } else {
        console.error("Leaderboard element not found!");
    }
}


document.addEventListener('DOMContentLoaded', fetchAirtableData);
