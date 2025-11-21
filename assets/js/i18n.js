/* ============================================
   INTERNATIONALIZATION (i18n) MODULE
   ============================================ */

(function() {
    'use strict';

    // Current language and translations object
    let currentLang = 'sr'; // Default language
    let translations = {};

    // Initialize i18n system
    async function initI18n() {
        // Check localStorage for saved language preference
        const savedLang = localStorage.getItem('caffeArtLang');
        if (savedLang && (savedLang === 'sr' || savedLang === 'en')) {
            currentLang = savedLang;
        }

        // Set HTML lang attribute
        document.documentElement.lang = currentLang;

        // Load translation files
        await loadTranslations();

        // Apply translations to the page
        applyTranslations();

        // Set up language switcher event listeners
        setupLanguageSwitcher();

        // Update active language indicator
        updateActiveLanguage();
    }

    // Load translation files
    async function loadTranslations() {
        try {
            const response = await fetch(`assets/lang/${currentLang}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load ${currentLang}.json`);
            }
            translations = await response.json();
        } catch (error) {
            console.error('Error loading translations:', error);
            // Fallback to Serbian if translation load fails
            if (currentLang !== 'sr') {
                currentLang = 'sr';
                const response = await fetch('assets/lang/sr.json');
                translations = await response.json();
            }
        }
    }

    // Apply translations to all elements with data-i18n
    function applyTranslations() {
        // Update page title
        updatePageTitle();

        // Translate text content
        document.querySelectorAll('[data-i18n]').forEach(function(element) {
            const key = element.getAttribute('data-i18n');
            const translation = getNestedTranslation(key);

            if (translation) {
                // Add fade effect
                element.style.opacity = '0';

                setTimeout(function() {
                    element.textContent = translation;
                    element.style.transition = 'opacity 0.3s ease';
                    element.style.opacity = '1';
                }, 150);
            }
        });

        // Translate attributes (like alt, placeholder, title)
        document.querySelectorAll('[data-i18n-attr]').forEach(function(element) {
            const attrPairs = element.getAttribute('data-i18n-attr').split(';');

            attrPairs.forEach(function(pair) {
                const [attr, key] = pair.split(':');
                const translation = getNestedTranslation(key.trim());

                if (translation) {
                    element.setAttribute(attr.trim(), translation);
                }
            });
        });

        // Translate list items dynamically
        translateDynamicLists();
    }

    // Get nested translation from object using dot notation
    function getNestedTranslation(key) {
        const keys = key.split('.');
        let value = translations;

        for (let i = 0; i < keys.length; i++) {
            if (value && typeof value === 'object' && keys[i] in value) {
                value = value[keys[i]];
            } else {
                return null;
            }
        }

        return value;
    }

    // Update page title based on current page
    function updatePageTitle() {
        const path = window.location.pathname;
        let titleKey = 'meta.title.home';

        if (path.includes('bar.html')) {
            titleKey = 'meta.title.bar';
        } else if (path.includes('gallery.html')) {
            titleKey = 'meta.title.gallery';
        } else if (path.includes('contact.html')) {
            titleKey = 'meta.title.contact';
        }

        const title = getNestedTranslation(titleKey);
        if (title) {
            document.title = title;
        }
    }

    // Translate dynamic lists (menu items, etc.)
    function translateDynamicLists() {
        // Bar menu items
        const menuCards = document.querySelectorAll('.menu-card');
        menuCards.forEach(function(card, index) {
            const categoryKeys = ['spirits', 'beers', 'cold_drinks', 'hot_drinks'];
            if (index < categoryKeys.length) {
                const categoryKey = categoryKeys[index];
                const category = translations.bar?.categories?.[categoryKey];

                if (category) {
                    // Update title
                    const titleElement = card.querySelector('.menu-card-title');
                    if (titleElement) {
                        titleElement.textContent = category.title;
                    }

                    // Update list items
                    const listItems = card.querySelectorAll('.menu-card-list li');
                    listItems.forEach(function(item, itemIndex) {
                        if (category.items && category.items[itemIndex]) {
                            item.textContent = category.items[itemIndex];
                        }
                    });
                }
            }
        });
    }

    // Setup language switcher event listeners
    function setupLanguageSwitcher() {
        const langButtons = document.querySelectorAll('.lang-switcher button, .mobile-lang-switcher button, .lang-switcher a, .mobile-lang-switcher a');

        langButtons.forEach(function(button) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const newLang = this.getAttribute('data-lang');

                if (newLang && newLang !== currentLang) {
                    switchLanguage(newLang);
                }
            });
        });
    }

    // Switch to a new language
    async function switchLanguage(newLang) {
        if (newLang !== 'sr' && newLang !== 'en') {
            console.error('Invalid language:', newLang);
            return;
        }

        // Update current language
        currentLang = newLang;

        // Save to localStorage
        localStorage.setItem('caffeArtLang', newLang);

        // Update HTML lang attribute
        document.documentElement.lang = newLang;

        // Load new translations
        await loadTranslations();

        // Apply new translations
        applyTranslations();

        // Update active language indicator
        updateActiveLanguage();

        // Re-initialize Twemoji for flag emojis after language change
        if (typeof twemoji !== 'undefined') {
            setTimeout(function() {
                twemoji.parse(document.body, {
                    folder: 'svg',
                    ext: '.svg',
                    className: 'emoji-icon'
                });
            }, 200);
        }

        // Update menu if available
        if (typeof CaffeArtMenu !== 'undefined' && CaffeArtMenu.updateLanguage) {
            CaffeArtMenu.updateLanguage();
        }

        // Close mobile menu if open
        closeMobileMenu();
    }

    // Close mobile menu helper function
    function closeMobileMenu() {
        const mainNav = document.querySelector('.main-nav');
        const menuIcon = document.querySelector('.mobile-menu-icon');
        const body = document.body;

        if (mainNav && mainNav.classList.contains('open')) {
            mainNav.classList.remove('open');
            body.classList.remove('menu-open');

            // Get current scroll position from body top before resetting
            const currentTop = body.style.top;
            const scrollPosition = currentTop ? Math.abs(parseInt(currentTop)) : 0;

            body.style.top = '';

            // Restore scroll position
            requestAnimationFrame(function() {
                window.scrollTo({
                    top: scrollPosition,
                    behavior: 'instant'
                });
            });

            if (menuIcon) {
                menuIcon.innerHTML = '<i class="fas fa-bars"></i>';
            }
        }
    }

    // Update active language indicator
    function updateActiveLanguage() {
        const langButtons = document.querySelectorAll('.lang-switcher button, .mobile-lang-switcher button, .lang-switcher a, .mobile-lang-switcher a');

        langButtons.forEach(function(button) {
            const buttonLang = button.getAttribute('data-lang');
            if (buttonLang === currentLang) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    // Get current language
    function getCurrentLanguage() {
        return currentLang;
    }

    // Public API
    window.CaffeArtI18n = {
        init: initI18n,
        switchLanguage: switchLanguage,
        getCurrentLanguage: getCurrentLanguage
    };

})();
