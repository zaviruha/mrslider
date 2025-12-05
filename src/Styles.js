export const SLIDER_STYLES = `
/* Стили для Multiple Range Slider компонента */
:host {
    --track-height: 6px;
    --thumb-size: 20px;
    --track-color: #ddd;
    --range-color: #4a90e2;
    --thumb-color: white;
    --thumb-border-color: #4a90e2;
    --active-shadow: 0 0 0 5px rgba(74, 144, 226, 0.2);
    --value-bg: white;
    --value-color: #333;
    --value-shadow: 0 1px 3px rgba(0,0,0,0.1);
    
    display: block;
    position: relative;
    height: 30px;
    margin: 20px 0;
    touch-action: none;
    user-select: none;
}

.track {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: var(--track-height);
    background: var(--track-color);
    border-radius: 3px;
    transform: translateY(-50%);
    cursor: pointer;
}

.range {
    position: absolute;
    height: var(--track-height);
    background: var(--range-color);
    border-radius: 3px;
    top: 50%;
    transform: translateY(-50%);
    transition: left 0.1s ease, width 0.1s ease;
}

.thumb {
    position: absolute;
    width: var(--thumb-size);
    height: var(--thumb-size);
    background: var(--thumb-color);
    border: 2px solid var(--thumb-border-color);
    border-radius: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    cursor: grab;
    z-index: 2;
    transition: transform 0.1s ease, box-shadow 0.2s ease, border-color 0.2s ease;
    outline: none;
}

.thumb:hover {
    transform: translate(-50%, -50%) scale(1.1);
    border-color: color-mix(in srgb, var(--thumb-border-color) 80%, black);
}

.thumb:active,
.thumb.dragging {
    cursor: grabbing;
    transform: translate(-50%, -50%) scale(1.2);
    box-shadow: var(--active-shadow);
    z-index: 3;
}

.thumb:focus {
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--thumb-border-color) 50%, transparent);
}

.thumb.disabled {
    cursor: not-allowed;
    opacity: 0.6;
}

.value {
    position: absolute;
    top: -25px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 12px;
    font-family: system-ui, -apple-system, sans-serif;
    color: var(--value-color);
    background: var(--value-bg);
    padding: 2px 6px;
    border-radius: 3px;
    box-shadow: var(--value-shadow);
    white-space: nowrap;
    pointer-events: none;
    transition: opacity 0.2s ease;
}

.value::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 50%;
    transform: translateX(-50%);
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid var(--value-bg);
}

/* Темная тема */
@media (prefers-color-scheme: dark) {
    :host {
        --track-color: #444;
        --value-bg: #333;
        --value-color: white;
    }
}

/* Анимации для плавного перемещения */
@keyframes thumbPulse {
    0% { transform: translate(-50%, -50%) scale(1); }
    50% { transform: translate(-50%, -50%) scale(1.1); }
    100% { transform: translate(-50%, -50%) scale(1); }
}

.thumb.moving {
    animation: thumbPulse 0.3s ease;
}

/* Модификаторы для разных состояний */
:host([disabled]) .track,
:host([disabled]) .thumb {
    cursor: not-allowed;
    opacity: 0.6;
}

:host([disabled]) .thumb:hover {
    transform: translate(-50%, -50%) scale(1);
}
`;