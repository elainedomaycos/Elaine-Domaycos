 // Loading Screen Animation
        const loadingText = document.getElementById('loading-text');
        const loadingScreen = document.getElementById('loading-screen');
        const mainContent = document.getElementById('main-content');

        let dotCount = 0;
        const maxDots = 3;

        const typewriterInterval = setInterval(() => {
            const dotsElement = loadingText.querySelector('.dots');
            
            if (dotCount <= maxDots) {
                dotsElement.textContent = '.'.repeat(dotCount);
                dotCount++;
            } else {
                clearInterval(typewriterInterval);
                
                setTimeout(() => {
                    loadingScreen.classList.add('fade-out');
                    
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                        mainContent.classList.remove('hidden');
                        mainContent.classList.add('visible');
                    }, 500);
                }, 500);
            }
        }, 400);

        // Smooth Scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
                
                document.querySelector('.nav-links').classList.remove('active');
            });
        });

        // Active Navigation Link
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');

        function setActiveLink() {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (window.scrollY >= (sectionTop - 150)) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }

        // Scroll Animation Observer
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, observerOptions);

        // Observe all animated elements after loading
        window.addEventListener('load', () => {
            setTimeout(() => {
                const animatedElements = document.querySelectorAll('.animate-on-scroll, .animate-left, .animate-right');
                animatedElements.forEach(el => observer.observe(el));
            }, 1000);
        });

        // Navbar scroll effect
        const navbar = document.querySelector('.navbar');

        window.addEventListener('scroll', () => {
            setActiveLink();
            
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Mobile menu toggle
        const mobileToggle = document.querySelector('.mobile-toggle');
        const navLinksContainer = document.querySelector('.nav-links');

        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => {
                navLinksContainer.classList.toggle('active');
                mobileToggle.textContent = navLinksContainer.classList.contains('active') ? '✕' : '☰';
            });
        }

        // Projects Carousel - FIXED
        const track = document.getElementById('carouselTrack');
        const cards = Array.from(document.querySelectorAll('.project-card'));
        const dotsContainer = document.getElementById('carouselDots');
        const prevBtn = document.querySelector('.carousel-nav.prev');
        const nextBtn = document.querySelector('.carousel-nav.next');
        
        let currentPage = 0;
        const cardsPerPage = 3;
        const totalPages = Math.ceil(cards.length / cardsPerPage);

        function updateCarousel() {
            const cardWidth = cards[0].offsetWidth;
            const gap = 20;
            const offset = currentPage * (cardWidth + gap) * cardsPerPage;
            
            track.style.transform = `translateX(-${offset}px)`;
            
            // Update dots
            updateDots();
            
            // Update button states
            prevBtn.classList.toggle('disabled', currentPage === 0);
            nextBtn.classList.toggle('disabled', currentPage >= totalPages - 1);
        }

        function updateDots() {
            dotsContainer.innerHTML = '';
            
            for (let i = 0; i < totalPages; i++) {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                if (i === currentPage) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    currentPage = i;
                    updateCarousel();
                });
                dotsContainer.appendChild(dot);
            }
        }

        function moveCarousel(direction) {
            currentPage += direction;
            
            if (currentPage < 0) currentPage = 0;
            if (currentPage >= totalPages) currentPage = totalPages - 1;
            
            updateCarousel();
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') moveCarousel(-1);
            else if (e.key === 'ArrowRight') moveCarousel(1);
        });

        // Responsive carousel
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                currentPage = 0;
                updateCarousel();
            }, 250);
        });

        // Initialize carousel
        updateCarousel();

        // Achievements Carousel
        const achievementBtn = document.querySelector(".carousel-btn");
        const achievementItems = document.querySelectorAll(".carousel-item");
        let currentAchievement = 0;

        if (achievementBtn) {
            achievementBtn.addEventListener("click", () => {
                achievementItems[currentAchievement].classList.remove("active");
                currentAchievement = (currentAchievement + 1) % achievementItems.length;
                achievementItems[currentAchievement].classList.add("active");
            });
        }

        // Auto-advance achievements
        setInterval(() => {
            if (achievementItems.length > 0) {
                achievementItems[currentAchievement].classList.remove("active");
                currentAchievement = (currentAchievement + 1) % achievementItems.length;
                achievementItems[currentAchievement].classList.add("active");
            }
        }, 5000);

        // Contact Form Handler
        const sendBtn = document.querySelector('.send-btn');
        if (sendBtn) {
            sendBtn.addEventListener('click', (e) => {
                e.preventDefault();
                
                const nameInput = document.querySelector('input[name="name"]');
                const emailInput = document.querySelector('input[name="email"]');
                const messageInput = document.querySelector('textarea[name="message"]');
                
                if (nameInput.value && emailInput.value && messageInput.value) {
                    alert(`Thank you, ${nameInput.value}! Your message has been received. I'll get back to you at ${emailInput.value} soon!`);
                    
                    nameInput.value = '';
                    emailInput.value = '';
                    messageInput.value = '';
                } else {
                    alert('Please fill in all fields.');
                }
            });
        }