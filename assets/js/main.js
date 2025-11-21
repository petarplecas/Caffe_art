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

    // Load header navigation
    loadTemplate('#header-nav', 'components/header.html', function() {
        initMobileMenu();
        setActiveNavLink();
        // Initialize i18n after header is loaded (for language switcher)
        if (typeof CaffeArtI18n !== 'undefined' && CaffeArtI18n.init) {
            CaffeArtI18n.init();
        }
        // Initialize Twemoji for flag emojis
        setTimeout(initTwemoji, 100);
    });

    // Load footer
    loadTemplate('#footer-container', 'components/footer.html', function() {
        // Re-apply translations to footer after it's loaded
        if (typeof CaffeArtI18n !== 'undefined' && CaffeArtI18n.init) {
            // Give it a small delay to ensure footer DOM is ready
            setTimeout(function() {
                CaffeArtI18n.init();
            }, 100);
        }
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
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.main-nav li a');

        navLinks.forEach(function(link) {
            const linkPage = link.getAttribute('href');

            // Check if the link matches the current page
            if (linkPage === currentPage) {
                link.classList.add('active');
            }
            // Special case: if on index.html and no match found yet, don't mark anything
            // (index.html doesn't appear in navigation)
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
});
