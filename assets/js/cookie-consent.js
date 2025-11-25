/* ============================================
   COOKIE CONSENT MANAGEMENT
   ============================================ */

(function() {
    'use strict';

    // Constants
    const CONSENT_KEY = 'caffeArtCookieConsent';
    const CONSENT_TIMESTAMP_KEY = 'caffeArtConsentTimestamp';
    const CONSENT_ACCEPTED = 'accepted';
    const CONSENT_DECLINED = 'declined';

    /**
     * Check if user has already provided consent
     * @returns {string|null} 'accepted', 'declined', or null if no consent given
     */
    function getConsentStatus() {
        return localStorage.getItem(CONSENT_KEY);
    }

    /**
     * Set user's consent choice
     * @param {string} status - 'accepted' or 'declined'
     */
    function setConsentStatus(status) {
        localStorage.setItem(CONSENT_KEY, status);
        localStorage.setItem(CONSENT_TIMESTAMP_KEY, new Date().toISOString());
    }

    /**
     * Check if user has accepted analytics cookies
     * @returns {boolean} True if user accepted cookies
     */
    function hasAcceptedCookies() {
        return getConsentStatus() === CONSENT_ACCEPTED;
    }

    /**
     * Show the cookie consent banner
     */
    function showBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.style.display = 'block';
        }
    }

    /**
     * Hide the cookie consent banner with animation
     */
    function hideBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.style.animation = 'slideDown 0.5s ease-out';
            setTimeout(function() {
                banner.style.display = 'none';
            }, 500);
        }
    }

    /**
     * Handle user accepting cookies
     */
    function handleAccept() {
        setConsentStatus(CONSENT_ACCEPTED);
        hideBanner();

        // Initialize Google Analytics
        if (typeof CaffeArtAnalytics !== 'undefined' && CaffeArtAnalytics.init) {
            CaffeArtAnalytics.init();
        }

        // Track consent acceptance event (if analytics already initialized)
        if (typeof CaffeArtAnalytics !== 'undefined' && CaffeArtAnalytics.trackEvent) {
            CaffeArtAnalytics.trackEvent('cookie_consent_given', {
                'event_category': 'Privacy',
                'event_label': 'Accepted',
                'consent_method': 'banner'
            });
        }
    }

    /**
     * Handle user declining cookies
     */
    function handleDecline() {
        setConsentStatus(CONSENT_DECLINED);
        hideBanner();

        // Ensure analytics is not initialized
    }

    /**
     * Initialize cookie consent banner
     */
    function init() {
        const consentStatus = getConsentStatus();

        // If user hasn't made a choice, show banner
        if (!consentStatus) {
            showBanner();
        }
        // If user previously accepted, initialize analytics
        else if (consentStatus === CONSENT_ACCEPTED) {
            if (typeof CaffeArtAnalytics !== 'undefined' && CaffeArtAnalytics.init) {
                CaffeArtAnalytics.init();
            }
        }

        // Set up event listeners
        const acceptBtn = document.getElementById('cookie-accept');
        const declineBtn = document.getElementById('cookie-decline');

        if (acceptBtn) {
            acceptBtn.addEventListener('click', handleAccept);
        }

        if (declineBtn) {
            declineBtn.addEventListener('click', handleDecline);
        }
    }

    /**
     * Revoke consent (for future privacy settings page)
     */
    function revokeConsent() {
        localStorage.removeItem(CONSENT_KEY);
        localStorage.removeItem(CONSENT_TIMESTAMP_KEY);
        showBanner();
    }

    /**
     * Get consent timestamp
     * @returns {string|null} ISO timestamp or null
     */
    function getConsentTimestamp() {
        return localStorage.getItem(CONSENT_TIMESTAMP_KEY);
    }

    // Public API
    window.CaffeArtCookieConsent = {
        init: init,
        hasAcceptedCookies: hasAcceptedCookies,
        getConsentStatus: getConsentStatus,
        revokeConsent: revokeConsent,
        getConsentTimestamp: getConsentTimestamp,
        showBanner: showBanner,
        hideBanner: hideBanner
    };

})();
