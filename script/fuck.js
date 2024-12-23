document.addEventListener("DOMContentLoaded", () => {
    // Airtable setup
    const accessToken = 'patkHvP79DLxdSXdS.f5426d3dede7ffc9f385aca56989548f5dea2946ae1ddf8813e3a43b857a81d1'; // Replace with your Airtable PAT
    const baseId = 'appyrizLAyOlYArpI.'; // Replace with your Airtable Base ID
    const tableName = 'License Tracker'; // Replace with your table name

     const trackerContainer = document.getElementById("tracker-container");
    const searchInput = document.getElementById("search-input");

    if (typeof statesByCountry !== "undefined" && trackerContainer && searchInput) {

        function displayStates(records) {
    trackerContainer.innerHTML = ""; // Clear previous content

    records.forEach(record => {
        const state = record.fields.Region;
        const count = record.fields.Count;
        const recordId = record.id;
        const imagePath = getImageForState(state);

        const trackerDiv = document.createElement("div");
        trackerDiv.className = "tracker";

        const stateImage = document.createElement("img");
        stateImage.src = imagePath || "assets/default.png";
        stateImage.alt = ${state} license plate;

        const stateLabel = document.createElement("span");
        stateLabel.textContent = state;

        const countLabel = document.createElement("span");
        countLabel.className = "counter";
        countLabel.id = count-${recordId};
        countLabel.textContent = count;

        const decrementButton = document.createElement("button");
        decrementButton.textContent = "-";
        decrementButton.onclick = () => updateCount(recordId, 'decrement'); // Use action name

const incrementButton = document.createElement("button");
        incrementButton.textContent = "+";
        incrementButton.onclick = () => updateCount(recordId, 'increment'); // Use action name


        trackerDiv.appendChild(stateImage);
        trackerDiv.appendChild(stateLabel);
        trackerDiv.appendChild(decrementButton);
        trackerDiv.appendChild(countLabel);
        trackerDiv.appendChild(incrementButton);
        trackerContainer.appendChild(trackerDiv);
    });
}
}

        async function fetchData() {
            try {
                const response = await fetch(https://api.airtable.com/v0/${baseId}/${tableName}, {
                    headers: { Authorization: Bearer ${accessToken} }
                });
                const data = await response.json();
                console.log("Fetched data:", data); // Check the structure of fetched data
                displayStates(data.records); // Pass records to displayStates
            } catch (error) {
                console.error("Error fetching data from Airtable:", error);
            }
        }

        async function updateCount(recordId, newCount) {
            try {
                const response = await fetch(https://api.airtable.com/v0/${baseId}/${tableName}/${recordId}, {
                    method: "PATCH",
                    headers: {
                        Authorization: Bearer ${accessToken},
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ fields: { Count: newCount } })
                });
                const data = await response.json();
                document.getElementById(count-${recordId}).textContent = data.fields.Count;
            } catch (error) {
                console.error("Error updating count in Airtable:", error);
            }
        }

        async function loadCounts() {
            try {
                const response = await fetch(https://api.airtable.com/v0/${baseId}/${tableName}, {
                    headers: { Authorization: Bearer ${accessToken} }
                });
                const data = await response.json();
                data.records.forEach(record => {
                    const countLabel = document.getElementById(count-${record.fields.Region});
                    if (countLabel) {
                        countLabel.textContent = record.fields.Count;
                    }
                });
            } catch (error) {
                console.error("Error loading counts from Airtable:", error);
            }
        }

        loadCounts();
        fetchData();
    } else {
        console.error("Missing required elements or data.");
    }
});
