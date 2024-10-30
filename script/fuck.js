document.addEventListener("DOMContentLoaded", () => {
    // Airtable setup
    const accessToken = 'YOUR_PERSONAL_ACCESS_TOKEN'; // Replace with your Airtable PAT
    const baseId = 'YOUR_BASE_ID'; // Replace with your Airtable Base ID
    const tableName = 'States'; // Replace with your table name

    // Check if elements exist
    const trackerContainer = document.getElementById("tracker-container");
    const searchInput = document.getElementById("search-input");

    // Ensure statesByCountry is loaded and elements are found
    if (typeof statesByCountry !== "undefined" && trackerContainer && searchInput) {

        // Function to generate tracker cards dynamically
        function displayStates(stateList) {
            trackerContainer.innerHTML = ""; // Clear previous content

            for (const country in stateList) {
                // Create a header for each country
                const countryHeader = document.createElement("h2");
                countryHeader.className = "country-header";
                countryHeader.textContent = country;
                trackerContainer.appendChild(countryHeader);

                stateList[country].forEach(state => {
                    const trackerDiv = document.createElement("div");
                    trackerDiv.className = "tracker";

                    const stateImage = document.createElement("img");
                    stateImage.src = state.image;
                    stateImage.alt = `${state.name} license plate`;

                    const stateLabel = document.createElement("span");
                    stateLabel.textContent = state.name;

                    const decrementButton = document.createElement("button");
                    decrementButton.textContent = "-";
                    decrementButton.onclick = () => updateCount(state.name, -1);

                    const countLabel = document.createElement("span");
                    countLabel.className = "counter";
                    countLabel.id = `count-${state.name}`;
                    countLabel.textContent = 0; // Default to 0; will be updated with fetched data

                    const incrementButton = document.createElement("button");
                    incrementButton.textContent = "+";
                    incrementButton.onclick = () => updateCount(state.name, 1);

                    trackerDiv.appendChild(stateImage);
                    trackerDiv.appendChild(stateLabel);
                    trackerDiv.appendChild(decrementButton);
                    trackerDiv.appendChild(countLabel);
                    trackerDiv.appendChild(incrementButton);
                    trackerContainer.appendChild(trackerDiv);
                });
            }
        }

        // Display all states initially
        displayStates(statesByCountry);

        // Function to update count in Airtable
        async function updateCount(state, value) {
            try {
                // Fetch the record ID based on the state name
                const record = await getRecordByState(state);
                if (!record) {
                    console.error("No matching record found for:", state);
                    return;
                }

                // Patch request to update the count
                const updatedCount = record.fields.Count + value;
                const response = await fetch(`https://api.airtable.com/v0/${baseId}/${tableName}/${record.id}`, {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        fields: { Count: updatedCount }
                    })
                });
                if (!response.ok) throw new Error("Failed to update count");

                const data = await response.json();
                document.getElementById(`count-${state}`).textContent = data.fields.Count; // Update displayed count
            } catch (error) {
                console.error("Error updating count in Airtable:", error);
            }
        }

        // Function to search Airtable for a record by state name
        async function getRecordByState(state) {
            try {
                const response = await fetch(`https://api.airtable.com/v0/${baseId}/${tableName}?filterByFormula={Region}="${state}"`, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                const data = await response.json();
                return data.records[0]; // Return the first matching record
            } catch (error) {
                console.error("Error retrieving record from Airtable:", error);
                return null;
            }
        }

        // Function to load initial counts from Airtable
        async function loadCounts() {
            try {
                const response = await fetch(`https://api.airtable.com/v0/${baseId}/${tableName}`, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                const data = await response.json();
                
                // Map Airtable records to their count elements in the DOM
                data.records.forEach(record => {
                    const countLabel = document.getElementById(`count-${record.fields.Region}`);
                    if (countLabel) {
                        countLabel.textContent = record.fields.Count;
                    }
                });
            } catch (error) {
                console.error("Error loading counts from Airtable:", error);
            }
        }

        loadCounts(); // Load counts when the page loads

        // Search functionality to filter states
        searchInput.addEventListener('input', (event) => {
            const searchText = event.target.value.toLowerCase();
            const filteredStatesByCountry = {};

            for (const country in statesByCountry) {
                const filteredStates = statesByCountry[country].filter(state =>
                    state.name.toLowerCase().includes(searchText)
                );
                if (filteredStates.length > 0) {
                    filteredStatesByCountry[country] = filteredStates;
                }
            }

            displayStates(filteredStatesByCountry); // Update displayed list based on search
        });

    } else {
        console.error("Missing required elements or data.");
    }
});
