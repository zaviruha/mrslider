# Multiple Range Slider Web Component

Кастомный Web Component для создания слайдера с несколькими бегунками.

## Установка

### Вариант 1: Использование через CDN

```html
<script type="module">
  import { MultipleRangeSlider } from "https://cdn.jsdelivr.net/gh/zaviruha/mrslider@master/src/MultipleRangeSlider.js";
</script>
```

### Вариант 2: Локальная установка

1. Скопируйте папку src/components/ в ваш проект
2. Подключите компонент:

```html
<script type="module" src="./src/MultipleRangeSlider.js"></script>
```

## Использование

### Базовый пример

```html
<zh-mr-slider
  min="0"
  max="100"
  values="20,50,80"
  name="range"
  precision="2"
  step="2.2"
></zh-mr-slider>
```

### Атрибуты

- min - минимальное значение (по умолчанию: 0)
- max - максимальное значение (по умолчанию: 100)
- values - начальные значения (через запятую)
- name - имя для полей формы
- precision - точность округления
- step - шаг изменения значений
- disabled - отключение компонента

### CSS Custom Properties

```css
zh-mr-slider {
  --range-color: #ff6b6b;
  --thumb-border-color: #ff6b6b;
  --track-height: 8px;
  --thumb-size: 24px;
}
```

### JavaScript API

```javascript
const slider = document.querySelector("zh-mr-slider");

// Получить текущие значения
const values = slider.currentValues;

// Установить новые значения
slider.setValues([10, 30, 70]);

// Добавить бегунок
slider.addThumb(50);

// Удалить бегунок
slider.removeThumb(0);

// Включить/отключить
slider.enable();
slider.disable();

// Сбросить к начальным значениям
slider.reset();
```

### События

- input - при изменении значения
- change - при окончании изменения

```javascript
slider.addEventListener("change", (e) => {
  console.log("Значения:", e.detail.values);
});
```

### Совместимость

- Современные браузеры с поддержкой Web Components
- Полифилы не требуются
