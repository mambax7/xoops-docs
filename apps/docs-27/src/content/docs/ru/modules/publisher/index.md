---
title: "Модуль Publisher"
description: "Полная документация модуля Publisher для новостей и блога XOOPS"
---

> Первоклассный модуль публикации новостей и блогов для XOOPS CMS.

---

## Обзор

Publisher - это определяющий модуль управления контентом для XOOPS, эволюционировавший из SmartSection, чтобы стать наиболее функциональным решением для блога и новостей. Он предоставляет комплексные инструменты для создания, организации и публикации контента с полной поддержкой редакционного рабочего процесса.

**Требования:**
- XOOPS 2.5.10+
- PHP 7.1+ (рекомендуется PHP 8.x)

---

## Ключевые особенности

### Управление контентом
- **Категории и подкатегории** - Иерархическая организация контента
- **Редактирование с форматированием** - Поддерживаются множество редакторов WYSIWYG
- **Вложенные файлы** - Прикрепляйте файлы к статьям
- **Управление изображениями** - Изображения страницы и категории
- **Обертывание файлов** - Оборачивайте файлы как статьи

### Рабочий процесс публикации
- **Запланированная публикация** - Установите будущие даты публикации
- **Даты истечения** - Автоматическое истечение контента
- **Модерация** - Редакционный рабочий процесс одобрения
- **Управление черновиками** - Сохраняйте незаконченную работу

### Отображение и шаблоны
- **Четыре базовых шаблона** - Множество макетов отображения
- **Пользовательские шаблоны** - Создавайте свои собственные проекты
- **Оптимизация SEO** - Понятные для поисковых систем URL
- **Адаптивный дизайн** - Вывод для мобильных устройств

### Взаимодействие с пользователем
- **Рейтинги** - Система оценки статей
- **Комментарии** - Обсуждения читателей
- **Социальный обмен** - Поделитесь в социальных сетях

### Разрешения
- **Контроль отправки** - Кто может отправлять статьи
- **Разрешения на уровне полей** - Контролируйте поля формы по группам
- **Разрешения по категориям** - Контроль доступа по категориям
- **Права модерации** - Глобальные параметры модерации

---

## Содержание раздела

### Руководство пользователя
- Installation Guide
- Basic Configuration
- Creating Articles
- Managing Categories
- Setting Up Permissions

### Руководство разработчика
- Extending Publisher
- Creating Custom Templates
- API Reference
- Hooks and Events

---

## Быстрый старт

### 1. Установка

```bash
# Download from GitHub
git clone https://github.com/XoopsModules25x/publisher.git

# Copy to modules directory
cp -r publisher /path/to/xoops/htdocs/modules/
```

Затем установите через XOOPS Admin → Modules → Install.

### 2. Создайте свою первую категорию

1. Перейдите в **Admin → Publisher → Categories**
2. Нажмите **Add Category**
3. Заполните:
   - **Name**: News
   - **Description**: Latest news and updates
   - **Image**: Upload category image
4. Сохраните

### 3. Создайте вашу первую статью

1. Перейдите в **Admin → Publisher → Articles**
2. Нажмите **Add Article**
3. Заполните:
   - **Title**: Welcome to Our Site
   - **Category**: News
   - **Content**: Your article content
4. Установите **Status**: Published
5. Сохраните

---

## Параметры конфигурации

### Общие параметры

| Параметр | Описание | По умолчанию |
|---------|-------------|---------|
| Editor | Редактор WYSIWYG для использования | XOOPS Default |
| Items per page | Статьи показаны на странице | 10 |
| Show breadcrumb | Отображать навигационный путь | Да |
| Allow ratings | Включить рейтинги статей | Да |
| Allow comments | Включить комментарии статей | Да |

### Параметры SEO

| Параметр | Описание | По умолчанию |
|---------|-------------|---------|
| SEO URLs | Включить понятные URL | Нет |
| URL rewriting | Apache mod_rewrite | None |
| Meta keywords | Автоматическое создание ключевых слов | Да |

### Матрица разрешений

| Разрешение | Анонимный | Зарегистрированный | Редактор | Администратор |
|------------|-----------|------------|--------|-------|
| Просмотр статей | ✓ | ✓ | ✓ | ✓ |
| Отправка статей | ✗ | ✓ | ✓ | ✓ |
| Редактирование собственных статей | ✗ | ✓ | ✓ | ✓ |
| Редактирование всех статей | ✗ | ✗ | ✓ | ✓ |
| Одобрение статей | ✗ | ✗ | ✓ | ✓ |
| Управление категориями | ✗ | ✗ | ✗ | ✓ |

---

## Структура модуля

```
modules/publisher/
├── admin/                  # Admin interface
│   ├── index.php
│   ├── category.php
│   ├── item.php
│   └── menu.php
├── class/                  # PHP classes
│   ├── Category.php
│   ├── CategoryHandler.php
│   ├── Item.php
│   ├── ItemHandler.php
│   └── Helper.php
├── include/                # Include files
│   ├── common.php
│   └── functions.php
├── templates/              # Smarty templates
│   ├── publisher_index.tpl
│   ├── publisher_item.tpl
│   └── publisher_category.tpl
├── language/               # Translations
│   └── english/
├── sql/                    # Database schema
│   └── mysql.sql
├── xoops_version.php       # Module info
└── index.php               # Module entry
```

---

## Миграция

### Из SmartSection

Publisher включает встроенный инструмент миграции:

1. Перейдите в **Admin → Publisher → Import**
2. Выберите **SmartSection** в качестве источника
3. Выберите параметры импорта:
   - Categories
   - Articles
   - Comments
4. Нажмите **Import**

### Из модуля News

1. Перейдите в **Admin → Publisher → Import**
2. Выберите **News** в качестве источника
3. Отобразите категории
4. Нажмите **Import**

---

## Связанная документация

- Module Development Guide
- Smarty Templating
- XMF Framework

---

## Ресурсы

- [GitHub Repository](https://github.com/XoopsModules25x/publisher)
- [Issue Tracker](https://github.com/XoopsModules25x/publisher/issues)
- [Original Tutorial](https://xoops.gitbook.io/publisher-tutorial/)

---

#xoops #publisher #module #blog #news #cms #content-management
