/**
 * UI Framework JavaScript
 * Provides UI components and interactions for the new framework
 * while maintaining compatibility with existing Pokémon generator logic
 */

class UIFramework {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupChatWidget();
        this.setupHeroActions();
        this.setupResponsiveMenus();
        this.bindEvents();
        console.log('UI Framework initialized');
    }

    /**
     * Setup navigation functionality
     */
    setupNavigation() {
        // Add mobile menu toggle if needed
        const nav = document.querySelector('.header__nav');
        if (nav) {
            // Future mobile menu implementation
        }

        // Smooth scroll for internal links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    /**
     * Setup chat widget functionality
     */
    setupChatWidget() {
        const chatToggle = document.getElementById('chat-toggle');
        const chatClose = document.getElementById('chat-close');
        const chatContent = document.getElementById('chat-content');

        if (chatToggle && chatContent) {
            chatToggle.addEventListener('click', () => {
                const isVisible = chatContent.style.display === 'block';
                chatContent.style.display = isVisible ? 'none' : 'block';
                
                if (!isVisible) {
                    chatContent.style.animation = 'slideInUp 0.3s ease-out';
                }
            });

            if (chatClose) {
                chatClose.addEventListener('click', () => {
                    chatContent.style.display = 'none';
                });
            }

            // Close chat when clicking outside
            document.addEventListener('click', (e) => {
                const chatWidget = document.getElementById('chat-widget');
                if (chatWidget && !chatWidget.contains(e.target) && 
                    chatContent.style.display === 'block') {
                    chatContent.style.display = 'none';
                }
            });
        }
    }

    /**
     * Setup hero section action buttons
     */
    setupHeroActions() {
        // Get all action buttons
        const actionButtons = document.querySelectorAll('[data-action]');
        
        actionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const action = button.getAttribute('data-action');
                this.handleHeroAction(action, e);
            });
        });
    }

    /**
     * Handle hero section actions
     */
    handleHeroAction(action, event) {
        switch (action) {
            case 'start-generation':
                this.showGeneratorSection();
                break;
            case 'open-search':
                this.openSearchModal();
                break;
            case 'start-shiny':
                this.showGeneratorSection();
                // Future: Set shiny hunting mode
                break;
            case 'open-calculator':
                this.showTypeCalculator();
                break;
            case 'open-team-builder':
                this.showTeamBuilder();
                break;
            default:
                console.log('Unknown action:', action);
        }
    }

    /**
     * Show the generator section
     */
    showGeneratorSection() {
        const heroSection = document.querySelector('.hero');
        const generatorSection = document.getElementById('generator-section');
        
        if (heroSection && generatorSection) {
            // Hide hero with animation
            heroSection.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
            heroSection.style.opacity = '0';
            heroSection.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                heroSection.style.display = 'none';
                generatorSection.style.display = 'block';
                generatorSection.style.opacity = '0';
                generatorSection.style.transform = 'translateY(20px)';
                
                // Show generator with animation
                setTimeout(() => {
                    generatorSection.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
                    generatorSection.style.opacity = '1';
                    generatorSection.style.transform = 'translateY(0)';
                    
                    // Scroll to generator
                    generatorSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 50);
            }, 300);
        }
    }

    /**
     * Show hero section (back from generator)
     */
    showHeroSection() {
        const heroSection = document.querySelector('.hero');
        const generatorSection = document.getElementById('generator-section');
        
        if (heroSection && generatorSection) {
            // Hide generator
            generatorSection.style.transition = 'opacity 0.3s ease-out';
            generatorSection.style.opacity = '0';
            
            setTimeout(() => {
                generatorSection.style.display = 'none';
                heroSection.style.display = 'block';
                heroSection.style.opacity = '0';
                
                // Show hero with animation
                setTimeout(() => {
                    heroSection.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
                    heroSection.style.opacity = '1';
                    heroSection.style.transform = 'translateY(0)';
                    
                    // Scroll to top
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }, 50);
            }, 300);
        }
    }

    /**
     * Open search modal (placeholder)
     */
    openSearchModal() {
        console.log('Search modal would open here');
        // Future implementation
    }

    /**
     * Show type calculator (placeholder)
     */
    showTypeCalculator() {
        console.log('Type calculator would open here');
        // Future implementation
    }

    /**
     * Show team builder (placeholder)
     */
    showTeamBuilder() {
        console.log('Team builder would open here');
        // Future implementation
    }

    /**
     * Setup responsive menu behavior
     */
    setupResponsiveMenus() {
        // Enhanced dropdown behavior
        document.querySelectorAll('.dropdown').forEach(dropdown => {
            const button = dropdown.querySelector('button');
            const popup = dropdown.querySelector('.popup');
            
            if (button && popup) {
                button.addEventListener('click', (e) => {
                    e.stopPropagation();
                    
                    // Close all other dropdowns
                    document.querySelectorAll('.dropdown').forEach(otherDropdown => {
                        if (otherDropdown !== dropdown) {
                            otherDropdown.querySelector('.popup')?.classList.remove('visible');
                            otherDropdown.classList.remove('open');
                        }
                    });
                    
                    // Toggle current dropdown
                    popup.classList.toggle('visible');
                    dropdown.classList.toggle('open');
                });
                
                // Close dropdown when clicking outside
                document.addEventListener('click', (e) => {
                    if (!dropdown.contains(e.target)) {
                        popup.classList.remove('visible');
                        dropdown.classList.remove('open');
                    }
                });
                
                // Close dropdown on escape key
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && popup.classList.contains('visible')) {
                        popup.classList.remove('visible');
                        dropdown.classList.remove('open');
                    }
                });
            }
        });
    }

    /**
     * Bind additional framework events
     */
    bindEvents() {
        // Add back to home functionality
        this.addBackToHomeButton();
        
        // Enhance existing button behaviors
        this.enhanceButtons();
        
        // Setup keyboard shortcuts
        this.setupKeyboardShortcuts();
    }

    /**
     * Add back to home button in generator
     */
    addBackToHomeButton() {
        const generatorTitle = document.querySelector('.generator__title');
        if (generatorTitle) {
            const backButton = document.createElement('button');
            backButton.className = 'btn btn--secondary btn--sm';
            backButton.innerHTML = '← Back to Home';
            backButton.style.position = 'absolute';
            backButton.style.top = '0';
            backButton.style.left = '0';
            
            backButton.addEventListener('click', () => {
                this.showHeroSection();
            });
            
            const container = generatorTitle.parentElement;
            if (container) {
                container.style.position = 'relative';
                container.appendChild(backButton);
            }
        }
    }

    /**
     * Enhance existing buttons with better UX
     */
    enhanceButtons() {
        // Add ripple effect to buttons
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');
                
                button.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }

    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // ESC to go back to home
            if (e.key === 'Escape') {
                const generatorSection = document.getElementById('generator-section');
                if (generatorSection && generatorSection.style.display !== 'none') {
                    this.showHeroSection();
                }
            }
            
            // G to go to generator
            if (e.key === 'g' || e.key === 'G') {
                if (!e.target.matches('input, textarea, [contenteditable]')) {
                    this.showGeneratorSection();
                }
            }
            
            // H to go to home
            if (e.key === 'h' || e.key === 'H') {
                if (!e.target.matches('input, textarea, [contenteditable]')) {
                    this.showHeroSection();
                }
            }
        });
    }

    /**
     * Utility function to show notifications
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--color-background);
            border: 1px solid var(--color-border);
            border-radius: var(--border-radius-md);
            padding: var(--spacing-md);
            box-shadow: var(--shadow-lg);
            z-index: var(--z-modal);
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}

// CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes slideInUp {
        from {
            transform: translateY(20px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .btn {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(style);

// Initialize the framework when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.uiFramework = new UIFramework();
    });
} else {
    window.uiFramework = new UIFramework();
}