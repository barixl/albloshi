document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       STICKY HEADER SCROLL EFFECT
       ========================================================================== */
    const header = document.querySelector('.main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* ==========================================================================
       MOBILE NAVIGATION DRAWER TOGGLE
       ========================================================================== */
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navItems = document.querySelectorAll('.nav-item');

    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('open');
        navMenu.classList.toggle('open');
        document.body.classList.toggle('no-scroll');
    });

    // Handle mobile sub-menus (dropdowns) on click
    navItems.forEach(item => {
        const link = item.querySelector('.nav-link-dropdown');
        if (link) {
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 1200) {
                    e.preventDefault(); // Stop navigation
                    item.classList.toggle('open-mobile-submenu');
                }
            });
        }
    });

    // Close mobile menu when clicking a regular link
    const regularLinks = document.querySelectorAll('.nav-link:not(.nav-link-dropdown), .dropdown-menu a, .megamenu a');
    regularLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 1200) {
                mobileToggle.classList.remove('open');
                navMenu.classList.remove('open');
                document.body.classList.remove('no-scroll');
            }
        });
    });

    /* ==========================================================================
       HERO BANNER SLIDER
       ========================================================================== */
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    let slideInterval;
    const intervalTime = 5500; // Slide transitions every 5.5s

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        let next = currentSlide + 1;
        if (next >= slides.length) {
            next = 0;
        }
        showSlide(next);
    }

    function startSlideShow() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, intervalTime);
    }

    function prevSlide() {
        let prev = currentSlide - 1;
        if (prev < 0) {
            prev = slides.length - 1;
        }
        showSlide(prev);
    }

    // Dot navigation events
    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            showSlide(idx);
            startSlideShow(); // Reset timer
        });
    });

    // Arrow navigation events
    const arrowLeft = document.querySelector('.slider-arrow-left');
    const arrowRight = document.querySelector('.slider-arrow-right');

    if (arrowLeft && arrowRight) {
        arrowLeft.addEventListener('click', () => {
            prevSlide();
            startSlideShow(); // Reset timer
        });
        arrowRight.addEventListener('click', () => {
            nextSlide();
            startSlideShow(); // Reset timer
        });
    }

    // Mobile Swipe Gesture Support (touchstart & touchend)
    const sliderContainer = document.querySelector('.hero-slider');
    let touchStartX = 0;
    let touchEndX = 0;

    if (sliderContainer) {
        sliderContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        sliderContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }

    function handleSwipe() {
        const threshold = 60; // Minimum swipe distance in px
        const diffX = touchEndX - touchStartX;

        if (Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                // Swiped right -> previous slide
                prevSlide();
            } else {
                // Swiped left -> next slide
                nextSlide();
            }
            startSlideShow(); // Reset auto transition timer
        }
    }

    // Initial launch
    if (slides.length > 0) {
        showSlide(0);
        startSlideShow();
    }

    /* ==========================================================================
       INTERACTIVE ANIMATED STATISTICS COUNTER
       ========================================================================== */
    const statNumbers = document.querySelectorAll('.stat-number');
    
    function animateCounter(el) {
        const target = +el.getAttribute('data-target');
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 2000; // 2 seconds counting animation
        const frameRate = 1000 / 60; // 60 FPS
        const totalFrames = Math.round(duration / frameRate);
        let frame = 0;

        const countTimer = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;
            // Ease out quadratic counting animation
            const currentVal = Math.round(target * (progress * (2 - progress)));
            
            if (frame >= totalFrames) {
                el.textContent = target + suffix;
                clearInterval(countTimer);
            } else {
                el.textContent = currentVal + suffix;
            }
        }, frameRate);
    }

    // Set up Intersection Observer to trigger when visible
    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target); // Trigger only once
            }
        });
    }, {
        threshold: 0.5
    });

    statNumbers.forEach(num => {
        statsObserver.observe(num);
    });

    /* ==========================================================================
       PRODUCT SHOWCASE TAB SWITCHER
       ========================================================================== */
    const tabButtons = document.querySelectorAll('.tab-btn');
    const showcasePanels = document.querySelectorAll('.showcase-panel');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            // Remove active states
            tabButtons.forEach(b => b.classList.remove('active'));
            showcasePanels.forEach(p => p.classList.remove('active'));

            // Set active clicked tab & target panel
            btn.classList.add('active');
            btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

            const targetPanel = document.getElementById(targetTab);
            if (targetPanel) {
                targetPanel.classList.add('active');
                const track = targetPanel.querySelector('.showcase-cards-track');
                if (track) {
                    track.scrollLeft = 0;
                    // Allow DOM to update display:flex before checking widths
                    setTimeout(() => track.dispatchEvent(new Event('scroll')), 10);
                }
            }
        });
    });

    /* ==========================================================================
       PRODUCT SHOWCASE ARROW NAVIGATION
       ========================================================================== */
    document.querySelectorAll('.showcase-track-wrapper').forEach(wrapper => {
        const track = wrapper.querySelector('.showcase-cards-track');
        const prevBtn = wrapper.querySelector('.showcase-arrow-prev');
        const nextBtn = wrapper.querySelector('.showcase-arrow-next');

        if (!track || !prevBtn || !nextBtn) return;

        const scrollByAmount = () => {
            const card = track.querySelector('.product-card');
            return card ? card.offsetWidth + 24 : 320; // card width + 1.5rem gap
        };

        nextBtn.addEventListener('click', () => {
            track.scrollBy({ left: scrollByAmount(), behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            track.scrollBy({ left: -scrollByAmount(), behavior: 'smooth' });
        });

        // Update disabled state on scroll
        const updateArrows = () => {
            // Using Math.ceil to avoid floating point scroll issues
            prevBtn.disabled = track.scrollLeft <= 0;
            nextBtn.disabled = Math.ceil(track.scrollLeft + track.clientWidth) >= track.scrollWidth;
        };

        track.addEventListener('scroll', updateArrows);
        
        // Initial state update (with a tiny delay in case it's a hidden tab on load)
        setTimeout(updateArrows, 50);
        
        // Update on resize too
        window.addEventListener('resize', updateArrows);
    });

    /* ==========================================================================
       TESTIMONIALS SLIDER NAVIGATION
       ========================================================================== */
    const reviewsWrapper = document.querySelector('.reviews-carousel-wrapper');
    if (reviewsWrapper) {
        const viewport = reviewsWrapper.querySelector('.reviews-viewport');
        const prevReviewBtn = reviewsWrapper.querySelector('.reviews-arrow-prev');
        const nextReviewBtn = reviewsWrapper.querySelector('.reviews-arrow-next');

        if (viewport && prevReviewBtn && nextReviewBtn) {
            const scrollReviewsBy = () => {
                const card = viewport.querySelector('.review-card');
                return card ? card.offsetWidth + 24 : 350; // card width + gap
            };

            nextReviewBtn.addEventListener('click', () => {
                viewport.scrollBy({ left: scrollReviewsBy(), behavior: 'smooth' });
            });

            prevReviewBtn.addEventListener('click', () => {
                viewport.scrollBy({ left: -scrollReviewsBy(), behavior: 'smooth' });
            });

            const updateReviewArrows = () => {
                prevReviewBtn.disabled = viewport.scrollLeft <= 0;
                nextReviewBtn.disabled = Math.ceil(viewport.scrollLeft + viewport.clientWidth) >= viewport.scrollWidth;
            };

            viewport.addEventListener('scroll', updateReviewArrows);
            setTimeout(updateReviewArrows, 50);
            window.addEventListener('resize', updateReviewArrows);
        }
    }

    /* ==========================================================================
       FAQ ACCORDION TOGGLE
       ========================================================================== */
    const faqHeaders = document.querySelectorAll('.faq-header');

    faqHeaders.forEach(header => {
        header.addEventListener('click', () => {
            header.parentElement.classList.toggle('active');
        });
    });

    /* ==========================================================================
       SIMPLE CONTACT FORM VALIDATION & SUBMISSION
       ========================================================================== */
    const contactForm = document.getElementById('companyInquiryForm');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Simple validation check
            const name = document.getElementById('formName').value.trim();
            const email = document.getElementById('formEmail').value.trim();
            const phone = document.getElementById('formPhone').value.trim();
            
            if (!name || !email || !phone) {
                alert('Please fill out all required fields.');
                return;
            }

            // Mock submission success (since it is frontend only)
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting Inquiry...';

            setTimeout(() => {
                alert(`Thank you, ${name}! Your inquiry has been sent successfully. Our business development team will contact you shortly.`);
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }, 1500);
        });
    }


});
