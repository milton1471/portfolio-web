// Portfolio Gaming - JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    const loadingScreen = document.getElementById('loadingScreen');
    const themeToggle = document.getElementById('themeToggle');
    const header = document.getElementById('header');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const contactForm = document.getElementById('contactForm');
    
    // Estado global
    let isLoading = true;
    let currentTheme = localStorage.getItem('theme') || 'dark';
    
    // Inicialización
    init();
    
    function init() {
        setTheme(currentTheme);
        startLoadingSequence();
        setupEventListeners();
        setupIntersectionObserver();
        setupScrollAnimations();
        setupTypingEffect();
        setupParticles();
    }
    
    // === LOADING SCREEN ===
    function startLoadingSequence() {
        const progressBar = document.querySelector('.loading-progress');
        const percentage = document.querySelector('.loading-percentage');
        const status = document.querySelector('.loading-status');
        
        const loadingSteps = [
            { progress: 15, status: 'Cargando interfaz...', delay: 300 },
            { progress: 30, status: 'Inicializando sistemas...', delay: 500 },
            { progress: 50, status: 'Compilando proyectos...', delay: 400 },
            { progress: 70, status: 'Configurando skills...', delay: 600 },
            { progress: 85, status: 'Preparando contacto...', delay: 300 },
            { progress: 100, status: 'Sistema listo!', delay: 500 }
        ];
        
        let currentStep = 0;
        
        function nextStep() {
            if (currentStep < loadingSteps.length) {
                const step = loadingSteps[currentStep];
                
                // Actualizar progreso
                progressBar.style.width = step.progress + '%';
                percentage.textContent = step.progress + '%';
                status.textContent = step.status;
                
                // Efectos de sonido simulados con vibración (si está disponible)
                if (navigator.vibrate) {
                    navigator.vibrate(50);
                }
                
                currentStep++;
                setTimeout(nextStep, step.delay);
            } else {
                setTimeout(hideLoadingScreen, 800);
            }
        }
        
        setTimeout(nextStep, 500);
    }
    
    function hideLoadingScreen() {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            isLoading = false;
            startHeroAnimations();
        }, 500);
    }
    
    // === THEME TOGGLE ===
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        currentTheme = theme;
        localStorage.setItem('theme', theme);
        
        // Actualizar icono del toggle
        const sunIcon = themeToggle.querySelector('.fa-sun');
        const moonIcon = themeToggle.querySelector('.fa-moon');
        
        if (theme === 'light') {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        } else {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
    }
    
    // === EVENT LISTENERS ===
    function setupEventListeners() {
        // Theme toggle
        themeToggle.addEventListener('click', () => {
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
            
            // Efecto de transición suave
            document.body.style.transition = 'all 0.3s ease';
            setTimeout(() => {
                document.body.style.transition = '';
            }, 300);
        });
        
        // Navigation toggle
        navToggle.addEventListener('click', toggleNavigation);
        
        // Navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                navigateToSection(targetId);
            });
        });
        
        // Scroll events
        window.addEventListener('scroll', debounce(handleScroll, 10));
        
        // Form submission
        if (contactForm) {
            contactForm.addEventListener('submit', handleFormSubmit);
        }
        
        // Resize events
        window.addEventListener('resize', debounce(handleResize, 250));
        
        // Click outside nav menu
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                closeNavigation();
            }
        });
    }
    
    // === NAVIGATION ===
    function toggleNavigation() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('nav-open');
    }
    
    function closeNavigation() {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('nav-open');
    }
    
    function navigateToSection(targetId) {
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            const headerHeight = header.offsetHeight;
            const targetPosition = targetSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Actualizar link activo
            updateActiveNavLink(targetId);
            closeNavigation();
        }
    }
    
    function updateActiveNavLink(activeId) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === activeId) {
                link.classList.add('active');
            }
        });
    }
    
    // === SCROLL HANDLING ===
    function handleScroll() {
        const scrollY = window.scrollY;
        
        // Header scroll effect
        if (scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Update active navigation based on scroll position
        updateNavigationOnScroll();
        
        // Parallax effects
        applyParallaxEffects(scrollY);
    }
    
    function updateNavigationOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + header.offsetHeight + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = '#' + section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                updateActiveNavLink(sectionId);
            }
        });
    }
    
    function applyParallaxEffects(scrollY) {
        // Hero background parallax
        const heroBackground = document.querySelector('.hero-background');
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${scrollY * 0.5}px)`;
        }
        
        // Floating elements parallax
        const floatingElements = document.querySelectorAll('.floating-code span');
        floatingElements.forEach((element, index) => {
            const speed = 0.2 + (index * 0.1);
            element.style.transform = `translateY(${scrollY * speed}px) rotate(${scrollY * 0.1}deg)`;
        });
    }
    
    // === INTERSECTION OBSERVER ===
    function setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Trigger specific animations based on element type
                    triggerElementAnimation(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe elements
        const animateElements = document.querySelectorAll('.about-card, .skill-category, .project-card, .service-card, .contact-card, .contact-form');
        animateElements.forEach(el => {
            observer.observe(el);
        });
    }
    
    function triggerElementAnimation(element) {
        // Skill bars animation
        if (element.classList.contains('skill-category')) {
            animateSkillBars(element);
        }
        
        // Stats counter animation
        if (element.classList.contains('hero-stats')) {
            animateCounters(element);
        }
        
        // Avatar stats animation
        if (element.querySelector('.avatar-stats')) {
            animateAvatarStats(element);
        }
    }
    
    // === SKILL ANIMATIONS ===
    function animateSkillBars(container) {
        const skillBars = container.querySelectorAll('.skill-progress, .fill');
        
        skillBars.forEach((bar, index) => {
            setTimeout(() => {
                const skillLevel = bar.getAttribute('data-skill');
                if (skillLevel) {
                    bar.style.width = skillLevel + '%';
                }
            }, index * 200);
        });
    }
    
    function animateAvatarStats(container) {
        const avatarBars = container.querySelectorAll('.fill');
        
        avatarBars.forEach((bar, index) => {
            setTimeout(() => {
                const skillLevel = bar.getAttribute('data-skill');
                if (skillLevel) {
                    bar.style.width = skillLevel + '%';
                }
            }, index * 300);
        });
    }
    
    // === COUNTER ANIMATIONS ===
    function animateCounters(container) {
        const counters = container.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = Math.floor(current);
            }, 50);
        });
    }
    
    // === TYPING EFFECT ===
    function setupTypingEffect() {
        const typingElement = document.querySelector('.typing-text');
        if (!typingElement) return;
        
        const messages = [
            'Hola, soy Milton',
            'Full Stack Developer',
            'WordPress Expert', 
            'React Specialist',
            'PHP Developer',
            'Disponible para proyectos'
        ];
        
        let messageIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        function typeMessage() {
            const currentMessage = messages[messageIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentMessage.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingElement.textContent = currentMessage.substring(0, charIndex + 1);
                charIndex++;
            }
            
            let typeSpeed = isDeleting ? 50 : 100;
            
            if (!isDeleting && charIndex === currentMessage.length) {
                typeSpeed = 2000; // Pause at end
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                messageIndex = (messageIndex + 1) % messages.length;
                typeSpeed = 500; // Pause before next message
            }
            
            setTimeout(typeMessage, typeSpeed);
        }
        
        // Start typing effect after loading
        setTimeout(typeMessage, 2000);
    }
    
    // === PARTICLES SYSTEM ===
    function setupParticles() {
        const particlesContainer = document.querySelector('.loading-particles');
        if (!particlesContainer) return;
        
        function createParticle() {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: var(--primary-color);
                border-radius: 50%;
                pointer-events: none;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: particleFloat ${3 + Math.random() * 4}s linear infinite;
                opacity: ${0.3 + Math.random() * 0.7};
            `;
            
            particlesContainer.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 7000);
        }
        
        // Create particles periodically during loading
        const particleInterval = setInterval(() => {
            if (isLoading) {
                createParticle();
            } else {
                clearInterval(particleInterval);
            }
        }, 200);
    }
    
    // === HERO ANIMATIONS ===
    function startHeroAnimations() {
        // Animate hero elements in sequence
        const heroElements = [
            '.hero-greeting',
            '.hero-title',
            '.hero-description',
            '.hero-stats',
            '.hero-buttons',
            '.avatar-container'
        ];
        
        heroElements.forEach((selector, index) => {
            const element = document.querySelector(selector);
            if (element) {
                setTimeout(() => {
                    element.style.opacity = '0';
                    element.style.transform = 'translateY(30px)';
                    element.style.transition = 'all 0.8s ease';
                    
                    setTimeout(() => {
                        element.style.opacity = '1';
                        element.style.transform = 'translateY(0)';
                    }, 100);
                }, index * 200);
            }
        });
        
        // Start counter animations
        setTimeout(() => {
            const heroStats = document.querySelector('.hero-stats');
            if (heroStats) {
                animateCounters(heroStats);
            }
        }, 1000);
        
        // Start avatar stats animation
        setTimeout(() => {
            const avatarContainer = document.querySelector('.avatar-container');
            if (avatarContainer) {
                animateAvatarStats(avatarContainer);
            }
        }, 1500);
    }
    
    // === FORM HANDLING ===
    function handleFormSubmit(e) {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('.btn-submit');
        const formStatus = document.getElementById('formStatus');
        const formData = new FormData(contactForm);
        
        // Mostrar estado de carga
        submitBtn.classList.add('loading');
        formStatus.textContent = '';
        formStatus.className = 'form-status';
        
        // Simular envío (reemplazar con tu lógica de envío real)
        setTimeout(() => {
            try {
                // Aquí iría tu lógica de envío real
                // Por ahora simulamos éxito
                
                showFormStatus('success', '¡Mensaje enviado correctamente! Te contactaré pronto.');
                contactForm.reset();
                
                // Efecto de éxito con vibración
                if (navigator.vibrate) {
                    navigator.vibrate([100, 50, 100]);
                }
                
            } catch (error) {
                showFormStatus('error', 'Error al enviar el mensaje. Por favor, intenta nuevamente.');
                console.error('Form submission error:', error);
            }
            
            submitBtn.classList.remove('loading');
        }, 2000);
    }
    
    function showFormStatus(type, message) {
        const formStatus = document.getElementById('formStatus');
        formStatus.className = `form-status ${type}`;
        formStatus.textContent = message;
        
        // Auto-hide después de 5 segundos
        setTimeout(() => {
            formStatus.style.opacity = '0';
            setTimeout(() => {
                formStatus.className = 'form-status';
                formStatus.textContent = '';
                formStatus.style.opacity = '1';
            }, 300);
        }, 5000);
    }
    
    // === UTILITY FUNCTIONS ===
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    function handleResize() {
        // Recalcular elementos que dependen del viewport
        const heroHeight = window.innerHeight;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.minHeight = heroHeight + 'px';
        }
        
        // Cerrar navegación en resize si está abierta
        if (window.innerWidth > 768) {
            closeNavigation();
        }
    }
    
    // === SCROLL ANIMATIONS CSS ===
    function setupScrollAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes particleFloat {
                0% {
                    transform: translateY(0) rotate(0deg);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(-100vh) rotate(360deg);
                    opacity: 0;
                }
            }
            
            .animate-in {
                animation: slideInUp 0.8s ease forwards;
            }
            
            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(50px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .nav-open {
                overflow: hidden;
            }
            
            .glitch-text {
                animation: textGlitch 0.3s ease;
            }
            
            @keyframes textGlitch {
                0%, 100% { transform: translate(0); }
                20% { transform: translate(-1px, 1px); }
                40% { transform: translate(-1px, -1px); }
                60% { transform: translate(1px, 1px); }
                80% { transform: translate(1px, -1px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // === EASTER EGGS ===
    let konamiCode = [];
    const konamiSequence = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 
        'KeyB', 'KeyA'
    ];
    
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.code);
        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }
        
        if (konamiCode.join(',') === konamiSequence.join(',')) {
            activateEasterEgg();
        }
    });
    
    function activateEasterEgg() {
        // Efecto especial cuando se activa el código Konami
        document.body.style.animation = 'rainbow 2s infinite';
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        setTimeout(() => {
            document.body.style.animation = '';
            style.remove();
        }, 5000);
        
        console.log('🎮 Easter egg activado! Modo gaming extremo habilitado.');
    }
    
    // === PERFORMANCE MONITORING ===
    function monitorPerformance() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
                console.log(`⚡ Portfolio cargado en ${loadTime}ms`);
                
                // Reportar métricas importantes
                if (loadTime > 3000) {
                    console.warn('⚠️ Tiempo de carga lento detectado');
                }
            });
        }
    }
    
    // Inicializar monitoreo de performance
    monitorPerformance();
    
    // === ACCESSIBILITY IMPROVEMENTS ===
    function setupAccessibility() {
        // Manejo de navegación por teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeNavigation();
            }
            
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
        
        // Mejorar contraste en modo de alto contraste
        if (window.matchMedia('(prefers-contrast: high)').matches) {
            document.documentElement.classList.add('high-contrast');
        }
        
        // Respetar preferencia de animaciones reducidas
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.classList.add('reduced-motion');
        }
    }
    
    setupAccessibility();
    
    // === CONSOLE EASTER EGG ===
    console.log(`
    🎮 =============================================== 🎮
       ¡Hola developer! 👋
       
       Veo que revisas el código... ¡Excelente!
       
       Portfolio creado por: Milton (milton1471)
       Tecnologías: HTML5, CSS3, JavaScript vanilla
       Estilo: Gaming/Tech futurista
       
       Si te gusta el código, ¡conectemos!
       📧 milton.dev@gmail.com
       🐙 github.com/milton1471
       
       Tip: Prueba el código Konami para un easter egg 😉
    🎮 =============================================== 🎮
    `);
});

// === SERVICE WORKER REGISTRATION ===
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('✅ Service Worker registrado correctamente');
            })
            .catch(error => {
                console.log('❌ Error al registrar Service Worker:', error);
            });
    });
}

// === GLOBAL ERROR HANDLING ===
window.addEventListener('error', (e) => {
    console.error('💥 Error global capturado:', e.error);
    
    // Aquí podrías enviar errores a un servicio de monitoreo
    // como Sentry, LogRocket, etc.
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('💥 Promise rechazada no manejada:', e.reason);
    e.preventDefault();
});

// === EXPORT FUNCTIONS FOR EXTERNAL USE ===
window.MiltonPortfolio = {
    navigateToSection: (sectionId) => {
        const targetSection = document.querySelector(sectionId);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    },
    
    toggleTheme: () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    },
    
    showMessage: (message, type = 'info') => {
        // Función para mostrar notificaciones personalizadas
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--bg-card);
            border: 1px solid var(--primary-color);
            color: var(--text-primary);
            padding: 1rem 1.5rem;
            border-radius: 10px;
            backdrop-filter: blur(20px);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
};