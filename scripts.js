// Common JavaScript for BSA Troop 485 Website

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Set current year in footer
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // Close mobile menu if window is resized to desktop width
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768 && mobileMenu) { // Tailwind's 'md' breakpoint
            mobileMenu.classList.add('hidden');
        }
    });

    // Add onerror fallbacks for placeholder images
    const images = document.querySelectorAll('img[src^="https://placehold.co"]');
    images.forEach(img => {
        if (!img.getAttribute('onerror')) { // Add only if not already present
            img.onerror = function() {
                // Attempt to extract width, height, and text for a more relevant fallback
                const parts = this.src.split('/');
                let dims = '300x200'; // default
                let text = 'Image+Error';
                if (parts.length > 3) {
                   dims = parts[3];
                   const textParam = parts.find(p => p.includes('text='));
                   if (textParam) {
                       text = textParam.split('=')[1] || 'Error';
                   }
                }
                this.src = `https://placehold.co/${dims}/E0E0E0/B0B0B0?text=${text.replace(/\s/g, '+')}`;
                this.alt = "Error loading image - placeholder shown"; // Update alt text
            };
        }
    });

    // Set active navigation item based on current page
    setActiveNavigation();

    // Initialize contact form if present
    initializeContactForm();

    // Initialize gallery lightbox if present
    initializeGallery();
});

// Function to set active navigation item
function setActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a[href]');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('nav-active');
        }
    });
}

// Contact form initialization
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Simple validation
            if (!data.name || !data.email || !data.message) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                alert('Please enter a valid email address.');
                return;
            }

            // Phone validation if provided
            if (data.phone) {
                const phoneRegex = /^\+?1?\d{10}$/;
                if (!phoneRegex.test(data.phone.replace(/\D/g, ''))) {
                    alert('Please enter a valid 10-digit phone number.');
                    return;
                }
            }
            
            try {
                // Show loading state
                const submitButton = contactForm.querySelector('button[type="submit"]');
                const originalButtonText = submitButton.textContent;
                submitButton.disabled = true;
                submitButton.textContent = 'Sending...';

                // Send data to Lambda function
                const response = await fetch('YOUR_API_GATEWAY_ENDPOINT', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || 'Failed to send message');
                }

                // Show success message
                alert('Thank you for your message! We will get back to you soon.');
                contactForm.reset();
            } catch (error) {
                console.error('Error:', error);
                alert('Sorry, there was an error sending your message. Please try again later.');
            } finally {
                // Reset button state
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        });
    }
}

// Gallery lightbox initialization
function initializeGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item img');
    
    galleryItems.forEach(img => {
        img.addEventListener('click', function() {
            openLightbox(this.src, this.alt);
        });
        
        // Add cursor pointer to indicate clickable
        img.style.cursor = 'pointer';
    });
}

// Simple lightbox function
function openLightbox(src, alt) {
    // Create lightbox overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        cursor: pointer;
    `;
    
    // Create image element
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
    `;
    
    overlay.appendChild(img);
    document.body.appendChild(overlay);
    
    // Close on click
    overlay.addEventListener('click', function() {
        document.body.removeChild(overlay);
    });
    
    // Close on escape key
    const escapeHandler = function(e) {
        if (e.key === 'Escape') {
            document.body.removeChild(overlay);
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);
}

// Utility function to format dates
function formatDate(date) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return new Date(date).toLocaleDateString('en-US', options);
}

// Utility function to create calendar event links
function createCalendarLink(title, startDate, endDate, description, location) {
    const start = new Date(startDate).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const end = new Date(endDate).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: title,
        dates: `${start}/${end}`,
        details: description || '',
        location: location || ''
    });
    
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
