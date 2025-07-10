// Mango Studio Portfolio JavaScript

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all functionality
    initNavigation();
    initAnimations();
    initContactForm();
    initScrollEffects();
    initInteractiveElements();
    initThemeToggle();
    
    console.log('Mango Studio portfolio website loaded successfully!');
});

// Theme Toggle Functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const body = document.body;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Add smooth transition effect
        body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            body.style.transition = '';
        }, 300);
    });
    
    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.className = 'fas fa-sun';
        } else {
            themeIcon.className = 'fas fa-moon';
        }
    }
}

// Navigation functionality
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.9)';
            navbar.style.backdropFilter = 'blur(25px)';
            navbar.style.webkitBackdropFilter = 'blur(25px)';
            navbar.style.boxShadow = '0 8px 40px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.8)';
            navbar.style.backdropFilter = 'blur(20px)';
            navbar.style.webkitBackdropFilter = 'blur(20px)';
            navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
        }
        
        // Update for dark theme
        const isDarkTheme = document.body.getAttribute('data-theme') === 'dark';
        if (isDarkTheme) {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(26, 26, 26, 0.9)';
            } else {
                navbar.style.background = 'rgba(26, 26, 26, 0.8)';
            }
        }
    });
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId && targetId.startsWith('#')) {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
            
            // Close mobile menu if open
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                const navbarToggler = document.querySelector('.navbar-toggler');
                navbarToggler.click();
            }
        });
    });
    
    // Active navigation highlighting
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// Animation functionality
function initAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .work-item, .contact-info');
    animateElements.forEach(element => {
        element.classList.add('loading');
        observer.observe(element);
    });
}


// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const imageUpload = document.getElementById('imageUpload');
    const imagePreview = document.getElementById('imagePreview');
    let uploadedImages = [];
    
    // Initialize EmailJS (you'll need to replace these with actual EmailJS credentials)
    emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your EmailJS public key
    
    // Handle image upload preview
    if (imageUpload) {
        imageUpload.addEventListener('change', function(e) {
            const files = Array.from(e.target.files);
            
            files.forEach((file, index) => {
                if (file.size > 5 * 1024 * 1024) { // 5MB limit
                    showNotification('Image ' + file.name + ' is too large. Maximum size is 5MB.', 'error');
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    const imageData = {
                        name: file.name,
                        data: e.target.result,
                        size: file.size
                    };
                    uploadedImages.push(imageData);
                    
                    // Create preview
                    const previewDiv = document.createElement('div');
                    previewDiv.className = 'image-preview';
                    previewDiv.innerHTML = `
                        <img src="${e.target.result}" alt="Preview">
                        <button type="button" class="remove-image" onclick="removeImage(${uploadedImages.length - 1})">×</button>
                    `;
                    imagePreview.appendChild(previewDiv);
                };
                reader.readAsDataURL(file);
            });
        });
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate required fields
            const requiredFields = ['fullName', 'email'];
            let isValid = true;
            
            requiredFields.forEach(field => {
                const input = document.getElementById(field);
                if (!input.value.trim()) {
                    input.classList.add('is-invalid');
                    isValid = false;
                } else {
                    input.classList.remove('is-invalid');
                }
            });
            
            // Validate email format
            const emailInput = document.getElementById('email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailInput.value && !emailRegex.test(emailInput.value)) {
                emailInput.classList.add('is-invalid');
                isValid = false;
            }
            
            if (isValid) {
                sendEmail();
            } else {
                showNotification('Please fill in all required fields correctly.', 'error');
            }
        });
        
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.hasAttribute('required') && !this.value.trim()) {
                    this.classList.add('is-invalid');
                } else {
                    this.classList.remove('is-invalid');
                }
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('is-invalid') && this.value.trim()) {
                    this.classList.remove('is-invalid');
                }
            });
        });
    }
    
    function sendEmail() {
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Prepare email data
        const templateParams = {
            to_email: 'hello@mangostudio.com',
            full_name: document.getElementById('fullName').value,
            company: document.getElementById('company').value || 'Not specified',
            from_email: document.getElementById('email').value,
            phone: document.getElementById('phone').value || 'Not specified',
            service_type: document.getElementById('serviceType').value || 'Not specified',
            budget: document.getElementById('budget').value || 'Not specified',
            message: document.getElementById('message').value || 'No message provided',
            images_count: uploadedImages.length,
            timestamp: new Date().toLocaleString()
        };
        
        // Simulate email sending for now (replace with actual EmailJS call)
        setTimeout(() => {
            showNotification('Thank you! Your project brief has been sent. We\'ll get back to you within 24 hours!', 'success');
            contactForm.reset();
            imagePreview.innerHTML = '';
            uploadedImages = [];
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            
            // Log the data that would be sent
            console.log('Project brief data that would be sent:', templateParams);
            if (uploadedImages.length > 0) {
                console.log('Project references that would be attached:', uploadedImages.map(img => img.name));
            }
        }, 2000);
        
        /* 
        // Uncomment this when you have EmailJS configured:
        emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
            .then(function(response) {
                showNotification('Thank you! Your project brief has been sent. We\'ll get back to you within 24 hours!', 'success');
                contactForm.reset();
                imagePreview.innerHTML = '';
                uploadedImages = [];
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, function(error) {
                showNotification('Sorry, there was an error sending your message. Please try again or contact us directly.', 'error');
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                console.error('EmailJS error:', error);
            });
        */
    }
    
    // Global function to remove images
    window.removeImage = function(index) {
        uploadedImages.splice(index, 1);
        const previews = imagePreview.querySelectorAll('.image-preview');
        if (previews[index]) {
            previews[index].remove();
        }
        
        // Update indices for remaining images
        const remainingPreviews = imagePreview.querySelectorAll('.image-preview');
        remainingPreviews.forEach((preview, newIndex) => {
            const removeBtn = preview.querySelector('.remove-image');
            removeBtn.setAttribute('onclick', `removeImage(${newIndex})`);
        });
    };
}

