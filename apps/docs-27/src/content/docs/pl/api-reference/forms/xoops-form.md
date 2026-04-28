---
title: "Odniesienie API XoopsForm"
description: "Kompletne odniesienie API dla klas XoopsForm i elementów formularza"
---

> Kompletna dokumentacja API dla systemu generowania formularzy XOOPS.

---

## Hierarchia Klas

```mermaid
classDiagram
    class XoopsForm {
        <<abstract>>
        #string $title
        #string $name
        #string $action
        #string $method
        #array $elements
        #string $extra
        #bool $required
        +addElement(element, required)
        +getElements()
        +getElement(name)
        +setExtra(extra)
        +render()
        +display()
    }

    class XoopsThemeForm {
        +render()
    }

    class XoopsSimpleForm {
        +render()
    }

    class XoopsTableForm {
        +render()
    }

    XoopsForm <|-- XoopsThemeForm
    XoopsForm <|-- XoopsSimpleForm
    XoopsForm <|-- XoopsTableForm

    class XoopsFormElement {
        <<abstract>>
        #string $name
        #string $caption
        #string $description
        #string $extra
        #bool $required
        +getName()
        +getCaption()
        +setCaption(caption)
        +getDescription()
        +setDescription(desc)
        +isRequired()
        +setRequired(required)
        +render()
    }

    XoopsFormElement <|-- XoopsFormText
    XoopsFormElement <|-- XoopsFormTextArea
    XoopsFormElement <|-- XoopsFormSelect
    XoopsFormElement <|-- XoopsFormCheckBox
    XoopsFormElement <|-- XoopsFormRadio
    XoopsFormElement <|-- XoopsFormButton
    XoopsFormElement <|-- XoopsFormFile
    XoopsFormElement <|-- XoopsFormHidden
    XoopsFormElement <|-- XoopsFormLabel
    XoopsFormElement <|-- XoopsFormPassword
    XoopsFormElement <|-- XoopsFormElementTray
```

---

## XoopsForm (Abstrakcyjna Klasa Bazowa)

### Konstruktor

```php
public function __construct(
    string $title,      // Tytuł formularza
    string $name,       // Atrybut nazwy formularza
    string $action,     // URL akcji formularza
    string $method = 'post',  // Metoda HTTP
    bool $addToken = false    // Dodaj token CSRF
)
```

### Metody

| Metoda | Parametry | Zwraca | Opis |
|--------|-----------|--------|------|
| `addElement` | `XoopsFormElement $element, bool $required = false` | `void` | Dodaj element do formularza |
| `getElements` | - | `array` | Pobierz wszystkie elementy |
| `getElement` | `string $name` | `XoopsFormElement|null` | Pobierz element po nazwie |
| `setExtra` | `string $extra` | `void` | Ustaw dodatkowe atrybuty HTML |
| `getExtra` | - | `string` | Pobierz dodatkowe atrybuty |
| `getTitle` | - | `string` | Pobierz tytuł formularza |
| `setTitle` | `string $title` | `void` | Ustaw tytuł formularza |
| `getName` | - | `string` | Pobierz nazwę formularza |
| `getAction` | - | `string` | Pobierz URL akcji |
| `render` | - | `string` | Renderuj HTML formularza |
| `display` | - | `void` | Echo renderowanego formularza |
| `insertBreak` | `string $extra = ''` | `void` | Wstaw wizualny podział |
| `setRequired` | `XoopsFormElement $element` | `void` | Oznacz element jako wymagany |

---

## XoopsThemeForm

Najczęściej używana klasa formularza, renderuje się z motywem dostosowanym do stylu.

### Użycie

```php
<?php
$form = new XoopsThemeForm(
    'User Registration',
    'registration_form',
    'register.php',
    'post',
    true  // Dołącz token CSRF
);

$form->addElement(new XoopsFormText('Username', 'uname', 25, 255, ''), true);
$form->addElement(new XoopsFormPassword('Password', 'pass', 25, 255), true);
$form->addElement(new XoopsFormButton('', 'submit', _SUBMIT, 'submit'));

echo $form->render();
```

### Wyrenderowane Wyjście

