---
title: "Formulários XOOPS"
description: "Guia completo do sistema de geração de formulários XOOPS, incluindo todos os elementos de formulário, validação e renderização"
---

# 📝 Sistema de Formulários XOOPS

> Geração completa de formulários, validação e renderização para módulos XOOPS.

---

## Visão Geral

O sistema de formulários XOOPS fornece uma abordagem poderosa e orientada a objetos para criar formulários HTML. Ele lida com geração de formulário, validação, proteção CSRF e renderização flexível com suporte para vários frameworks CSS.

---

## 🚀 Início Rápido

### Criação Básica de Formulário

```php
<?php
use XoopsFormButton;
use XoopsFormHidden;
use XoopsFormHiddenToken;
use XoopsFormText;
use XoopsThemeForm;

// Criar um formulário
$form = new XoopsThemeForm(
    'Formulário de Contato',  // Título
    'contact_form',           // Nome
    'submit.php',             // Ação
    'post',                   // Método
    true                      // Usar token
);

// Adicionar elementos
$form->addElement(new XoopsFormText('Nome', 'name', 50, 255, ''), true);
$form->addElement(new XoopsFormText('Email', 'email', 50, 255, ''), true);
$form->addElement(new XoopsFormTextArea('Mensagem', 'message', '', 5, 60), true);
$form->addElement(new XoopsFormHiddenToken());
$form->addElement(new XoopsFormButton('', 'submit', _SUBMIT, 'submit'));

// Renderizar
echo $form->render();
```

---

## 📦 Classes de Formulário

### XoopsForm (Classe Base)

A classe base abstrata para todos os formulários.

```php
// Tipos de formulário disponíveis
$simpleForm = new XoopsSimpleForm($title, $name, $action, $method);
$themeForm = new XoopsThemeForm($title, $name, $action, $method, $addToken);
$tableForm = new XoopsTableForm($title, $name, $action, $method, $addToken);
```

### XoopsThemeForm

A classe de formulário mais comumente usada, renderiza com estilo de tema.

```php
$form = new XoopsThemeForm('Meu Formulário', 'myform', 'process.php', 'post', true);

// Métodos do formulário
$form->addElement($element, $required = false);
$form->insertElement($position, $element, $required = false);
$form->getElement($name);
$form->getElements();
$form->setExtra($extra);        // Atributos HTML extras
$form->render();
$form->display();               // Ecoar diretamente
```

---

## 🧩 Elementos do Formulário

### Entrada de Texto

```php
// Texto em uma linha
$text = new XoopsFormText(
    'Nome de Usuário',  // Legenda
    'username',         // Nome
    50,                 // Tamanho
    255,                // Comprimento máximo
    $defaultValue       // Valor padrão
);

// Com placeholder
$text->setExtra('placeholder="Digite nome de usuário"');
```

### Entrada de Senha

```php
$password = new XoopsFormPassword(
    'Senha',
    'password',
    50,             // Tamanho
    255             // Comprimento máximo
);
```

### Textarea

```php
$textarea = new XoopsFormTextArea(
    'Descrição',
    'description',
    $defaultValue,
    5,              // Linhas
    60              // Colunas
);
```

### Dropdown de Seleção

```php
$select = new XoopsFormSelect(
    'Categoria',
    'category_id',
    $defaultValue,
    1,              // Tamanho (1 = dropdown)
    false           // Múltiplo
);

// Adicionar opções
$select->addOption(1, 'Opção 1');
$select->addOption(2, 'Opção 2');

// Ou adicionar array
$options = [
    1 => 'Categoria A',
    2 => 'Categoria B',
    3 => 'Categoria C'
];
$select->addOptionArray($options);
```

### Multi-Seleção

```php
$multiSelect = new XoopsFormSelect(
    'Tags',
    'tags[]',
    $selectedValues,
    5,              // Linhas visíveis
    true            // Seleção múltipla
);
$multiSelect->addOptionArray($tagOptions);
```

### Checkbox

```php
// Checkbox único
$checkbox = new XoopsFormCheckBox(
    'Ativo',
    'active',
    1               // Marcado se valor corresponder
);
$checkbox->addOption(1, 'Ativar este recurso');

// Múltiplos checkboxes
$checkboxGroup = new XoopsFormCheckBox(
    'Recursos',
    'features[]',
    $selectedFeatures
);
$checkboxGroup->addOptionArray([
    'comments' => 'Ativar Comentários',
    'ratings' => 'Ativar Classificações',
    'sharing' => 'Ativar Compartilhamento'
]);
```

### Botões de Rádio

```php
$radio = new XoopsFormRadio(
    'Status',
    'status',
    $defaultStatus
);
$radio->addOptionArray([
    'draft' => 'Rascunho',
    'published' => 'Publicado',
    'archived' => 'Arquivado'
]);
```

