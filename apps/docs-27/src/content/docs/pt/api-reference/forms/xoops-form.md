---
title: "Referência da API XoopsForm"
description: "Referência completa da API para classes XoopsForm e elementos de formulário"
---

> Documentação completa da API para o sistema de geração de formulários do XOOPS.

---

## Hierarquia de Classe

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

## XoopsForm (Base Abstrata)

### Construtor

```php
public function __construct(
    string $title,      // Título do formulário
    string $name,       // Atributo de nome do formulário
    string $action,     // URL de ação do formulário
    string $method = 'post',  // Método HTTP
    bool $addToken = false    // Adicionar token CSRF
)
```

### Métodos

| Método | Parâmetros | Retorna | Descrição |
|--------|------------|---------|-------------|
| `addElement` | `XoopsFormElement $element, bool $required = false` | `void` | Adicionar elemento ao formulário |
| `getElements` | - | `array` | Obter todos os elementos |
| `getElement` | `string $name` | `XoopsFormElement\|null` | Obter elemento pelo nome |
| `setExtra` | `string $extra` | `void` | Definir atributos HTML extras |
| `getExtra` | - | `string` | Obter atributos extras |
| `getTitle` | - | `string` | Obter título do formulário |
| `setTitle` | `string $title` | `void` | Definir título do formulário |
| `getName` | - | `string` | Obter nome do formulário |
| `getAction` | - | `string` | Obter URL de ação |
| `render` | - | `string` | Renderizar HTML do formulário |
| `display` | - | `void` | Ecoar formulário renderizado |
| `insertBreak` | `string $extra = ''` | `void` | Inserir quebra visual |
| `setRequired` | `XoopsFormElement $element` | `void` | Marcar elemento como obrigatório |

---

## XoopsThemeForm

A classe de formulário mais comumente usada, renderiza com estilo ciente do tema.

### Uso

```php
<?php
$form = new XoopsThemeForm(
    'User Registration',
    'registration_form',
    'register.php',
    'post',
    true  // Incluir token CSRF
);

$form->addElement(new XoopsFormText('Username', 'uname', 25, 255, ''), true);
$form->addElement(new XoopsFormPassword('Password', 'pass', 25, 255), true);
$form->addElement(new XoopsFormButton('', 'submit', _SUBMIT, 'submit'));

echo $form->render();
```

### Saída Renderizada

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
    <!-- ... mais campos ... -->
  </table>
  <input type="hidden" name="XOOPS_TOKEN_REQUEST" value="...">
</form>
```

---

## Elementos de Formulário

### XoopsFormText

Entrada de texto de linha única.

```php
$text = new XoopsFormText(
    string $caption,    // Texto do rótulo
    string $name,       // Nome da entrada
    int $size,          // Largura de exibição
    int $maxlength,     // Caracteres máximos
    mixed $value = ''   // Valor padrão
);

// Métodos
$text->getValue();
$text->setValue($value);
$text->getSize();
$text->getMaxlength();
```

### XoopsFormTextArea

Entrada de texto multi-linha.

```php
$textarea = new XoopsFormTextArea(
    string $caption,
    string $name,
    mixed $value = '',
    int $rows = 5,
    int $cols = 50
);

// Métodos
$textarea->getRows();
$textarea->getCols();
```

### XoopsFormSelect

Dropdown ou multi-select.

```php
$select = new XoopsFormSelect(
    string $caption,
    string $name,
    mixed $value = null,
    int $size = 1,        // 1 = dropdown, >1 = listbox
    bool $multiple = false
);

// Métodos
$select->addOption(mixed $value, string $name = '');
$select->addOptionArray(array $options);
$select->getOptions();
$select->getValue();
$select->isMultiple();
```

### XoopsFormCheckBox

Checkbox ou grupo de checkboxes.

```php
$checkbox = new XoopsFormCheckBox(
    string $caption,
    string $name,
    mixed $value = null,
    string $delimeter = '&nbsp;'
);

// Métodos
$checkbox->addOption(mixed $value, string $name = '');
$checkbox->addOptionArray(array $options);
$checkbox->getValue();
```

### XoopsFormRadio

Grupo de botões de rádio.

```php
$radio = new XoopsFormRadio(
    string $caption,
    string $name,
    mixed $value = null,
    string $delimeter = '&nbsp;'
);

// Métodos
$radio->addOption(mixed $value, string $name = '');
$radio->addOptionArray(array $options);
```

### XoopsFormButton

Botão de envio, reset ou personalizado.

```php
$button = new XoopsFormButton(
    string $caption,
    string $name,
    string $value = '',
    string $type = 'button'  // 'submit', 'reset', 'button'
);
```

### XoopsFormFile

Entrada de upload de arquivo.

```php
$file = new XoopsFormFile(
    string $caption,
    string $name,
    int $maxFileSize = 0
);

