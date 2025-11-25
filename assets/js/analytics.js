/* ============================================
   GOOGLE ANALYTICS 4 TRACKING MODULE
   ============================================ */

(function() {
    'use strict';

    // GA4 Measurement ID - Replace with your actual GA4 property ID
    const GA4_MEASUREMENT_ID = 'G-PB3G5YR15S'; 

    let isInitialized = false;
    let trackingQueue = [];

    /**
     * Initialize Google Analytics 4
     * Only called after user consent is given
     */
    function init() {
        // Check if user has consented
        if (typeof CaffeArtCookieConsent === 'undefined' ||
            !CaffeArtCookieConsent.hasAcceptedCookies()) {
            // User has not accepted cookies
            return;
        }

        // Check if already initialized
        if (isInitialized) {
            // Already initialized
            return;
        }

        // Load GA4 script
        loadGA4Script();

        // Initialize data layer
        window.dataLayer = window.dataLayer || [];

        // Configure GA4
        gtag('js', new Date());
        gtag('config', GA4_MEASUREMENT_ID, {
            'anonymize_ip': true,
            'send_page_view': true,
            'cookie_flags': 'SameSite=None;Secure'
        });

        // Set user properties
        setUserProperties();

        // Mark as initialized
        isInitialized = true;

        // Process queued events
        processQueue();

        // Set up automatic tracking
        setupAutomaticTracking();

        // GA4 initialized
    }

    /**
     * Load Google Analytics 4 script dynamically
     */
    function loadGA4Script() {
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_MEASUREMENT_ID;
        document.head.appendChild(script);
    }

    /**
     * gtag helper function
     */
    function gtag() {
        if (typeof window.dataLayer !== 'undefined') {
            window.dataLayer.push(arguments);
        }
    }

    /**
     * Set user properties based on site state
     */
    function setUserProperties() {
        const language = localStorage.getItem('caffeArtLang') || 'sr';
        const pageType = determinePageType();

        gtag('set', 'user_properties', {
            'language': language,
            'page_type': pageType
        });
    }

    /**
     * Determine current page type
     * @returns {string} Page type identifier
     */
    function determinePageType() {
        const pathname = window.location.pathname;

        if (pathname.includes('/bar')) return 'bar';
        if (pathname.includes('/gallery')) return 'gallery';
        if (pathname.includes('/contact')) return 'contact';
        if (pathname.includes('/faq')) return 'faq';
        return 'home';
    }

    /**
     * Track custom event
     * @param {string} eventName - Name of the event
     * @param {Object} eventParams - Event parameters
     */
    function trackEvent(eventName, eventParams) {
        if (!isInitialized) {
            // Queue event for later if not yet initialized
            trackingQueue.push({ name: eventName, params: eventParams });
            return;
        }

        gtag('event', eventName, eventParams || {});
    }

    /**
     * Process queued events after initialization
     */
    function processQueue() {
        while (trackingQueue.length > 0) {
            const event = trackingQueue.shift();
            gtag('event', event.name, event.params);
        }
    }

    /**
     * Track phone number clicks
     */
    function trackPhoneClick() {
        trackEvent('contact_phone_click', {
            'event_category': 'Contact',
            'event_label': 'Phone Number Click',
            'phone_number': '+381612003932',
            'page': determinePageType()
        });
    }

    /**
     * Track email clicks
     */
    function trackEmailClick() {
        trackEvent('contact_email_click', {
            'event_category': 'Contact',
            'event_label': 'Email Click',
            'email': 'caffeart@gmail.com',
            'page': determinePageType()
        });
    }

    /**
     * Track social media clicks
     * @param {string} platform - Social media platform name
     * @param {string} location - Where the link was clicked
     */
    function trackSocialClick(platform, location) {
        trackEvent('social_media_click', {
            'event_category': 'Social',
            'platform': platform,
            'link_location': location || 'Footer'
        });
    }

    /**
     * Track language change
     * @param {string} previousLang - Previous language code
     * @param {string} newLang - New language code
     */
    function trackLanguageChange(previousLang, newLang) {
        trackEvent('language_change', {
            'event_category': 'Engagement',
            'previous_language': previousLang,
            'new_language': newLang
        });

        // Update user property
        if (isInitialized) {
            gtag('set', 'user_properties', {
                'language': newLang
            });
        }
    }

    /**
     * Track navigation clicks
     * @param {string} linkText - Text of the navigation link
     * @param {string} destination - URL destination
     * @param {string} location - Click location (Header/Mobile Menu/etc)
     */
    function trackNavigation(linkText, destination, location) {
        trackEvent('navigation_click', {
            'event_category': 'Navigation',
            'link_text': linkText,
            'link_url': destination,
            'click_location': location || 'Header'
        });
    }

    /**
     * Track CTA button clicks
     * @param {string} buttonText - Button text
     * @param {string} destination - Destination URL
     * @param {string} location - Where button was clicked
     */
    function trackCTAClick(buttonText, destination, location) {
        trackEvent('cta_click', {
            'event_category': 'CTA',
            'button_text': buttonText,
            'destination': destination,
            'location': location || 'Homepage'
        });
    }

    /**
     * Track FAQ item view
     * @param {string} question - Question text
     * @param {number} index - Question index (1-based)
     */
    function trackFAQView(question, index) {
        trackEvent('faq_view', {
            'event_category': 'FAQ',
            'question': question,
            'question_index': index
        });
    }

    /**
     * Track menu category view
     * @param {string} categoryName - Category identifier
     * @param {string} section - Section (alcoholic/non_alcoholic)
     */
    function trackMenuCategory(categoryName, section) {
        trackEvent('menu_category_view', {
            'event_category': 'Menu',
            'category_name': categoryName,
            'section': section
        });
    }

    /**
     * Track scroll depth
     * @param {number} percentage - Scroll depth percentage (25, 50, 75, 100)
     */
    function trackScrollDepth(percentage) {
        trackEvent('scroll_depth', {
            'event_category': 'Engagement',
            'page': determinePageType(),
            'depth_percentage': percentage
        });
    }

    /**
     * Set up automatic tracking for common elements
     */
    function setupAutomaticTracking() {
        // Track all phone number clicks
        document.addEventListener('click', function(e) {
            const target = e.target.closest('a[href^="tel:"]');
            if (target) {
                trackPhoneClick();
            }
        });

        // Track all email clicks
        document.addEventListener('click', function(e) {
            const target = e.target.closest('a[href^="mailto:"]');
            if (target) {
                trackEmailClick();
            }
        });

        // Track social media clicks
        document.addEventListener('click', function(e) {
            const target = e.target.closest('.contact-social a');
            if (target) {
                const href = target.getAttribute('href');
                let platform = 'Unknown';

                if (href.includes('facebook.com')) {
                    platform = 'Facebook';
                } else if (href.includes('instagram.com')) {
                    platform = 'Instagram';
                }

                trackSocialClick(platform, 'Footer');
            }
        });

        // Set up scroll depth tracking
        setupScrollDepthTracking();
    }

    /**
     * Set up scroll depth tracking (25%, 50%, 75%, 100%)
     */
    function setupScrollDepthTracking() {
        const depths = [25, 50, 75, 100];
        const tracked = new Set();

        function checkScrollDepth() {
            const scrollPercentage = (window.scrollY + window.innerHeight) / document.body.scrollHeight * 100;

            depths.forEach(function(depth) {
                if (scrollPercentage >= depth && !tracked.has(depth)) {
                    tracked.add(depth);
                    trackScrollDepth(depth);
                }
            });
        }

        // Use throttle from utils if available
        const throttledCheck = typeof CaffeArtUtils !== 'undefined' && CaffeArtUtils.throttle
            ? CaffeArtUtils.throttle(checkScrollDepth, 1000)
            : checkScrollDepth;

        window.addEventListener('scroll', throttledCheck);
    }

    /**
     * Check if GA4 is initialized
     * @returns {boolean} True if initialized
     */
    function isGA4Initialized() {
        return isInitialized;
    }

    /**
     * Get current GA4 Measurement ID
     * @returns {string} Measurement ID
     */
    function getMeasurementId() {
        return GA4_MEASUREMENT_ID;
    }

    // Public API
    window.CaffeArtAnalytics = {
        init: init,
        trackEvent: trackEvent,
        trackPhoneClick: trackPhoneClick,
        trackEmailClick: trackEmailClick,
        trackSocialClick: trackSocialClick,
        trackLanguageChange: trackLanguageChange,
        trackNavigation: trackNavigation,
        trackCTAClick: trackCTAClick,
        trackFAQView: trackFAQView,
        trackMenuCategory: trackMenuCategory,
        trackScrollDepth: trackScrollDepth,
        isInitialized: isGA4Initialized,
        getMeasurementId: getMeasurementId
    };

})();
