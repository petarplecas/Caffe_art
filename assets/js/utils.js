/* ============================================
   SHARED UTILITY FUNCTIONS
   ============================================ */

(function() {
    'use strict';

    /**
     * Determines the path prefix based on current location
     * Used for loading assets and templates from subfolders
     * @returns {string} Path prefix (empty since we use <base> tag)
     */
    function getPathPrefix() {
        // With <base href="/Caffe_art/"> tag, all paths are relative to root
        return '';
    }

    /**
     * Throttle function for performance optimization
     * Limits how often a function can be called
     * @param {Function} func - Function to throttle
     * @param {number} delay - Minimum time between calls in milliseconds
     * @returns {Function} Throttled function
     */
    function throttle(func, delay) {
        let lastCall = 0;
        return function(...args) {
            const now = new Date().getTime();
            if (now - lastCall < delay) {
                return;
            }
            lastCall = now;
            return func(...args);
        };
    }

    /**
     * Close mobile menu and restore scroll position
     * Shared function used by navigation and language switcher
     */
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

    /**
     * Check if current page matches a given path pattern
     * @param {string} pattern - Path pattern to match (e.g., '/bar/', 'bar.html')
     * @returns {boolean} True if current page matches pattern
     */
    function isCurrentPage(pattern) {
        return window.location.pathname.includes(pattern);
    }

    /**
     * Remove trailing slash from URL
     * Automatically redirects if URL has trailing slash
     */
    function removeTrailingSlash() {
        const path = window.location.pathname;
        const hasTrailingSlash = path.length > 1 && path.endsWith('/');

        if (hasTrailingSlash) {
            const newPath = path.slice(0, -1);
            const newUrl = window.location.protocol + '//' +
                          window.location.host +
                          newPath +
                          window.location.search +
                          window.location.hash;

            window.history.replaceState(null, '', newUrl);
        }
    }

    // Remove trailing slash on page load
    removeTrailingSlash();

    // Public API
    window.CaffeArtUtils = {
        getPathPrefix: getPathPrefix,
        throttle: throttle,
        closeMobileMenu: closeMobileMenu,
        isCurrentPage: isCurrentPage,
        removeTrailingSlash: removeTrailingSlash
    };

})();
