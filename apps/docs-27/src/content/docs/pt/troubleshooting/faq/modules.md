---
title: "FAQ de Módulos"
description: "Perguntas frequentes sobre módulos do XOOPS"
---

# Perguntas Frequentes sobre Módulos

> Perguntas e respostas comuns sobre módulos do XOOPS, instalação e gerenciamento.

---

## Instalação e Ativação

### P: Como instalo um módulo no XOOPS?

**R:**
1. Baixar arquivo zip do módulo
2. Ir para XOOPS Admin > Módulos > Gerenciar Módulos
3. Clicar em "Procurar" e selecionar arquivo zip
4. Clicar em "Enviar"
5. O módulo aparece na lista (geralmente desativado)
6. Clicar no ícone de ativação para ativá-lo

Alternativamente, extrair o zip diretamente em `/xoops_root/modules/` e navegar para o painel admin.

---

### P: Upload de módulo falha com "Permissão negada"

**R:** Este é um problema de permissão de arquivo:

```bash
# Fix module directory permissions
chmod 755 /path/to/xoops/modules

# Fix upload directory (if uploading)
chmod 777 /path/to/xoops/uploads

# Fix ownership if needed
chown -R www-data:www-data /path/to/xoops
```

Veja Falhas de Instalação de Módulo para mais detalhes.

---

### P: Por que não consigo ver o módulo no painel admin após a instalação?

**R:** Verifique o seguinte:

1. **Módulo não ativado** - Clicar no ícone de olho na lista de Módulos
2. **Página de admin faltando** - Módulo deve ter `hasAdmin = 1` em xoopsversion.php
3. **Arquivos de idioma faltando** - Necessário `language/english/admin.php`
4. **Cache não limpo** - Limpar cache e atualizar navegador

```bash
# Clear XOOPS cache
rm -rf /path/to/xoops/xoops_data/caches/*
```

---

### P: Como desinstalo um módulo?

**R:**
1. Ir para XOOPS Admin > Módulos > Gerenciar Módulos
2. Desativar o módulo (clicar no ícone de olho)
3. Clicar no ícone de lixeira/exclusão
4. Manualmente deletar a pasta do módulo se você quer remoção completa:

```bash
rm -rf /path/to/xoops/modules/modulename
```

---

## Gerenciamento de Módulos

### P: Qual é a diferença entre desabilitar e desinstalar?

**R:**
- **Desabilitar**: Desativar o módulo (clicar no ícone de olho). Tabelas do banco de dados permanecem.
- **Desinstalar**: Remover o módulo. Deleta tabelas do banco de dados e remove da lista.

Para remover completamente, também delete a pasta:
```bash
rm -rf modules/modulename
```

---

### P: Como verificar se um módulo está corretamente instalado?

**R:** Use o script de debug:

```php
<?php
// Create admin/debug_modules.php
require_once XOOPS_ROOT_PATH . '/mainfile.php';

if (!is_object($xoopsUser) || !$xoopsUser->isAdmin()) {
    exit('Admin only');
}

echo "<h1>Module Debug</h1>";

// List all modules
$module_handler = xoops_getHandler('module');
$modules = $module_handler->getObjects();

foreach ($modules as $module) {
    echo "<h2>" . $module->getVar('name') . "</h2>";
    echo "Status: " . ($module->getVar('isactive') ? "Active" : "Inactive") . "<br>";
    echo "Directory: " . $module->getVar('dirname') . "<br>";
    echo "Mid: " . $module->getVar('mid') . "<br>";
    echo "Version: " . $module->getVar('version') . "<br>";
}
?>
```

---

### P: Posso executar várias versões do mesmo módulo?

**R:** Não, XOOPS não suporta isto nativamente. Contudo, você pode:

1. Criar uma cópia com um nome de diretório diferente: `mymodule` e `mymodule2`
2. Atualizar dirname em xoopsversion.php de ambos os módulos
3. Garantir nomes únicos de tabela de banco de dados

Isto não é recomendado pois eles compartilham o mesmo código.

---

## Configuração de Módulo

### P: Onde configuro as configurações do módulo?

**R:**
1. Ir para XOOPS Admin > Módulos
2. Clicar no ícone de configurações/engrenagem próximo ao módulo
3. Configurar preferências

