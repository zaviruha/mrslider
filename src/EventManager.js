/**
 * Класс для управления событиями слайдера
 */

export class EventManager {
  constructor(slider) {
    this.slider = slider;
    // Используем requestAnimationFrame для оптимизации
    this.rafId = null;
    this.lastUpdate = 0;
    this.UPDATE_THROTTLE_MS = 16; // ~60 FPS

    // Биндим методы для правильного контекста
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
  }

  /**
   * Настраивает все обработчики событий
   */
  setupEventListeners() {
    this.setupMouseEvents();
    this.setupTouchEvents();
  }

  /**
   * Настраивает обработчики мыши
   */
  setupMouseEvents() {
    const shadowRoot = this.slider.shadowRoot;

    shadowRoot.addEventListener("mousedown", this.handleMouseDown.bind(this));
    // Удаляем mousemove с shadowRoot - вешаем на document
    shadowRoot.addEventListener("mouseup", this.handleMouseUp.bind(this));
  }

  /**
   * Настраивает обработчики касаний
   */
  setupTouchEvents() {
    const shadowRoot = this.slider.shadowRoot;

    shadowRoot.addEventListener("touchstart", this.handleTouchStart.bind(this));
    // Удаляем touchmove с shadowRoot
    shadowRoot.addEventListener("touchend", this.handleTouchEnd.bind(this));
  }

  /**
   * Настраивает обработчики клавиатуры
   */
  setupKeyboardEvents() {
    const shadowRoot = this.slider.shadowRoot;

    shadowRoot.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  /**
   * Обрабатывает нажатие кнопки мыши
   * @param {MouseEvent} e - событие мыши
   */
  handleMouseDown(e) {
    if (e.target.classList.contains("thumb")) {
      this.slider.activeThumb = e.target;
      this.slider.activeThumb.classList.add("dragging");
      e.preventDefault();

      // Добавляем глобальные обработчики
      document.addEventListener("mousemove", this.handleMouseMove);
      document.addEventListener("mouseup", this.handleMouseUp);
    }
  }

  /**
   * Обрабатывает движение мыши с throttling
   * @param {MouseEvent} e - событие мыши
   */
  handleMouseMove(e) {
    const now = performance.now();

    // Используем requestAnimationFrame для оптимизации
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }

    this.rafId = requestAnimationFrame(() => {
      if (this.slider.activeThumb) {
        this.slider.moveThumb(e.clientX);
      }
    });
  }

  /**
   * Обрабатывает отпускание кнопки мыши
   */
  handleMouseUp() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    // Убираем глобальные обработчики
    document.removeEventListener("mousemove", this.handleMouseMove);
    document.removeEventListener("mouseup", this.handleMouseUp);

    if (this.slider.activeThumb) {
      this.slider.activeThumb.classList.remove("dragging");
      this.slider.activeThumb = null;
      this.slider.dispatchChangeEvent();
    }
  }

  /**
   * Обрабатывает начало касания
   * @param {TouchEvent} e - событие касания
   */
  handleTouchStart(e) {
    if (e.target.classList.contains("thumb")) {
      this.slider.activeThumb = e.target;
      this.slider.activeThumb.classList.add("dragging");
      e.preventDefault();

      // Добавляем глобальные обработчики
      document.addEventListener("touchmove", this.handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", this.handleTouchEnd);
    }
  }

  /**
   * Обрабатывает движение касания
   * @param {TouchEvent} e - событие касания
   */
  handleTouchMove(e) {
    e.preventDefault(); // Предотвращаем скролл страницы

    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }

    this.rafId = requestAnimationFrame(() => {
      if (this.slider.activeThumb && e.touches.length > 0) {
        this.slider.moveThumb(e.touches[0].clientX);
      }
    });
  }

  /**
   * Обрабатывает окончание касания
   */
  handleTouchEnd() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    // Убираем глобальные обработчики
    document.removeEventListener("touchmove", this.handleTouchMove);
    document.removeEventListener("touchend", this.handleTouchEnd);

    if (this.slider.activeThumb) {
      this.slider.activeThumb.classList.remove("dragging");
      this.slider.activeThumb = null;
      this.slider.dispatchChangeEvent();
    }
  }

  /**
   * Обрабатывает нажатия клавиш
   */
  handleKeyDown(e) {
    const thumb = e.target;
    if (!thumb.classList.contains("thumb")) return;

    const index = parseInt(thumb.dataset.index);
    const currentValue = this.slider.getCurrentValues()[index];
    const step =
      this.slider.step > 0
        ? this.slider.step
        : (this.slider.max - this.slider.min) / 100;

    let newValue = currentValue;

    switch (e.key) {
      case "ArrowLeft":
      case "ArrowDown":
        newValue = Math.max(this.slider.min, currentValue - step);
        break;
      case "ArrowRight":
      case "ArrowUp":
        newValue = Math.min(this.slider.max, currentValue + step);
        break;
      case "Home":
        newValue = this.slider.min;
        break;
      case "End":
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
    document.removeEventListener("mouseup", this.boundHandleMouseUp);
  }
}
