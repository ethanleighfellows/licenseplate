// states.js

const statesByCountry = {
  '🇺🇸 United States 🇺🇸': [
    { name: "Alabama", image: "assets/plates/alabama.png" },
    { name: "Alaska", image: "assets/plates/alaska.png" },
    { name: "Arizona", image: "assets/plates/arizona.png" },
    { name: "Arkansas", image: "assets/plates/arkansas.png" },
    { name: "California (Outside)", image: "assets/plates/california.png" },
    { name: "Colorado", image: "assets/plates/colorado.png" },
    { name: "Connecticut", image: "assets/plates/connecticut.png" },
    { name: "Delaware", image: "assets/plates/delaware.png" },
    { name: "Florida", image: "assets/plates/florida.png" },
    { name: "Georgia", image: "assets/plates/georgia.png" },
    { name: "Hawaii", image: "assets/plates/hawaii.png" },
    { name: "Idaho", image: "assets/plates/idaho.png" },
    { name: "Illinois", image: "assets/plates/illinois.png" },
    { name: "Indiana", image: "assets/plates/indiana.png" },
    { name: "Iowa", image: "assets/plates/iowa.png" },
    { name: "Kansas", image: "assets/plates/kansas.png" },
    { name: "Kentucky", image: "assets/plates/kentucky.png" },
    { name: "Louisiana", image: "assets/plates/louisiana.png" },
    { name: "Maine", image: "assets/plates/maine.png" },
    { name: "Maryland", image: "assets/plates/maryland.png" },
    { name: "Massachusetts", image: "assets/plates/massachusetts.png" },
    { name: "Michigan", image: "assets/plates/michigan.png" },
    { name: "Minnesota", image: "assets/plates/minnesota.png" },
    { name: "Mississippi", image: "assets/plates/mississippi.png" },
    { name: "Missouri", image: "assets/plates/missouri.png" },
    { name: "Montana", image: "assets/plates/montana.png" },
    { name: "Nebraska", image: "assets/plates/nebraska.png" },
    { name: "Nevada", image: "assets/plates/nevada.png" },
    { name: "New Hampshire", image: "assets/plates/new_hampshire.png" },
    { name: "New Jersey", image: "assets/plates/new_jersey.png" },
    { name: "New Mexico", image: "assets/plates/new_mexico.png" },
    { name: "New York", image: "assets/plates/new_york.png" },
    { name: "North Carolina", image: "assets/plates/north_carolina.png" },
    { name: "North Dakota", image: "assets/plates/north_dakota.png" },
    { name: "Ohio", image: "assets/plates/ohio.png" },
    { name: "Oklahoma", image: "assets/plates/oklahoma.png" },
    { name: "Oregon", image: "assets/plates/oregon.png" },
    { name: "Pennsylvania", image: "assets/plates/pennsylvania.png" },
    { name: "Rhode Island", image: "assets/plates/rhode_island.png" },
    { name: "South Carolina", image: "assets/plates/south_carolina.png" },
    { name: "South Dakota", image: "assets/plates/south_dakota.png" },
    { name: "Tennessee", image: "assets/plates/tennessee.png" },
    { name: "Texas", image: "assets/plates/texas.png" },
    { name: "Utah", image: "assets/plates/utah.png" },
    { name: "Vermont", image: "assets/plates/vermont.png" },
    { name: "Virginia", image: "assets/plates/virginia.png" },
    { name: "Washington", image: "assets/plates/washington.png" },
    { name: "West Virginia", image: "assets/plates/west_virginia.png" },
    { name: "Wisconsin", image: "assets/plates/wisconsin.png" },
    { name: "Wyoming", image: "assets/plates/wyoming.png" }
],
'🇲🇽 Mexico 🇲🇽': [
    { name: "Aguascalientes", image: "assets/plates/aguascalientes.png" },
    { name: "Baja California", image: "assets/plates/baja_california.png" },
    { name: "Baja California Sur", image: "assets/plates/baja_california_sur.png" },
    { name: "Campeche", image: "assets/plates/campeche.png" },
    { name: "Chiapas", image: "assets/plates/chiapas.png" },
    { name: "Chihuahua", image: "assets/plates/chihuahua.png" },
    { name: "Coahuila", image: "assets/plates/coahuila.png" },
    { name: "Colima", image: "assets/plates/colima.png" },
    { name: "Durango", image: "assets/plates/durango.png" },
    { name: "Guanajuato", image: "assets/plates/guanajuato.png" },
    { name: "Guerrero", image: "assets/plates/guerrero.png" },
    { name: "Hidalgo", image: "assets/plates/hidalgo.png" },
    { name: "Jalisco", image: "assets/plates/jalisco.png" },
    { name: "Mexico City", image: "assets/plates/mexico_city.png" },
    { name: "Mexico State", image: "assets/plates/mexico_state.png" },
    { name: "Michoacán", image: "assets/plates/michoacan.png" },
    { name: "Morelos", image: "assets/plates/morelos.png" },
    { name: "Nayarit", image: "assets/plates/nayarit.png" },
    { name: "Nuevo León", image: "assets/plates/nuevo_leon.png" },
    { name: "Oaxaca", image: "assets/plates/oaxaca.png" },
    { name: "Puebla", image: "assets/plates/puebla.png" },
    { name: "Querétaro", image: "assets/plates/queretaro.png" },
    { name: "Quintana Roo", image: "assets/plates/quintana_roo.png" },
    { name: "San Luis Potosí", image: "assets/plates/san_luis_potosi.png" },
    { name: "Sinaloa", image: "assets/plates/sinaloa.png" },
    { name: "Sonora", image: "assets/plates/sonora.png" },
    { name: "Tabasco", image: "assets/plates/tabasco.png" },
    { name: "Tamaulipas", image: "assets/plates/tamaulipas.png" },
    { name: "Tlaxcala", image: "assets/plates/tlaxcala.png" },
    { name: "Veracruz", image: "assets/plates/veracruz.png" },
    { name: "Yucatán", image: "assets/plates/yucatan.png" },
    { name: "Zacatecas", image: "assets/plates/zacatecas.png" }
],
'🇨🇦 Canada 🇨🇦': [
    { name: "Alberta", image: "assets/plates/alberta.png" },
    { name: "British Columbia", image: "assets/plates/british_columbia.png" },
    { name: "Manitoba", image: "assets/plates/manitoba.png" },
    { name: "New Brunswick", image: "assets/plates/new_brunswick.png" },
    { name: "Newfoundland and Labrador", image: "assets/plates/newfoundland_labrador.png" },
    { name: "Nova Scotia", image: "assets/plates/nova_scotia.png" },
    { name: "Ontario (Outside)", image: "assets/plates/ontario.png" },
    { name: "Prince Edward Island", image: "assets/plates/prince_edward_island.png" },
    { name: "Quebec", image: "assets/plates/quebec.png" },
    { name: "Saskatchewan", image: "assets/plates/saskatchewan.png" },
    { name: "Northwest Territories", image: "assets/plates/northwest_territories.png" },
    { name: "Nunavut", image: "assets/plates/nunavut.png" },
    { name: "Yukon", image: "assets/plates/yukon.png" }
]
};

const trackerContainer = document.getElementById("tracker-container");
const searchInput = document.getElementById("search-input");

// Function to call backend update API
function updateCount(state, value) {
    fetch('/update-count', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ state, value })
    })
    .then(response => response.json())
    .then(data => {
        // Update displayed count
        document.getElementById(`count-${state}`).textContent = data.newCount;
    })
    .catch(error => console.error("Error updating count:", error));
}

// Function to generate tracker cards dynamically
function displayStates(stateList) {
    trackerContainer.innerHTML = ""; // Clear previous content

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
            decrementButton.onclick = () => updateCount(state.name, -1); // Decrease count

            const countLabel = document.createElement("span");
            countLabel.className = "counter";
            countLabel.id = `count-${state.name}`;
            countLabel.textContent = 0;

            const incrementButton = document.createElement("button");
            incrementButton.textContent = "+";
            incrementButton.onclick = () => updateCount(state.name, 1); // Increase count

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
