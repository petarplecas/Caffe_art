/* ============================================
   FAQ ACCORDION FUNCTIONALITY
   ============================================ */

(function() {
    'use strict';

    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        initFAQAccordion();
    });

    function initFAQAccordion() {
        const faqItems = document.querySelectorAll('.faq-item');

        if (!faqItems.length) return;

        faqItems.forEach(function(item) {
            const question = item.querySelector('.faq-question');

            if (!question) return;

            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');

                // Track FAQ view in analytics if opening
                if (!isActive && typeof CaffeArtAnalytics !== 'undefined' && CaffeArtAnalytics.trackFAQView) {
                    const questionText = question.querySelector('span').textContent;
                    const questionIndex = Array.from(faqItems).indexOf(item) + 1;
                    CaffeArtAnalytics.trackFAQView(questionText, questionIndex);
                }

                // Close all other items (optional - remove if you want multiple items open)
                faqItems.forEach(function(otherItem) {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherQuestion = otherItem.querySelector('.faq-question');
                        if (otherQuestion) {
                            otherQuestion.setAttribute('aria-expanded', 'false');
                        }
                    }
                });

                // Toggle current item
                if (isActive) {
                    item.classList.remove('active');
                    question.setAttribute('aria-expanded', 'false');
                } else {
                    item.classList.add('active');
                    question.setAttribute('aria-expanded', 'true');
                }
            });

            // Keyboard accessibility - allow Enter and Space to toggle
            question.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    question.click();
                }
            });
        });

        // Optional: Open first FAQ item by default
        if (faqItems.length > 0) {
            const firstItem = faqItems[0];
            const firstQuestion = firstItem.querySelector('.faq-question');
            if (firstQuestion) {
                firstItem.classList.add('active');
                firstQuestion.setAttribute('aria-expanded', 'true');
            }
        }
    }

})();
