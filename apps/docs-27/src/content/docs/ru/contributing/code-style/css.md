---
title: "Рекомендации по CSS и SCSS"
description: "Стандарты кодирования CSS/SCSS XOOPS и лучшие практики"
---

> XOOPS следует современным стандартам CSS с предварительной обработкой SCSS, сосредоточиваясь на поддерживаемости и производительности.

---

## Обзор

Стандарты CSS XOOPS подчеркивают:

- **Предварительная обработка SCSS** для организации
- **Методология BEM** для именования
- **Адаптивный дизайн, ориентированный на мобильные устройства**
- **Доступность и семантический HTML**
- **Оптимизация производительности**

---

## Структура файлов

### Организация SCSS

```
styles/
├── abstracts/           # Переменные, миксины, функции
│   ├── _variables.scss
│   ├── _mixins.scss
│   └── _functions.scss
├── base/                # Сброс, типография, по умолчанию
│   ├── _reset.scss
│   ├── _typography.scss
│   └── _base.scss
├── components/          # Переиспользуемые компоненты
│   ├── _button.scss
│   ├── _form.scss
│   ├── _card.scss
│   └── _navigation.scss
├── layout/              # Макет страницы
│   ├── _header.scss
│   ├── _footer.scss
│   ├── _sidebar.scss
│   └── _container.scss
├── pages/               # Стили, специфичные для страницы
│   ├── _home.scss
│   ├── _dashboard.scss
│   └── _admin.scss
└── main.scss            # Импортируйте все файлы
```

### Наименование файлов

```scss
// Используйте нижний регистр с дефисами
_button.scss        // Компонент
_modal-dialog.scss  // Компонент из нескольких слов
_colors.scss        // Переменные
```

---

## Соглашения об именовании

### Методология BEM

BEM = Блок Элемент Модификатор

```scss
// Блок: Автономный компонент
.button { }

// Блок__Элемент: Дочерний элемент блока
.button__text { }
.button__icon { }

// Блок--Модификатор: Вариант блока
.button--primary { }
.button--disabled { }
.button--small { }

// Сложный пример
.card { }
.card__header { }
.card__body { }
.card__footer { }
.card--highlighted { }
.card--loading { }
```

### Лучшие практики именования

```scss
// ✅ Описательное именование BEM
.form-field { }
.form-field__label { }
.form-field__input { }
.form-field--disabled { }
.form-field--error { }

// ❌ Избегайте
.form-f { }                 // Слишком сокращено
.form_field { }             // Используйте дефисы, а не подчеркивания
.formField { }              // Не используйте camelCase
.form-field-2 { }           // Не используйте цифры для вариантов
.form-field.active { }      // Используйте модификаторы, а не классы
```

---

## Форматирование

### Базовая структура

```scss
.component {
  // 1. Позиционирование и макет
  display: flex;
  position: relative;
  top: 0;
  left: 0;

  // 2. Модель бокса
  width: 100%;
  height: auto;
  padding: 1rem;
  margin: 0.5rem;
  border: 1px solid;

  // 3. Типография
  font-size: 1rem;
  line-height: 1.5;
  color: #333;

  // 4. Визуальные эффекты
  background: #fff;
  border-radius: 4px;
  box-shadow: none;

  // 5. Анимации
  transition: all 0.3s ease;
}
```

### Интервал и отступы

```scss
// Используйте 2 пробела для отступа
.component {
  padding: 1rem;

  &__child {
    margin: 0.5rem;
  }
}

// Свойства на отдельных строках
.component {
  display: flex;        // ✅
  color: red;
  font-size: 1rem;
}

// ❌ Не компактируйте
.component { display: flex; color: red; }
```

### Селекторы

```scss
// Один селектор на строку
.button,
.button-group,
.button-list {
  // ...
}

// Не пропускайте строки между селекторами
// ✅
.component {
}

.component__element {
}

// ❌
.component {
}


.component__element {
}
```

---

## Переменные

### Именование переменных

```scss
// Используйте описательные имена
$color-primary: #0066cc;
$color-secondary: #666666;
$color-danger: #dc3545;

$font-base: 16px;
$font-size-small: 0.875rem;
$font-size-large: 1.25rem;

$spacing-unit: 0.5rem;
$spacing-small: 0.5rem;
$spacing-medium: 1rem;
$spacing-large: 2rem;

$border-radius-small: 2px;
$border-radius-medium: 4px;
$border-radius-large: 8px;

$transition-duration: 0.3s;
$transition-timing: ease-in-out;
```

### Организация переменных

```scss
// _variables.scss

// Цвета
$color-primary: #0066cc;
$color-secondary: #666666;

// Типография
$font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
$font-size-base: 1rem;
$line-height-base: 1.5;

// Интервал
$spacing-unit: 0.5rem;
$spacing-xs: $spacing-unit;
$spacing-sm: $spacing-unit * 2;
$spacing-md: $spacing-unit * 4;
$spacing-lg: $spacing-unit * 8;

// Точки разрыва
$breakpoint-sm: 576px;
$breakpoint-md: 768px;
$breakpoint-lg: 992px;
$breakpoint-xl: 1200px;
```