```html
<form name="registration_form" action="register.php" method="post"
      enctype="application/x-www-form-urlencoded">
  <table class="outer" cellspacing="1">
    <tr><th colspan="2">User Registration</th></tr>
    <tr class="odd">
      <td class="head">Username <span class="required">*</span></td>
      <td class="even">
        <input type="text" name="uname" size="25" maxlength="255" value="">
      </td>
    </tr>
    <!-- ... więcej pól ... -->
  </table>
  <input type="hidden" name="XOOPS_TOKEN_REQUEST" value="...">
</form>
```

---

## Elementy Formularza

### XoopsFormText

Jednoliniowe wejście tekstowe.

```php
$text = new XoopsFormText(
    string $caption,    // Tekst etykiety
    string $name,       // Nazwa wejścia
    int $size,          // Szerokość wyświetlenia
    int $maxlength,     // Maksymalna liczba znaków
    mixed $value = ''   // Wartość domyślna
);

// Metody
$text->getValue();
$text->setValue($value);
$text->getSize();
$text->getMaxlength();
```

### XoopsFormTextArea

Wieloliniowe wejście tekstowe.

```php
$textarea = new XoopsFormTextArea(
    string $caption,
    string $name,
    mixed $value = '',
    int $rows = 5,
    int $cols = 50
);

// Metody
$textarea->getRows();
$textarea->getCols();
```

### XoopsFormSelect

Dropdown lub wielokrotny wybór.

```php
$select = new XoopsFormSelect(
    string $caption,
    string $name,
    mixed $value = null,
    int $size = 1,        // 1 = dropdown, >1 = listbox
    bool $multiple = false
);

// Metody
$select->addOption(mixed $value, string $name = '');
$select->addOptionArray(array $options);
$select->getOptions();
$select->getValue();
$select->isMultiple();
```

### XoopsFormCheckBox

Checkbox lub grupa checkboxów.

```php
$checkbox = new XoopsFormCheckBox(
    string $caption,
    string $name,
    mixed $value = null,
    string $delimeter = '&nbsp;'
);

// Metody
$checkbox->addOption(mixed $value, string $name = '');
$checkbox->addOptionArray(array $options);
$checkbox->getValue();
```

### XoopsFormRadio

Grupa przycisków radiowych.

```php
$radio = new XoopsFormRadio(
    string $caption,
    string $name,
    mixed $value = null,
    string $delimeter = '&nbsp;'
);

// Metody
$radio->addOption(mixed $value, string $name = '');
$radio->addOptionArray(array $options);
```

### XoopsFormButton

Przycisk Submit, reset lub niestandardowy.

```php
$button = new XoopsFormButton(
    string $caption,
    string $name,
    string $value = '',
    string $type = 'button'  // 'submit', 'reset', 'button'
);
```

### XoopsFormFile

Wejście przesyłania pliku.

```php
$file = new XoopsFormFile(
    string $caption,
    string $name,
    int $maxFileSize = 0
);

// Metody
$file->getMaxFileSize();
$file->setMaxFileSize(int $size);
```

### XoopsFormHidden

Ukryte pole wejścia.

```php
$hidden = new XoopsFormHidden(
    string $name,
    mixed $value
);
```

### XoopsFormHiddenToken

Token ochrony CSRF.

```php
$token = new XoopsFormHiddenToken(
    string $name = 'XOOPS_TOKEN_REQUEST'
);
```

### XoopsFormLabel

Etykieta tylko do wyświetlania (nie wejście).

```php
$label = new XoopsFormLabel(
    string $caption,
    string $value
);
```

### XoopsFormPassword

Pole wejścia hasła.

```php
$password = new XoopsFormPassword(
    string $caption,
    string $name,
    int $size,
    int $maxlength,
    mixed $value = ''
);
```

### XoopsFormElementTray

Grupuje wiele elementów razem.

```php
$tray = new XoopsFormElementTray(
    string $caption,
    string $delimeter = '&nbsp;'
);

// Metody
$tray->addElement(XoopsFormElement $element, bool $required = false);
$tray->getElements();
```

---

