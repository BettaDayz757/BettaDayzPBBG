// Accessibility and UX enhancements for BettaDayzPBBG

// Add smooth scrolling for skip link
document.addEventListener('DOMContentLoaded', function() {
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.focus();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Add keyboard navigation support
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('keydown', function(e) {
            // Handle Enter and Space keys
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // Announce page changes for screen readers
    const pageTitle = document.title;
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    announcement.textContent = `Page loaded: ${pageTitle}`;
    document.body.appendChild(announcement);

    // Remove focus outline on mouse click, keep for keyboard
    document.body.addEventListener('mousedown', function() {
        document.body.classList.add('using-mouse');
    });

    document.body.addEventListener('keydown', function() {
        document.body.classList.remove('using-mouse');
    });
});