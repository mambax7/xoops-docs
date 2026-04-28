---
title: "Erros de Conexão com Banco de Dados"
description: "Guia de solução de problemas para problemas de conexão com banco de dados do XOOPS"
---

Erros de conexão com banco de dados estão entre os problemas mais comuns em instalações do XOOPS. Este guia fornece etapas sistemáticas de solução de problemas para identificar e resolver problemas de conexão.

## Mensagens de Erro Comuns

### "Can't connect to MySQL server"

```
Error: Can't connect to MySQL server on 'localhost' (111)
```

Este erro normalmente indica que o servidor MySQL não está em execução ou não está acessível.

### "Access denied for user"

```
Error: Access denied for user 'xoops_user'@'localhost' (using password: YES)
```

Isto indica credenciais de banco de dados incorretas em sua configuração.

### "Unknown database"

```
Error: Unknown database 'xoops_db'
```

O banco de dados especificado não existe no servidor MySQL.

## Arquivos de Configuração

### Local de Configuração do XOOPS

O arquivo de configuração principal está localizado em:

```
/mainfile.php
```

Configurações principais do banco de dados:

```php
// Database Configuration
define('XOOPS_DB_TYPE', 'mysqli');
define('XOOPS_DB_HOST', 'localhost');
define('XOOPS_DB_PORT', '3306');
define('XOOPS_DB_USER', 'xoops_user');
define('XOOPS_DB_PASS', 'your_password');
define('XOOPS_DB_NAME', 'xoops_db');
define('XOOPS_DB_PREFIX', 'xoops_');
```

## Etapas de Solução de Problemas

### Etapa 1: Verificar se o Serviço MySQL Está em Execução

#### No Linux/Unix

```bash
# Check if MySQL is running
sudo systemctl status mysql

# Start MySQL if not running
sudo systemctl start mysql

# Restart MySQL
sudo systemctl restart mysql
```

### Etapa 2: Testar Conectividade MySQL

#### Usando a Linha de Comando

```bash
# Test connection with credentials
mysql -h localhost -u xoops_user -p xoops_db

# If prompted for password, enter it
# Success shows: mysql>

# Exit MySQL
mysql> EXIT;
```

### Etapa 3: Verificar Credenciais do Banco de Dados

#### Verificar Configuração do XOOPS

```php
// In mainfile.php, verify these constants:
echo "Host: " . XOOPS_DB_HOST . "\n";
echo "User: " . XOOPS_DB_USER . "\n";
echo "Port: " . XOOPS_DB_PORT . "\n";
echo "Database: " . XOOPS_DB_NAME . "\n";
```

### Etapa 4: Verificar se o Banco de Dados Existe

```bash
# Connect to MySQL
mysql -u root -p

# List all databases
SHOW DATABASES;

# Check for your database
SHOW DATABASES LIKE 'xoops_db';

# If not found, create it
CREATE DATABASE xoops_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Exit
EXIT;
```

### Etapa 5: Verificar Permissões do Usuário

```bash
# Connect as root
mysql -u root -p

# Check user privileges
SHOW GRANTS FOR 'xoops_user'@'localhost';

# Grant all privileges if needed
GRANT ALL PRIVILEGES ON xoops_db.* TO 'xoops_user'@'localhost';

# Reload privileges
FLUSH PRIVILEGES;
```

## Problemas Comuns e Soluções

### Problema 1: MySQL Não Está em Execução

**Sintomas:**
- Erro de conexão recusada
- Não consegue conectar ao localhost

**Soluções:**

```bash
# Linux: Check and start MySQL
sudo systemctl status mysql
sudo systemctl start mysql
```

### Problema 2: Credenciais Incorretas

**Sintomas:**
- Erro "Access denied"
- "using password: YES" ou "using password: NO"

**Soluções:**

```bash
# Reset password (as root)
mysql -u root -p

# Change user password
ALTER USER 'xoops_user'@'localhost' IDENTIFIED BY 'new_password';

# Update mainfile.php
define('XOOPS_DB_PASS', 'new_password');
```

### Problema 3: Banco de Dados Não Criado

**Sintomas:**
- Erro "Unknown database"
- Falha na instalação durante a criação do banco de dados

**Soluções:**

```bash
# Check if database exists
mysql -u root -p -e "SHOW DATABASES;"

# Create database if missing
mysql -u root -p -e "CREATE DATABASE xoops_db CHARACTER SET utf8mb4;"
```

## Script de Diagnóstico

Crie um script de diagnóstico abrangente:

```php
<?php
// diagnose-db.php

echo "=== XOOPS Database Diagnostic ===\n\n";

// Check constants defined
echo "1. Configuration Check:\n";
echo "   Host: " . (defined('XOOPS_DB_HOST') ? XOOPS_DB_HOST : "NOT DEFINED") . "\n";
echo "   User: " . (defined('XOOPS_DB_USER') ? XOOPS_DB_USER : "NOT DEFINED") . "\n";
echo "   Database: " . (defined('XOOPS_DB_NAME') ? XOOPS_DB_NAME : "NOT DEFINED") . "\n\n";

// Check PHP MySQL extension
echo "2. Extension Check:\n";
echo "   MySQLi: " . (extension_loaded('mysqli') ? "YES" : "NO") . "\n\n";

// Test connection
echo "3. Connection Test:\n";
try {
    $conn = new mysqli(
        XOOPS_DB_HOST,
        XOOPS_DB_USER,
        XOOPS_DB_PASS,
        XOOPS_DB_NAME,
        XOOPS_DB_PORT
    );

    if ($conn->connect_error) {
        echo "   FAILED: " . $conn->connect_error . "\n";
    } else {
        echo "   SUCCESS: Connected to MySQL\n";
        echo "   Server Info: " . $conn->get_server_info() . "\n";
        $conn->close();
    }
} catch (Exception $e) {
    echo "   EXCEPTION: " . $e->getMessage() . "\n";
}

echo "\n=== End Diagnostic ===\n";
?>
```

## Documentação Relacionada

- Tela-Branca-da-Morte - Solução de problemas comuns de WSOD
- ../../01-Getting-Started/Configuration/Performance-Optimization - Otimização de performance do banco de dados
- ../../06-Publisher-Module/User-Guide/Basic-Configuration - Configuração inicial do XOOPS
- ../../04-API-Reference/Database/XoopsDatabase - Referência da API de banco de dados

---

**Última Atualização:** 2026-01-31
**Aplicável A:** XOOPS 2.5.7+
**Versões PHP:** 7.4+
