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
                targetPanel.scrollLeft = 0;
            }
        });
    });

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

    /* ==========================================================================
       REVIEWS CAROUSEL
       ========================================================================== */
    const reviewsTrack = document.querySelector('.reviews-track');
    const reviewDots   = document.querySelectorAll('.reviews-dot');
    const prevBtn      = document.querySelector('.reviews-arrow-prev');
    const nextBtn      = document.querySelector('.reviews-arrow-next');
    const totalReviews = document.querySelectorAll('.review-card').length;
    let currentReview  = 0;

    function goToReview(index) {
        if (index < 0) index = totalReviews - 1;
        if (index >= totalReviews) index = 0;
        currentReview = index;
        reviewsTrack.style.transform = `translateX(-${currentReview * 100}%)`;
        reviewDots.forEach((d, i) => d.classList.toggle('active', i === currentReview));
    }

    if (reviewsTrack && totalReviews > 0) {
        prevBtn && prevBtn.addEventListener('click', () => goToReview(currentReview - 1));
        nextBtn && nextBtn.addEventListener('click', () => goToReview(currentReview + 1));
        reviewDots.forEach((dot, i) => dot.addEventListener('click', () => goToReview(i)));

        // Touch swipe
        let touchStartX = 0;
        const viewport = document.querySelector('.reviews-viewport');
        viewport.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
        viewport.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) goToReview(currentReview + (diff > 0 ? 1 : -1));
        }, { passive: true });
    }
});
