/**
 * Класс для управления событиями слайдера
 */

export class EventManager {
    constructor(slider) {
        this.slider = slider;
        this.boundHandleMouseUp = this.handleMouseUp.bind(this);
    }
    
    /**
     * Настраивает все обработчики событий
     */
    setupEventListeners() {
        this.setupMouseEvents();
        this.setupTouchEvents();
        this.setupKeyboardEvents();
    }
    
    /**
     * Настраивает обработчики мыши
     */
    setupMouseEvents() {
        const shadowRoot = this.slider.shadowRoot;
        
        shadowRoot.addEventListener('mousedown', this.handleMouseDown.bind(this));
        shadowRoot.addEventListener('mousemove', this.handleMouseMove.bind(this));
        shadowRoot.addEventListener('mouseup', this.handleMouseUp.bind(this));
        
        // Добавляем обработчик для всего документа
        document.addEventListener('mouseup', this.boundHandleMouseUp);
    }
    
    /**
     * Настраивает обработчики касаний
     */
    setupTouchEvents() {
        const shadowRoot = this.slider.shadowRoot;
        
        shadowRoot.addEventListener('touchstart', this.handleTouchStart.bind(this));
        shadowRoot.addEventListener('touchmove', this.handleTouchMove.bind(this));
        shadowRoot.addEventListener('touchend', this.handleTouchEnd.bind(this));
        
        // Предотвращаем прокрутку страницы при взаимодействии со слайдером
        shadowRoot.addEventListener('touchmove', (e) => {
            if (this.slider.activeThumb) {
                e.preventDefault();
            }
        }, { passive: false });
    }
    
    /**
     * Настраивает обработчики клавиатуры
     */
    setupKeyboardEvents() {
        const shadowRoot = this.slider.shadowRoot;
        
        shadowRoot.addEventListener('keydown', this.handleKeyDown.bind(this));
    }
    
    /**
     * Обрабатывает нажатие кнопки мыши
     */
    handleMouseDown(e) {
        if (e.target.classList.contains('thumb')) {
            this.slider.activeThumb = e.target;
            this.slider.activeThumb.classList.add('dragging');
            e.preventDefault();
        }
    }
    
    /**
     * Обрабатывает движение мыши
     */
    handleMouseMove(e) {
        if (this.slider.activeThumb) {
            this.slider.moveThumb(e.clientX);
        }
    }
    
    /**
     * Обрабатывает отпускание кнопки мыши
     */
    handleMouseUp() {
        if (this.slider.activeThumb) {
            this.slider.activeThumb.classList.remove('dragging');
            this.slider.activeThumb = null;
            this.slider.dispatchChangeEvent();
        }
    }
    
    /**
     * Обрабатывает начало касания
     */
    handleTouchStart(e) {
        if (e.target.classList.contains('thumb')) {
            this.slider.activeThumb = e.target;
            this.slider.activeThumb.classList.add('dragging');
            e.preventDefault();
        }
    }
    
    /**
     * Обрабатывает движение касания
     */
    handleTouchMove(e) {
        if (this.slider.activeThumb && e.touches.length > 0) {
            this.slider.moveThumb(e.touches[0].clientX);
        }
    }
    
    /**
     * Обрабатывает окончание касания
     */
    handleTouchEnd() {
        if (this.slider.activeThumb) {
            this.slider.activeThumb.classList.remove('dragging');
            this.slider.activeThumb = null;
            this.slider.dispatchChangeEvent();
        }
    }
    
    /**
     * Обрабатывает нажатия клавиш
     */
    handleKeyDown(e) {
        const thumb = e.target;
        if (!thumb.classList.contains('thumb')) return;
        
        const index = parseInt(thumb.dataset.index);
        const currentValue = this.slider.getCurrentValues()[index];
        const step = this.slider.step > 0 ? this.slider.step : (this.slider.max - this.slider.min) / 100;
        
        let newValue = currentValue;
        
        switch(e.key) {
            case 'ArrowLeft':
            case 'ArrowDown':
                newValue = Math.max(this.slider.min, currentValue - step);
                break;
            case 'ArrowRight':
            case 'ArrowUp':
                newValue = Math.min(this.slider.max, currentValue + step);
                break;
            case 'Home':
                newValue = this.slider.min;
                break;
            case 'End':
                newValue = this.slider.max;
                break;
            default:
                return;
        }
        
        e.preventDefault();
        this.slider.setThumbValue(index, newValue);
    }
    
    /**
     * Удаляет все обработчики событий
     */
    cleanup() {
        document.removeEventListener('mouseup', this.boundHandleMouseUp);
    }
}