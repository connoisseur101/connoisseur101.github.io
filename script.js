// Global Variables
let selectedRegion = null;
let placesData = {};
let storesData = {};

// Load places (regions) from places.json
fetch('places.json')
    .then(response => response.json())
    .then(data => {
        placesData = data.places;
        populateRegionSelect(placesData);
    })
    .catch(error => console.error('Error loading places:', error));

// Load stores from stores.json
fetch('stores.json')
    .then(response => response.json())
    .then(data => {
        storesData = data.stores;
    })
    .catch(error => console.error('Error loading stores:', error));

// Populate the region selection dropdown
function populateRegionSelect(places) {
    const regionSelect = document.getElementById('region-select');
    places.forEach(place => {
        const option = document.createElement('option');
        option.value = place.id;
        option.textContent = place.name;
        regionSelect.appendChild(option);
    });

    // Set event listener for region selection
    regionSelect.addEventListener('change', function () {
        selectedRegion = this.value;
        loadRegionData(selectedRegion);
        loadStores(selectedRegion);
    });

    // Trigger initial load for the first region
    if (places.length > 0) {
        selectedRegion = places[0].id;
        regionSelect.value = selectedRegion;
        loadRegionData(selectedRegion);
        loadStores(selectedRegion);
    }
}

// Load region description
function loadRegionData(regionId) {
    const region = placesData.find(place => place.id === regionId);
    if (region) {
        document.getElementById('region-info').textContent = region.description;
    }
}

// Load stores for the selected region
function loadStores(regionId) {
    const storesContainer = document.getElementById('stores-container');
    storesContainer.innerHTML = ''; // Clear previous stores
    const filteredStores = storesData.filter(store => store.regionId === regionId && store.online);

    if (filteredStores.length === 0) {
        storesContainer.innerHTML = '<p>No stores available for this region.</p>';
        return;
    }

    filteredStores.forEach(store => {
        const storeDiv = document.createElement('div');
        storeDiv.className = 'store';

        // Create store content
        const storeContent = `
            <h3>${store.name}</h3>
            <p><strong>Category:</strong> ${store.category}</p>
            <p>${store.description}</p>
            <a class="button" href="${store.mapLink}" target="_blank">View on Map</a>
            <button class="collapsible">Details</button>
            <div class="content">
                <p>${store.details}</p>
            </div>
        `;
        storeDiv.innerHTML = storeContent;
        storesContainer.appendChild(storeDiv);
    });

    // Add event listeners for the new collapsible elements
    const collapsibles = storesContainer.getElementsByClassName('collapsible');
    for (let i = 0; i < collapsibles.length; i++) {
        collapsibles[i].addEventListener('click', function () {
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            if (content.style.display === 'block') {
                content.style.display = 'none';
            } else {
                content.style.display = 'block';
            }
        });
    }
}

// Load tour guides from tour-guides.json
fetch('tour-guides.json')
    .then(response => response.json())
    .then(data => {
        const guidesContainer = document.getElementById('tour-guides-container');
        data.guides.forEach(guide => {
            const guideDiv = document.createElement('div');
            guideDiv.className = 'tour-guide';
            guideDiv.innerHTML = `
                <h3>${guide.name}</h3>
                <p><strong>Languages:</strong> ${guide.languages.join(', ')}</p>
                <p>${guide.description}</p>
                <a class="button" href="${guide.contactLink}" target="_blank">Contact</a>
            `;
            guidesContainer.appendChild(guideDiv);
        });
    })
    .catch(error => console.error('Error loading tour guides:', error));

// Collapsible Region Description and Store Details
document.addEventListener('DOMContentLoaded', function () {
    // For region description
    const regionCollapsible = document.querySelector('#region-description .collapsible');
    regionCollapsible.addEventListener('click', function () {
        this.classList.toggle('active');
        const content = this.nextElementSibling;
        if (content.style.display === 'block') {
            content.style.display = 'none';
        } else {
            content.style.display = 'block';
        }
    });
});