As configurações são armazenadas na tabela `xoops_config`.

**Acessar em código:**
```php
<?php
$module_handler = xoops_getHandler('module');
$module = $module_handler->getByDirname('modulename');
$config_handler = xoops_getHandler('config');
$settings = $config_handler->getConfigsByCat(0, $module->mid());

foreach ($settings as $setting) {
    echo $setting->getVar('conf_name') . ": " . $setting->getVar('conf_value');
}
?>
```

---

### P: Como defino opções de configuração de módulo?

**R:** Em xoopsversion.php:

```php
<?php
$modversion['config'] = [
    [
        'name' => 'items_per_page',
        'title' => '_AM_MYMODULE_ITEMS_PER_PAGE',
        'description' => '_AM_MYMODULE_ITEMS_PER_PAGE_DESC',
        'formtype' => 'text',
        'valuetype' => 'int',
        'default' => 10
    ],
    [
        'name' => 'enable_feature',
        'title' => '_AM_MYMODULE_ENABLE_FEATURE',
        'description' => '_AM_MYMODULE_ENABLE_FEATURE_DESC',
        'formtype' => 'yesno',
        'valuetype' => 'bool',
        'default' => 1
    ]
];
?>
```

---

## Recursos de Módulo

### P: Como adiciono uma página de admin ao meu módulo?

**R:** Criar a estrutura:

```
modules/mymodule/
├── admin/
│   ├── index.php
│   ├── menu.php
│   └── menu_en.php
```

Em xoopsversion.php:
```php
<?php
$modversion['hasAdmin'] = 1;
$modversion['adminindex'] = 'admin/index.php';
?>
```

Criar `admin/index.php`:
```php
<?php
require_once XOOPS_ROOT_PATH . '/kernel/admin.php';

xoops_cp_header();
echo "<h1>Module Administration</h1>";
xoops_cp_footer();
?>
```

---

### P: Como adiciono funcionalidade de busca ao meu módulo?

**R:**
1. Definir em xoopsversion.php:
```php
<?php
$modversion['hasSearch'] = 1;
$modversion['search'] = 'search.php';
?>
```

2. Criar `search.php`:
```php
<?php
function mymodule_search($queryArray, $andor, $limit, $offset) {
    // Search implementation
    $results = [];
    return $results;
}
?>
```

---

### P: Como adiciono notificações ao meu módulo?

**R:**
1. Definir em xoopsversion.php:
```php
<?php
$modversion['hasNotification'] = 1;
$modversion['notification_categories'] = [
    ['name' => 'item_published', 'title' => '_NOT_ITEM_PUBLISHED']
];
$modversion['notifications'] = [
    ['name' => 'item_published', 'title' => '_NOT_ITEM_PUBLISHED']
];
?>
```

2. Disparar notificação em código:
```php
<?php
$notification_handler = xoops_getHandler('notification');
$notification_handler->triggerEvent(
    'item_published',
    $item_id,
    'Item published',
    'description'
);
?>
```

---

## Permissões de Módulo

### P: Como defino permissões de módulo?

**R:**
1. Ir para XOOPS Admin > Módulos > Permissões de Módulo
2. Selecionar o módulo
3. Escolher usuário/grupo e nível de permissão
4. Salvar

**Em código:**
```php
<?php
// Check if user can access module
if (!xoops_isUser()) {
    exit('Login required');
}

// Check specific permission
$mperm_handler = xoops_getHandler('member_permission');
$module_handler = xoops_getHandler('module');
$module = $module_handler->getByDirname('mymodule');

if (!$mperm_handler->userCanAccess($module->mid())) {
    exit('Access denied');
}
?>
```

---

## Banco de Dados de Módulo

### P: Onde as tabelas de banco de dados do módulo estão armazenadas?

**R:** Tudo no banco de dados principal do XOOPS, prefixado com seu prefixo de tabela (geralmente `xoops_`):

```bash
# List all module tables
mysql> SHOW TABLES LIKE 'xoops_mymodule_%';

# Or in PHP
<?php
$result = $GLOBALS['xoopsDB']->query(
    "SHOW TABLES LIKE '" . XOOPS_DB_PREFIX . "mymodule_%'"
);
while ($row = $result->fetch_assoc()) {
    print_r($row);
}
?>
```

