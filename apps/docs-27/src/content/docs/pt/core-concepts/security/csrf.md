---
title: "Proteção CSRF"
description: "Entendendo e implementando proteção CSRF no XOOPS usando a classe XoopsSecurity"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

Ataques de Falsificação de Requisição Entre Sites (CSRF) enganam usuários para executar ações indesejadas em um site onde estão autenticados. XOOPS fornece proteção CSRF integrada através da classe `XoopsSecurity`.

## Documentação Relacionada

- Security-Best-Practices - Guia abrangente de segurança
- Input-Sanitization - MyTextSanitizer e validação
- SQL-Injection-Prevention - Práticas de segurança de banco de dados

## Entendendo Ataques CSRF

Um ataque CSRF ocorre quando:

1. Um usuário está autenticado em seu site XOOPS
2. O usuário visita um site malicioso
3. O site malicioso envia uma requisição para seu site XOOPS usando a sessão do usuário
4. Seu site processa a requisição como se viesse do usuário legítimo

## A Classe XoopsSecurity

XOOPS fornece a classe `XoopsSecurity` para proteger contra ataques CSRF. Esta classe gerencia tokens de segurança que devem ser incluídos em formulários e verificados ao processar requisições.

### Geração de Token

A classe de segurança gera tokens únicos que são armazenados na sessão do usuário e devem ser incluídos em formulários:

```php
$security = new XoopsSecurity();

// Obter campo de entrada HTML de token
$tokenHTML = $security->getTokenHTML();

// Obter apenas o valor do token
$tokenValue = $security->createToken();
```

### Verificação de Token

Ao processar envios de formulário, verifique se o token é válido:

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    redirect_header('index.php', 3, _MD_TOKENEXPIRED);
    exit();
}
```

## Usando Sistema de Token XOOPS

### Com Classes XoopsForm

Ao usar classes de formulário XOOPS, a proteção de token é simples:

```php
// Criar um formulário
$form = new XoopsThemeForm('Adicionar Item', 'form_name', 'submit.php');

// Adicionar elementos de formulário
$form->addElement(new XoopsFormText('Título', 'title', 50, 255, ''));
$form->addElement(new XoopsFormTextArea('Conteúdo', 'content', ''));

// Adicionar campo de token oculto - SEMPRE incluir isto
$form->addElement(new XoopsFormHiddenToken());

// Adicionar botão enviar
$form->addElement(new XoopsFormButton('', 'submit', _SUBMIT, 'submit'));
```

### Com Formulários Personalizados

Para formulários HTML personalizados que não usam XoopsForm:

```php
// Em seu template de formulário ou arquivo PHP
$security = new XoopsSecurity();
?>
<form method="post" action="submit.php">
    <input type="text" name="title" />
    <textarea name="content"></textarea>

    <!-- Incluir o token -->
    <?php echo $security->getTokenHTML(); ?>

    <button type="submit">Enviar</button>
</form>
```

### Em Templates Smarty

Ao gerar formulários em templates Smarty:

```php
// Em seu arquivo PHP
$security = new XoopsSecurity();
$GLOBALS['xoopsTpl']->assign('token', $security->getTokenHTML());
```

```smarty
{* Em seu template *}
<form method="post" action="submit.php">
    <input type="text" name="title" />
    <textarea name="content"></textarea>

    {* Incluir o token *}
    <{$token}>

    <button type="submit">Enviar</button>
</form>
```

## Processando Envios de Formulário

### Verificação Básica de Token

```php
// Em seu script de processamento de formulário
$security = new XoopsSecurity();

// Verificar o token
if (!$security->check()) {
    redirect_header('index.php', 3, _MD_TOKENEXPIRED);
    exit();
}

// Token é válido, processar o formulário
$title = $_POST['title'];
// ... continuar processando
```

### Com Tratamento de Erro Personalizado

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    // Obter informações de erro detalhadas
    $errors = $security->getErrors();

    // Registrar o erro
    error_log('Falha na validação de token CSRF: ' . implode(', ', $errors));

    // Redirecionar com mensagem de erro
    redirect_header('form.php', 3, 'Token de segurança expirou. Tente novamente.');
    exit();
}
```

### Para Requisições AJAX

Ao trabalhar com requisições AJAX, inclua o token em sua requisição:

```javascript
// JavaScript - obter token do campo oculto
var token = document.querySelector('input[name="XOOPS_TOKEN_REQUEST"]').value;

// Incluir na requisição AJAX
fetch('ajax_handler.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'action=save&XOOPS_TOKEN_REQUEST=' + encodeURIComponent(token)
});
```

```php
// Manipulador AJAX do PHP
$security = new XoopsSecurity();

if (!$security->check()) {
    echo json_encode(['error' => 'Token de segurança inválido']);
    exit();
}

// Processar requisição AJAX
```

## Verificando HTTP Referer

Para proteção adicional, especialmente para requisições AJAX, você também pode verificar o referer HTTP:

