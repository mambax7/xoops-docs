---
title: "Solução de Problemas"
description: "Soluções para problemas comuns do XOOPS, técnicas de depuração e FAQ"
---

> Soluções para problemas comuns e técnicas de depuração do XOOPS CMS.

---

## Diagnóstico Rápido

Antes de mergulhar em problemas específicos, verifique estas causas comuns:

1. **Permissões de Arquivo** - Diretórios precisam de 755, arquivos precisam de 644
2. **Versão PHP** - Garantir PHP 7.4+ (8.x recomendado)
3. **Logs de Erro** - Verificar `xoops_data/logs/` e logs de erro PHP
4. **Cache** - Limpar cache em Admin → Sistema → Manutenção

---

## Conteúdo da Seção

### Problemas Comuns
- Tela Branca da Morte (WSOD)
- Erros de Conexão com Banco de Dados
- Erros de Permissão Negada
- Falhas de Instalação de Módulo
- Erros de Compilação de Template

### FAQ
- FAQ de Instalação
- FAQ de Módulos
- FAQ de Temas
- FAQ de Performance

### Depuração
- Ativando Modo Debug
- Usando Ray Debugger
- Depuração de Query de Banco de Dados
- Depuração de Template Smarty

---

## Problemas Comuns e Soluções

### Tela Branca da Morte (WSOD)

**Sintomas:** Página branca em branco, sem mensagem de erro

**Soluções:**

1. **Ativar exibição de erro PHP temporariamente:**
   ```php
   // Add to mainfile.php temporarily
   error_reporting(E_ALL);
   ini_set('display_errors', 1);
   ```

2. **Verificar log de erro PHP:**
   ```bash
   tail -f /var/log/php/error.log
   ```

3. **Causas comuns:**
   - Limite de memória excedido
   - Erro fatal de sintaxe PHP
   - Extensão necessária ausente

4. **Corrigir problemas de memória:**
   ```php
   // In mainfile.php or php.ini
   ini_set('memory_limit', '256M');
   ```

---

### Erros de Conexão com Banco de Dados

**Sintomas:** "Unable to connect to database" ou similar

**Soluções:**

1. **Verificar credenciais em mainfile.php:**
   ```php
   define('XOOPS_DB_HOST', 'localhost');
   define('XOOPS_DB_USER', 'your_username');
   define('XOOPS_DB_PASS', 'your_password');
   define('XOOPS_DB_NAME', 'your_database');
   ```

2. **Testar conexão manualmente:**
   ```php
   <?php
   $conn = new mysqli('localhost', 'user', 'pass', 'database');
   if ($conn->connect_error) {
       die("Connection failed: " . $conn->connect_error);
   }
   echo "Connected successfully";
   ```

3. **Verificar serviço MySQL:**
   ```bash
   sudo systemctl status mysql
   sudo systemctl restart mysql
   ```

4. **Verificar permissões do usuário:**
   ```sql
   GRANT ALL PRIVILEGES ON xoops.* TO 'user'@'localhost';
   FLUSH PRIVILEGES;
   ```

---

### Erros de Permissão Negada

**Sintomas:** Não consegue fazer upload de arquivos, não consegue salvar configurações

**Soluções:**

1. **Definir permissões corretas:**
   ```bash
   # Directories
   find /path/to/xoops -type d -exec chmod 755 {} \;

   # Files
   find /path/to/xoops -type f -exec chmod 644 {} \;

   # Writable directories
   chmod -R 777 xoops_data/
   chmod -R 777 uploads/
   ```

2. **Definir propriedade correta:**
   ```bash
   chown -R www-data:www-data /path/to/xoops
   ```

3. **Verificar SELinux (CentOS/RHEL):**
   ```bash
   # Check status
   sestatus

   # Allow httpd to write
   setsebool -P httpd_unified 1
   ```

---

### Falhas de Instalação de Módulo

**Sintomas:** Módulo não instala, erros SQL

**Soluções:**

1. **Verificar requisitos do módulo:**
   - Compatibilidade de versão PHP
   - Extensões PHP necessárias
   - Compatibilidade de versão XOOPS

2. **Instalação SQL manual:**
   ```bash
   mysql -u user -p database < modules/mymodule/sql/mysql.sql
   ```

3. **Limpar cache do módulo:**
   ```php
   // In xoops_data/caches/
   rm -rf xoops_cache/*
   rm -rf smarty_cache/*
   rm -rf smarty_compile/*
   ```

4. **Verificar sintaxe xoopsversion.php:**
   ```bash
   php -l modules/mymodule/xoopsversion.php
   ```

---

### Erros de Compilação de Template

**Sintomas:** Erros Smarty, template não encontrado

**Soluções:**

1. **Limpar cache Smarty:**
   ```bash
   rm -rf xoops_data/caches/smarty_cache/*
   rm -rf xoops_data/caches/smarty_compile/*
   ```

2. **Verificar sintaxe de template:**
   ```smarty
   {* Correct *}
   {$variable}

   {* Incorrect - missing $ *}
   {variable}
   ```

---

## Documentação Relacionada

- Tela Branca da Morte
- Erros de Conexão com Banco de Dados
- Erros de Permissão Negada
- Falhas de Instalação de Módulo
- Erros de Template

---

#xoops #troubleshooting #debugging #solutions
