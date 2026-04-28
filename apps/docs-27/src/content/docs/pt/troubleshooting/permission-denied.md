---
title: "Erros de Permissão Negada"
description: "Solução de problemas de permissão de arquivo e diretório no XOOPS"
---

Problemas de permissão de arquivo e diretório são comuns em instalações do XOOPS, especialmente após upload ou migração de servidor. Este guia ajuda a diagnosticar e resolver problemas de permissão.

## Compreender Permissões de Arquivo

### Noções Básicas de Permissão Linux/Unix

Permissões de arquivo são representadas como códigos de três dígitos:

```
rwxrwxrwx
||| ||| |||
||| ||| +-- Others (world)
||| +------ Group
+--------- Owner

r = read (4)
w = write (2)
x = execute (1)

755 = rwxr-xr-x (owner full, group read/execute, others read/execute)
644 = rw-r--r-- (owner read/write, group read, others read)
777 = rwxrwxrwx (everyone full access - NOT RECOMMENDED)
```

## Erros Comuns de Permissão

### "Permission denied" em Upload

```
Warning: fopen(/var/www/html/xoops/uploads/file.jpg): failed to open stream:
Permission denied in /var/www/html/xoops/class/file.php on line 42
```

### "Unable to write file"

```
Error: Unable to write file to /var/www/html/xoops/cache/
```

### "Cannot create directory"

```
Error: mkdir(/var/www/html/xoops/uploads/temp/): Permission denied
```

## Diretórios Críticos do XOOPS

### Diretórios Que Requerem Permissões de Escrita

| Diretório | Mínimo | Propósito |
|-----------|---------|----------|
| `/uploads` | 755 | Uploads de usuário |
| `/cache` | 755 | Arquivos de cache |
| `/templates_c` | 755 | Templates compilados |
| `/var` | 755 | Dados variáveis |
| `mainfile.php` | 644 | Configuração (legível) |

## Solução de Problemas Linux/Unix

### Passo 1: Verificar Permissões Atuais

```bash
# Check file permissions
ls -l /var/www/html/xoops/

# Check specific file
ls -l /var/www/html/xoops/mainfile.php

# Check directory permissions
ls -ld /var/www/html/xoops/uploads/
```

### Passo 2: Identificar Usuário do Servidor Web

```bash
# Check Apache user
ps aux | grep -E '[a]pache|[h]ttpd'
# Usually: www-data (Debian/Ubuntu) or apache (RedHat/CentOS)

# Check Nginx user
ps aux | grep -E '[n]ginx'
# Usually: www-data or nginx
```

### Passo 3: Corrigir Propriedade

```bash
# Set correct ownership (assuming www-data user)
sudo chown -R www-data:www-data /var/www/html/xoops/

# Fix only web-writable directories
sudo chown www-data:www-data /var/www/html/xoops/uploads/
sudo chown www-data:www-data /var/www/html/xoops/cache/
sudo chown www-data:www-data /var/www/html/xoops/templates_c/
sudo chown www-data:www-data /var/www/html/xoops/var/
```

### Passo 4: Corrigir Permissões

#### Opção A: Permissões Restritivas (Recomendado)

```bash
# All directories: 755 (rwxr-xr-x)
find /var/www/html/xoops -type d -exec chmod 755 {} \;

# All files: 644 (rw-r--r--)
find /var/www/html/xoops -type f -exec chmod 644 {} \;

# Except writable directories
chmod 755 /var/www/html/xoops/uploads/
chmod 755 /var/www/html/xoops/cache/
chmod 755 /var/www/html/xoops/templates_c/
chmod 755 /var/www/html/xoops/var/
```

#### Opção B: Script Tudo-em-um

```bash
#!/bin/bash
# fix-permissions.sh

XOOPS_PATH="/var/www/html/xoops"
WEB_USER="www-data"

echo "Fixing XOOPS permissions..."

# Set ownership
sudo chown -R $WEB_USER:$WEB_USER $XOOPS_PATH

# Set directory permissions
find $XOOPS_PATH -type d -exec chmod 755 {} \;

# Set file permissions
find $XOOPS_PATH -type f -exec chmod 644 {} \;

# Ensure writable directories
chmod 755 $XOOPS_PATH/uploads/
chmod 755 $XOOPS_PATH/cache/
chmod 755 $XOOPS_PATH/templates_c/
chmod 755 $XOOPS_PATH/var/

echo "Done! Permissions fixed."
```

## Problemas de Permissão por Diretório

### Diretório de Uploads

**Problema:** Não consegue fazer upload de arquivos

```bash
# Solution
sudo chown www-data:www-data /var/www/html/xoops/uploads/
chmod 755 /var/www/html/xoops/uploads/
find /var/www/html/xoops/uploads -type f -exec chmod 644 {} \;
find /var/www/html/xoops/uploads -type d -exec chmod 755 {} \;
```

### Diretório de Cache

**Problema:** Arquivos de cache não estão sendo gravados

```bash
# Solution
sudo chown www-data:www-data /var/www/html/xoops/cache/
chmod 755 /var/www/html/xoops/cache/
```

### Cache de Templates

**Problema:** Templates não compilando

```bash
# Solution
sudo chown www-data:www-data /var/www/html/xoops/templates_c/
chmod 755 /var/www/html/xoops/templates_c/
```

## Solução de Problemas do Windows

### Passo 1: Verificar Propriedades do Arquivo

1. Clique com botão direito no arquivo → Propriedades
2. Clique na aba "Segurança"
3. Clique no botão "Editar"
4. Selecione usuário e verifique permissões

### Passo 2: Conceder Permissões de Escrita

#### Via GUI:

```
1. Right-click folder → Properties
2. Select "Security" tab
3. Click "Edit"
4. Select "Users" or "IUSR"
5. Check "Write" and "Modify"
6. Click "Apply"
```

---

## Documentação Relacionada

- Tela Branca da Morte
- Falhas de Instalação de Módulo
- FAQ de Instalação

---

#xoops #permissions #troubleshooting #security