---

## Цвета

### Цветовая система

```scss
// Основная палитра
$color-primary: #0066cc;
$color-primary-dark: #004499;
$color-primary-light: #3399ff;

// Вторичная палитра
$color-secondary: #666666;
$color-secondary-dark: #333333;
$color-secondary-light: #999999;

// Семантические цвета
$color-success: #28a745;
$color-warning: #ffc107;
$color-danger: #dc3545;
$color-info: #17a2b8;

// Нейтральные цвета
$color-white: #ffffff;
$color-black: #000000;
$color-gray-100: #f8f9fa;
$color-gray-200: #e9ecef;
$color-gray-300: #dee2e6;
$color-gray-400: #ced4da;
$color-gray-500: #adb5bd;
$color-gray-600: #6c757d;
$color-gray-700: #495057;
$color-gray-800: #343a40;
$color-gray-900: #212529;

// Использование
.button {
  background-color: $color-primary;
  color: $color-white;

  &:hover {
    background-color: $color-primary-dark;
  }

  &--danger {
    background-color: $color-danger;
  }
}
```

---

## Типография

### Объявления шрифтов

```scss
// Определите переменные типографии
$font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
$font-family-monospace: 'Courier New', monospace;

// Размеры шрифтов
$font-size-base: 1rem;      // 16px
$font-size-small: 0.875rem; // 14px
$font-size-large: 1.25rem;  // 20px

$line-height-base: 1.5;
$line-height-tight: 1.25;
$line-height-loose: 1.75;

// Толщина шрифтов
$font-weight-light: 300;
$font-weight-normal: 400;
$font-weight-semibold: 600;
$font-weight-bold: 700;
```

### Иерархия заголовков

```scss
h1, .h1 {
  font-size: 2rem;
  line-height: 1.2;
  font-weight: $font-weight-bold;
  margin-bottom: $spacing-lg;
}

h2, .h2 {
  font-size: 1.5rem;
  line-height: 1.3;
  font-weight: $font-weight-bold;
  margin-bottom: $spacing-md;
}

h3, .h3 {
  font-size: 1.25rem;
  line-height: 1.4;
  font-weight: $font-weight-semibold;
  margin-bottom: $spacing-md;
}

p {
  font-size: $font-size-base;
  line-height: $line-height-base;
  margin-bottom: $spacing-md;
}

small {
  font-size: $font-size-small;
}
```

---

## Миксины

### Общие миксины

```scss
// Миксин для адаптивной точки разрыва
@mixin respond-to($breakpoint) {
  @if $breakpoint == 'sm' {
    @media (min-width: $breakpoint-sm) { @content; }
  } @else if $breakpoint == 'md' {
    @media (min-width: $breakpoint-md) { @content; }
  } @else if $breakpoint == 'lg' {
    @media (min-width: $breakpoint-lg) { @content; }
  } @else if $breakpoint == 'xl' {
    @media (min-width: $breakpoint-xl) { @content; }
  }
}

// Использование
.component {
  font-size: 0.875rem;

  @include respond-to('md') {
    font-size: 1rem;
  }

  @include respond-to('lg') {
    font-size: 1.125rem;
  }
}

// Миксин Flexbox
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

// Использование
.modal__overlay {
  @include flex-center;
  height: 100vh;
}

// Миксин обрезки текста
@mixin truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// Использование
.breadcrumb__item {
  @include truncate;
  max-width: 200px;
}

// Миксин Clearfix (устаревший)
@mixin clearfix {
  &::after {
    content: '';
    display: table;
    clear: both;
  }
}
```

---

## Адаптивный дизайн

### Подход, ориентированный на мобильные устройства

```scss
// Базовые стили (мобильные)
.component {
  font-size: 0.875rem;
  padding: $spacing-sm;
}

// Планшеты и выше
@include respond-to('md') {
  .component {
    font-size: 1rem;
    padding: $spacing-md;
  }
}

// Десктопы и выше
@include respond-to('lg') {
  .component {
    font-size: 1.125rem;
    padding: $spacing-lg;
  }
}
```

### Система точек разрыва

```scss
// Определите точки разрыва
$breakpoints: (
  'xs': 0,
  'sm': 576px,
  'md': 768px,
  'lg': 992px,
  'xl': 1200px,
  'xxl': 1400px,
);

// Гибкий миксин для любой точки разрыва
@mixin media($breakpoint) {
  $min-width: map-get($breakpoints, $breakpoint);
  @media (min-width: $min-width) {
    @content;
  }
}

// Использование
.component {
  width: 100%;

  @include media('md') {
    width: 50%;
  }

  @include media('lg') {
    width: 33.333%;
  }
}
```

---

## Компоненты

### Компонент кнопки

