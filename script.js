document.addEventListener('DOMContentLoaded', () => {
    // Consistent reference to the <html> element
    const htmlElement = document.documentElement;
    const header = document.getElementById('main-header');
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    const themeToggle = document.getElementById('theme-toggle');
    const contactLink = document.getElementById('contact-link');
    const contactSection = document.getElementById('page-5');
    const statValues = document.querySelectorAll('.stat-value');
    const carouselContainer = document.getElementById('testimonial-carousel-container');
    const carouselWrapper = document.getElementById('testimonial-carousel-wrapper');

    // --- Mobile Menu Toggle ---
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const isExpanded = navLinks.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);
        });

        document.addEventListener('click', (event) => {
            if (!header.contains(event.target) && navLinks.classList.contains('active')) {
                 navLinks.classList.remove('active');
                 menuToggle.setAttribute('aria-expanded', 'false');
            }
        });

         navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                 if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            });
         });
    }

    // --- Theme Toggle ---
    if (themeToggle) {
        // Function to apply theme to the <html> element
        const applyTheme = (theme) => {
            htmlElement.dataset.theme = theme; // Apply to <html> tag
            localStorage.setItem('zenDocTheme', theme); // Save preference
            themeToggle.setAttribute('aria-label', `Switch to ${theme === 'light' ? 'dark' : 'light'} theme`);
        };

        // Function to determine the initial theme
        const getInitialTheme = () => {
            const savedTheme = localStorage.getItem('zenDocTheme');
            if (savedTheme) {
                return savedTheme; // Use saved theme if available
            }
            // If no saved theme, check OS preference
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            return prefersDark ? 'dark' : 'light'; // Default to light if no preference detected
        };

        // Apply the initial theme when the page loads
        const initialTheme = getInitialTheme();
        applyTheme(initialTheme);

        // Add event listener for the toggle button click
        themeToggle.addEventListener('click', () => {
            // Check the current theme on the <html> element
            const currentTheme = htmlElement.dataset.theme;
            // Determine the new theme
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            // Apply the new theme
            applyTheme(newTheme);
        });

         // Optional: Listen for OS theme changes IF the user hasn't manually selected one
         window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
             // Only change if NO theme is saved in localStorage (respect user's manual choice)
             if (!localStorage.getItem('zenDocTheme')) {
                applyTheme(event.matches ? 'dark' : 'light');
             }
         });
    }

    // --- Contact Link Smooth Scroll ---
    if (contactLink && contactSection) {
        contactLink.addEventListener('click', (e) => {
            e.preventDefault();
            contactSection.scrollIntoView({ behavior: 'smooth' });
             if (navLinks && navLinks.classList.contains('active')) {
                 navLinks.classList.remove('active');
                 menuToggle.setAttribute('aria-expanded', 'false');
             }
        });
    }

     // --- Number Count-Up Animation ---
     const animateValue = (element, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentValue = Math.floor(progress * (end - start) + start);
            element.textContent = currentValue;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                element.textContent = end;
            }
        };
        window.requestAnimationFrame(step);
    };

    const observerOptions = {
        root: null,
        threshold: 0.5
    };

    const statObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const targetValue = parseInt(el.dataset.target, 10);
                if (!isNaN(targetValue) && !el.classList.contains('counted')) {
                     animateValue(el, 0, targetValue, 1500);
                     el.classList.add('counted');
                }
                // observer.unobserve(el); // Keep observing if needed
            }
        });
    }, observerOptions);

    statValues.forEach(valueElement => {
        statObserver.observe(valueElement);
    });


    // --- Testimonial Carousel ---
    if (carouselWrapper && carouselContainer) {
        const cards = carouselWrapper.querySelectorAll('.testimonial-card');
        if (cards.length > 0) {
            cards.forEach(card => {
                const clone = card.cloneNode(true);
                carouselWrapper.appendChild(clone);
            });
            // CSS handles the animation loop based on -50% transform
        }
    }

}); // End DOMContentLoaded