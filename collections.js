document.addEventListener('DOMContentLoaded', () => {
    fetch('collections.json')
        .then(response => response.json())
        .then(data => renderDatasets(data))
        .catch(error => {
            console.error('Error fetching collections:', error);
            document.getElementById('dataset-container').innerHTML = 
                '<div class="error">Failed to load datasets. Please try again later.</div>';
        });
});

function renderDatasets(data) {
    const container = document.getElementById('dataset-container');
    container.innerHTML = ''; // Clear loading message
    
    data.collections.forEach((dataset, index) => {
        const localImagePath = getLocalImagePath(index, dataset.provider);
        dataset.image = localImagePath;
        const card = createDatasetCard(dataset);
        container.innerHTML += card;
    });
}

function createDatasetCard(dataset) {
    let modelBadge = '';
    
    if (dataset.model === 'subscription') {
        modelBadge = '<span class="model-badge subscription">Subscription</span>';
    } else if (dataset.model === 'one-time') {
        modelBadge = '<span class="model-badge one-time">One-time</span>';
    } else if (dataset.model === 'free') {
        modelBadge = '<span class="model-badge free">Free</span>';
    }
    
    // Format price display based on model type
    let priceDisplay = dataset.price;
    if (dataset.model === 'subscription') {
        priceDisplay = `${dataset.price}/month`;
    }
        
    return `
        <div class="dataset-card">
            <img src="${dataset.image}" alt="${dataset.title} dataset" class="dataset-img">
            <div class="dataset-content">
                <div class="dataset-provider">
                    <span class="provider-logo"></span>
                    ${dataset.provider}
                </div>
                <h3 class="dataset-title">${dataset.title}</h3>
                <p class="dataset-desc">${dataset.description}</p>
                <div class="dataset-meta">
                    <div class="dataset-popularity">${renderStars(dataset.popularity)}</div>
                    <div class="dataset-price">${priceDisplay}</div>
                </div>
                <div class="model-container">
                    ${modelBadge}
                </div>
                <div class="tags">
                    ${dataset.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <a href="${dataset.website}" target="_blank" class="btn btn-primary card-btn">Request Access</a>
            </div>
        </div>
    `;
}

function renderStars(popularity) {
    // Handle undefined or null values
    if (popularity === undefined || popularity === null) {
        return 'No rating';
    }
    
    const fullStars = Math.floor(popularity);
    const halfStar = popularity % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let stars = '';
    for (let i = 0; i < fullStars; i++) {
        stars += '★';
    }
    if (halfStar) {
        stars += '★';
    }
    for (let i = 0; i < emptyStars; i++) {
        stars += '☆';
    }
    
    return stars + ' ' + popularity.toFixed(1);
}

function setupSearch() {
    const searchBox = document.querySelector('.search-box');
    searchBox.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        const filteredData = {
            collections: collectionsData.collections.filter(dataset => 
                dataset.title.toLowerCase().includes(searchTerm) ||
                dataset.description.toLowerCase().includes(searchTerm) ||
                dataset.provider.toLowerCase().includes(searchTerm) ||
                dataset.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
                dataset.model.toLowerCase().includes(searchTerm)
            )
        };
        
        renderDatasets(filteredData);
    });
}

function getLocalImagePath(index, provider) {
    const [firstName, lastName] = provider.split(' ');
    return `images/${index + 1}.jpg`;
}
