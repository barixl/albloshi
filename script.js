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
       PRODUCT SHOWCASE LAYOUT (VERTICALLY STACKED DOMAINS)
       ========================================================================== */

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

    /* ==========================================================================
       ALBLOSHI INTEGRATED CUSTOMER ASSISTANT & CHATBOT
       ========================================================================== */
    const chatbotBtn = document.getElementById('chatbotBtn');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotCloseBtn = document.getElementById('chatbotCloseBtn');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSendBtn = document.getElementById('chatbotSendBtn');
    
    let chatbotFirstOpen = true;

    // Toggle Chat Window
    if (chatbotBtn && chatbotWindow) {
        chatbotBtn.addEventListener('click', () => {
            chatbotWindow.classList.toggle('active');
            chatbotBtn.classList.toggle('active');
            
            // Clear notification badge
            const badge = chatbotBtn.querySelector('.chatbot-badge');
            if (badge) {
                badge.style.display = 'none';
            }
            
            if (chatbotWindow.classList.contains('active')) {
                chatbotInput.focus();
                if (chatbotFirstOpen) {
                    initiateBotConversation();
                    chatbotFirstOpen = false;
                }
            }
        });
    }

    if (chatbotCloseBtn && chatbotWindow) {
        chatbotCloseBtn.addEventListener('click', () => {
            chatbotWindow.classList.remove('active');
            chatbotBtn.classList.remove('active');
        });
    }

    // Scroll to bottom helper
    function scrollToBottom() {
        setTimeout(() => {
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }, 50);
    }

    // Append Message helper
    function appendMessage(sender, text, isHtml = false, isWhatsappCard = false) {
        if (isWhatsappCard) {
            const card = document.createElement('div');
            card.className = 'chatbot-whatsapp-card';
            card.innerHTML = text;
            chatbotMessages.appendChild(card);
            scrollToBottom();
            return card;
        }

        const bubble = document.createElement('div');
        bubble.className = `chatbot-bubble ${sender}`;
        if (isHtml) {
            bubble.innerHTML = text;
        } else {
            bubble.textContent = text;
        }
        chatbotMessages.appendChild(bubble);
        scrollToBottom();
        return bubble;
    }

    // Show Typing Indicator
    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'chatbot-typing';
        indicator.innerHTML = `
            <span class="chatbot-dot"></span>
            <span class="chatbot-dot"></span>
            <span class="chatbot-dot"></span>
        `;
        chatbotMessages.appendChild(indicator);
        scrollToBottom();
        return indicator;
    }

    // Initialize Conversation
    function initiateBotConversation() {
        const typing = showTypingIndicator();
        
        setTimeout(() => {
            typing.remove();
            appendMessage('bot', 'Welcome to Albloshi! 🤖 How can I assist your business operations today? Please select a topic below or type your inquiry.', false);
            showTopicChips();
        }, 1000);
    }

    // Show Topic Choice Chips
    function showTopicChips() {
        const chipsContainer = document.createElement('div');
        chipsContainer.className = 'chatbot-chips-wrapper';
        
        const chipsList = document.createElement('div');
        chipsList.className = 'chatbot-chips';
        
        const topics = [
            { label: '🏢 About Albloshi', value: 'about_albloshi' },
            { label: '🧪 Tellabs Chemicals', value: 'tellabs_chemicals' },
            { label: '🚚 Logistics & Warehousing', value: 'logistics' },
            { label: '💼 Industrial & Manpower', value: 'manpower' },
            { label: '📞 Chat on WhatsApp', value: 'speak_human' }
        ];

        topics.forEach(t => {
            const chip = document.createElement('button');
            chip.className = 'chatbot-chip';
            chip.textContent = t.label;
            chip.addEventListener('click', () => {
                chipsContainer.remove();
                handleChipSelection(t.label, t.value);
            });
            chipsList.appendChild(chip);
        });

        chipsContainer.appendChild(chipsList);
        chatbotMessages.appendChild(chipsContainer);
        scrollToBottom();
    }

    // Handle Chip Selection
    function handleChipSelection(label, value) {
        appendMessage('user', label);
        const typing = showTypingIndicator();
        
        setTimeout(() => {
            typing.remove();
            let response = '';
            let showFollowUp = true;
            let customChips = [];

            switch(value) {
                case 'about_albloshi':
                    response = '<strong>Mohammad Abdulla Albloshi Trading Co.</strong> is a leading multi-industry corporate enterprise based in Dammam, Saudi Arabia. We serve primary strategic sectors across the Kingdom, offering high-volume food distribution, ASTM/ASME industrial materials, certified manpower supply, and specialty chemicals.';
                    customChips = ['🧪 Tellabs Chemicals', '🚚 Warehousing & Areas', '📞 Speak on WhatsApp'];
                    break;
                case 'tellabs_chemicals':
                    response = 'Albloshi is the designated, official GCC regional distributor for <strong>TELLABS Specialty Chemicals</strong>. We offer local inventory stocking, mill documentation, and direct technical execution for water treatment, activated carbon, polymers, and food/hygiene specialty chemicals.';
                    customChips = ['📄 Documentation & MSDS', '💳 Request Credit', '⬅️ Main Menu'];
                    break;
                case 'logistics':
                    response = 'Our central logistics headquarters and state-of-the-art warehouses are located in <strong>Dammam</strong>. We offer immediate, direct supply execution to Al Khobar, Jubail, Qatif, Al Hassa, and Eastern Province sectors, along with enterprise freight dispatch to Riyadh, Jeddah, and broader GCC regions.';
                    customChips = ['🏢 About Albloshi', '⬅️ Main Menu'];
                    break;
                case 'manpower':
                    response = 'We supply critical materials and highly qualified, certified manpower solutions (welders, fabricators, pipefitters, and mechanical/civil support personnel) complying with strict industrial safety standards to sustain major plant and site operations.';
                    customChips = ['🧪 Tellabs Chemicals', '📞 Speak on WhatsApp', '⬅️ Main Menu'];
                    break;
                case 'speak_human':
                    response = 'Connect directly with our Business Development Manager, <strong>Mohammad Riaz</strong>, for corporate procurement or technical pricing consultations!';
                    appendMessage('bot', response, true);
                    appendMessage('bot', `
                        <p>Receive immediate feedback directly on WhatsApp mobile lines:</p>
                        <a href="https://wa.me/966549581547" target="_blank" class="chatbot-whatsapp-btn">
                            <span class="material-icons">chat</span> Chat on WhatsApp
                        </a>
                    `, true, true);
                    showFollowUp = false;
                    
                    // Show a simple menu option
                    setTimeout(() => {
                        const miniChips = document.createElement('div');
                        miniChips.className = 'chatbot-chips-wrapper';
                        miniChips.innerHTML = `
                            <div class="chatbot-chips">
                                <button class="chatbot-chip" id="btnMiniContact">📝 Go to Contact Form</button>
                                <button class="chatbot-chip" id="btnMiniMenu">⬅️ Main Menu</button>
                            </div>
                        `;
                        chatbotMessages.appendChild(miniChips);
                        miniChips.querySelector('#btnMiniContact').addEventListener('click', () => {
                            miniChips.remove();
                            scrollToContactFormAction();
                        });
                        miniChips.querySelector('#btnMiniMenu').addEventListener('click', () => {
                            miniChips.remove();
                            resetChatbotMenuAction();
                        });
                        scrollToBottom();
                    }, 500);
                    break;
                case 'msds_doc':
                    response = 'Absolutely. Every industrial shipment is accompanied by official <strong>Mill Test Certificates (MTC)</strong> conforming to ASTM/ASME metrics. Similarly, all distributed TELLABS chemical supplies arrive with comprehensive <strong>Material Safety Data Sheets (MSDS)</strong> and specification sheets.';
                    customChips = ['🧪 Tellabs Chemicals', '⬅️ Main Menu'];
                    break;
                case 'credit_acc':
                    response = 'To open a corporate credit account or obtain custom contract terms, please submit an official request through our <strong>Enterprise Sales Inquiry Form</strong>. Our credit control team will verify details and reach back within 24 hours.';
                    customChips = ['📝 Go to Contact Form', '⬅️ Main Menu'];
                    break;
                default:
                    response = 'How else can Albloshi assist your operations today?';
                    customChips = ['🏢 About Albloshi', '🧪 Tellabs Chemicals', '📞 Speak on WhatsApp'];
            }

            if (showFollowUp) {
                appendMessage('bot', response, true);
                showCustomChips(customChips);
            }
        }, 1000);
    }

    // Show Custom Follow-up Chips
    function showCustomChips(chipLabels) {
        const chipsContainer = document.createElement('div');
        chipsContainer.className = 'chatbot-chips-wrapper';
        
        const chipsList = document.createElement('div');
        chipsList.className = 'chatbot-chips';

        chipLabels.forEach(label => {
            const chip = document.createElement('button');
            chip.className = 'chatbot-chip';
            chip.textContent = label;
            chip.addEventListener('click', () => {
                chipsContainer.remove();
                
                // Map custom chip labels to value triggers
                if (label.includes('About Albloshi')) handleChipSelection(label, 'about_albloshi');
                else if (label.includes('Tellabs Chemicals')) handleChipSelection(label, 'tellabs_chemicals');
                else if (label.includes('Warehousing') || label.includes('Logistics')) handleChipSelection(label, 'logistics');
                else if (label.includes('Manpower')) handleChipSelection(label, 'manpower');
                else if (label.includes('WhatsApp')) handleChipSelection(label, 'speak_human');
                else if (label.includes('Documentation') || label.includes('MSDS')) handleChipSelection(label, 'msds_doc');
                else if (label.includes('Credit')) handleChipSelection(label, 'credit_acc');
                else if (label.includes('Contact Form')) scrollToContactFormAction();
                else if (label.includes('Main Menu')) resetChatbotMenuAction();
                else handleChipSelection(label, 'default');
            });
            chipsList.appendChild(chip);
        });

        chipsContainer.appendChild(chipsList);
        chatbotMessages.appendChild(chipsContainer);
        scrollToBottom();
    }

    // Actions
    function scrollToContactFormAction() {
        appendMessage('user', '📝 Go to Contact Form');
        const typing = showTypingIndicator();
        setTimeout(() => {
            typing.remove();
            appendMessage('bot', 'Scrolling you to our Sales Inquiry form... Fill it out, and our directors will be in touch!');
            setTimeout(() => {
                chatbotWindow.classList.remove('active');
                chatbotBtn.classList.remove('active');
                const contactSec = document.getElementById('contact');
                if (contactSec) {
                    contactSec.scrollIntoView({ behavior: 'smooth' });
                    const inputField = document.getElementById('formName');
                    if (inputField) {
                        setTimeout(() => inputField.focus(), 800);
                    }
                }
            }, 600);
        }, 800);
    }

    function resetChatbotMenuAction() {
        appendMessage('user', '⬅️ Return to Main Menu');
        const typing = showTypingIndicator();
        setTimeout(() => {
            typing.remove();
            appendMessage('bot', 'Main Menu: Select one of our divisions or operations below:');
            showTopicChips();
        }, 800);
    }

    // Process typed messages
    function processUserMessage(text) {
        const typing = showTypingIndicator();
        const lower = text.toLowerCase();
        
        setTimeout(() => {
            typing.remove();
            
            // Key matches
            if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey') || lower.includes('greetings') || lower.includes('menu')) {
                appendMessage('bot', 'Hello! How can I help you today? Select a main category below:');
                showTopicChips();
            } else if (lower.includes('chemical') || lower.includes('tellabs') || lower.includes('chlorine') || lower.includes('water')) {
                handleChipSelection('Chemical Solutions Info', 'tellabs_chemicals');
            } else if (lower.includes('about') || lower.includes('company') || lower.includes('who are you') || lower.includes('albloshi')) {
                handleChipSelection('About Mohammad Albloshi', 'about_albloshi');
            } else if (lower.includes('food') || lower.includes('grain') || lower.includes('rice') || lower.includes('sugar') || lower.includes('oil')) {
                appendMessage('bot', 'Our <strong>Food Division</strong> distributes bulk products (sugar, rice, flour, grains, and oils) with an robust GCC freight network to ensure high volume supply freshness and safety.', true);
                showCustomChips(['🚚 Warehousing & Areas', '📞 Speak on WhatsApp', '⬅️ Main Menu']);
            } else if (lower.includes('manpower') || lower.includes('labor') || lower.includes('welder') || lower.includes('staff') || lower.includes('hiring')) {
                handleChipSelection('Manpower Solutions', 'manpower');
            } else if (lower.includes('logistics') || lower.includes('delivery') || lower.includes('where') || lower.includes('dammam') || lower.includes('riyadh')) {
                handleChipSelection('Logistics network', 'logistics');
            } else if (lower.includes('doc') || lower.includes('msds') || lower.includes('mtc') || lower.includes('certif') || lower.includes('test')) {
                handleChipSelection('Technical documentation', 'msds_doc');
            } else if (lower.includes('credit') || lower.includes('finance') || lower.includes('pay') || lower.includes('price')) {
                handleChipSelection('Credit Account terms', 'credit_acc');
            } else if (lower.includes('whatsapp') || lower.includes('phone') || lower.includes('mobile') || lower.includes('contact') || lower.includes('riaz')) {
                handleChipSelection('Speak with a Corporate Rep', 'speak_human');
            } else {
                // Fallback reply asking to contact through contact form or whatsapp
                appendMessage('bot', `I couldn\'t find an exact match for "${text}". 🔍 Our direct sales team is standing by to help! \n\nYou can submit an inquiry through our <strong>Contact Form</strong>, or reach out directly via WhatsApp.`, true);
                
                appendMessage('bot', `
                    <p>Contact Mohammad Riaz — Business Development Manager:</p>
                    <a href="https://wa.me/966549581547" target="_blank" class="chatbot-whatsapp-btn">
                        <span class="material-icons">chat</span> Chat on WhatsApp
                    </a>
                `, true, true);
                
                showCustomChips(['📝 Go to Contact Form', '⬅️ Main Menu']);
            }
        }, 1000);
    }

    // Input handlers
    if (chatbotInput) {
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const val = chatbotInput.value.trim();
                if (val) {
                    appendMessage('user', val);
                    chatbotInput.value = '';
                    processUserMessage(val);
                }
            }
        });
    }

    if (chatbotSendBtn) {
        chatbotSendBtn.addEventListener('click', () => {
            const val = chatbotInput.value.trim();
            if (val) {
                appendMessage('user', val);
                chatbotInput.value = '';
                processUserMessage(val);
            }
        });
    }

});
