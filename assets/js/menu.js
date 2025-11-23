/* ============================================
   DRINKS MENU MODULE
   ============================================ */

(function() {
    'use strict';

    let menuData = null;
    let currentLang = 'sr';

    // Icon mapping for categories
    const categoryIcons = {
        'toceno_pivo': 'fas fa-beer',
        'gin': 'fas fa-cocktail',
        'whiskey': 'fas fa-glass-whiskey',
        'vino': 'fas fa-wine-glass-alt',
        'cognac': 'fas fa-wine-bottle',
        'likeri': 'fas fa-cocktail',
        'domaca_rakija': 'fas fa-wine-bottle',
        'rum': 'fas fa-cocktail',
        'tequila': 'fas fa-cocktail',
        'vermut': 'fas fa-wine-glass',
        'vodka': 'fas fa-glass-whiskey',
        'cocktails': 'fas fa-cocktail',
        'grickalice': 'fas fa-cookie-bite',
        'hot_drinks': 'fas fa-coffee',
        'iced_coffee': 'fas fa-ice-cream',
        'fresh_juices': 'fas fa-lemon',
        'mineral_water': 'fas fa-tint',
        'carbonated_drinks': 'fas fa-glass-whiskey',
        'soft_drinks': 'fas fa-glass-whiskey',
        'energy_drinks': 'fas fa-bolt',
        'beer': 'fas fa-beer',
        'combo_deals': 'fas fa-gift'
    };

    // Initialize menu system
    async function initMenu() {
        // Wait for i18n to be available
        if (typeof CaffeArtI18n !== 'undefined' && CaffeArtI18n.getCurrentLanguage) {
            currentLang = CaffeArtI18n.getCurrentLanguage();
        }

        // Load menu data
        await loadMenuData();

        // Render menu
        renderMenu();
    }

    // Load menu data from JSON
    async function loadMenuData() {
        try {
            // Get path prefix using shared utility
            const pathPrefix = CaffeArtUtils.getPathPrefix();

            const response = await fetch(pathPrefix + 'assets/data/menu.json');
            if (!response.ok) {
                throw new Error('Failed to load menu.json');
            }
            const data = await response.json();
            menuData = data.menu;
        } catch (error) {
            console.error('Error loading menu data:', error);
        }
    }

    // Render entire menu
    function renderMenu() {
        if (!menuData) {
            console.error('Menu data not loaded');
            return;
        }

        const container = document.getElementById('drinks-menu');
        if (!container) {
            console.error('Menu container not found');
            return;
        }

        // Clear container
        container.innerHTML = '';

        // Render all categories
        renderCategories(container);
    }

    // Render all categories with section headers
    function renderCategories(container) {
        // Define menu structure with sections
        const menuStructure = [
            {
                sectionKey: 'non_alcoholic',
                categories: [
                    'hot_drinks',
                    'iced_coffee',
                    'fresh_juices',
                    'mineral_water',
                    'carbonated_drinks',
                    'soft_drinks',
                    'energy_drinks'
                ]
            },
            {
                sectionKey: 'alcoholic',
                categories: [
                    'beer',
                    'toceno_pivo',
                    'vino',
                    'domaca_rakija',
                    'rum',
                    'tequila',
                    'vermut',
                    'gin',
                    'whiskey',
                    'cognac',
                    'likeri',
                    'vodka',
                    'cocktails'
                ]
            },
            {
                sectionKey: 'snacks',
                categories: ['grickalice']
            },
            {
                sectionKey: 'combos',
                categories: ['combo_deals']
            }
        ];

        // Render each section
        menuStructure.forEach(section => {
            // Create section header
            const sectionHeader = createSectionHeader(section.sectionKey);
            container.appendChild(sectionHeader);

            // Render categories in this section
            section.categories.forEach(categoryKey => {
                // All categories are under alcoholic_drinks in the JSON structure
                const categoryData = menuData.alcoholic_drinks?.[categoryKey];

                // Render if found
                if (categoryData) {
                    const categoryEl = createCategoryElement(categoryKey, categoryData);
                    container.appendChild(categoryEl);
                }
            });
        });
    }

    // Create section header element
    function createSectionHeader(sectionKey) {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'menu-section-header';

        const title = document.createElement('h2');
        title.className = 'menu-section-title';

        // Get section title from translations
        const sectionTitle = getSectionTitle(sectionKey);
        title.textContent = sectionTitle;

        sectionDiv.appendChild(title);

        return sectionDiv;
    }

    // Get section title from translations
    function getSectionTitle(sectionKey) {
        // Section title mapping
        const sectionTitles = {
            'sr': {
                'non_alcoholic': 'Bezalkoholna pića',
                'alcoholic': 'Alkoholna pića',
                'combos': 'Combo ponude',
                'snacks': 'Grickalice'
            },
            'en': {
                'non_alcoholic': 'Non-Alcoholic Drinks',
                'alcoholic': 'Alcoholic Drinks',
                'combos': 'Combo Deals',
                'snacks': 'Snacks'
            }
        };

        return sectionTitles[currentLang]?.[sectionKey] || sectionKey;
    }

    // Create category element
    function createCategoryElement(categoryKey, categoryData) {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'menu-category';

        // Category header
        const header = document.createElement('div');
        header.className = 'category-header';

        // Icon
        const icon = document.createElement('i');
        icon.className = categoryIcons[categoryKey] || 'fas fa-glass-martini';
        header.appendChild(icon);

        // Title
        const title = document.createElement('h3');
        title.className = 'category-title';
        title.textContent = getCategoryTitle(categoryData);
        header.appendChild(title);

        categoryDiv.appendChild(header);

        // Divider
        const divider = document.createElement('div');
        divider.className = 'category-divider';
        categoryDiv.appendChild(divider);

        // Drinks list
        const drinksList = document.createElement('div');
        drinksList.className = 'drinks-list';

        if (categoryData.items && Array.isArray(categoryData.items)) {
            categoryData.items.forEach(item => {
                const drinkEl = createDrinkElement(item);
                drinksList.appendChild(drinkEl);
            });
        }

        categoryDiv.appendChild(drinksList);

        return categoryDiv;
    }

    // Create drink element
    function createDrinkElement(item) {
        const drinkDiv = document.createElement('div');
        drinkDiv.className = 'drink-item';

        // Drink info (left side)
        const infoDiv = document.createElement('div');
        infoDiv.className = 'drink-info';

        // Name
        const nameSpan = document.createElement('span');
        nameSpan.className = 'drink-name';
        nameSpan.textContent = item.name;
        infoDiv.appendChild(nameSpan);

        // Volume (if exists)
        if (item.volume) {
            const volumeSpan = document.createElement('span');
            volumeSpan.className = 'drink-volume';
            volumeSpan.textContent = formatVolume(item.volume);
            infoDiv.appendChild(volumeSpan);
        }

        drinkDiv.appendChild(infoDiv);

        // Price (right side)
        const priceSpan = document.createElement('span');
        priceSpan.className = 'drink-price';
        priceSpan.textContent = `${item.price} din`;
        drinkDiv.appendChild(priceSpan);

        return drinkDiv;
    }

    // Get category title based on current language
    function getCategoryTitle(categoryData) {
        if (categoryData.title && typeof categoryData.title === 'object') {
            return categoryData.title[currentLang] || categoryData.title.sr || 'Category';
        }
        return categoryData.title || 'Category';
    }

    // Format volume for display
    function formatVolume(volume) {
        if (volume >= 1) {
            return `${volume}l`;
        } else if (volume >= 0.1) {
            // Convert to ml and show in liters if makes sense
            const liters = volume.toFixed(2);
            return `${liters}l`;
        } else {
            // Show in ml for very small volumes (like 0.03l = 30ml)
            const ml = Math.round(volume * 1000);
            return `${ml}ml`;
        }
    }

    // Re-render menu when language changes
    function updateMenuLanguage() {
        if (typeof CaffeArtI18n !== 'undefined' && CaffeArtI18n.getCurrentLanguage) {
            currentLang = CaffeArtI18n.getCurrentLanguage();
        }
        renderMenu();
    }

    // Public API
    window.CaffeArtMenu = {
        init: initMenu,
        updateLanguage: updateMenuLanguage
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMenu);
    } else {
        // DOM already loaded
        initMenu();
    }

})();
