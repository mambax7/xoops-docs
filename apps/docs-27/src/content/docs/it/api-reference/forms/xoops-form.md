---
title: "Riferimento API XoopsForm"
description: "Riferimento API completo per le classi XoopsForm e elementi form"
---

> Documentazione API completa per il sistema di generazione form XOOPS.

---

## Gerarchia Classi

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

## XoopsForm (Base Astratto)

### Costruttore

```php
public function __construct(
    string $title,      // Titolo form
    string $name,       // Attributo name form
    string $action,     // URL action form
    string $method = 'post',  // Metodo HTTP
    bool $addToken = false    // Aggiungi token CSRF
)
```

### Metodi

| Metodo | Parametri | Restituisce | Descrizione |
|--------|------------|---------|-------------|
| `addElement` | `XoopsFormElement $element, bool $required = false` | `void` | Aggiungi elemento al form |
| `getElements` | - | `array` | Ottieni tutti gli elementi |
| `getElement` | `string $name` | `XoopsFormElement\|null` | Ottieni elemento per nome |
| `setExtra` | `string $extra` | `void` | Imposta attributi HTML extra |
| `getExtra` | - | `string` | Ottieni attributi extra |
| `getTitle` | - | `string` | Ottieni titolo form |
| `setTitle` | `string $title` | `void` | Imposta titolo form |
| `getName` | - | `string` | Ottieni nome form |
| `getAction` | - | `string` | Ottieni URL action |
| `render` | - | `string` | Render HTML form |
| `display` | - | `void` | Echo form renderizzato |
| `insertBreak` | `string $extra = ''` | `void` | Inserisci pausa visuale |
| `setRequired` | `XoopsFormElement $element` | `void` | Contrassegna elemento obbligatorio |

---

## XoopsThemeForm

La classe form più comunemente usata, renderizza con styling consapevole del tema.

### Utilizzo

```php
<?php
$form = new XoopsThemeForm(
    'Registrazione Utente',
    'registration_form',
    'register.php',
    'post',
    true  // Includi token CSRF
);

$form->addElement(new XoopsFormText('Nome Utente', 'uname', 25, 255, ''), true);
$form->addElement(new XoopsFormPassword('Password', 'pass', 25, 255), true);
$form->addElement(new XoopsFormButton('', 'submit', _SUBMIT, 'submit'));

echo $form->render();
```

### Output Renderizzato

```html
<form name="registration_form" action="register.php" method="post"
      enctype="application/x-www-form-urlencoded">
  <table class="outer" cellspacing="1">
    <tr><th colspan="2">Registrazione Utente</th></tr>
    <tr class="odd">
      <td class="head">Nome Utente <span class="required">*</span></td>
      <td class="even">
        <input type="text" name="uname" size="25" maxlength="255" value="">
      </td>
    </tr>
    <!-- ... altri campi ... -->
  </table>
  <input type="hidden" name="XOOPS_TOKEN_REQUEST" value="...">
</form>
```

---

## Elementi Form

### XoopsFormText

Input testo a riga singola.

```php
$text = new XoopsFormText(
    string $caption,    // Testo label
    string $name,       // Nome input
    int $size,          // Larghezza display
    int $maxlength,     // Max caratteri
    mixed $value = ''   // Valore default
);

// Metodi
$text->getValue();
$text->setValue($value);
$text->getSize();
$text->getMaxlength();
```

### XoopsFormTextArea

Input testo multilinea.

```php
$textarea = new XoopsFormTextArea(
    string $caption,
    string $name,
    mixed $value = '',
    int $rows = 5,
    int $cols = 50
);

// Metodi
$textarea->getRows();
$textarea->getCols();
```

### XoopsFormSelect

Dropdown o multi-select.

```php
$select = new XoopsFormSelect(
    string $caption,
    string $name,
    mixed $value = null,
    int $size = 1,        // 1 = dropdown, >1 = listbox
    bool $multiple = false
);

// Metodi
$select->addOption(mixed $value, string $name = '');
$select->addOptionArray(array $options);
$select->getOptions();
$select->getValue();
$select->isMultiple();
```

### XoopsFormCheckBox

Checkbox o gruppo checkbox.

```php
$checkbox = new XoopsFormCheckBox(
    string $caption,
    string $name,
    mixed $value = null,
    string $delimeter = '&nbsp;'
);

// Metodi
$checkbox->addOption(mixed $value, string $name = '');
$checkbox->addOptionArray(array $options);
$checkbox->getValue();
```

### XoopsFormRadio

Gruppo pulsante radio.

```php
$radio = new XoopsFormRadio(
    string $caption,
    string $name,
    mixed $value = null,
    string $delimeter = '&nbsp;'
);

// Metodi
$radio->addOption(mixed $value, string $name = '');
$radio->addOptionArray(array $options);
```

### XoopsFormButton

Pulsante submit, reset o personalizzato.

```php
$button = new XoopsFormButton(
    string $caption,
    string $name,
    string $value = '',
    string $type = 'button'  // 'submit', 'reset', 'button'
);
```

### XoopsFormFile

Input upload file.

```php
$file = new XoopsFormFile(
    string $caption,
    string $name,
    int $maxFileSize = 0
);

// Metodi
$file->getMaxFileSize();
$file->setMaxFileSize(int $size);
```

