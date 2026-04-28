---
title: Atualizando XOOPS 2.5 para 2.7
description: Guia passo a passo para atualizar com segurança sua instalação XOOPS de 2.5.x para 2.7.x.
---

:::caution[Faça backup primeiro]
Sempre faça backup de seu banco de dados e arquivos antes de atualizar. Sem exceções.
:::

## O Que Mudou em 2.7

- **PHP 8.2+ obrigatório** — PHP 7.x não é mais suportado
- **Dependências gerenciadas pelo Composer** — Bibliotecas principais gerenciadas via `composer.json`
- **Carregamento automático PSR-4** — Classes de módulo podem usar namespaces
- **XoopsObject aprimorado** — Novo `getVar()` com segurança de tipo, `obj2Array()` descontinuado
- **Admin Bootstrap 5** — Painel de administração reconstruído com Bootstrap 5

## Lista de Verificação Pré-Atualização

- [ ] PHP 8.2+ disponível no seu servidor
- [ ] Backup completo de banco de dados (`mysqldump -u user -p xoops_db > backup.sql`)
- [ ] Backup completo de arquivos de sua instalação
- [ ] Lista de módulos instalados e suas versões
- [ ] Tema personalizado com backup separado

## Passos de Atualização

### 1. Coloque o site em modo de manutenção

```php
// mainfile.php — adicione temporariamente
define('XOOPS_MAINTENANCE', true);
```

### 2. Baixe XOOPS 2.7

```bash
wget https://github.com/XOOPS/XoopsCore27/releases/latest/download/xoops-2.7.x.zip
unzip xoops-2.7.x.zip
```

### 3. Substitua arquivos principais

Envie os novos arquivos, **excluindo**:
- `uploads/` — seus arquivos enviados
- `xoops_data/` — sua configuração
- `modules/` — seus módulos instalados
- `themes/` — seus temas
- `mainfile.php` — sua configuração de site

```bash
rsync -av --exclude='uploads/' --exclude='xoops_data/' \
  --exclude='modules/' --exclude='themes/' --exclude='mainfile.php' \
  xoops-2.7/ /var/www/html/
```

### 4. Execute o script de atualização

Navegue até `https://seudominio.com/upgrade/` em seu navegador.
O assistente de atualização aplicará migrações de banco de dados.

### 5. Atualize módulos

Módulos do XOOPS 2.7 devem ser compatíveis com PHP 8.2.
Verifique o [Ecossistema de Módulos](/xoops-docs/2.7/module-guide/introduction/) para versões atualizadas.

No Admin → Módulos, clique em **Atualizar** para cada módulo instalado.

### 6. Remova modo de manutenção e teste

Remova a linha `XOOPS_MAINTENANCE` de `mainfile.php` e
verifique se todas as páginas carregam corretamente.

## Problemas Comuns

**Erros "Classe não encontrada" após atualização**
- Execute `composer dump-autoload` na raiz do XOOPS
- Limpe o diretório `xoops_data/caches/`

**Módulo quebrado após atualização**
- Verifique as versões de lançamento do GitHub do módulo para uma versão compatível com 2.7
- O módulo pode precisar de mudanças no código para PHP 8.2 (funções descontinuadas, propriedades tipadas)

**CSS do painel de administração quebrado**
- Limpe o cache do seu navegador
- Certifique-se de que `xoops_lib/` foi totalmente substituído durante o envio de arquivo
