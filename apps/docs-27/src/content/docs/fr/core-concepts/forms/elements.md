---
title: "Éléments de formulaire XOOPS"
---

## Aperçu

XOOPS fournit un ensemble complet d'éléments de formulaire via sa hiérarchie de classe `XoopsFormElement`. Ces éléments gèrent le rendu, la validation et le traitement des données pour les formulaires web.

## Hiérarchie des éléments de formulaire

```mermaid
classDiagram
    class XoopsFormElement {
        +getName()
        +getCaption()
        +render()
        +setValue()
        +getValue()
    }

    XoopsFormElement <|-- XoopsFormText
    XoopsFormElement <|-- XoopsFormTextArea
    XoopsFormElement <|-- XoopsFormSelect
    XoopsFormElement <|-- XoopsFormCheckBox
    XoopsFormElement <|-- XoopsFormRadio
    XoopsFormElement <|-- XoopsFormButton
    XoopsFormElement <|-- XoopsFormHidden
    XoopsFormElement <|-- XoopsFormFile
    XoopsFormElement <|-- XoopsFormLabel
    XoopsFormElement <|-- XoopsFormPassword
    XoopsFormElement <|-- XoopsFormDateTime
```

## Éléments d'entrée de texte

### XoopsFormText

Entrée de texte sur une seule ligne :

```php
use XoopsFormText;

$element = new XoopsFormText(
    caption: 'Username',
    name: 'username',
    size: 30,
    maxlength: 50,
    value: $currentValue
);
```

### XoopsFormPassword

Entrée de mot de passe avec masquage :

```php
use XoopsFormPassword;

$element = new XoopsFormPassword(
    caption: 'Password',
    name: 'password',
    size: 30,
    maxlength: 100
);
```

### XoopsFormTextArea

Entrée de texte multi-ligne :

```php
use XoopsFormTextArea;

$element = new XoopsFormTextArea(
    caption: 'Description',
    name: 'description',
    value: $currentValue,
    rows: 5,
    cols: 50
);
```

## Éléments de sélection

### XoopsFormSelect

Sélection de liste déroulante :

```php
use XoopsFormSelect;

$element = new XoopsFormSelect(
    caption: 'Category',
    name: 'category_id',
    value: $selected,
    size: 1,
    multiple: false
);

$element->addOption(1, 'Category 1');
$element->addOption(2, 'Category 2');
$element->addOptionArray([
    3 => 'Category 3',
    4 => 'Category 4'
]);
```

### XoopsFormCheckBox

Entrée de case à cocher :

```php
use XoopsFormCheckBox;

$element = new XoopsFormCheckBox(
    caption: 'Features',
    name: 'features',
    value: $selected
);

$element->addOption('comments', 'Enable Comments');
$element->addOption('ratings', 'Enable Ratings');
```

### XoopsFormRadio

Groupe de boutons radio :

```php
use XoopsFormRadio;

$element = new XoopsFormRadio(
    caption: 'Status',
    name: 'status',
    value: $currentValue
);

$element->addOption('draft', 'Draft');
$element->addOption('published', 'Published');
$element->addOption('archived', 'Archived');
```

## Envoi de fichier

### XoopsFormFile

Entrée d'envoi de fichier :

```php
use XoopsFormFile;

$element = new XoopsFormFile(
    caption: 'Upload Image',
    name: 'image'
);

$element->setMaxFileSize(2 * 1024 * 1024); // 2MB
```

## Date et heure

### XoopsFormDateTime

Sélecteur de date/heure :

```php
use XoopsFormDateTime;

$element = new XoopsFormDateTime(
    caption: 'Publish Date',
    name: 'publish_date',
    size: 15,
    value: time()
);
```

## Éléments spéciaux

### XoopsFormHidden

Champ caché :

```php
use XoopsFormHidden;

$element = new XoopsFormHidden('article_id', $articleId);
```

### XoopsFormLabel

Étiquette d'affichage uniquement :

```php
use XoopsFormLabel;

$element = new XoopsFormLabel(
    caption: 'Created By',
    value: $authorName
);
```

### XoopsFormButton

Boutons de formulaire :

```php
use XoopsFormButton;

// Submit button
$submit = new XoopsFormButton('', 'submit', 'Save', 'submit');

// Reset button
$reset = new XoopsFormButton('', 'reset', 'Reset', 'reset');
```

## Personnalisation des éléments

### Ajout de classes CSS

```php
$element->setExtra('class="form-control custom-class"');
```

### Ajout d'attributs personnalisés

```php
$element->setExtra('data-validate="required" placeholder="Enter text..."');
```

### Définition de la description

```php
$element->setDescription('Enter a unique username (3-20 characters)');
```

## Documentation associée

- Aperçu des formulaires
- Validation de formulaire
- Rendus personnalisés
