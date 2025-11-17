// FitTrack - Interactive Elements
// Vanilla JavaScript for lightweight interactions

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navActions = document.querySelector('.nav-actions');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            // In a real implementation, you would show/hide the mobile menu
            console.log('Mobile menu toggled');
        });
    }

    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);

            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });

    // Observe workout cards
    const workoutCards = document.querySelectorAll('.workout-card');
    workoutCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    // Animate stats on view
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                animateValue(entry.target);
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });

    function animateValue(element) {
        const text = element.innerText;
        const hasPlus = text.includes('+');
        const hasPercent = text.includes('%');
        const numericValue = parseInt(text.replace(/[^0-9]/g, ''));

        if (!isNaN(numericValue)) {
            const duration = 1500;
            const start = 0;
            const increment = numericValue / (duration / 16);
            let current = start;

            const timer = setInterval(() => {
                current += increment;
                if (current >= numericValue) {
                    current = numericValue;
                    clearInterval(timer);
                }

                let displayValue = Math.floor(current).toLocaleString();
                if (current >= 1000) {
                    displayValue = (current / 1000).toFixed(0) + 'K';
                    if (current >= 1000000) {
                        displayValue = (current / 1000000).toFixed(0) + 'M';
                    }
                }

                element.innerText = displayValue + (hasPlus ? '+' : '') + (hasPercent ? '%' : '');
            }, 16);
        }
    }

    // Chart bar animation
    const chartBars = document.querySelectorAll('.chart-bar');
    const chartObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                const height = entry.target.style.height;
                entry.target.style.height = '0';
                entry.target.offsetHeight; // Trigger reflow
                entry.target.style.transition = 'height 0.8s ease';
                entry.target.style.height = height;
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    chartBars.forEach(bar => {
        chartObserver.observe(bar);
    });

    // Button hover effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add header scroll effect
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    });
});

// Console message
console.log('%c FitTrack ', 'background: #37322f; color: #f59e0b; font-size: 20px; padding: 10px 20px; border-radius: 5px;');
console.log('%c Transform Your Fitness Journey 💪 ', 'color: #37322f; font-size: 14px;');