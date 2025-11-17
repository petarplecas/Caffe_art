// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {

    /* Throttle function for performance optimization */
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

    // Load header navigation
    loadTemplate('#header-nav', 'components/header.html', function() {
        initMobileMenu();
    });

    // Load footer
    loadTemplate('#footer-container', 'components/footer.html');

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

    /* Sticky Navigation with throttled scroll event */
    const handleStickyNav = throttle(function() {
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
});