```php
$security = new XoopsSecurity();

// Verificar cabeçalho referer
if (!$security->checkReferer()) {
    echo json_encode(['error' => 'Requisição inválida']);
    exit();
}

// Também verificar o token
if (!$security->check()) {
    echo json_encode(['error' => 'Token inválido']);
    exit();
}
```

### Verificação de Segurança Combinada

```php
$security = new XoopsSecurity();

// Executar ambas as verificações
if (!$security->checkReferer() || !$security->check()) {
    redirect_header('index.php', 3, 'Falha na validação de segurança');
    exit();
}
```

## Configuração de Token

### Vida Útil do Token

Os tokens têm uma vida útil limitada para prevenir ataques de repetição. Você pode configurar isso nas configurações XOOPS ou lidar com tokens expirados graciosamente:

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    // Token pode ter expirado
    // Regenerar formulário com novo token
    redirect_header('form.php', 3, 'Sua sessão expirou. Por favor, envie o formulário novamente.');
    exit();
}
```

### Múltiplos Formulários na Mesma Página

Quando você tem múltiplos formulários na mesma página, cada um deve ter seu próprio token:

```php
// Formulário 1
$form1 = new XoopsThemeForm('Formulário 1', 'form1', 'submit1.php');
$form1->addElement(new XoopsFormHiddenToken('token1'));

// Formulário 2
$form2 = new XoopsThemeForm('Formulário 2', 'form2', 'submit2.php');
$form2->addElement(new XoopsFormHiddenToken('token2'));
```

## Boas Práticas

### Sempre Use Tokens para Operações que Alteram Estado

Incluir tokens em qualquer formulário que:

- Cria dados
- Atualiza dados
- Deleta dados
- Altera configurações do usuário
- Realiza qualquer ação administrativa

### Não Confie Apenas na Verificação de Referer

O cabeçalho HTTP referer pode ser:

- Removido por ferramentas de privacidade
- Ausente em alguns navegadores
- Falsificado em alguns casos

Sempre use verificação de token como sua defesa primária.

### Regenere Tokens Apropriadamente

Considere regenerar tokens:

- Após envio bem-sucedido de formulário
- Após login/logout
- Em intervalos regulares para sessões longas

### Lidar com Expiração de Token Graciosamente

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    // Armazenar dados do formulário temporariamente
    $_SESSION['form_backup'] = $_POST;

    // Redirecionar de volta ao formulário com mensagem
    redirect_header('form.php?restore=1', 3, 'Por favor, reenvie o formulário.');
    exit();
}
```

## Problemas Comuns e Soluções

### Erro de Token Não Encontrado

**Problema**: Falha na verificação de segurança com "token not found"

**Solução**: Certifique-se de que o campo de token está incluído em seu formulário:

```php
$form->addElement(new XoopsFormHiddenToken());
```

### Erro de Token Expirado

**Problema**: Usuários veem "token expired" após preenchimento longo de formulário

**Solução**: Considere usar JavaScript para atualizar o token periodicamente:

```javascript
// Atualizar token a cada 10 minutos
setInterval(function() {
    fetch('refresh_token.php')
        .then(response => response.json())
        .then(data => {
            document.querySelector('input[name="XOOPS_TOKEN_REQUEST"]').value = data.token;
        });
}, 600000);
```

### Problemas de Token AJAX

**Problema**: Requisições AJAX falham na validação de token

**Solução**: Certifique-se de que o token é passado com cada requisição AJAX e verifique no servidor:

```php
// Manipulador AJAX
header('Content-Type: application/json');

$security = new XoopsSecurity();
if (!$security->check(true, false)) { // Não limpar token para AJAX
    http_response_code(403);
    echo json_encode(['error' => 'Token inválido']);
    exit();
}
```

## Exemplo: Implementação Completa de Formulário

```php
<?php
// form.php
require_once dirname(__DIR__) . '/mainfile.php';

$security = new XoopsSecurity();

// Lidar com envio de formulário
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!$security->check()) {
        redirect_header('form.php', 3, 'Token de segurança expirou. Tente novamente.');
        exit();
    }

    // Processar envio válido
    $title = $myts->htmlSpecialChars($_POST['title']);
    // ... salvar no banco de dados

    redirect_header('success.php', 3, 'Item salvo com sucesso!');
    exit();
}

// Exibir formulário
$GLOBALS['xoopsOption']['template_main'] = 'mymodule_form.tpl';
include XOOPS_ROOT_PATH . '/header.php';

$form = new XoopsThemeForm('Adicionar Item', 'add_item', 'form.php');
$form->addElement(new XoopsFormText('Título', 'title', 50, 255, ''));
$form->addElement(new XoopsFormTextArea('Conteúdo', 'content', ''));
$form->addElement(new XoopsFormHiddenToken());
$form->addElement(new XoopsFormButton('', 'submit', _SUBMIT, 'submit'));

$GLOBALS['xoopsTpl']->assign('form', $form->render());

include XOOPS_ROOT_PATH . '/footer.php';
```

---

#segurança #csrf #xoops #formulários #tokens #XoopsSecurity
