// NGO Website JavaScript

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 76;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    function highlightNavigation() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const sectionHeight = section.offsetHeight;
            
            if (sectionTop <= 100 && sectionTop + sectionHeight > 100) {
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

    window.addEventListener('scroll', highlightNavigation);
    highlightNavigation(); // Initial call

    // Form handling
    const volunteerForm = document.getElementById('volunteerForm');
    
    if (volunteerForm) {
        volunteerForm.addEventListener('submit', function(event) {
            event.preventDefault();
            event.stopPropagation();

            // Validate interests checkboxes
            const interests = document.querySelectorAll('input[name="interests"]:checked');
            const interestsError = document.getElementById('interests-error');
            
            // Remove existing error message
            if (interestsError) {
                interestsError.remove();
            }

            if (interests.length === 0) {
                const errorDiv = document.createElement('div');
                errorDiv.id = 'interests-error';
                errorDiv.className = 'text-danger mt-2';
                errorDiv.innerHTML = '<small>Please select at least one area of interest.</small>';
                document.querySelector('label:contains("Areas of Interest")').parentNode.appendChild(errorDiv);
                return;
            }

            if (volunteerForm.checkValidity()) {
                // Show loading state
                const submitBtn = volunteerForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<span class="loading"></span> Submitting...';
                submitBtn.disabled = true;

                // Simulate form submission (replace with actual form submission logic)
                setTimeout(() => {
                    // Collect form data
                    const formData = {
                        firstName: document.getElementById('firstName').value,
                        lastName: document.getElementById('lastName').value,
                        email: document.getElementById('email').value,
                        phone: document.getElementById('phone').value,
                        age: document.getElementById('age').value,
                        interests: Array.from(interests).map(cb => cb.value),
                        availability: document.getElementById('availability').value,
                        message: document.getElementById('message').value
                    };

                    console.log('Form submitted with data:', formData);
                    
                    // Show success message
                    showSuccessMessage();
                    
                    // Reset form
                    volunteerForm.reset();
                    volunteerForm.classList.remove('was-validated');
                    
                    // Reset button
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            }

            volunteerForm.classList.add('was-validated');
        });
    }

    // Bootstrap form validation
    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        });
    });

    // Animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const elementsToAnimate = document.querySelectorAll('.feature-box, .stat-card, .card');
    elementsToAnimate.forEach(el => observer.observe(el));
});

// Show success message
function showSuccessMessage() {
    // Remove existing success message
    const existingMessage = document.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create success message
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <i class="fas fa-check-circle fs-3 mb-2"></i>
        <h4>Thank You!</h4>
        <p>Your volunteer application has been submitted successfully. We'll get back to you within 2-3 business days.</p>
    `;

    // Insert after the form
    const form = document.getElementById('volunteerForm');
    form.parentNode.insertBefore(successDiv, form.nextSibling);

    // Show the message with animation
    setTimeout(() => {
        successDiv.classList.add('show');
    }, 100);

    // Remove message after 8 seconds
    setTimeout(() => {
        successDiv.style.opacity = '0';
        successDiv.style.transform = 'translateY(-20px)';
        setTimeout(() => successDiv.remove(), 500);
    }, 8000);
}

// Navbar collapse on mobile after clicking link
document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    link.addEventListener('click', () => {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse.classList.contains('show')) {
            const navbarToggler = document.querySelector('.navbar-toggler');
            navbarToggler.click();
        }
    });
});

// Counter animation for statistics
function animateCounters() {
    const counters = document.querySelectorAll('.stat-card h3');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/\D/g, ''));
        const increment = target / 200;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                if (counter.textContent.includes('+')) {
                    counter.textContent = Math.ceil(current) + '+';
                } else {
                    counter.textContent = Math.ceil(current);
                }
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + (counter.textContent.includes('+') ? '+' : '');
            }
        };
        
        updateCounter();
    });
}

// Trigger counter animation when hero section is visible
const heroSection = document.getElementById('home');
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            heroObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

if (heroSection) {
    heroObserver.observe(heroSection);
}
