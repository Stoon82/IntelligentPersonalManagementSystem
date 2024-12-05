import React, { createContext, useContext, useState, useEffect } from 'react';

interface DebugContextType {
    isDebugMode: boolean;
    toggleDebugMode: () => void;
}

const DebugContext = createContext<DebugContextType | undefined>(undefined);

export function DebugProvider({ children }: { children: React.ReactNode }) {
    const [isDebugMode, setIsDebugMode] = useState(false);

    const toggleDebugMode = () => {
        setIsDebugMode(prev => !prev);
    };

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.shiftKey && event.key === 'D') {
                event.preventDefault();
                toggleDebugMode();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);

    useEffect(() => {
        if (isDebugMode) {
            enableDebugOverlays();
        } else {
            disableDebugOverlays();
        }
    }, [isDebugMode]);

    return (
        <DebugContext.Provider value={{ isDebugMode, toggleDebugMode }}>
            {children}
        </DebugContext.Provider>
    );
}

export function useDebug() {
    const context = useContext(DebugContext);
    if (context === undefined) {
        throw new Error('useDebug must be used within a DebugProvider');
    }
    return context;
}

interface ElementInfo {
    id: string;
    type: string;
    className: string;
    text?: string;
}

// Helper functions to handle debug overlays
function enableDebugOverlays() {
    const elements = document.querySelectorAll<HTMLElement>('button, input, select, textarea, a, [role="button"], [role="tab"], .MuiButtonBase-root, .clickable');
    let counter = 1;

    elements.forEach(element => {
        // Skip if element is not visible
        const style = window.getComputedStyle(element);
        if (style.display === 'none' || style.visibility === 'hidden' || 
            element.offsetParent === null) {
            return;
        }

        // Create debug overlay
        const debugOverlay = document.createElement('div');
        debugOverlay.className = 'debug-overlay';
        debugOverlay.setAttribute('data-debug-id', String(counter));
        debugOverlay.textContent = String(counter);

        // Create tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'debug-tooltip';
        
        // Gather element information
        const elementInfo: ElementInfo = {
            id: element.id || `debug-${counter}`,
            type: element.tagName.toLowerCase(),
            className: element.className,
            text: element.textContent?.trim().substring(0, 50),
        };

        tooltip.innerHTML = `
            ID: ${elementInfo.id}<br>
            Type: ${elementInfo.type}<br>
            ${elementInfo.className ? `Class: ${elementInfo.className}<br>` : ''}
            ${elementInfo.text ? `Text: ${elementInfo.text}` : ''}
        `;

        debugOverlay.appendChild(tooltip);

        // Position overlay
        const rect = element.getBoundingClientRect();
        debugOverlay.style.position = 'fixed';
        debugOverlay.style.left = `${rect.left}px`;
        debugOverlay.style.top = `${rect.top}px`;
        debugOverlay.style.zIndex = '10000';

        document.body.appendChild(debugOverlay);
        counter++;
    });

    // Add resize and scroll handlers
    window.addEventListener('resize', updateOverlayPositions);
    window.addEventListener('scroll', updateOverlayPositions);
}

function disableDebugOverlays() {
    const overlays = document.querySelectorAll<HTMLDivElement>('.debug-overlay');
    overlays.forEach(overlay => overlay.remove());

    window.removeEventListener('resize', updateOverlayPositions);
    window.removeEventListener('scroll', updateOverlayPositions);
}

function updateOverlayPositions() {
    const overlays = document.querySelectorAll<HTMLDivElement>('.debug-overlay');
    overlays.forEach(overlay => {
        const debugId = overlay.getAttribute('data-debug-id');
        const elements = Array.from(document.querySelectorAll<HTMLElement>(
            'button, input, select, textarea, a, [role="button"], [role="tab"], .MuiButtonBase-root, .clickable'
        ));
        
        let targetElement: HTMLElement | null = null;
        let counter = 1;

        for (const element of elements) {
            const style = window.getComputedStyle(element);
            if (style.display === 'none' || style.visibility === 'hidden' || 
                element.offsetParent === null) {
                continue;
            }
            
            if (counter === Number(debugId)) {
                targetElement = element;
                break;
            }
            counter++;
        }

        if (targetElement) {
            const rect = targetElement.getBoundingClientRect();
            overlay.style.left = `${rect.left}px`;
            overlay.style.top = `${rect.top}px`;
        }
    });
}
