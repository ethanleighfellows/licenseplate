 const trackerContainer = document.getElementById("tracker-container");
        const searchInput = document.getElementById("search-input");

        // Function to generate tracker cards dynamically
        function displayStates(stateList) {
            trackerContainer.innerHTML = "";  // Clear previous content

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
                    countLabel.textContent = 0; // Start with 0, will be updated with fetched data

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

        // Function to update count
        function updateCount(state, value) {
            // Send a request to the backend to update the count
            fetch(`/update-count`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ state, value })
            }).then(response => response.json()).then(data => {
                document.getElementById(`count-${state}`).textContent = data.newCount;
            });
        }

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

            displayStates(filteredStatesByCountry);  // Update displayed list based on search
        });

        function loadCounts() {
            // Fetch the current counts from the server
            fetch(`/get-counts`).then(response => response.json()).then(data => {
                Object.keys(data).forEach(state => {
                    document.getElementById(`count-${state}`).textContent = data[state];
                });
            });
        }

        loadCounts(); // Load counts when the page loads
    </script>
