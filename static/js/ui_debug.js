class UIDebugger {
    constructor() {
        this.isDebugMode = false;
        this.debugElements = new Map();
        this.counter = 1;
    }

    toggle() {
        this.isDebugMode = !this.isDebugMode;
        if (this.isDebugMode) {
            this.enableDebugMode();
        } else {
            this.disableDebugMode();
        }
    }

    enableDebugMode() {
        // Reset counter
        this.counter = 1;
        
        // Find all elements with an id
        const elements = document.querySelectorAll('[id]');
        elements.forEach(element => {
            // Create debug overlay
            const debugOverlay = document.createElement('div');
            debugOverlay.className = 'debug-overlay';
            debugOverlay.textContent = this.counter;
            
            // Create tooltip
            const tooltip = document.createElement('div');
            tooltip.className = 'debug-tooltip';
            tooltip.textContent = `ID: ${element.id}`;
            debugOverlay.appendChild(tooltip);

            // Position the overlay
            const rect = element.getBoundingClientRect();
            debugOverlay.style.position = 'absolute';
            debugOverlay.style.left = `${rect.left}px`;
            debugOverlay.style.top = `${rect.top}px`;

            // Store reference
            this.debugElements.set(this.counter, {
                element: element,
                overlay: debugOverlay
            });

            document.body.appendChild(debugOverlay);
            this.counter++;
        });

        // Add resize listener
        window.addEventListener('resize', this.updateOverlayPositions.bind(this));
    }

    disableDebugMode() {
        // Remove all debug overlays
        this.debugElements.forEach(({overlay}) => {
            overlay.remove();
        });
        this.debugElements.clear();

        // Remove resize listener
        window.removeEventListener('resize', this.updateOverlayPositions.bind(this));
    }

    updateOverlayPositions() {
        this.debugElements.forEach(({element, overlay}) => {
            const rect = element.getBoundingClientRect();
            overlay.style.left = `${rect.left}px`;
            overlay.style.top = `${rect.top}px`;
        });
    }

    getElementInfo(number) {
        const debug = this.debugElements.get(number);
        if (debug) {
            return {
                id: debug.element.id,
                element: debug.element
            };
        }
        return null;
    }
}

// Create global instance
window.uiDebugger = new UIDebugger();

// Add keyboard shortcut (Ctrl + Shift + D) to toggle debug mode
document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.shiftKey && event.key === 'D') {
        window.uiDebugger.toggle();
        event.preventDefault();
    }
});
