/**
 * Основной класс компонента Multiple Range Slider
 */

import {
  DEFAULT_CONFIG,
  roundValue,
  valueToPercent,
  percentToValue,
} from "./Utils.js";
import { HiddenInputManager } from "./HiddenInputManager.js";
import { EventManager } from "./EventManager.js";

// Импортируем стили (для сборщиков)
import { SLIDER_STYLES } from "./Styles.js";

// Если используем без сборщика, стили будут добавлены через template string

export class MultipleRangeSlider extends HTMLElement {
  static observedAttributes = [
    "min",
    "max",
    "values",
    "name",
    "precision",
    "step",
    "disabled",
  ];

  constructor() {
    super();

    // Проверка поддержки Web Components
    if (!window.customElements || !window.ShadowRoot) {
      this.renderFallback();
      return;
    }

    this.initializeProperties();
    this.attachShadow({ mode: "open" });
  }

  /**
   * Инициализирует свойства компонента
   */
  initializeProperties() {
    this.activeThumb = null;
    this.inputManager = new HiddenInputManager(this);
    this.eventManager = new EventManager(this);

    this.min = DEFAULT_CONFIG.MIN;
    this.max = DEFAULT_CONFIG.MAX;
    this.values = DEFAULT_CONFIG.VALUES;
    this.name = DEFAULT_CONFIG.NAME;
    this.precision = DEFAULT_CONFIG.PRECISION;
    this.step = DEFAULT_CONFIG.STEP;
    this.disabled = false;
  }

  /**
   * Геттеры и сеттеры для публичного API
   */
  get currentValues() {
    return this.getCurrentValues();
  }

  set currentValues(newValues) {
    this.setValues(newValues);
  }

  get isDisabled() {
    return this.disabled || this.hasAttribute("disabled");
  }

  /**
   * Жизненный цикл компонента
   */
  connectedCallback() {
    this.render();
    this.eventManager.setupEventListeners();
    this.createHiddenInputs();
    this.updateAccessibility();
  }

  disconnectedCallback() {
    this.inputManager.removeInputs();
    this.eventManager.cleanup();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    this.updateAttribute(name, newValue);

    if (this.isConnected) {
      this.render();
      this.updateAccessibility();
    }
  }

  /**
   * Обновляет атрибут компонента
   */
  updateAttribute(name, value) {
    const attributeHandlers = {
      values: () => {
        this.values = value ? value.split(",").map(Number) : [];
      },
      min: () => {
        this.min = Number(value) || DEFAULT_CONFIG.MIN;
      },
      max: () => {
        this.max = Number(value) || DEFAULT_CONFIG.MAX;
      },
      name: () => {
        this.name = value || DEFAULT_CONFIG.NAME;
      },
      precision: () => {
        this.precision = parseInt(value) || DEFAULT_CONFIG.PRECISION;
      },
      step: () => {
        this.step = Number(value) || DEFAULT_CONFIG.STEP;
      },
      disabled: () => {
        this.disabled = value !== null;
      },
    };

    if (attributeHandlers[name]) {
      attributeHandlers[name]();
    }
  }

  /**
   * Рендерит компонент
   */
  render() {
    const template = this.createTemplate();
    this.shadowRoot.innerHTML = template;
    this.updateRange();
  }

  /**
   * Создает HTML шаблон компонента
   */
  createTemplate() {
    const values = this.getDisplayValues();
    const thumbsHTML = this.generateThumbsHTML(values);
    const styles = SLIDER_STYLES;

    return `
            <style>${styles}</style>
            <div class="track" part="track"></div>
            <div class="range" part="range"></div>
            ${thumbsHTML}
        `;
  }

  /**
   * Возвращает значения для отображения
   */
  getDisplayValues() {
    if (this.values.length > 0) {
      return this.values;
    }

    // Значения по умолчанию
    const quarter = this.min + (this.max - this.min) * 0.25;
    const threeQuarters = this.min + (this.max - this.min) * 0.75;
    return [quarter, threeQuarters];
  }

  /**
   * Генерирует HTML для бегунков
   */
  generateThumbsHTML(values) {
    const roundedValues = values.map((value) => this.roundValue(value));

    return roundedValues
      .map((value, index) => {
        const percent = valueToPercent(value, this.min, this.max);
        const isDisabled = this.isDisabled ? "disabled" : "";

        return `
                <div class="thumb ${isDisabled}" 
                     data-index="${index}" 
                     style="left: ${percent}%"
                     tabindex="${this.isDisabled ? "-1" : "0"}"
                     role="slider"
                     aria-valuemin="${this.min}"
                     aria-valuemax="${this.max}"
                     aria-valuenow="${value}"
                     aria-label="Слайдер ${index + 1}"
                     part="thumb">
                    <div class="value" part="value">${value.toFixed(
                      this.precision
                    )}</div>
                </div>
            `;
      })
      .join("");
  }

  /**
   * Округляет значение
   */
  roundValue(value) {
    return roundValue(value, {
      min: this.min,
      step: this.step,
      precision: this.precision,
    });
  }

  /**
   * Создает скрытые поля ввода
   */
  createHiddenInputs() {
    const values = this.getCurrentValues();
    this.inputManager.createInputs(values);
  }

