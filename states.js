// states.js

const statesByCountry = {
    // (All country, state, and province data here)
};

const trackerContainer = document.getElementById("tracker-container");
const searchInput = document.getElementById("search-input");

// Function to generate tracker cards dynamically
function displayStates(stateList) {
    trackerContainer.innerHTML = "";  // Clear previous content

    for (const country in stateList) {
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
            countLabel.textContent = 0;

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