// Métodos
$file->getMaxFileSize();
$file->setMaxFileSize(int $size);
```

### XoopsFormHidden

Campo de entrada oculto.

```php
$hidden = new XoopsFormHidden(
    string $name,
    mixed $value
);
```

### XoopsFormHiddenToken

Token de proteção CSRF.

```php
$token = new XoopsFormHiddenToken(
    string $name = 'XOOPS_TOKEN_REQUEST'
);
```

### XoopsFormLabel

Rótulo somente exibição (não é uma entrada).

```php
$label = new XoopsFormLabel(
    string $caption,
    string $value
);
```

### XoopsFormPassword

Campo de entrada de senha.

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

Agrupa múltiplos elementos juntos.

```php
$tray = new XoopsFormElementTray(
    string $caption,
    string $delimeter = '&nbsp;'
);

// Métodos
$tray->addElement(XoopsFormElement $element, bool $required = false);
$tray->getElements();
```

---

## Diagrama de Fluxo de Formulário

```mermaid
sequenceDiagram
    participant Usuário
    participant Navegador
    participant Formulário
    participant Segurança
    participant Handler
    participant BancoDados

    Usuário->>Navegador: Preencher formulário
    Navegador->>Formulário: Enviar POST
    Formulário->>Segurança: Validar token CSRF

    alt Token Inválido
        Segurança-->>Navegador: Erro: Token inválido
        Navegador-->>Usuário: Mostrar erro
    else Token Válido
        Segurança->>Handler: Processar dados
        Handler->>Handler: Validar entrada

        alt Validação Falhou
            Handler-->>Navegador: Mostrar formulário com erros
            Navegador-->>Usuário: Exibir erros
        else Validação Passou
            Handler->>BancoDados: Salvar dados
            BancoDados-->>Handler: Sucesso
            Handler-->>Navegador: Redirecionar
            Navegador-->>Usuário: Mensagem de sucesso
        end
    end
```

---

## Exemplo Completo

```php
<?php
require_once __DIR__ . '/mainfile.php';

use Xmf\Request;

$helper = \XoopsModules\MyModule\Helper::getInstance();
$itemHandler = $helper->getHandler('Item');

// Processar envio de formulário
if (Request::hasVar('submit', 'POST')) {
    // Verificar token CSRF
    if (!$GLOBALS['xoopsSecurity']->check()) {
        redirect_header('form.php', 3, implode('<br>', $GLOBALS['xoopsSecurity']->getErrors()));
    }

    // Obter entrada validada
    $title = Request::getString('title', '', 'POST');
    $content = Request::getText('content', '', 'POST');
    $categoryId = Request::getInt('category_id', 0, 'POST');
    $status = Request::getString('status', 'draft', 'POST');

    // Criar e popular objeto
    $item = $itemHandler->create();
    $item->setVars([
        'title' => $title,
        'content' => $content,
        'category_id' => $categoryId,
        'status' => $status,
        'created' => time(),
        'uid' => $GLOBALS['xoopsUser']->getVar('uid')
    ]);

    // Salvar
    if ($itemHandler->insert($item)) {
        redirect_header('index.php', 2, _MD_MYMODULE_SAVED);
    } else {
        $error = _MD_MYMODULE_ERROR_SAVING;
    }
}

// Construir formulário
$form = new XoopsThemeForm(_MD_MYMODULE_ADD_ITEM, 'itemform', 'form.php', 'post', true);

// Campo de título
$titleElement = new XoopsFormText(_MD_MYMODULE_TITLE, 'title', 50, 255, $title ?? '');
$titleElement->setDescription(_MD_MYMODULE_TITLE_DESC);
$form->addElement($titleElement, true);

// Dropdown de categoria
$categoryHandler = $helper->getHandler('Category');
$categories = $categoryHandler->getList();
$categorySelect = new XoopsFormSelect(_MD_MYMODULE_CATEGORY, 'category_id', $categoryId ?? 0);
$categorySelect->addOptionArray($categories);
$form->addElement($categorySelect, true);

// Textarea de conteúdo com editor
$editorConfigs = [
    'name' => 'content',
    'value' => $content ?? '',
    'rows' => 15,
    'cols' => 60,
    'width' => '100%',
    'height' => '400px',
];
$form->addElement(new XoopsFormEditor(_MD_MYMODULE_CONTENT, 'content', $editorConfigs));

// Botões de rádio de status
$statusRadio = new XoopsFormRadio(_MD_MYMODULE_STATUS, 'status', $status ?? 'draft');
$statusRadio->addOptionArray([
    'draft' => _MD_MYMODULE_DRAFT,
    'published' => _MD_MYMODULE_PUBLISHED,
    'archived' => _MD_MYMODULE_ARCHIVED
]);
$form->addElement($statusRadio);

// Botão de envio
$buttonTray = new XoopsFormElementTray('', '&nbsp;');
$buttonTray->addElement(new XoopsFormButton('', 'submit', _SUBMIT, 'submit'));
$buttonTray->addElement(new XoopsFormButton('', 'reset', _CANCEL, 'reset'));
$form->addElement($buttonTray);

// Exibir
require_once XOOPS_ROOT_PATH . '/header.php';

if (!empty($error)) {
    echo "<div class='errorMsg'>$error</div>";
}

$form->display();

require_once XOOPS_ROOT_PATH . '/footer.php';
```

---

## Documentação Relacionada

- API XoopsObject
- Guia de Formulários
- Proteção CSRF

---

#xoops #api #formulários #xoopsform #referência
