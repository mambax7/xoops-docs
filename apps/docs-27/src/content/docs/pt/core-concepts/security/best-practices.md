---
title: "Boas Práticas de Segurança"
description: "Guia abrangente de segurança para desenvolvimento de módulos XOOPS"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::tip[APIs de Segurança são estáveis entre versões]
As práticas de segurança e APIs documentadas aqui funcionam tanto no XOOPS 2.5.x quanto no XOOPS 4.0.x. As classes de segurança principal (`XoopsSecurity`, `MyTextSanitizer`) permanecem estáveis.
:::

Este documento fornece boas práticas de segurança abrangentes para desenvolvedores de módulos XOOPS. Seguindo essas diretrizes, você ajudará a garantir que seus módulos sejam seguros e não introduzam vulnerabilidades em instalações XOOPS.

## Princípios de Segurança

Todo desenvolvedor XOOPS deve seguir estes princípios fundamentais de segurança:

1. **Defesa em Profundidade**: Implementar múltiplas camadas de controles de segurança
2. **Privilégio Mínimo**: Fornecer apenas os direitos de acesso mínimos necessários
3. **Validação de Entrada**: Nunca confiar em entrada do usuário
4. **Seguro por Padrão**: A segurança deve ser a configuração padrão
5. **Mantenha Simples**: Sistemas complexos são mais difíceis de proteger

## Documentação Relacionada

- CSRF-Protection - Sistema de token e classe XoopsSecurity
- Input-Sanitization - MyTextSanitizer e validação
- SQL-Injection-Prevention - Práticas de segurança de banco de dados

## Lista de Verificação Rápida

Antes de liberar seu módulo, verifique:

- [ ] Todos os formulários incluem tokens XOOPS
- [ ] Toda entrada do usuário é validada e sanitizada
- [ ] Toda saída é adequadamente escapada
- [ ] Todas as consultas de banco de dados usam prepared statements
- [ ] Uploads de arquivo são devidamente validados
- [ ] Verificações de autenticação e autorização estão em vigor
- [ ] Tratamento de erro não revela informações sensíveis
- [ ] Configuração sensível está protegida
- [ ] Bibliotecas de terceiros estão atualizadas
- [ ] Testes de segurança foram realizados

## Autenticação e Autorização

### Verificando Autenticação de Usuário

```php
// Verificar se o usuário está conectado
if (!is_object($GLOBALS['xoopsUser'])) {
    redirect_header(XOOPS_URL, 3, _NOPERM);
    exit();
}
```

### Verificando Permissões de Usuário

```php
// Verificar se o usuário tem permissão para acessar este módulo
if (!$GLOBALS['xoopsUser']->isAdmin($xoopsModule->mid())) {
    redirect_header(XOOPS_URL, 3, _NOPERM);
    exit();
}

// Verificar permissão específica
$moduleHandler = xoops_getHandler('module');
$module = $moduleHandler->getByDirname('mymodule');
$moduleperm_handler = xoops_getHandler('groupperm');
$groups = $GLOBALS['xoopsUser']->getGroups();

if (!$moduleperm_handler->checkRight('mymodule_view', $item_id, $groups, $module->getVar('mid'))) {
    redirect_header(XOOPS_URL, 3, _NOPERM);
    exit();
}
```

### Configurando Permissões de Módulo

```php
// Criar permissão na função de instalação/atualização
$gpermHandler = xoops_getHandler('groupperm');
$gpermHandler->deleteByModule($module->getVar('mid'), 'mymodule_view');

// Adicionar permissão para todos os grupos
$groups = [XOOPS_GROUP_ADMIN, XOOPS_GROUP_USERS, XOOPS_GROUP_ANONYMOUS];
foreach ($groups as $group_id) {
    $gpermHandler->addRight('mymodule_view', 1, $group_id, $module->getVar('mid'));
}
```

## Segurança de Sessão

### Boas Práticas de Manipulação de Sessão

1. Não armazenar informações sensíveis na sessão
2. Regenerar IDs de sessão após login/mudanças de privilégio
3. Validar dados da sessão antes de usá-los

```php
// Regenerar ID de sessão após login
session_regenerate_id(true);

// Validar dados da sessão
if (isset($_SESSION['mymodule_user_id'])) {
    $user_id = (int)$_SESSION['mymodule_user_id'];
    // Verificar se o usuário existe no banco de dados
}
```

### Prevenindo Fixação de Sessão

```php
// Após login bem-sucedido
session_regenerate_id(true);
$_SESSION['mymodule_user_ip'] = $_SERVER['REMOTE_ADDR'];

// Em requisições subsequentes
if ($_SESSION['mymodule_user_ip'] !== $_SERVER['REMOTE_ADDR']) {
    // Possível tentativa de sequestro de sessão
    session_destroy();
    redirect_header('index.php', 3, 'Erro de sessão');
    exit();
}
```

## Segurança de Upload de Arquivo

### Validando Uploads de Arquivo

```php
// Verificar se o arquivo foi carregado corretamente
if (!isset($_FILES['userfile']) || $_FILES['userfile']['error'] != UPLOAD_ERR_OK) {
    redirect_header('index.php', 3, 'Erro no upload de arquivo');
    exit();
}

// Verificar tamanho de arquivo
if ($_FILES['userfile']['size'] > 1000000) { // limite de 1MB
    redirect_header('index.php', 3, 'Arquivo muito grande');
    exit();
}

// Verificar tipo de arquivo
$allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
if (!in_array($_FILES['userfile']['type'], $allowed_types)) {
    redirect_header('index.php', 3, 'Tipo de arquivo inválido');
    exit();
}

// Validar extensão de arquivo
$filename = $_FILES['userfile']['name'];
$ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
$allowed_extensions = ['jpg', 'jpeg', 'png', 'gif'];
if (!in_array($ext, $allowed_extensions)) {
    redirect_header('index.php', 3, 'Extensão de arquivo inválida');
    exit();
}
```

