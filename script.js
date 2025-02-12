window.addEventListener('scroll', () => {
    const scrollProgress = document.querySelector('.scroll-progress');
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = (window.scrollY / scrollableHeight) * 100;
    scrollProgress.style.width = `${scrollPercentage}%`;
});

// Custom Cursor
document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');

    document.addEventListener('mousemove', (e) => {
        // Get scroll position
        const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;

        // Add scroll position to cursor coordinates
        const cursorX = e.clientX + scrollX;
        const cursorY = e.clientY + scrollY;

        // Update cursor positions using fixed positioning and transform
        cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        cursorFollower.style.transform = `translate3d(${e.clientX - 15}px, ${e.clientY - 15}px, 0)`;
    });

    document.addEventListener('mousedown', () => {
        cursor.style.transform = 'scale(0.8)';
        cursorFollower.style.transform = 'scale(0.8)';
    });

    document.addEventListener('mouseup', () => {
        cursor.style.transform = 'scale(1)';
        cursorFollower.style.transform = 'scale(1)';
    });
});

// Typed.js Initialization
const typed = new Typed('.typed-text', {
    strings: ['a Full Stack Developer', 'a UI/UX Designer', 'a Problem Solver'],
    typeSpeed: 50,
    backSpeed: 30,
    backDelay: 2000,
    loop: true
});

// Navbar Scroll Effect
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });

        // Close mobile menu
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse.classList.contains('show')) {
            navbarCollapse.classList.remove('show');
        }
    });
});

// Active Navigation Link Update
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 150) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

// Interactive Skill Radar Chart
const ctx = document.getElementById('skillRadarChart').getContext('2d');
new Chart(ctx, {
    type: 'radar',
    data: {
        labels: ['Programming', 'Web Dev', 'Algorithms', 'Problem Solving', 'Design'],
        datasets: [{
            label: 'Skills Proficiency',
            data: [85, 80, 90, 85, 75],
            backgroundColor: 'rgba(2, 121, 76, 0.2)',
            borderColor: 'var(--accent-color)',
            pointBackgroundColor: 'var(--accent-color)'
        }]
    },
    options: {
        responsive: true,
        scales: {
            r: {
                beginAtZero: true,
                max: 100,
                ticks: { display: false },
                grid: { color: 'rgba(255, 255, 255, 0.1)' }
            }
        }
    }
});

// Project Hover Effects
document.querySelectorAll('.project-showcase').forEach(project => {
    project.addEventListener('mouseenter', () => {
        project.querySelector('.project-overlay').style.opacity = '1';
    });
    
    project.addEventListener('mouseleave', () => {
        project.querySelector('.project-overlay').style.opacity = '0';
    });
});

// Form Submission Handling
// Contact form configuration
// First, initialize EmailJS with your public key
emailjs.init("IrfxFM67kzFb_G_A3"); // Replace with your actual public key

const initializeContactForm = () => {
    const form = document.querySelector('.contact-form');
    const inputs = form.querySelectorAll('input, textarea');
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Validation patterns
    const patterns = {
        name: /^[a-zA-Z\s]{2,30}$/,
        email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
        subject: /^.{2,100}$/,
        message: /^[\s\S]{10,1000}$/
    };

    // Error messages
    const errorMessages = {
        name: 'Please enter a valid name (2-30 characters)',
        email: 'Please enter a valid email address',
        subject: 'Subject must be between 2-100 characters',
        message: 'Message must be between 10-1000 characters'
    };

    // Create and append error element
    const createErrorElement = (input) => {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message text-danger mt-1';
        errorDiv.style.fontSize = '0.875rem';
        input.parentElement.appendChild(errorDiv);
    };

    // Initialize error elements
    inputs.forEach(input => {
        createErrorElement(input);
    });

    // Validate single input
    const validateInput = (input) => {
        const pattern = patterns[input.id];
        const errorElement = input.parentElement.querySelector('.error-message');
        const isValid = pattern.test(input.value);
        
        if (!isValid) {
            input.classList.add('is-invalid');
            input.classList.remove('is-valid');
            errorElement.textContent = errorMessages[input.id];
        } else {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
            errorElement.textContent = '';
        }
        
        return isValid;
    };

    // Real-time validation
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            validateInput(input);
            // Check if all inputs are valid
            const allValid = Array.from(inputs).every(input => patterns[input.id].test(input.value));
            submitButton.disabled = !allValid;
        });
    });

    // Form submission handler
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validate all inputs
        const isValid = Array.from(inputs).every(input => validateInput(input));
        
        if (!isValid) {
            return;
        }

        // Disable submit button and show loading state
        submitButton.disabled = true;
        const originalText = submitButton.textContent;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';

        // Get form data
        const templateParams = {
            from_name: form.querySelector('#name').value,
            from_email: form.querySelector('#email').value,
            subject: form.querySelector('#subject').value,
            message: form.querySelector('#message').value
        };

        try {
            // Send email using EmailJS
            const response = await emailjs.send(
                'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
                'template_2tnzkys', // Your template ID
                templateParams
            );

            if (response.status === 200) {
                showNotification('Message sent successfully!', 'success');
                form.reset();
                inputs.forEach(input => {
                    input.classList.remove('is-valid');
                });
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('EmailJS Error:', error);
            showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            // Reset button state
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
        }
    });
};

// Notification component
const showNotification = (message, type) => {
    const notification = document.createElement('div');
    notification.className = `notification ${type} animate__animated animate__fadeInDown`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="bi ${type === 'success' ? 'bi-check-circle' : 'bi-x-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.remove('animate__fadeInDown');
        notification.classList.add('animate__fadeOutUp');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeContactForm);

document.addEventListener('DOMContentLoaded', () => {
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: '#02794c'
            },
            shape: {
                type: 'circle'
            },
            opacity: {
                value: 0.5,
                random: false
            },
            size: {
                value: 3,
                random: true
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#02794c',
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: 'none',
                random: false,
                straight: false,
                out_mode: 'out',
                bounce: false
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'repulse'
                },
                onclick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            }
        },
        retina_detect: true
    });
});

// Project card mouse movement effect
document.querySelectorAll('.project-showcase').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / card.clientWidth) * 100;
        const y = ((e.clientY - rect.top) / card.clientHeight) * 100;
        
        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);
    });
});

// Enhanced scroll animations
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate__animated', 'animate__fadeInUp');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.glass-card, .project-showcase, .section-title').forEach(el => {
    observer.observe(el);
});

// Enhanced form validation with visual feedback
const form = document.querySelector('.contact-form');
if (form) {
    const inputs = form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            if (input.value.length > 0) {
                input.classList.add('is-valid');
            } else {
                input.classList.remove('is-valid');
            }
        });
    });
}

// Smooth scroll enhancement
const smoothScroll = (target, duration) => {
    const targetPosition = target.getBoundingClientRect().top;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - 80;
    let startTime = null;

    const animation = currentTime => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    };

    const ease = (t, b, c, d) => {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    };

    requestAnimationFrame(animation);
};

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        smoothScroll(target, 1000);

        // Close mobile menu if open
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse.classList.contains('show')) {
            navbarCollapse.classList.remove('show');
        }
    });
});



// Initialize AOS
AOS.init({
    duration: 800,
    once: true,
    offset: 100
});