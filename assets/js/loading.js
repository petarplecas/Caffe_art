/**
 * Loading Screen Controller
 * Handles the loading screen animation and transition to main content
 */

(function() {
    'use strict';

    // Minimum loading time in milliseconds (to ensure users see the animation)
    const MIN_LOADING_TIME = 1500;

    // Time when script starts executing
    const startTime = Date.now();

    /**
     * Initialize loading screen
     */
    function initLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');

        if (!loadingScreen) {
            console.warn('Loading screen element not found');
            return;
        }

        // Add loading class to body to prevent scrolling
        document.body.classList.add('loading');

        // Wait for page to fully load
        window.addEventListener('load', function() {
            hideLoadingScreen(loadingScreen);
        });

        // Fallback: hide loading screen after maximum time (5 seconds)
        setTimeout(function() {
            if (!loadingScreen.classList.contains('hidden')) {
                console.warn('Loading screen timeout - hiding forcefully');
                hideLoadingScreen(loadingScreen);
            }
        }, 5000);
    }

    /**
     * Hide loading screen with smooth transition
     */
    function hideLoadingScreen(loadingScreen) {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsedTime);

        // Transition duration is same for all devices
        const transitionDuration = 1000; // 1s for all devices

        // Wait for minimum loading time before hiding
        setTimeout(function() {
            // Add transitioning class for logo movement animation
            loadingScreen.classList.add('transitioning');

            // Wait for logo transition to complete, then fade out
            setTimeout(function() {
                loadingScreen.classList.add('hidden');

                // Remove loading class from body to enable scrolling
                document.body.classList.remove('loading');

                // Remove from DOM after transition completes
                setTimeout(function() {
                    loadingScreen.style.display = 'none';
                }, 800);
            }, transitionDuration);
        }, remainingTime);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLoadingScreen);
    } else {
        initLoadingScreen();
    }
})();