### Usando XOOPS Uploader

```php
include_once XOOPS_ROOT_PATH . '/class/uploader.php';

$allowed_mimetypes = ['image/gif', 'image/jpeg', 'image/png'];
$maxsize = 1000000; // 1MB
$maxwidth = 1024;
$maxheight = 768;
$upload_dir = XOOPS_ROOT_PATH . '/uploads/mymodule';

$uploader = new XoopsMediaUploader(
    $upload_dir,
    $allowed_mimetypes,
    $maxsize,
    $maxwidth,
    $maxheight
);

if ($uploader->fetchMedia('userfile')) {
    $uploader->setPrefix('mymodule_');

    if ($uploader->upload()) {
        $filename = $uploader->getSavedFileName();
        // Salvar nome do arquivo no banco de dados
    } else {
        echo $uploader->getErrors();
    }
} else {
    echo $uploader->getErrors();
}
```

### Armazenando Arquivos Carregados com Segurança

```php
// Definir diretório de upload fora da raiz web
$upload_dir = XOOPS_VAR_PATH . '/uploads/mymodule';

// Criar diretório se não existir
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0755, true);
}

// Mover arquivo carregado
move_uploaded_file($_FILES['userfile']['tmp_name'], $upload_dir . '/' . $safe_filename);
```

## Tratamento de Erro e Logging

### Tratamento Seguro de Erro

```php
try {
    $result = someFunction();
    if (!$result) {
        throw new Exception('Operação falhou');
    }
} catch (Exception $e) {
    // Registrar o erro
    xoops_error($e->getMessage());

    // Exibir uma mensagem de erro genérica para o usuário
    redirect_header('index.php', 3, 'Ocorreu um erro. Tente novamente mais tarde.');
    exit();
}
```

### Logging de Eventos de Segurança

```php
// Registrar eventos de segurança
xoops_loadLanguage('logger', 'mymodule');
$GLOBALS['xoopsLogger']->addExtra('Segurança', 'Tentativa de login falhada para usuário: ' . $username);
```

## Segurança de Configuração

### Armazenando Configuração Sensível

```php
// Definir caminho de configuração fora da raiz web
$config_path = XOOPS_VAR_PATH . '/configs/mymodule/config.php';

// Carregar configuração
if (file_exists($config_path)) {
    include $config_path;
} else {
    // Lidar com configuração ausente
}
```

### Protegendo Arquivos de Configuração

Use `.htaccess` para proteger arquivos de configuração:

```apache
# Em .htaccess
<Files "config.php">
    Order Allow,Deny
    Deny from all
</Files>
```

## Bibliotecas de Terceiros

### Selecionando Bibliotecas

1. Escolher bibliotecas mantidas ativamente
2. Verificar vulnerabilidades de segurança
3. Verificar se a licença da biblioteca é compatível com XOOPS

### Atualizando Bibliotecas

```php
// Verificar versão da biblioteca
if (version_compare(LIBRARY_VERSION, '1.2.3', '<')) {
    xoops_error('Por favor, atualize a biblioteca para a versão 1.2.3 ou superior');
}
```

### Isolando Bibliotecas

```php
// Carregar biblioteca de forma controlada
function loadLibrary($file)
{
    $allowed = ['parser.php', 'formatter.php'];

    if (!in_array($file, $allowed)) {
        return false;
    }

    include_once XOOPS_ROOT_PATH . '/modules/mymodule/libraries/' . $file;
    return true;
}
```

## Testes de Segurança

### Lista de Verificação de Testes Manuais

1. Testar todos os formulários com entrada inválida
2. Tentar contornar autenticação e autorização
3. Testar funcionalidade de upload de arquivo com arquivos maliciosos
4. Verificar vulnerabilidades XSS em toda saída
5. Testar injeção de SQL em todas as consultas de banco de dados

### Testes Automatizados

Use ferramentas automatizadas para verificar vulnerabilidades:

1. Ferramentas de análise de código estática
2. Scanners de aplicação web
3. Verificadores de dependência para bibliotecas de terceiros

## Escapando Saída

### Contexto HTML

```php
// Para conteúdo HTML regular
echo htmlspecialchars($variable, ENT_QUOTES, 'UTF-8');

// Usando MyTextSanitizer
$myts = MyTextSanitizer::getInstance();
echo $myts->htmlSpecialChars($variable);
```

### Contexto JavaScript

```php
// Para dados usados em JavaScript
echo json_encode($variable);

// Para JavaScript inline
echo 'var data = ' . json_encode($variable) . ';';
```

### Contexto URL

```php
// Para dados usados em URLs
echo htmlspecialchars(urlencode($variable), ENT_QUOTES, 'UTF-8');
```

### Variáveis de Template

```php
// Atribuir variáveis ao template Smarty
$GLOBALS['xoopsTpl']->assign('title', htmlspecialchars($title, ENT_QUOTES, 'UTF-8'));

// Para conteúdo HTML que deve ser exibido como está
$GLOBALS['xoopsTpl']->assign('content', $myts->displayTarea($content, 1, 1, 1, 1, 1));
```

## Recursos

- [OWASP Top Ten](https://owasp.org/www-project-top-ten/)
- [Folha de Cola de Segurança do PHP](https://cheatsheetseries.owasp.org/cheatsheets/PHP_Configuration_Cheat_Sheet.html)
- [Documentação XOOPS](https://xoops.org/)

---

#segurança #boas-práticas #xoops #desenvolvimento-módulo #autenticação #autorização
