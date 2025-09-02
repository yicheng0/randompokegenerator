/**
 * Integration Script
 * Bridges the existing Pokémon generator functionality with the new UI framework
 */

class FrameworkIntegration {
    constructor() {
        this.originalElements = new Map();
        this.init();
    }

    init() {
        // Wait for both the original code and UI framework to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupIntegration();
            });
        } else {
            this.setupIntegration();
        }
    }

    setupIntegration() {
        // Wait a bit for other scripts to initialize
        setTimeout(() => {
            this.preserveOriginalFunctionality();
            this.enhanceFormBehavior();
            this.setupResultsDisplay();
            this.integrateShinyFeatures();
            this.setupHistoryNavigation();
            console.log('Framework integration complete');
        }, 100);
    }

    /**
     * Preserve all original JavaScript functionality
     */
    preserveOriginalFunctionality() {
        // Store references to original functions that might be called
        this.originalFunctions = {
            generateRandom: window.generateRandom,
            displayPokemon: window.displayPokemon,
            displayPrevious: window.displayPrevious,
            displayNext: window.displayNext,
            toggleShinyDisplay: window.toggleShinyDisplay,
            clearShinies: window.clearShinies
        };

        // Ensure original form submission works
        const form = document.getElementById('controls');
        if (form) {
            // Remove any existing event listeners and add our enhanced one
            const newForm = form.cloneNode(true);
            form.parentNode.replaceChild(newForm, form);
            
            newForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission();
                return false;
            });
        }

        // Preserve dropdown functionality
        this.preserveDropdownBehavior();
    }

    /**
     * Handle form submission with enhanced UX
     */
    handleFormSubmission() {
        // Show loading state
        this.showLoadingState();
        
        // Call the original generateRandom function
        if (typeof generateRandom === 'function') {
            generateRandom();
        }
        
        // The loading state will be hidden by the original markLoading function
    }

    /**
     * Show enhanced loading state
     */
    showLoadingState() {
        const form = document.getElementById('controls');
        const submitButton = form?.querySelector('input[type="submit"]');
        
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.value = 'Generating...';
        }
        
        // Add loading animation to results area
        const results = document.getElementById('results');
        if (results) {
            results.innerHTML = `
                <div class="loading-placeholder">
                    <div class="loading-spinner"></div>
                    <p>Generating your Pokémon...</p>
                </div>
            `;
        }
        
        // Re-enable button after a delay (fallback)
        setTimeout(() => {
            if (submitButton && submitButton.disabled) {
                submitButton.disabled = false;
                submitButton.value = 'Generate';
            }
        }, 10000);
    }

    /**
     * Preserve original dropdown behavior while adding enhancements
     */
    preserveDropdownBehavior() {
        // Get all dropdowns
        const dropdowns = document.querySelectorAll('.dropdown');
        
        dropdowns.forEach(dropdown => {
            const button = dropdown.querySelector('button');
            const popup = dropdown.querySelector('.popup');
            
            if (button && popup) {
                // Remove existing event listeners by cloning
                const newButton = button.cloneNode(true);
                button.parentNode.replaceChild(newButton, button);
                
                // Add enhanced dropdown behavior
                newButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Close other dropdowns
                    document.querySelectorAll('.dropdown .popup.visible').forEach(otherPopup => {
                        if (otherPopup !== popup) {
                            otherPopup.classList.remove('visible');
                        }
                    });
                    
                    // Toggle current dropdown
                    popup.classList.toggle('visible');
                });
                
                // Preserve checkbox functionality
                const checkboxes = popup.querySelectorAll('input[type="checkbox"]');
                checkboxes.forEach(checkbox => {
                    checkbox.addEventListener('change', () => {
                        this.updateDropdownTitle(dropdown);
                    });
                });
                
                // Initialize dropdown title
                this.updateDropdownTitle(dropdown);
            }
        });
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown')) {
                document.querySelectorAll('.dropdown .popup.visible').forEach(popup => {
                    popup.classList.remove('visible');
                });
            }
        });
    }

    /**
     * Update dropdown button title based on selections
     */
    updateDropdownTitle(dropdown) {
        const button = dropdown.querySelector('button');
        const checkboxes = dropdown.querySelectorAll('input[type="checkbox"]:not([data-select-all])');
        const selectedCheckboxes = dropdown.querySelectorAll('input[type="checkbox"]:not([data-select-all]):checked');
        const selectAllCheckbox = dropdown.querySelector('input[type="checkbox"][data-select-all]');
        
        if (!button) return;
        
        const pluralName = button.dataset.pluralName || 'Items';
        const allName = button.dataset.allName || `All ${pluralName}`;
        const allowNone = button.dataset.allowNone;
        
        // Update select all checkbox
        if (selectAllCheckbox) {
            selectAllCheckbox.checked = selectedCheckboxes.length > 0;
            selectAllCheckbox.indeterminate = selectedCheckboxes.length > 0 && selectedCheckboxes.length < checkboxes.length;
        }
        
        // Update button text
        let displayText;
        if (allowNone && selectedCheckboxes.length === 0) {
            displayText = `No ${pluralName}`;
        } else if (selectedCheckboxes.length === 0 || selectedCheckboxes.length === checkboxes.length) {
            displayText = allName;
        } else if (selectedCheckboxes.length === 1) {
            displayText = this.getCheckboxDisplayName(selectedCheckboxes[0]);
        } else if (button.dataset.allowShowingTwo && selectedCheckboxes.length === 2) {
            displayText = `${this.getCheckboxDisplayName(selectedCheckboxes[0])}, ${this.getCheckboxDisplayName(selectedCheckboxes[1])}`;
        } else {
            const nameForCount = button.dataset.nameForCount || pluralName;
            displayText = `${selectedCheckboxes.length} ${nameForCount}`;
        }
        
        button.textContent = displayText;
    }

    /**
     * Get display name for checkbox
     */
    getCheckboxDisplayName(checkbox) {
        return checkbox.dataset.shortName || checkbox.parentElement.textContent.trim();
    }

    /**
     * Enhance form behavior
     */
    enhanceFormBehavior() {
        // Add form validation
        const form = document.getElementById('controls');
        if (form) {
            // Validate that at least one region is selected
            form.addEventListener('submit', (e) => {
                const regionCheckboxes = form.querySelectorAll('input[name="regions"]:checked');
                if (regionCheckboxes.length === 0) {
                    e.preventDefault();
                    this.showNotification('Please select at least one region.', 'warning');
                    return false;
                }
                
                const typeCheckboxes = form.querySelectorAll('input[name="types"]:checked');
                if (typeCheckboxes.length === 0) {
                    e.preventDefault();
                    this.showNotification('Please select at least one type.', 'warning');
                    return false;
                }
            });
        }
        
        // Add real-time form updates
        this.setupRealTimeUpdates();
    }

    /**
     * Setup real-time form updates
     */
    setupRealTimeUpdates() {
        // Select all functionality
        document.querySelectorAll('input[data-select-all]').forEach(selectAllCheckbox => {
            selectAllCheckbox.addEventListener('change', (e) => {
                const container = e.target.closest('.popup');
                const otherCheckboxes = container.querySelectorAll('input[type="checkbox"]:not([data-select-all])');
                
                otherCheckboxes.forEach(checkbox => {
                    checkbox.checked = e.target.checked;
                });
                
                // Update dropdown title
                const dropdown = e.target.closest('.dropdown');
                if (dropdown) {
                    this.updateDropdownTitle(dropdown);
                }
            });
        });
        
        // Forms checkbox dependency
        const formsCheckbox = document.getElementById('forms');
        const megasCheckbox = document.getElementById('megas');
        const gigantamaxesCheckbox = document.getElementById('gigantamaxes');
        
        if (formsCheckbox && (megasCheckbox || gigantamaxesCheckbox)) {
            formsCheckbox.addEventListener('change', () => {
                if (megasCheckbox) megasCheckbox.disabled = !formsCheckbox.checked;
                if (gigantamaxesCheckbox) gigantamaxesCheckbox.disabled = !formsCheckbox.checked;
            });
            
            // Initialize state
            if (megasCheckbox) megasCheckbox.disabled = !formsCheckbox.checked;
            if (gigantamaxesCheckbox) gigantamaxesCheckbox.disabled = !formsCheckbox.checked;
        }
    }

    /**
     * Setup enhanced results display
     */
    setupResultsDisplay() {
        // Override the original displayPokemon function with enhanced version
        const originalDisplayPokemon = window.displayPokemon;
        if (originalDisplayPokemon) {
            window.displayPokemon = (pokemon) => {
                // Call original function
                originalDisplayPokemon(pokemon);
                
                // Add enhancements
                this.enhanceResults();
                this.updateSubmitButton();
            };
        }
    }

    /**
     * Enhance the results display
     */
    enhanceResults() {
        const results = document.getElementById('results');
        if (!results) return;
        
        // Add hover effects and animations to result items
        const resultItems = results.querySelectorAll('li');
        resultItems.forEach((item, index) => {
            // Stagger animations
            item.style.animationDelay = `${index * 0.1}s`;
            item.classList.add('result-item-animate');
            
            // Add click functionality for details
            item.addEventListener('click', () => {
                this.showPokemonDetails(item);
            });
        });
        
        // Update shiny count
        const shinyItems = results.querySelectorAll('li.shiny');
        if (shinyItems.length > 0) {
            this.showNotification(`✨ Found ${shinyItems.length} shiny Pokémon!`, 'success');
        }
    }

    /**
     * Show Pokémon details modal (placeholder)
     */
    showPokemonDetails(item) {
        // Extract Pokémon info from the item
        const name = item.querySelector('img')?.alt || 'Unknown Pokémon';
        this.showNotification(`Clicked on ${name}`, 'info');
        // Future: Show detailed modal with stats, moves, etc.
    }

    /**
     * Update submit button state
     */
    updateSubmitButton() {
        const submitButton = document.querySelector('#controls input[type="submit"]');
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.value = 'Generate';
        }
    }

    /**
     * Integrate shiny features
     */
    integrateShinyFeatures() {
        // Enhance shiny toggler
        const shinyToggler = document.getElementById('shiny-toggler');
        if (shinyToggler) {
            // Add enhanced click handler
            const originalOnClick = shinyToggler.onclick;
            shinyToggler.onclick = null;
            
            shinyToggler.addEventListener('click', (e) => {
                if (originalOnClick) {
                    originalOnClick.call(shinyToggler, e);
                }
                
                // Add enhanced animation
                const container = document.getElementById('shiny-container');
                if (container) {
                    if (!container.classList.contains('invisible')) {
                        container.style.animation = 'slideInUp 0.3s ease-out';
                    }
                }
            });
        }
        
        // Enhance clear shinies button
        const clearButton = document.querySelector('button[onclick="clearShinies()"]');
        if (clearButton) {
            clearButton.addEventListener('click', (e) => {
                // Add confirmation with custom styling
                e.preventDefault();
                this.showConfirmDialog(
                    'Clear Shiny Pokémon',
                    'Are you sure you want to clear all your shiny Pokémon? This action cannot be undone.',
                    () => {
                        if (typeof clearShinies === 'function') {
                            clearShinies();
                            this.showNotification('Shiny Pokémon cleared!', 'success');
                        }
                    }
                );
            });
        }
    }

    /**
     * Setup enhanced history navigation
     */
    setupHistoryNavigation() {
        const prevButton = document.getElementById('previous');
        const nextButton = document.getElementById('next');
        
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                this.animateHistoryTransition('previous');
            });
        }
        
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                this.animateHistoryTransition('next');
            });
        }
        
        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!e.target.matches('input, textarea, [contenteditable]')) {
                if (e.key === 'ArrowLeft' && prevButton && !prevButton.classList.contains('hidden')) {
                    prevButton.click();
                } else if (e.key === 'ArrowRight' && nextButton && !nextButton.classList.contains('hidden')) {
                    nextButton.click();
                }
            }
        });
    }

    /**
     * Animate history transition
     */
    animateHistoryTransition(direction) {
        const results = document.getElementById('results');
        if (results) {
            results.style.transition = 'opacity 0.2s ease-out, transform 0.2s ease-out';
            results.style.opacity = '0';
            results.style.transform = `translateX(${direction === 'next' ? '-20px' : '20px'})`;
            
            setTimeout(() => {
                results.style.opacity = '1';
                results.style.transform = 'translateX(0)';
            }, 200);
        }
    }

    /**
     * Show confirmation dialog
     */
    showConfirmDialog(title, message, onConfirm) {
        const dialog = document.createElement('div');
        dialog.className = 'confirm-dialog';
        dialog.innerHTML = `
            <div class="confirm-dialog__backdrop"></div>
            <div class="confirm-dialog__content">
                <h3 class="confirm-dialog__title">${title}</h3>
                <p class="confirm-dialog__message">${message}</p>
                <div class="confirm-dialog__buttons">
                    <button class="btn btn--secondary confirm-dialog__cancel">Cancel</button>
                    <button class="btn btn--red confirm-dialog__confirm">Confirm</button>
                </div>
            </div>
        `;
        
        // Add styles
        dialog.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: var(--z-modal);
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        document.body.appendChild(dialog);
        
        // Event listeners
        dialog.querySelector('.confirm-dialog__cancel').addEventListener('click', () => {
            dialog.remove();
        });
        
        dialog.querySelector('.confirm-dialog__confirm').addEventListener('click', () => {
            onConfirm();
            dialog.remove();
        });
        
        dialog.querySelector('.confirm-dialog__backdrop').addEventListener('click', () => {
            dialog.remove();
        });
    }

    /**
     * Show notification (delegated to UI framework if available)
     */
    showNotification(message, type = 'info') {
        if (window.uiFramework && window.uiFramework.showNotification) {
            window.uiFramework.showNotification(message, type);
        } else {
            // Fallback notification
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }
}

