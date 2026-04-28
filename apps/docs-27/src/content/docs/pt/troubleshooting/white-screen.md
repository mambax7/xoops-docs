---
title: "Tela Branca da Morte (WSOD)"
description: "Diagnóstico e correção da tela branca de morte no XOOPS"
---

> Como diagnosticar e corrigir páginas brancas em branco no XOOPS.

---

## Fluxograma de Diagnóstico

```mermaid
flowchart TD
    A[White Screen] --> B{PHP Errors Visible?}
    B -->|No| C[Enable Error Display]
    B -->|Yes| D[Read Error Message]

    C --> E{Errors Now Visible?}
    E -->|Yes| D
    E -->|No| F[Check PHP Error Log]

    D --> G{Error Type?}
    G -->|Memory| H[Increase memory_limit]
    G -->|Syntax| I[Fix PHP Syntax]
    G -->|Missing File| J[Restore File]
    G -->|Permission| K[Fix Permissions]
    G -->|Database| L[Check DB Connection]

    F --> M{Log Has Errors?}
    M -->|Yes| D
    M -->|No| N[Check Web Server Logs]

    N --> O{Found Issue?}
    O -->|Yes| D
    O -->|No| P[Enable XOOPS Debug]
```

---

## Diagnóstico Rápido

### Passo 1: Ativar Exibição de Erro PHP

Adicionar a `mainfile.php` temporariamente:

```php
<?php
// Add at the very top, after <?php
error_reporting(E_ALL);
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
```

### Passo 2: Verificar Log de Erro PHP

```bash
# Common log locations
tail -100 /var/log/php/error.log
tail -100 /var/log/apache2/error.log
tail -100 /var/log/nginx/error.log

# Or check PHP info for log location
php -i | grep error_log
```

### Passo 3: Ativar Debug do XOOPS

```php
// In mainfile.php
define('XOOPS_DEBUG_LEVEL', 2);
```

---

## Causas Comuns e Soluções

```mermaid
pie title WSOD Common Causes
    "Memory Limit" : 25
    "PHP Syntax Error" : 20
    "Missing Files" : 15
    "Database Issues" : 15
    "Permissions" : 10
    "Template Errors" : 10
    "Timeout" : 5
```

### 1. Limite de Memória Excedido

**Sintomas:**
- Página em branco em operações grandes
- Funciona para dados pequenos, falha para grande

**Erro:**
```
Fatal error: Allowed memory size of 134217728 bytes exhausted
```

**Soluções:**

```php
// In mainfile.php
ini_set('memory_limit', '256M');

// Or in .htaccess
php_value memory_limit 256M

// Or in php.ini
memory_limit = 256M
```

### 2. Erro de Sintaxe PHP

**Sintomas:**
- WSOD após editar arquivo PHP
- Página específica falha, outras funcionam

**Erro:**
```
Parse error: syntax error, unexpected '}' in /path/file.php on line 123
```

**Soluções:**

```bash
# Check file for syntax errors
php -l /path/to/file.php

# Check all PHP files in module
find modules/mymodule -name "*.php" -exec php -l {} \;
```

### 3. Arquivo Obrigatório Faltando

**Sintomas:**
- WSOD após upload/migração
- Páginas aleatórias falham

**Erro:**
```
Fatal error: require_once(): Failed opening required 'class/Helper.php'
```

**Soluções:**

```bash
# Re-upload missing files
# Compare against fresh installation
diff -r /path/to/xoops /path/to/fresh-xoops

# Check file permissions
ls -la class/
```

### 4. Falha de Conexão com Banco de Dados

**Sintomas:**
- Todas as páginas mostram WSOD
- Arquivos estáticos (imagens, CSS) funcionam

**Erro:**
```
Warning: mysqli_connect(): Access denied for user
```

**Soluções:**

```php
// Verify credentials in mainfile.php
define('XOOPS_DB_HOST', 'localhost');
define('XOOPS_DB_USER', 'your_user');
define('XOOPS_DB_PASS', 'your_password');
define('XOOPS_DB_NAME', 'your_database');

// Test connection manually
<?php
$conn = new mysqli('localhost', 'user', 'pass', 'database');
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully";
```

### 5. Problemas de Permissão

**Sintomas:**
- WSOD ao escrever arquivos
- Erros de cache/compilação

**Soluções:**

```bash
# Fix directory permissions
chmod -R 755 htdocs/
chmod -R 777 xoops_data/
chmod -R 777 uploads/

# Fix ownership
chown -R www-data:www-data /path/to/xoops
```

### 6. Erro de Template Smarty

**Sintomas:**
- WSOD em páginas específicas
- Funciona após limpar cache

**Soluções:**

```bash
# Clear Smarty cache
rm -rf xoops_data/caches/smarty_cache/*
rm -rf xoops_data/caches/smarty_compile/*

# Check template syntax
```

### 7. Tempo Máximo de Execução

**Sintomas:**
- WSOD após ~30 segundos
- Operações longas falham

**Erro:**
```
Fatal error: Maximum execution time of 30 seconds exceeded
```

**Soluções:**

```php
// In mainfile.php
set_time_limit(300);

// Or in .htaccess
php_value max_execution_time 300
```

---

## Script de Debug

Criar `debug.php` na raiz do XOOPS:

```php
<?php
/**
 * XOOPS Debug Script
 * Delete after troubleshooting!
 */

error_reporting(E_ALL);
ini_set('display_errors', '1');

echo "<h1>XOOPS Debug</h1>";

// Check PHP version
echo "<h2>PHP Version</h2>";
echo "PHP " . PHP_VERSION . "<br>";

// Check required extensions
echo "<h2>Required Extensions</h2>";
$required = ['mysqli', 'gd', 'curl', 'json', 'mbstring'];
foreach ($required as $ext) {
    $status = extension_loaded($ext) ? '✓' : '✗';
    echo "$status $ext<br>";
}

// Check file permissions
echo "<h2>Directory Permissions</h2>";
$dirs = [
    'xoops_data' => 'xoops_data',
    'uploads' => 'uploads',
    'cache' => 'xoops_data/caches'
];
foreach ($dirs as $name => $path) {
    $writable = is_writable($path) ? '✓ Writable' : '✗ Not writable';
    echo "$name: $writable<br>";
}

// Test database connection
echo "<h2>Database Connection</h2>";
if (file_exists('mainfile.php')) {
    // Extract credentials (simple regex, not production safe)
    $mainfile = file_get_contents('mainfile.php');
    preg_match("/XOOPS_DB_HOST.*'(.+?)'/", $mainfile, $host);
    preg_match("/XOOPS_DB_USER.*'(.+?)'/", $mainfile, $user);
    preg_match("/XOOPS_DB_PASS.*'(.+?)'/", $mainfile, $pass);
    preg_match("/XOOPS_DB_NAME.*'(.+?)'/", $mainfile, $name);

    if (!empty($host[1])) {
        $conn = @new mysqli($host[1], $user[1], $pass[1], $name[1]);
        if ($conn->connect_error) {
            echo "✗ Connection failed: " . $conn->connect_error;
        } else {
            echo "✓ Connected to database";
            $conn->close();
        }
    }
} else {
    echo "mainfile.php not found!";
}

echo "<p><strong>Delete this file after troubleshooting!</strong></p>";
?>
```

---

## Documentação Relacionada

- Ativar Modo Debug
- Erros de Conexão com Banco de Dados
- Erros de Permissão Negada
- Erros de Template

---

#xoops #wsod #troubleshooting #debugging