### XoopsFormHidden

Campo input nascosto.

```php
$hidden = new XoopsFormHidden(
    string $name,
    mixed $value
);
```

### XoopsFormHiddenToken

Token protezione CSRF.

```php
$token = new XoopsFormHiddenToken(
    string $name = 'XOOPS_TOKEN_REQUEST'
);
```

### XoopsFormLabel

Etichetta display (non un input).

```php
$label = new XoopsFormLabel(
    string $caption,
    string $value
);
```

### XoopsFormPassword

Campo input password.

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

Raggruppa più elementi insieme.

```php
$tray = new XoopsFormElementTray(
    string $caption,
    string $delimeter = '&nbsp;'
);

// Metodi
$tray->addElement(XoopsFormElement $element, bool $required = false);
$tray->getElements();
```

---

## Flusso Form

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Form
    participant Security
    participant Handler
    participant Database

    User->>Browser: Compila form
    Browser->>Form: Submit POST
    Form->>Security: Valida token CSRF

    alt Token Non Valido
        Security-->>Browser: Errore: Token non valido
        Browser-->>User: Mostra errore
    else Token Valido
        Security->>Handler: Processa dati
        Handler->>Handler: Valida input

        alt Validazione Fallita
            Handler-->>Browser: Mostra form con errori
            Browser-->>User: Visualizza errori
        else Validazione Riuscita
            Handler->>Database: Salva dati
            Database-->>Handler: Successo
            Handler-->>Browser: Redirect
            Browser-->>User: Messaggio successo
        end
    end
```

---

## Esempio Completo

```php
<?php
require_once __DIR__ . '/mainfile.php';

use Xmf\Request;

$helper = \XoopsModules\MyModule\Helper::getInstance();
$itemHandler = $helper->getHandler('Item');

// Processa invio form
if (Request::hasVar('submit', 'POST')) {
    // Verifica token CSRF
    if (!$GLOBALS['xoopsSecurity']->check()) {
        redirect_header('form.php', 3, implode('<br>', $GLOBALS['xoopsSecurity']->getErrors()));
    }

    // Ottieni input validato
    $title = Request::getString('title', '', 'POST');
    $content = Request::getText('content', '', 'POST');
    $categoryId = Request::getInt('category_id', 0, 'POST');
    $status = Request::getString('status', 'draft', 'POST');

    // Crea e popola oggetto
    $item = $itemHandler->create();
    $item->setVars([
        'title' => $title,
        'content' => $content,
        'category_id' => $categoryId,
        'status' => $status,
        'created' => time(),
        'uid' => $GLOBALS['xoopsUser']->getVar('uid')
    ]);

    // Salva
    if ($itemHandler->insert($item)) {
        redirect_header('index.php', 2, _MD_MYMODULE_SAVED);
    } else {
        $error = _MD_MYMODULE_ERROR_SAVING;
    }
}

// Costruisci form
$form = new XoopsThemeForm(_MD_MYMODULE_ADD_ITEM, 'itemform', 'form.php', 'post', true);

// Campo titolo
$titleElement = new XoopsFormText(_MD_MYMODULE_TITLE, 'title', 50, 255, $title ?? '');
$titleElement->setDescription(_MD_MYMODULE_TITLE_DESC);
$form->addElement($titleElement, true);

// Dropdown categoria
$categoryHandler = $helper->getHandler('Category');
$categories = $categoryHandler->getList();
$categorySelect = new XoopsFormSelect(_MD_MYMODULE_CATEGORY, 'category_id', $categoryId ?? 0);
$categorySelect->addOptionArray($categories);
$form->addElement($categorySelect, true);

// Textarea contenuto con editor
$editorConfigs = [
    'name' => 'content',
    'value' => $content ?? '',
    'rows' => 15,
    'cols' => 60,
    'width' => '100%',
    'height' => '400px',
];
$form->addElement(new XoopsFormEditor(_MD_MYMODULE_CONTENT, 'content', $editorConfigs));

// Pulsanti radio stato
$statusRadio = new XoopsFormRadio(_MD_MYMODULE_STATUS, 'status', $status ?? 'draft');
$statusRadio->addOptionArray([
    'draft' => _MD_MYMODULE_DRAFT,
    'published' => _MD_MYMODULE_PUBLISHED,
    'archived' => _MD_MYMODULE_ARCHIVED
]);
$form->addElement($statusRadio);

// Pulsante submit
$buttonTray = new XoopsFormElementTray('', '&nbsp;');
$buttonTray->addElement(new XoopsFormButton('', 'submit', _SUBMIT, 'submit'));
$buttonTray->addElement(new XoopsFormButton('', 'reset', _CANCEL, 'reset'));
$form->addElement($buttonTray);

// Visualizza
require_once XOOPS_ROOT_PATH . '/header.php';

if (!empty($error)) {
    echo "<div class='errorMsg'>$error</div>";
}

$form->display();

require_once XOOPS_ROOT_PATH . '/footer.php';
```

---

## Documentazione Correlata

- API XoopsObject
- Guida Form
- Protezione CSRF

---

#xoops #api #forms #xoopsform #reference