  /**
   * Обновляет диапазон между бегунками
   */
  updateRange() {
    const range = this.shadowRoot.querySelector(".range");
    const thumbs = Array.from(this.shadowRoot.querySelectorAll(".thumb"));

    if (thumbs.length < 2) return;

    const sortedValues = thumbs
      .map((thumb) => {
        const percent = parseFloat(thumb.style.left);
        return percentToValue(percent, this.min, this.max);
      })
      .sort((a, b) => a - b);

    const leftPercent = valueToPercent(sortedValues[0], this.min, this.max);
    const rightPercent = valueToPercent(
      sortedValues[sortedValues.length - 1],
      this.min,
      this.max
    );

    range.style.left = `${leftPercent}%`;
    range.style.width = `${rightPercent - leftPercent}%`;
  }

  /**
   * Перемещает бегунок
   */
  moveThumb(clientX) {
    if (this.isDisabled) return;

    const rect = this.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;

    this.updateThumbPosition(this.activeThumb, percent);
    this.updateRange();
    this.dispatchInputEvent();
  }

  /**
   * Обновляет позицию бегунка
   */
  updateThumbPosition(thumb, percent) {
    const rawValue = percentToValue(percent, this.min, this.max);
    const steppedValue = this.roundValue(rawValue);
    const steppedPercent = valueToPercent(steppedValue, this.min, this.max);

    thumb.style.left = `${steppedPercent}%`;
    thumb.querySelector(".value").textContent = steppedValue.toFixed(
      this.precision
    );
    thumb.setAttribute("aria-valuenow", steppedValue);
  }

  /**
   * Устанавливает конкретное значение бегунка
   */
  setThumbValue(index, value) {
    if (this.isDisabled) return;

    const thumb = this.shadowRoot.querySelector(
      `.thumb[data-index="${index}"]`
    );
    if (!thumb) return;

    const clampedValue = Math.max(this.min, Math.min(this.max, value));
    const roundedValue = this.roundValue(clampedValue);
    const percent = valueToPercent(roundedValue, this.min, this.max);

    this.updateThumbPosition(thumb, percent);
    this.updateRange();
    this.dispatchChangeEvent();
  }

  /**
   * Диспатчит событие input
   */
  dispatchInputEvent() {
    // Используем throttling для события input
    if (!this.inputThrottle) {
      this.inputThrottle = setTimeout(() => {
        const values = this.getCurrentValues();
        this.inputManager.updateValues(values);

        this.dispatchEvent(
          new CustomEvent("input", {
            detail: { values },
            bubbles: true,
            composed: true,
          })
        );

        this.inputThrottle = null;
      }, 50); // 20 FPS для события input
    }
  }

  /**
   * Диспатчит событие change
   */
  dispatchChangeEvent() {
    const values = this.getCurrentValues();
    this.inputManager.updateValues(values);

    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { values },
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Возвращает текущие значения слайдера
   */
  getCurrentValues() {
    const thumbs = Array.from(this.shadowRoot.querySelectorAll(".thumb"));

    return thumbs.map((thumb) => {
      const percent = parseFloat(thumb.style.left);
      const rawValue = percentToValue(percent, this.min, this.max);
      return this.roundValue(rawValue);
    });
  }

  /**
   * Устанавливает новые значения
   */
  setValues(newValues) {
    if (this.isDisabled) return;

    this.values = newValues.map((value) => this.roundValue(value));
    this.render();
    this.createHiddenInputs();
    this.dispatchChangeEvent();
  }

  /**
   * Добавляет новый бегунок
   */
  addThumb(value = null) {
    if (this.isDisabled) return;

    const newValue = value !== null ? value : (this.min + this.max) / 2;
    const roundedValue = this.roundValue(newValue);

    this.values.push(roundedValue);
    this.render();
    this.createHiddenInputs();
    this.dispatchChangeEvent();

    return this.values.length - 1; // Возвращаем индекс нового бегунка
  }

  /**
   * Удаляет бегунок по индексу
   */
  removeThumb(index) {
    if (this.isDisabled || index < 0 || index >= this.values.length) return;

    this.values.splice(index, 1);
    this.render();
    this.createHiddenInputs();
    this.dispatchChangeEvent();

    return true;
  }

  /**
   * Обновляет доступность компонента
   */
  updateAccessibility() {
    const thumbs = Array.from(this.shadowRoot.querySelectorAll(".thumb"));
    thumbs.forEach((thumb) => {
      thumb.tabIndex = this.isDisabled ? "-1" : "0";
      thumb.classList.toggle("disabled", this.isDisabled);
    });
  }

  /**
   * Рендерит fallback для старых браузеров
   */
  renderFallback() {
    this.innerHTML = `
            <div style="padding: 20px; background: #f0f0f0; border-radius: 4px;">
                <p style="margin: 0; color: #333;">
                    Ваш браузер не поддерживает этот компонент.<br>
                    Пожалуйста, обновите браузер.
                </p>
            </div>
        `;
  }

  /**
   * Публичные методы для API компонента
   */
  enable() {
    this.disabled = false;
    this.removeAttribute("disabled");
    this.updateAccessibility();
  }

  disable() {
    this.disabled = true;
    this.setAttribute("disabled", "");
    this.updateAccessibility();
  }

  reset() {
    this.values = this.getAttribute("values")
      ? this.getAttribute("values").split(",").map(Number)
      : DEFAULT_CONFIG.VALUES;
    this.render();
    this.createHiddenInputs();
    this.dispatchChangeEvent();
  }
}

// Авторегистрация компонента при загрузке модуля
if (!customElements.get("zh-mr-slider")) {
  customElements.define("zh-mr-slider", MultipleRangeSlider);
}
