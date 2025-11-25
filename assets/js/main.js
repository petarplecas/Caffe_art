// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {

    /* Load Header and Footer Templates */
    function loadTemplate(selector, templatePath, callback) {
        fetch(templatePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load template: ' + templatePath);
                }
                return response.text();
            })
            .then(data => {
                const element = document.querySelector(selector);
                if (element) {
                    element.innerHTML = data;
                    if (callback) callback();
                }
            })
            .catch(error => {
                console.error(error);
            });
    }

    /* Initialize Twemoji for emoji flags */
    function initTwemoji() {
        if (typeof twemoji !== 'undefined') {
            // Parse flag icons to convert emoji to images
            twemoji.parse(document.body, {
                folder: 'svg',
                ext: '.svg',
                className: 'emoji-icon'
            });
        }
    }

    // Get path prefix using shared utility
    const pathPrefix = CaffeArtUtils.getPathPrefix();

    // Detect GitHub Pages for absolute navigation URLs
    const isGitHubPages = window.location.hostname === 'petarplecas.github.io';
    const baseUrl = '/';

    // Track which templates are loaded
    let templatesLoaded = {
        header: false,
        footer: false,
        cookieConsent: false
    };

    // Initialize i18n once all templates are loaded
    function checkAllTemplatesLoaded() {
        if (templatesLoaded.header && templatesLoaded.footer && templatesLoaded.cookieConsent) {
            // All templates loaded, initialize i18n once
            if (typeof CaffeArtI18n !== 'undefined' && CaffeArtI18n.init) {
                CaffeArtI18n.init();
            }
            // Initialize Twemoji for flag emojis
            setTimeout(initTwemoji, 100);
        }
    }

    // Load header navigation
    loadTemplate('#header-nav', pathPrefix + 'components/header.html', function() {
        // Set navigation links dynamically
        const logoLink = document.querySelector('.logo-link');
        const navBar = document.querySelector('.nav-bar');
        const navGallery = document.querySelector('.nav-gallery');
        const navContact = document.querySelector('.nav-contact');

        if (logoLink) logoLink.href = baseUrl;
        if (navBar) navBar.href = baseUrl + 'bar/';
        if (navGallery) navGallery.href = baseUrl + 'gallery/';
        if (navContact) navContact.href = baseUrl + 'contact/';

        // Update logo image paths
        const logoImg = document.querySelector('.logo');
        if (logoImg) {
            if (isGitHubPages) {
                logoImg.src = '/Caffe_art/assets/img/logo/logo.png';
            } else {
                const isSubfolder = window.location.pathname.includes('/bar') ||
                                  window.location.pathname.includes('/gallery') ||
                                  window.location.pathname.includes('/contact') ||
                                  window.location.pathname.includes('/faq');
                logoImg.src = isSubfolder ? '../assets/img/logo/logo.png' : 'assets/img/logo/logo.png';
            }
        }

        initMobileMenu();
        setActiveNavLink();

        templatesLoaded.header = true;
        checkAllTemplatesLoaded();
    });

    // Load footer
    loadTemplate('#footer-container', pathPrefix + 'components/footer.html', function() {
        // Set FAQ link path
        const faqButton = document.querySelector('.faq-button');
        if (faqButton) {
            faqButton.href = baseUrl + 'faq/';
        }

        templatesLoaded.footer = true;
        checkAllTemplatesLoaded();
    });

    // Load cookie consent banner
    loadTemplate('#cookie-consent-container', pathPrefix + 'components/cookie-consent.html', function() {
        // Initialize cookie consent after banner is loaded
        if (typeof CaffeArtCookieConsent !== 'undefined' && CaffeArtCookieConsent.init) {
            CaffeArtCookieConsent.init();
        }

        templatesLoaded.cookieConsent = true;
        checkAllTemplatesLoaded();
    });

    /* Mobile Navigation */
    let scrollPosition = 0;

    function initMobileMenu() {
        const menuIcon = document.querySelector('.mobile-menu-icon');
        const mainNav = document.querySelector('.main-nav');
        const body = document.body;

        if (!menuIcon || !mainNav) return;

        // Toggle menu on icon click
        menuIcon.addEventListener('click', function() {
            mainNav.classList.toggle('open');

            if (mainNav.classList.contains('open')) {
                // Save scroll position before opening menu
                scrollPosition = window.pageYOffset;
                body.classList.add('menu-open');
                body.style.top = -scrollPosition + 'px';
                menuIcon.innerHTML = '<i class="fas fa-times"></i>';
            } else {
                // Restore scroll position after closing menu
                body.classList.remove('menu-open');
                body.style.top = '';
                // Use requestAnimationFrame to ensure the scroll happens after the body is no longer fixed
                requestAnimationFrame(function() {
                    window.scrollTo({
                        top: scrollPosition,
                        behavior: 'instant'
                    });
                });
                menuIcon.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });

        // Close mobile menu when clicking on a link
        const navLinks = mainNav.querySelectorAll('li a');
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                if (mainNav.classList.contains('open')) {
                    mainNav.classList.remove('open');
                    body.classList.remove('menu-open');
                    body.style.top = '';
                    // Use requestAnimationFrame to ensure the scroll happens after the body is no longer fixed
                    requestAnimationFrame(function() {
                        window.scrollTo({
                            top: scrollPosition,
                            behavior: 'instant'
                        });
                    });
                    menuIcon.innerHTML = '<i class="fas fa-bars"></i>';
                }
            });
        });
    }

    /* Set active navigation link based on current page */
    function setActiveNavLink() {
        const currentPath = window.location.pathname;
        const navBar = document.querySelector('.nav-bar');
        const navGallery = document.querySelector('.nav-gallery');
        const navContact = document.querySelector('.nav-contact');

        // Remove all active states first
        const allNavLinks = document.querySelectorAll('.main-nav li a');
        allNavLinks.forEach(function(link) {
            link.classList.remove('active');
        });

        // Set active based on current path
        if (currentPath.includes('/bar')) {
            if (navBar) navBar.classList.add('active');
        } else if (currentPath.includes('/gallery')) {
            if (navGallery) navGallery.classList.add('active');
        } else if (currentPath.includes('/contact')) {
            if (navContact) navContact.classList.add('active');
        }
        // Home page (index.html) doesn't have a nav link, so no active state
    }

    /* Sticky Navigation with throttled scroll event */
    const handleStickyNav = CaffeArtUtils.throttle(function() {
        const nav = document.querySelector('nav');
        if (nav) {
            if (window.scrollY > 100) {
                nav.classList.add('sticky');
            } else {
                nav.classList.remove('sticky');
            }
        }
    }, 100); // Throttle to run at most once every 100ms

    window.addEventListener('scroll', handleStickyNav, { passive: true });

    /* Smooth scroll for anchor links */
    document.addEventListener('click', function(e) {
        const target = e.target.closest('a[href*="#"]');

        if (!target || target.getAttribute('href') === '#') return;

        const targetPath = target.pathname.replace(/^\//, '');
        const currentPath = location.pathname.replace(/^\//, '');

        if (targetPath === currentPath && target.hostname === location.hostname) {
            const hash = target.hash;
            let element = document.querySelector(hash);

            if (!element) {
                element = document.querySelector('[name="' + hash.slice(1) + '"]');
            }

            if (element) {
                e.preventDefault();
                const targetPosition = element.offsetTop;

                // Smooth scroll animation
                const startPosition = window.pageYOffset;
                const distance = targetPosition - startPosition;
                const duration = 1000;
                let startTime = null;

                function animation(currentTime) {
                    if (startTime === null) startTime = currentTime;
                    const timeElapsed = currentTime - startTime;
                    const run = ease(timeElapsed, startPosition, distance, duration);
                    window.scrollTo(0, run);
                    if (timeElapsed < duration) requestAnimationFrame(animation);
                }

                // Easing function
                function ease(t, b, c, d) {
                    t /= d / 2;
                    if (t < 1) return c / 2 * t * t + b;
                    t--;
                    return -c / 2 * (t * (t - 2) - 1) + b;
                }

                requestAnimationFrame(animation);
            }
        }
    });

    /* Animations on scroll using Intersection Observer API */
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');

        if (!animatedElements.length) return;

        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    // Optional: stop observing after animation triggers
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(function(element) {
            observer.observe(element);
        });
    }

    // Initialize scroll animations
    initScrollAnimations();

    /* Lazy load background images using Intersection Observer */
    function initLazyBackgrounds() {
        const lazyBackgrounds = document.querySelectorAll('.lazy-background');

        if (!lazyBackgrounds.length) return;

        const bgObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    element.classList.add('background-loaded');
                    bgObserver.unobserve(element);
                }
            });
        }, {
            rootMargin: '50px' // Start loading 50px before element is visible
        });

        lazyBackgrounds.forEach(function(element) {
            bgObserver.observe(element);
        });
    }

    // Initialize lazy background loading
    initLazyBackgrounds();

    /* Gallery lazy loading animation */
    function initGalleryLazyLoad() {
        const galleryItems = document.querySelectorAll('.gallery-item');

        if (!galleryItems.length) return;

        const galleryObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry, index) {
                if (entry.isIntersecting) {
                    setTimeout(function() {
                        entry.target.classList.add('visible');
                    }, index * 50);
                    galleryObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        galleryItems.forEach(function(item) {
            galleryObserver.observe(item);
        });
    }

    // Initialize gallery lazy loading
    initGalleryLazyLoad();

    /* ============================================
       IMAGE SLIDER WITH SWIPE/DRAG FUNCTIONALITY
       ============================================ */
    function initImageSliders() {
        const sliders = document.querySelectorAll('.image-slider');

        sliders.forEach(function(slider) {
            const track = slider.querySelector('.slider-track');
            const slides = slider.querySelectorAll('.slider-item');

            if (!slides.length) return;

            // Set background images from data-bg attribute
            slides.forEach(function(slide) {
                const bgImage = slide.getAttribute('data-bg');
                if (bgImage) {
                    slide.style.backgroundImage = 'url(' + bgImage + ')';
                }
            });

            let currentIndex = 0;
            let startX = 0;
            let startY = 0;
            let isDragging = false;
            let isHorizontalSwipe = null;
            let startTime = 0;

            // Function to show specific slide
            function showSlide(index) {
                // Ensure index is within bounds
                if (index < 0) index = slides.length - 1;
                if (index >= slides.length) index = 0;

                currentIndex = index;

                // Update slides
                slides.forEach(function(slide, i) {
                    slide.classList.toggle('active', i === currentIndex);
                });
            }

            // Next slide
            function nextSlide() {
                showSlide(currentIndex + 1);
            }

            // Previous slide
            function prevSlide() {
                showSlide(currentIndex - 1);
            }

            // Touch/Mouse events for swipe/drag

            // Start drag/touch
            function handleStart(e) {
                isDragging = true;
                isHorizontalSwipe = null;
                startTime = Date.now();

                if (e.type.includes('mouse')) {
                    startX = e.pageX;
                    startY = e.pageY;
                } else {
                    startX = e.touches[0].pageX;
                    startY = e.touches[0].pageY;
                }
                slider.classList.add('dragging');
            }

            // End drag/touch
            function handleEnd(e) {
                if (!isDragging) return;

                isDragging = false;
                isHorizontalSwipe = null;
                slider.classList.remove('dragging');

                const endX = e.type.includes('mouse') ? e.pageX : e.changedTouches[0].pageX;
                const diff = startX - endX;
                const timeDiff = Date.now() - startTime;

                // Swipe threshold: 50px or quick swipe (< 300ms)
                const threshold = 50;
                const isQuickSwipe = timeDiff < 300 && Math.abs(diff) > 30;

                if (Math.abs(diff) > threshold || isQuickSwipe) {
                    if (diff > 0) {
                        nextSlide();
                    } else {
                        prevSlide();
                    }
                }
            }

            // Move - detect swipe direction and only prevent if horizontal
            function handleMove(e) {
                if (!isDragging) return;

                const currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
                const currentY = e.type.includes('mouse') ? e.pageY : e.touches[0].pageY;

                // Determine swipe direction on first move
                if (isHorizontalSwipe === null) {
                    const deltaX = Math.abs(currentX - startX);
                    const deltaY = Math.abs(currentY - startY);

                    // If horizontal movement is greater, it's a horizontal swipe
                    isHorizontalSwipe = deltaX > deltaY;
                }

                // Only prevent default for horizontal swipes (image slider)
                // Allow vertical swipes to scroll the page
                if (isHorizontalSwipe) {
                    e.preventDefault();
                }
            }

            // Mouse events
            slider.addEventListener('mousedown', handleStart);
            slider.addEventListener('mouseup', handleEnd);
            slider.addEventListener('mouseleave', function() {
                if (isDragging) {
                    isDragging = false;
                    slider.classList.remove('dragging');
                }
            });
            slider.addEventListener('mousemove', handleMove);

            // Touch events
            slider.addEventListener('touchstart', handleStart, { passive: true });
            slider.addEventListener('touchend', handleEnd, { passive: true });
            slider.addEventListener('touchmove', handleMove, { passive: false });

            // Prevent accidental image drag
            slider.addEventListener('dragstart', function(e) {
                e.preventDefault();
            });
        });
    }

    // Initialize sliders
    initImageSliders();

    /* ============================================
       ANALYTICS EVENT TRACKING SETUP
       ============================================ */
    function setupAnalyticsTracking() {
        // Track navigation clicks (header menu)
        document.addEventListener('click', function(e) {
            const navLink = e.target.closest('.main-nav a:not(.lang-switcher button):not(.mobile-lang-switcher button)');
            if (navLink && typeof CaffeArtAnalytics !== 'undefined' && CaffeArtAnalytics.trackNavigation) {
                const linkText = navLink.textContent.trim();
                const destination = navLink.getAttribute('href');
                const isMobile = document.querySelector('.main-nav').classList.contains('open');
                const location = isMobile ? 'Mobile Menu' : 'Header';

                CaffeArtAnalytics.trackNavigation(linkText, destination, location);
            }
        });

        // Track CTA button clicks on homepage
        const ctaButtons = document.querySelectorAll('.cta-box .link-naslov');
        ctaButtons.forEach(function(button) {
            button.addEventListener('click', function(e) {
                if (typeof CaffeArtAnalytics !== 'undefined' && CaffeArtAnalytics.trackCTAClick) {
                    const buttonText = this.textContent.trim();
                    const destination = this.getAttribute('href');

                    CaffeArtAnalytics.trackCTAClick(buttonText, destination, 'Homepage');
                }
            });
        });
    }

    // Initialize analytics tracking after a short delay to ensure all elements are loaded
    setTimeout(setupAnalyticsTracking, 500);
});