### Upload de Arquivo

```php
$file = new XoopsFormFile(
    'Carregar Imagem',
    'image',
    1048576         // Tamanho máximo em bytes (1MB)
);

// Múltiplos arquivos
$file->setExtra('multiple accept="image/*"');
```

### Campo Oculto

```php
$hidden = new XoopsFormHidden('item_id', $itemId);

// Token CSRF (sempre incluir!)
$token = new XoopsFormHiddenToken();
```

### Botão

```php
// Botão enviar
$submit = new XoopsFormButton('', 'submit', _SUBMIT, 'submit');

// Botão redefinir
$reset = new XoopsFormButton('', 'reset', _CANCEL, 'reset');

// Botão personalizado
$custom = new XoopsFormButton('', 'preview', 'Prévia', 'button');
$custom->setExtra('onclick="previewContent()"');
```

### Etiqueta (Somente Exibição)

```php
$label = new XoopsFormLabel(
    'Criado',
    date('Y-m-d H:i:s', $item->getVar('created'))
);
```

### Seletor de Data/Hora

```php
$date = new XoopsFormDateTime(
    'Data de Publicação',
    'publish_date',
    15,             // Tamanho
    $timestamp      // Timestamp padrão
);

// Apenas data (entrada de texto)
$dateText = new XoopsFormTextDateSelect(
    'Data do Evento',
    'event_date',
    15,
    $timestamp
);
```

### Editor WYSIWYG

```php
$editor = new XoopsFormEditor(
    'Conteúdo',
    'content',
    [
        'name' => 'content',
        'value' => $defaultContent,
        'rows' => 15,
        'cols' => 60,
        'width' => '100%',
        'height' => '400px'
    ],
    false,          // Sem HTML permitido
    'textarea'      // Editor de fallback
);
```

### Bandeja de Elemento (Agrupar Elementos)

```php
$tray = new XoopsFormElementTray('Intervalo de Datas', ' - ');
$tray->addElement(new XoopsFormTextDateSelect('', 'start_date', 10, $startDate));
$tray->addElement(new XoopsFormTextDateSelect('', 'end_date', 10, $endDate));
$form->addElement($tray);
```

---

## ✅ Validação de Formulário

### Campos Obrigatórios

```php
// Marcar como obrigatório (segundo parâmetro)
$form->addElement(new XoopsFormText('Nome', 'name', 50, 255, ''), true);

// Ou definir no elemento
$element = new XoopsFormText('Email', 'email', 50, 255, '');
$form->addElement($element, true);
```

### Validação Personalizada

```php
// Validação do lado do servidor
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Verificar token CSRF
    if (!$GLOBALS['xoopsSecurity']->check()) {
        redirect_header('form.php', 3, 'Token de segurança inválido');
        exit;
    }

    // Obter entrada sanitizada
    $name = \Xmf\Request::getString('name', '', 'POST');
    $email = \Xmf\Request::getString('email', '', 'POST');

    $errors = [];

    // Validar
    if (empty($name)) {
        $errors[] = 'Nome é obrigatório';
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Endereço de email inválido';
    }

    if (!empty($errors)) {
        // Mostrar erros
        foreach ($errors as $error) {
            echo "<div class='errorMsg'>$error</div>";
        }
    } else {
        // Processar formulário
    }
}
```

### Validação do Lado do Cliente

```php
$form->setExtra('onsubmit="return validateForm()"');
```

```javascript
function validateForm() {
    const name = document.forms['myform']['name'].value;
    if (name.trim() === '') {
        alert('Nome é obrigatório');
        return false;
    }
    return true;
}
```

---

## 🎨 Renderizadores Personalizados

### Renderizador Bootstrap 5

```php
// Registrar renderizador personalizado
XoopsFormRenderer::getInstance()->set(
    new XoopsFormRendererBootstrap5()
);

// Agora todos os formulários usam estilo Bootstrap 5
$form = new XoopsThemeForm('Meu Formulário', 'myform', 'process.php');
```

### Criar Renderizador Personalizado

