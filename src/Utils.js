/**
 * Утилиты для работы с числами и округлением
 */

export const DEFAULT_CONFIG = {
    MIN: 0,
    MAX: 100,
    VALUES: [],
    NAME: 'range-values',
    PRECISION: 0,
    STEP: 0,
    TRACK_HEIGHT: '6px',
    THUMB_SIZE: '20px',
    TRACK_COLOR: '#ddd',
    RANGE_COLOR: '#4a90e2',
    THUMB_COLOR: 'white',
    THUMB_BORDER_COLOR: '#4a90e2',
    ACTIVE_SHADOW: '0 0 0 5px rgba(74, 144, 226, 0.2)'
};

/**
 * Округляет значение с учетом шага и точности
 */
export const roundValue = (value, { min = 0, step = 0, precision = 1 } = {}) => {
    let roundedValue = value;
    
    if (step > 0) {
        const steps = Math.round((value - min) / step);
        roundedValue = min + steps * step;
    }
    
    const factor = Math.pow(10, precision);
    return Math.round(roundedValue * factor) / factor;
};

/**
 * Конвертирует значение в процент
 */
export const valueToPercent = (value, min, max) => {
    return ((value - min) / (max - min)) * 100;
};

/**
 * Конвертирует процент в значение
 */
export const percentToValue = (percent, min, max) => {
    return min + (percent / 100) * (max - min);
};

export default {
    roundValue,
    valueToPercent,
    percentToValue,
    DEFAULT_CONFIG
};