// Scroll effects
function initScrollEffects() {
    // Parallax effect for hero section
    const heroSection = document.querySelector('.hero-section');
    
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            heroSection.style.transform = `translateY(${rate}px)`;
        });
    }
    
    // Progress indicator (optional - can be added to show scroll progress)
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 2px;
        background: linear-gradient(90deg, #000000, #666666);
        z-index: 10000;
        transition: width 0.3s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / documentHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// Interactive elements
function initInteractiveElements() {
    // Work item hover effects
    const workItems = document.querySelectorAll('.work-item');
    workItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Service cards hover effects
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.background = 'linear-gradient(135deg, rgba(0, 0, 0, 0.02) 0%, rgba(0, 0, 0, 0.05) 100%)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.background = 'var(--white)';
        });
    });
    
    // Button hover effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-1px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
    `;
    
    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.background = '#66BB6A';
            break;
        case 'error':
            notification.style.background = '#F44336';
            break;
        case 'warning':
            notification.style.background = '#FFA726';
            break;
        default:
            notification.style.background = '#2196F3';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Slide in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
    
    // Click to dismiss
    notification.addEventListener('click', function() {
        this.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (this.parentNode) {
                this.remove();
            }
        }, 300);
    });
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    .loading {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.6s ease;
    }
    
    .loading.fade-in-up {
        opacity: 1;
        transform: translateY(0);
    }
    
    .is-invalid {
        border-color: #F44336 !important;
        box-shadow: 0 0 0 0.2rem rgba(244, 67, 54, 0.25) !important;
    }
    
    .notification {
        cursor: pointer;
    }
    
    .notification:hover {
        opacity: 0.9;
    }
`;
document.head.appendChild(style);

// Accessibility improvements
function initAccessibility() {
    // Add skip link for keyboard navigation
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 10001;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content landmark
    const heroSection = document.getElementById('home');
    if (heroSection) {
        heroSection.setAttribute('id', 'main-content');
        heroSection.setAttribute('role', 'main');
    }
}

// Initialize accessibility features
initAccessibility();

// Performance optimization
function initPerformanceOptimizations() {
    // Lazy loading for images (when actual images are added)
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window && images.length > 0) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // Preload critical resources
    const preloadLinks = [
        'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
    ];
    
    preloadLinks.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = href;
        document.head.appendChild(link);
    });
}

// Initialize performance optimizations
initPerformanceOptimizations();

// Debug mode (remove in production)
const debugMode = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

if (debugMode) {
    console.log('🥭 Mango Studio Portfolio Website Debug Mode');
    console.log('📱 Viewport:', window.innerWidth + 'x' + window.innerHeight);
    console.log('🎨 Color scheme:', getComputedStyle(document.documentElement).getPropertyValue('--primary-color'));
    
    // Add performance monitoring
    window.addEventListener('load', function() {
        if ('performance' in window) {
            const loadTime = performance.now();
            console.log('⚡ Page load time:', Math.round(loadTime) + 'ms');
        }
    });
}