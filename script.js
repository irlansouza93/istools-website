// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileMenu();
    initScrollAnimations();
    initSmoothScrolling();
    initHeaderScroll();
    initToolCardAnimations();
    initTypingAnimation();
    initParallaxEffect();
    initProgressBars();
});

// Mobile Menu Toggle
function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // Close menu when clicking on links
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animação simples e eficiente para tool cards
                if (entry.target.classList.contains('tool-card')) {
                    // Adiciona delay baseado na posição do card na página
                    const allCards = document.querySelectorAll('.tool-card');
                    const cardIndex = Array.from(allCards).indexOf(entry.target);
                    entry.target.style.transitionDelay = `${cardIndex * 0.1}s`;
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.tool-card, .step, .author-content, .section-header');
    animatedElements.forEach(el => {
        el.classList.add('fade-in-up');
        observer.observe(el);
    });
}

// Smooth Scrolling
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Header Scroll Effect
function initHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Tool Card Hover Animations
function initToolCardAnimations() {
    const toolCards = document.querySelectorAll('.tool-card');
    
    toolCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.05)';
        });
    });
}

// Typing Animation for Hero Title
function initTypingAnimation() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    
    // Texto que queremos digitar (sem HTML)
    const textToType = 'Irlan Souza Tools\nTutorial Completo';
    
    // Limpa o conteúdo inicial
    heroTitle.innerHTML = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < textToType.length) {
            const char = textToType.charAt(i);
            
            if (char === '\n') {
                // Quando encontrar quebra de linha, adiciona o <br> e continua
                heroTitle.innerHTML = `<span class="gradient-text">${textToType.substring(0, 17)}</span><br>`;
            } else if (i < 17) {
                // Primeiros 17 caracteres (Irlan Souza Tools) com gradiente
                heroTitle.innerHTML = `<span class="gradient-text">${textToType.substring(0, i + 1)}</span>`;
            } else if (i > 17) {
                // Resto do texto após a quebra de linha
                const restText = textToType.substring(18, i + 1);
                heroTitle.innerHTML = `<span class="gradient-text">Irlan Souza Tools</span><br>${restText}`;
            }
            
            i++;
            setTimeout(typeWriter, 100);
        }
    };
    
    // Inicia a animação após um delay
    setTimeout(typeWriter, 500);
}

// Parallax Effect for Hero Section
function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (scrolled < hero.offsetHeight) {
            hero.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Animated Progress Bars for Stats
function initProgressBars() {
    const stats = document.querySelectorAll('.stat-number');
    const observerOptions = {
        threshold: 0.5
    };
    
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;
                const numericValue = parseInt(finalValue.replace(/\D/g, ''));
                
                animateNumber(target, 0, numericValue, 2000, finalValue);
                statsObserver.unobserve(target);
            }
        });
    }, observerOptions);
    
    stats.forEach(stat => {
        statsObserver.observe(stat);
    });
}

// Number Animation Function
function animateNumber(element, start, end, duration, suffix) {
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + (end - start) * easeOutQuart);
        
        element.textContent = current + suffix.replace(/\d/g, '');
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        } else {
            element.textContent = suffix;
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Add CSS for enhanced animations (sem conflitos)
const style = document.createElement('style');
style.textContent = `
    .contact-link {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .contact-link:hover {
        transform: translateY(-3px);
    }
    
    .btn {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .btn:active {
        transform: translateY(-1px);
    }
    
    .fade-in-up {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .fade-in-up.visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    .animate-in {
        animation: slideInUp 0.6s ease forwards;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

document.head.appendChild(style);

// Keyboard Navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle && navMenu && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    }
});

// Preloader
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Add loaded class for any loading animations
    const loadingElements = document.querySelectorAll('.hero-content, .hero-visual');
    loadingElements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('loaded');
        }, index * 200);
    });
});

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
const throttledScrollHandler = throttle(function() {
    // Any scroll-based animations can be added here
}, 16); // ~60fps

window.addEventListener('scroll', throttledScrollHandler);

// Add loading states for external resources
const images = document.querySelectorAll('img');
images.forEach(img => {
    img.addEventListener('load', function() {
        this.classList.add('loaded');
    });
    
    img.addEventListener('error', function() {
        this.classList.add('error');
        // Fallback for missing images
        this.style.display = 'none';
    });
});

// Console welcome message
console.log(`
🚀 ISTools Website
Desenvolvido por Irlan Souza
GitHub: https://github.com/irlansouza193
Email: irlansouza193@gmail.com

Plugin profissional de vetorização para QGIS
`);

// Analytics placeholder
function trackEvent(category, action, label) {
    console.log(`Analytics: ${category} - ${action} - ${label}`);
}

// Track button clicks
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const text = this.textContent.trim();
        trackEvent('Button', 'Click', text);
    });
});

// Track external links
document.querySelectorAll('a[target="_blank"]').forEach(link => {
    link.addEventListener('click', function() {
        const href = this.getAttribute('href');
        trackEvent('External Link', 'Click', href);
    });
});

// Função HOME para o logo
document.addEventListener('DOMContentLoaded', function() {
    const homeButton = document.getElementById('homeButton');
    
    if (homeButton) {
        homeButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Animação suave para o topo
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Adiciona efeito visual no clique
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    }
});