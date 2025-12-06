/**
 * Класс для управления скрытыми полями формы
 */

export class HiddenInputManager {
  constructor(sliderElement) {
    this.slider = sliderElement;
    this.inputs = [];
  }

  /**
   * Создает скрытые поля ввода
   */
  createInputs(values) {
    this.removeInputs();

    values.forEach((value, index) => {
      const input = this.createInput(value, index);
      this.slider.appendChild(input);
      this.inputs.push(input);
    });
  }

  /**
   * Создает одно скрытое поле
   */
  createInput(value, index) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = `${this.slider.name}[${index}]`;
    input.value = value;
    input.setAttribute("data-slider-input", "true");
    return input;
  }

  /**
   * Обновляет значения существующих полей
   */
  updateValues(values) {
    if (this.inputs.length !== values.length) {
      this.createInputs(values);
    } else {
      values.forEach((value, index) => {
        this.inputs[index].value = value;
      });
    }
  }

  /**
   * Удаляет все скрытые поля
   */
  removeInputs() {
    this.inputs.forEach((input) => {
      if (input.parentNode === this.slider) {
        this.slider.removeChild(input);
      }
    });
    this.inputs = [];
  }

  /**
   * Возвращает все значения полей
   */
  getValues() {
    return this.inputs.map((input) => parseFloat(input.value));
  }
}
