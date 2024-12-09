// Initialize EmailJS
emailjs.init("FYknhI9OXYG42bjv8");

// Initialize AOS
AOS.init({
    duration: 1000,
    once: true,
    disable: 'mobile'
});

// Form validation and submission
const contactForm = document.getElementById('contactForm');

function handleFormSubmit(event) {
    event.preventDefault();
    
    // Get form elements
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const nameInput = form.querySelector('#name');
    const emailInput = form.querySelector('#email');
    const messageInput = form.querySelector('#message');
    
    // Validate form
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        showAlert('Por favor, preencha todos os campos corretamente.', 'warning');
        return;
    }
    
    // Add loading state
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';
    
    // Prepare template parameters
    const templateParams = {
        from_name: nameInput.value,
        from_email: emailInput.value,
        message: messageInput.value
    };
    
    // Send email
    emailjs.send('port_leogama.cloud', 'template_test', templateParams)
        .then(function() {
            // Show success message
            showAlert('Mensagem enviada com sucesso! Obrigado pelo contato.', 'success');
            form.reset();
            form.classList.remove('was-validated');
        })
        .catch(function(error) {
            // Show error message
            showAlert('Erro ao enviar mensagem. Por favor, tente novamente mais tarde.', 'danger');
            console.error('Error:', error);
        })
        .finally(function() {
            // Reset button state
            submitButton.disabled = false;
            submitButton.innerHTML = 'Enviar Mensagem';
        });
}

// Add form event listeners
if (contactForm) {
    // Handle form submission via button click
    contactForm.addEventListener('submit', handleFormSubmit);
    
    // Handle individual field validation
    const formInputs = contactForm.querySelectorAll('input, textarea');
    const submitButton = contactForm.querySelector('button[type="submit"]');
    
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value) {
                validateField(this);
            }
        });
    });

    // Add keydown event for Enter key on the form
    contactForm.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && event.target.tagName !== 'TEXTAREA') {
            event.preventDefault();
            submitButton.click(); // Simula o clique no botão de enviar
        }
    });
}

// Field validation function
function validateField(field) {
    if (!field.checkValidity()) {
        field.classList.add('is-invalid');
        const feedbackElement = field.nextElementSibling;
        if (feedbackElement && feedbackElement.classList.contains('invalid-feedback')) {
            announceToScreenReader(feedbackElement.textContent);
        }
    } else {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
    }
}

// Alert function with improved visibility
function showAlert(message, type) {
    // Remove any existing alerts
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());
    
    // Create new alert
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
    `;
    
    // Insert alert before the form
    const formContainer = contactForm.parentElement;
    formContainer.insertBefore(alertDiv, contactForm);
    
    // Announce message to screen readers
    announceToScreenReader(message);
    
    // Remove alert after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentElement) {
            alertDiv.remove();
        }
    }, 5000);
}

// Screen reader announcements
function announceToScreenReader(message) {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.classList.add('sr-only');
    announcer.textContent = message;
    document.body.appendChild(announcer);
    
    setTimeout(() => {
        announcer.remove();
    }, 1000);
}

// Back to top button
const backToTopButton = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 100) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
});

backToTopButton.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Keyboard navigation improvements
document.addEventListener('keydown', function(e) {
    // Skip to main content when pressing Tab
    if (e.key === 'Tab' && !e.shiftKey) {
        const skipLink = document.querySelector('.skip-to-main-content');
        if (document.activeElement === skipLink) {
            e.preventDefault();
            document.querySelector('#main-content').focus();
        }
    }
    
    // Close modal with Escape key
    if (e.key === 'Escape') {
        const modal = document.querySelector('.modal.show');
        if (modal) {
            const modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();
        }
    }
});

// Focus management for modals
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('shown.bs.modal', function() {
        // Focus first focusable element
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length) {
            focusableElements[0].focus();
        }
    });
    
    modal.addEventListener('hidden.bs.modal', function() {
        // Return focus to trigger element
        const triggerElement = document.querySelector('[data-bs-target="#' + modal.id + '"]');
        if (triggerElement) {
            triggerElement.focus();
        }
    });
});

// Form validation feedback
const forms = document.querySelectorAll('.needs-validation');
forms.forEach(form => {
    form.addEventListener('submit', function(event) {
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
            
            // Announce form errors to screen readers
            const firstInvalid = form.querySelector(':invalid');
            if (firstInvalid) {
                const errorMessage = firstInvalid.nextElementSibling?.textContent;
                if (errorMessage) {
                    announceToScreenReader(errorMessage);
                }
            }
        }
        form.classList.add('was-validated');
    }, false);
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
            // Update focus
            target.setAttribute('tabindex', '-1');
            target.focus();
        }
    });
});

// Loading state management
function setLoadingState(element, isLoading) {
    if (isLoading) {
        element.classList.add('loading');
        element.setAttribute('aria-busy', 'true');
    } else {
        element.classList.remove('loading');
        element.removeAttribute('aria-busy');
    }
}

// Initialize tooltips
const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
tooltipTriggerList.map(function(tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
});

// Handle images that fail to load
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        this.alt = 'Imagem não disponível';
        this.style.display = 'none';
        announceToScreenReader('Imagem não pôde ser carregada');
    });
});

// Manipulação do navbar no scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});