```php
<?php

class XoopsFormRendererBulma implements XoopsFormRendererInterface
{
    public function renderFormText(XoopsFormText $element): string
    {
        return sprintf(
            '<div class="field">
                <label class="label">%s</label>
                <div class="control">
                    <input class="input" type="text" name="%s" value="%s" size="%d" maxlength="%d" %s>
                </div>
            </div>',
            $element->getCaption(),
            $element->getName(),
            htmlspecialchars($element->getValue(), ENT_QUOTES),
            $element->getSize(),
            $element->getMaxlength(),
            $element->getExtra()
        );
    }

    public function renderFormSelect(XoopsFormSelect $element): string
    {
        $html = sprintf(
            '<div class="field">
                <label class="label">%s</label>
                <div class="control">
                    <div class="select">
                        <select name="%s" %s>',
            $element->getCaption(),
            $element->getName(),
            $element->getExtra()
        );

        foreach ($element->getOptions() as $value => $label) {
            $selected = ($value == $element->getValue()) ? ' selected' : '';
            $html .= sprintf(
                '<option value="%s"%s>%s</option>',
                htmlspecialchars($value, ENT_QUOTES),
                $selected,
                htmlspecialchars($label, ENT_QUOTES)
            );
        }

        $html .= '</select></div></div></div>';

        return $html;
    }

    // ... implementar outros métodos de renderização
}
```

---

## 🔐 Segurança

### Proteção CSRF

Sempre incluir o token oculto:

```php
$form->addElement(new XoopsFormHiddenToken());

// Ou automático com parâmetro useToken
$form = new XoopsThemeForm('Formulário', 'form', 'action.php', 'post', true);
```

### Verificar Token ao Enviar

```php
if (!$GLOBALS['xoopsSecurity']->check()) {
    redirect_header('index.php', 3, implode('<br>', $GLOBALS['xoopsSecurity']->getErrors()));
    exit;
}
```

### Sanitização de Entrada

```php
use Xmf\Request;

// Sempre sanitizar entrada
$string = Request::getString('field', 'default', 'POST');
$int = Request::getInt('id', 0, 'POST');
$array = Request::getArray('items', [], 'POST');
$email = Request::getEmail('email', '', 'POST');
$url = Request::getUrl('website', '', 'POST');
```

---

## 📋 Exemplo Completo

```php
<?php
require_once dirname(__DIR__) . '/mainfile.php';

use Xmf\Request;
use XoopsFormButton;
use XoopsFormHiddenToken;
use XoopsFormRadio;
use XoopsFormSelect;
use XoopsFormText;
use XoopsFormTextArea;
use XoopsThemeForm;

// Processar formulário
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Verificar CSRF
    if (!$GLOBALS['xoopsSecurity']->check()) {
        redirect_header('form.php', 3, 'Token de segurança inválido');
        exit;
    }

    // Obter e validar entrada
    $title = Request::getString('title', '', 'POST');
    $content = Request::getText('content', '', 'POST');
    $categoryId = Request::getInt('category_id', 0, 'POST');
    $status = Request::getString('status', 'draft', 'POST');

    if (empty($title)) {
        $error = 'Título é obrigatório';
    } else {
        // Salvar no banco de dados
        $itemHandler = xoops_getModuleHandler('item', 'mymodule');
        $item = $itemHandler->create();
        $item->setVar('title', $title);
        $item->setVar('content', $content);
        $item->setVar('category_id', $categoryId);
        $item->setVar('status', $status);
        $item->setVar('created', time());

        if ($itemHandler->insert($item)) {
            redirect_header('index.php', 2, 'Item salvo com sucesso');
            exit;
        } else {
            $error = 'Erro ao salvar item';
        }
    }
}

// Obter categorias para dropdown
$categoryHandler = xoops_getModuleHandler('category', 'mymodule');
$categories = $categoryHandler->getList();

// Construir formulário
$form = new XoopsThemeForm('Adicionar Novo Item', 'item_form', 'form.php', 'post', true);

$form->addElement(new XoopsFormText('Título', 'title', 50, 255, $title ?? ''), true);

$categorySelect = new XoopsFormSelect('Categoria', 'category_id', $categoryId ?? 0);
$categorySelect->addOptionArray($categories);
$form->addElement($categorySelect, true);

$form->addElement(new XoopsFormTextArea('Conteúdo', 'content', $content ?? '', 10, 60));

$statusRadio = new XoopsFormRadio('Status', 'status', $status ?? 'draft');
$statusRadio->addOptionArray([
    'draft' => 'Rascunho',
    'published' => 'Publicado'
]);
$form->addElement($statusRadio);

$form->addElement(new XoopsFormHiddenToken());
$form->addElement(new XoopsFormButton('', 'submit', _SUBMIT, 'submit'));

// Exibir
require_once XOOPS_ROOT_PATH . '/header.php';

if (!empty($error)) {
    echo "<div class='errorMsg'>$error</div>";
}

$form->display();

require_once XOOPS_ROOT_PATH . '/footer.php';
```

---

## 🔗 Documentação Relacionada

- Referência de Elementos de Formulário
- Validação de Formulário
- Renderizadores de Formulário Personalizados
- Proteção CSRF
- Sanitização de Entrada

---

#xoops #formulários #validação #segurança #ui #elementos