// Add required CSS for new features
const integrationStyles = document.createElement('style');
integrationStyles.textContent = `
    .loading-placeholder {
        text-align: center;
        padding: var(--spacing-3xl);
        color: var(--color-text-light);
    }
    
    .loading-spinner {
        width: 40px;
        height: 40px;
        border: 4px solid var(--color-border);
        border-top: 4px solid var(--color-blue);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto var(--spacing-md);
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .result-item-animate {
        animation: slideInUp 0.5s ease-out both;
    }
    
    .confirm-dialog__backdrop {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
    }
    
    .confirm-dialog__content {
        background: var(--color-background);
        padding: var(--spacing-xl);
        border-radius: var(--border-radius-lg);
        box-shadow: var(--shadow-xl);
        max-width: 400px;
        width: 90vw;
        position: relative;
        animation: slideInUp 0.3s ease-out;
    }
    
    .confirm-dialog__title {
        margin-bottom: var(--spacing-md);
        color: var(--color-text);
    }
    
    .confirm-dialog__message {
        margin-bottom: var(--spacing-xl);
        color: var(--color-text-light);
        line-height: var(--line-height-relaxed);
    }
    
    .confirm-dialog__buttons {
        display: flex;
        gap: var(--spacing-md);
        justify-content: flex-end;
    }
    
    .btn--red {
        background: var(--color-red);
        color: white;
        border-color: var(--color-red);
    }
    
    .btn--red:hover:not(:disabled) {
        background: #c82333;
        border-color: #c82333;
    }
`;
document.head.appendChild(integrationStyles);

// Initialize integration
window.frameworkIntegration = new FrameworkIntegration();