```scss
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-sm $spacing-md;
  border: 1px solid transparent;
  border-radius: $border-radius-medium;
  font-size: $font-size-base;
  font-weight: $font-weight-semibold;
  text-decoration: none;
  cursor: pointer;
  transition: all $transition-duration $transition-timing;

  &:hover {
    opacity: 0.9;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba($color-primary, 0.25);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  // Варианты
  &--primary {
    background-color: $color-primary;
    color: $color-white;

    &:hover {
      background-color: $color-primary-dark;
    }
  }

  &--secondary {
    background-color: $color-secondary;
    color: $color-white;
  }

  &--danger {
    background-color: $color-danger;
    color: $color-white;
  }

  &--small {
    padding: $spacing-xs $spacing-sm;
    font-size: $font-size-small;
  }

  &--large {
    padding: $spacing-md $spacing-lg;
    font-size: $font-size-large;
  }

  // Иконки
  &__icon {
    margin-right: 0.5em;

    &:last-child {
      margin-right: 0;
      margin-left: 0.5em;
    }
  }
}
```

### Компонент формы

```scss
.form-group {
  margin-bottom: $spacing-lg;
}

.form-field {
  display: flex;
  flex-direction: column;

  &__label {
    font-weight: $font-weight-semibold;
    margin-bottom: 0.5rem;
    color: $color-secondary-dark;
  }

  &__input,
  &__select,
  &__textarea {
    padding: $spacing-sm;
    border: 1px solid #ddd;
    border-radius: $border-radius-medium;
    font-size: $font-size-base;
    font-family: inherit;
    transition: border-color $transition-duration;

    &:focus {
      outline: none;
      border-color: $color-primary;
      box-shadow: 0 0 0 3px rgba($color-primary, 0.1);
    }

    &:disabled {
      background-color: #f5f5f5;
      cursor: not-allowed;
    }
  }

  &__help {
    font-size: $font-size-small;
    color: $color-gray-600;
    margin-top: 0.25rem;
  }

  &--error {
    .form-field__input,
    .form-field__select {
      border-color: $color-danger;

      &:focus {
        box-shadow: 0 0 0 3px rgba($color-danger, 0.1);
      }
    }

    .form-field__error {
      color: $color-danger;
      font-size: $font-size-small;
      margin-top: 0.25rem;
    }
  }

  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}
```

---

## Лучшие практики

### Делайте

- Используйте переменные SCSS для цветов, интервалов, шрифтов
- Следуйте соглашению об именовании BEM
- Адаптивный дизайн, ориентированный на мобильные устройства
- Организуйте файлы по назначению
- Пишите переиспользуемые миксины
- Держите селекторы простыми (максимум 3 уровня глубины)
- Используйте семантический HTML
- Минимизируйте специфичность
- Комментируйте сложные разделы

### Не делайте

- Не используйте встроенные стили
- Не используйте !important (почти никогда)
- Не создавайте чрезмерно специфичные селекторы
- Не используйте селекторы ID для стилизации
- Не вложите слишком глубоко (максимум 3-4 уровня)
- Не используйте px для размеров шрифтов (используйте rem)
- Не создавайте волшебные числа (используйте переменные)
- Не оставляйте неиспользуемый CSS
- Не забывайте о доступности

---

## Доступность

### Контрастность цвета

```scss
// Обеспечьте достаточный контраст
// Уровень AA: 4.5:1 для обычного текста
// Уровень AAA: 7:1 для обычного текста

.button--primary {
  background-color: $color-primary; // #0066cc
  color: $color-white;               // #ffffff
  // Коэффициент контрастности: 8.6:1 ✅
}

.button--secondary {
  background-color: $color-gray-300; // #dee2e6
  color: $color-black;               // #000000
  // Коэффициент контрастности: 9.3:1 ✅
}
```

### Состояния фокуса

```scss
// Всегда предоставляйте стили фокуса
.button:focus,
.form-field__input:focus {
  outline: 3px solid $color-primary;
  outline-offset: 2px;
}
```

### Семантический HTML с CSS

```scss
// Используйте надлежащую семантическую структуру
main {
  padding: $spacing-lg;
}

article {
  margin-bottom: $spacing-xl;
  border-bottom: 1px solid #eee;
  padding-bottom: $spacing-xl;
}

header {
  background-color: #f5f5f5;
  padding: $spacing-md;
}

nav {
  display: flex;
  gap: $spacing-md;
}
```

---

## Производительность

### Оптимизируйте селекторы

```scss
// ✅ Эффективно
.button {
  // ...
}

.button--primary {
  // ...
}

// ❌ Неэффективно (слишком специфично, глубокое вложение)
div.container section.content article .button {
  // ...
}
```

### Минимизируйте перекрашивание

```scss
// Группируйте анимации
.component {
  // Измените несколько свойств одновременно
  transition: background-color 0.3s, color 0.3s, border-color 0.3s;
}

// Или используйте сокращение
.component {
  transition: all 0.3s ease;
}
```

---

## Инструменты

### Конфигурация Stylelint

```json
{
  "extends": "stylelint-config-standard-scss",
  "rules": {
    "indentation": 2,
    "string-quotes": "single",
    "color-hex-length": "short",
    "selector-pseudo-class-no-unknown": null,
    "scss/dollar-variable-pattern": "^[a-z]"
  }
}
```

---

## Связанная документация

- Стандарты JavaScript
- Кодекс поведения
- Рабочий процесс участия
- Стандарты PHP

---

#xoops #css #scss #styling #coding-standards #best-practices
