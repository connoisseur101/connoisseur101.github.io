// Global Variables
let selectedRegion = 'tsukiji'; // Default region
let selectedCategory = 'Street Food'; // Default category
let placesData = [];
let storesData = [];

// Load places (regions) from places.json
fetch('places.json')
    .then(response => response.json())
    .then(data => {
        placesData = data.places;
        populateRegionButtons(placesData);
        loadRegionData(selectedRegion);
        loadStores(selectedRegion, selectedCategory);
    })
    .catch(error => console.error('Error loading places:', error));

// Load stores from stores.json
fetch('stores.json')
    .then(response => response.json())
    .then(data => {
        storesData = data.stores;
        populateCategoryButtons(storesData);
    })
    .catch(error => console.error('Error loading stores:', error));

// Populate the region buttons
function populateRegionButtons(places) {
    const regionButtonsContainer = document.getElementById('region-buttons');
    regionButtonsContainer.innerHTML = ''; // Clear previous buttons

    places.forEach(place => {
        const button = document.createElement('button');
        button.className = 'region-button';
        button.textContent = place.name;
        button.dataset.regionId = place.id;

        button.addEventListener('click', function () {
            selectedRegion = this.dataset.regionId;
            loadRegionData(selectedRegion);
            loadStores(selectedRegion, selectedCategory);
            highlightActiveRegionButton(selectedRegion);
        });

        regionButtonsContainer.appendChild(button);
    });

    // Highlight the default region button
    highlightActiveRegionButton(selectedRegion);
}

// Highlight the active region button
function highlightActiveRegionButton(regionId) {
    const buttons = document.getElementsByClassName('region-button');
    Array.from(buttons).forEach(button => {
        if (button.dataset.regionId === regionId) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

// Populate the category buttons
function populateCategoryButtons(stores) {
    const categoryButtonsContainer = document.getElementById('category-buttons');
    categoryButtonsContainer.innerHTML = ''; // Clear previous buttons

    // Get unique categories
    const categories = [...new Set(stores.map(store => store.category))];

    categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'category-button';
        button.textContent = category;

        button.addEventListener('click', function () {
            selectedCategory = category;
            loadStores(selectedRegion, selectedCategory);
            highlightActiveCategoryButton(selectedCategory);
        });

        categoryButtonsContainer.appendChild(button);
    });

    // Highlight the default category button
    highlightActiveCategoryButton(selectedCategory);
}

// Highlight the active category button
function highlightActiveCategoryButton(category) {
    const buttons = document.getElementsByClassName('category-button');
    Array.from(buttons).forEach(button => {
        if (button.textContent === category) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

// Load region description
function loadRegionData(regionId) {
    const region = placesData.find(place => place.id === regionId);
    if (region) {
        document.getElementById('region-info').textContent = region.description;
    }
}

// Load stores for the selected region and category
function loadStores(regionId, category) {
    const storesContainer = document.getElementById('stores-container');
    storesContainer.innerHTML = ''; // Clear previous stores

    const filteredStores = storesData.filter(store =>
        store.regionId === regionId &&
        store.online &&
        store.category === category
    );

    if (filteredStores.length === 0) {
        storesContainer.innerHTML = '<p>No stores available for this selection.</p>';
        return;
    }

    filteredStores.forEach(store => {
        const storeDiv = document.createElement('div');
        storeDiv.className = 'store';

        // Create store content
        const storeContent = `
            <h3>${store.name}</h3>
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

// Collapsible Sections
document.addEventListener('DOMContentLoaded', function () {
    const collapsibles = document.getElementsByClassName('collapsible');
    Array.from(collapsibles).forEach(collapsible => {
        // Start collapsed except for region description
        if (collapsible.parentElement.id !== 'region-description') {
            collapsible.nextElementSibling.style.display = 'none';
        }

        collapsible.addEventListener('click', function () {
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            if (content.style.display === 'block') {
                content.style.display = 'none';
            } else {
                content.style.display = 'block';
            }
        });
    });
});