---

### P: Como atualizo tabelas de banco de dados de módulo?

**R:** Criar um script de atualização no seu módulo:

```php
<?php
// modules/mymodule/update.php
require_once '../../mainfile.php';

if (!is_object($xoopsUser) || !$xoopsUser->isAdmin()) {
    exit('Admin only');
}

// Add new column
$sql = "ALTER TABLE `" . XOOPS_DB_PREFIX . "mymodule_items`
        ADD COLUMN `new_field` VARCHAR(255)";

if ($GLOBALS['xoopsDB']->query($sql)) {
    echo "✓ Updated successfully";
} else {
    echo "✗ Error: " . $GLOBALS['xoopsDB']->error;
}
?>
```

---

## Dependências de Módulo

### P: Como verifico se módulos necessários estão instalados?

**R:**
```php
<?php
$module_handler = xoops_getHandler('module');

// Check if a module exists
$module = $module_handler->getByDirname('required_module');

if (!$module || !$module->getVar('isactive')) {
    die('Error: required_module is not installed or active');
}
?>
```

---

### P: Módulos podem depender de outros módulos?

**R:** Sim, declare em xoopsversion.php:

```php
<?php
$modversion['dependencies'] = [
    [
        'dirname' => 'required_module',
        'version_min' => '1.0',
        'version_max' => 0,  // 0 = unlimited
        'order' => 1
    ]
];
?>
```

---

## Solução de Problemas

### P: Módulo aparece na lista mas não se ativa

**R:** Verifique:
1. Sintaxe xoopsversion.php - Use PHP linter:
```bash
php -l modules/mymodule/xoopsversion.php
```

2. Arquivo SQL de banco de dados:
```bash
# Check SQL syntax
grep -n "CREATE TABLE" modules/mymodule/sql/mysql.sql
```

3. Arquivos de idioma:
```bash
ls -la modules/mymodule/language/english/
```

Veja Falhas de Instalação de Módulo para diagnósticos detalhados.

---

### P: Módulo ativado mas não aparece no site principal

**R:**
1. Definir `hasMain = 1` em xoopsversion.php:
```php
<?php
$modversion['hasMain'] = 1;
$modversion['main_file'] = 'index.php';
?>
```

2. Criar `modules/mymodule/index.php`:
```php
<?php
require_once '../../mainfile.php';
include_once XOOPS_ROOT_PATH . '/header.php';

echo "Welcome to my module";

include_once XOOPS_ROOT_PATH . '/footer.php';
?>
```

---

### P: Módulo causa "tela branca de morte"

**R:** Ativar depuração para encontrar o erro:

```php
<?php
// In mainfile.php
error_reporting(E_ALL);
ini_set('display_errors', '1');
define('XOOPS_DEBUG_LEVEL', 2);
?>
```

Verificar o log de erros:
```bash
tail -100 /var/log/php/error.log
tail -100 /var/log/apache2/error.log
```

Veja Tela Branca da Morte para soluções.

---

## Performance

### P: Módulo é lento, como otimizar?

**R:**
1. **Verificar queries de banco de dados** - Use logging de query
2. **Cachear dados** - Use cache do XOOPS:
```php
<?php
$cache = xoops_cache_handler::getInstance();
$data = $cache->read('mykey');
if ($data === false) {
    $data = expensive_operation();
    $cache->write('mykey', $data, 3600);  // 1 hour
}
?>
```

3. **Otimizar templates** - Evitar loops em templates
4. **Ativar PHP opcode cache** - APCu, XDebug, etc.

Veja FAQ de Performance para mais detalhes.

---

## Desenvolvimento de Módulo

### P: Onde posso encontrar documentação de desenvolvimento de módulo?

**R:** Ver:
- Guia de Desenvolvimento de Módulo
- Estrutura de Módulo
- Criar Seu Primeiro Módulo

---

## Documentação Relacionada

- Falhas de Instalação de Módulo
- Estrutura de Módulo
- FAQ de Performance
- Ativar Modo Debug

---

#xoops #modules #faq #troubleshooting