## Diagram Przepływu Formularza

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Form
    participant Security
    participant Handler
    participant Database

    User->>Browser: Wypełnij formularz
    Browser->>Form: Wyślij POST
    Form->>Security: Waliduj token CSRF

    alt Token Invalid
        Security-->>Browser: Error: Invalid token
        Browser-->>User: Pokaż błąd
    else Token Valid
        Security->>Handler: Przetwórz dane
        Handler->>Handler: Waliduj wejście

        alt Validation Failed
            Handler-->>Browser: Pokaż formularz z błędami
            Browser-->>User: Wyświetl błędy
        else Validation Passed
            Handler->>Database: Zapisz dane
            Database-->>Handler: Sukces
            Handler-->>Browser: Przekieruj
            Browser-->>User: Komunikat sukcesu
        end
    end
```

---

## Kompletny Przykład

```php
<?php
require_once __DIR__ . '/mainfile.php';

use Xmf\Request;

$helper = \XoopsModules\MyModule\Helper::getInstance();
$itemHandler = $helper->getHandler('Item');

// Przetwórz przesłanie formularza
if (Request::hasVar('submit', 'POST')) {
    // Zweryfikuj token CSRF
    if (!$GLOBALS['xoopsSecurity']->check()) {
        redirect_header('form.php', 3, implode('<br>', $GLOBALS['xoopsSecurity']->getErrors()));
    }

    // Pobierz zwalidowane wejście
    $title = Request::getString('title', '', 'POST');
    $content = Request::getText('content', '', 'POST');
    $categoryId = Request::getInt('category_id', 0, 'POST');
    $status = Request::getString('status', 'draft', 'POST');

    // Utwórz i wypełnij obiekt
    $item = $itemHandler->create();
    $item->setVars([
        'title' => $title,
        'content' => $content,
        'category_id' => $categoryId,
        'status' => $status,
        'created' => time(),
        'uid' => $GLOBALS['xoopsUser']->getVar('uid')
    ]);

    // Zapisz
    if ($itemHandler->insert($item)) {
        redirect_header('index.php', 2, _MD_MYMODULE_SAVED);
    } else {
        $error = _MD_MYMODULE_ERROR_SAVING;
    }
}

// Zbuduj formularz
$form = new XoopsThemeForm(_MD_MYMODULE_ADD_ITEM, 'itemform', 'form.php', 'post', true);

// Pole tytułu
$titleElement = new XoopsFormText(_MD_MYMODULE_TITLE, 'title', 50, 255, $title ?? '');
$titleElement->setDescription(_MD_MYMODULE_TITLE_DESC);
$form->addElement($titleElement, true);

// Rozwijany katalog
$categoryHandler = $helper->getHandler('Category');
$categories = $categoryHandler->getList();
$categorySelect = new XoopsFormSelect(_MD_MYMODULE_CATEGORY, 'category_id', $categoryId ?? 0);
$categorySelect->addOptionArray($categories);
$form->addElement($categorySelect, true);

// Textarea zawartości z edytorem
$editorConfigs = [
    'name' => 'content',
    'value' => $content ?? '',
    'rows' => 15,
    'cols' => 60,
    'width' => '100%',
    'height' => '400px',
];
$form->addElement(new XoopsFormEditor(_MD_MYMODULE_CONTENT, 'content', $editorConfigs));

// Przyciski radiowe statusu
$statusRadio = new XoopsFormRadio(_MD_MYMODULE_STATUS, 'status', $status ?? 'draft');
$statusRadio->addOptionArray([
    'draft' => _MD_MYMODULE_DRAFT,
    'published' => _MD_MYMODULE_PUBLISHED,
    'archived' => _MD_MYMODULE_ARCHIVED
]);
$form->addElement($statusRadio);

// Przycisk Submit
$buttonTray = new XoopsFormElementTray('', '&nbsp;');
$buttonTray->addElement(new XoopsFormButton('', 'submit', _SUBMIT, 'submit'));
$buttonTray->addElement(new XoopsFormButton('', 'reset', _CANCEL, 'reset'));
$form->addElement($buttonTray);

// Wyświetl
require_once XOOPS_ROOT_PATH . '/header.php';

if (!empty($error)) {
    echo "<div class='errorMsg'>$error</div>";
}

$form->display();

require_once XOOPS_ROOT_PATH . '/footer.php';
```

---

## Powiązana Dokumentacja

- XoopsObject API
- Przewodnik Formularzy
- Ochrona CSRF

---

#xoops #api #forms #xoopsform #reference
