---
title: "Configuração Básica"
description: "Configuração inicial do XOOPS incluindo configurações de mainfile.php, nome do site, email e configuração de fuso horário"
---

# Configuração Básica do XOOPS

Este guia cobre as configurações essenciais para seu site XOOPS funcionar corretamente após a instalação.

## Configuração do mainfile.php

O arquivo `mainfile.php` contém configuração crítica para sua instalação do XOOPS. Ele é criado durante a instalação, mas você pode precisar editá-lo manualmente.

### Localização

```
/var/www/html/xoops/mainfile.php
```

### Estrutura do Arquivo

```php
<?php
// Configuração do Banco de Dados
define('XOOPS_DB_TYPE', 'mysqli');  // Tipo de banco de dados
define('XOOPS_DB_HOST', 'localhost');  // Host do banco de dados
define('XOOPS_DB_USER', 'xoops_user');  // Usuário do banco de dados
define('XOOPS_DB_PASS', 'password');  // Senha do banco de dados
define('XOOPS_DB_NAME', 'xoops_db');  // Nome do banco de dados
define('XOOPS_DB_PREFIX', 'xoops_');  // Prefixo de tabela

// Configuração do Site
define('XOOPS_ROOT_PATH', '/var/www/html/xoops');  // Caminho do sistema de arquivos
define('XOOPS_URL', 'http://your-domain.com/xoops');  // URL web
define('XOOPS_TRUST_PATH', '/var/www/html/xoops/var');  // Caminho confiável

// Conjunto de Caracteres
define('XOOPS_DB_CHARSET', 'utf8mb4');  // Charset do banco de dados
define('_CHARSET', 'UTF-8');  // Charset da página

// Modo de Debug (definir 0 em produção)
define('XOOPS_DEBUG', 0);  // Definir 1 para depuração
?>
```

### Configurações Críticas Explicadas

| Configuração | Propósito | Exemplo |
|---|---|---|
| `XOOPS_DB_TYPE` | Sistema de banco de dados | `mysqli`, `mysql`, `pdo` |
| `XOOPS_DB_HOST` | Localização do servidor de banco de dados | `localhost`, `192.168.1.1` |
| `XOOPS_DB_USER` | Usuário do banco de dados | `xoops_user` |
| `XOOPS_DB_PASS` | Senha do banco de dados | [senha_segura] |
| `XOOPS_DB_NAME` | Nome do banco de dados | `xoops_db` |
| `XOOPS_DB_PREFIX` | Prefixo de nome de tabela | `xoops_` (permite múltiplos XOOPS em um BD) |
| `XOOPS_ROOT_PATH` | Caminho físico do sistema de arquivos | `/var/www/html/xoops` |
| `XOOPS_URL` | URL acessível na web | `http://your-domain.com` |
| `XOOPS_TRUST_PATH` | Caminho confiável (fora da raiz web) | `/var/www/xoops_var` |

### Editando mainfile.php

Abra mainfile.php em um editor de texto:

```bash
# Usando nano
nano /var/www/html/xoops/mainfile.php

# Usando vi
vi /var/www/html/xoops/mainfile.php

# Usando sed (localizar e substituir)
sed -i "s|define('XOOPS_URL'.*|define('XOOPS_URL', 'http://novo-dominio.com');|" /var/www/html/xoops/mainfile.php
```

### Mudanças Comuns do mainfile.php

**Alterar URL do site:**
```php
define('XOOPS_URL', 'https://seudominio.com');
```

**Habilitar modo de debug (apenas desenvolvimento):**
```php
define('XOOPS_DEBUG', 1);
```

**Alterar prefixo de tabela (se necessário):**
```php
define('XOOPS_DB_PREFIX', 'meuoxoops_');
```

**Mover caminho confiável para fora da raiz web (avançado):**
```php
define('XOOPS_TRUST_PATH', '/var/www/xoops_var');
```

## Configuração do Painel de Administração

Configure configurações básicas através do painel de administração XOOPS.

### Acessando Configurações do Sistema

1. Faça login no painel de administração: `http://your-domain.com/xoops/admin/`
2. Navegue para: **Sistema > Preferências > Configurações Gerais**
3. Modifique as configurações (veja abaixo)
4. Clique em "Salvar" na parte inferior

### Nome e Descrição do Site

Configure como seu site aparece:

```
Nome do Site: Meu Site XOOPS
Descrição do Site: Um sistema dinâmico de gerenciamento de conteúdo
Slogan do Site: Construído com XOOPS
```

### Informações de Contato

Defina detalhes de contato do site:

```
Email de Admin do Site: admin@seu-dominio.com
Nome de Admin do Site: Administrador do Site
Email de Formulário de Contato: suporte@seu-dominio.com
Email de Suporte: ajuda@seu-dominio.com
```

### Idioma e Região

Defina idioma e região padrão:

```
Idioma Padrão: Português
Fuso Horário Padrão: America/Sao_Paulo (ou seu fuso horário)
Formato de Data: %d/%m/%Y
Formato de Hora: %H:%M:%S
```

## Configuração de Email

Configure as configurações de email para notificações e comunicações com o usuário.

### Localização das Configurações de Email

**Painel de Administração:** Sistema > Preferências > Configurações de Email

### Configuração SMTP

Para entrega de email confiável, use SMTP em vez de PHP mail():

```
Usar SMTP: Sim
Host SMTP: smtp.gmail.com (ou seu provedor SMTP)
Porta SMTP: 587 (TLS) ou 465 (SSL)
Usuário SMTP: seu-email@gmail.com
Senha SMTP: [senha_de_aplicativo]
Segurança SMTP: TLS ou SSL
```

### Exemplo de Configuração do Gmail

Configure XOOPS para enviar email via Gmail:

```
Host SMTP: smtp.gmail.com
Porta SMTP: 587
Segurança SMTP: TLS
Usuário SMTP: seu-email@gmail.com
Senha SMTP: [Senha de Aplicativo do Google - NÃO a senha regular]
Endereço De: seu-email@gmail.com
Nome De: Nome do Seu Site
```

**Nota:** Gmail requer uma Senha de Aplicativo, não sua senha do Gmail:
1. Vá para https://myaccount.google.com/apppasswords
2. Gere uma senha de aplicativo para "Email" e "Computador Windows"
3. Use a senha gerada no XOOPS

### Configuração de PHP mail() (Mais Simples, Mas Menos Confiável)

Se SMTP não estiver disponível, use PHP mail():

```
Usar SMTP: Não
Endereço De: noreply@seu-dominio.com
Nome De: Nome do Seu Site
```

Certifique-se de que seu servidor tem sendmail ou postfix configurado:

```bash
# Verificar se sendmail está disponível
which sendmail

# Ou verificar postfix
systemctl status postfix
```

### Configurações de Função de Email

Configure o que dispara emails:

```
Enviar Notificações: Sim
Notificar Admin no Registro de Usuário: Sim
Enviar Email de Boas-vindas para Novos Usuários: Sim
Enviar Link de Redefinição de Senha: Sim
Habilitar Email do Usuário: Sim
Habilitar Mensagens Privadas: Sim
Notificar em Ações de Admin: Sim
```

## Configuração de Fuso Horário

Defina o fuso horário apropriado para carimbos de data/hora e agendamento corretos.

### Definindo Fuso Horário no Painel de Administração

**Caminho:** Sistema > Preferências > Configurações Gerais

```
Fuso Horário Padrão: [Selecione seu fuso horário]
```

**Fusos Horários Comuns:**
- America/New_York (EST/EDT)
- America/Chicago (CST/CDT)
- America/Denver (MST/MDT)
- America/Los_Angeles (PST/PDT)
- Europe/London (GMT/BST)
- Europe/Paris (CET/CEST)
- Asia/Tokyo (JST)
- Asia/Shanghai (CST)
- Australia/Sydney (AEDT/AEST)
- America/Sao_Paulo (BRT/BRST)

### Verificar Fuso Horário

Verificar fuso horário do servidor atual:

```bash
# Mostrar fuso horário atual
timedatectl

# Ou verificar data
date +%Z

# Listar fusos horários disponíveis
timedatectl list-timezones
```

### Definir Fuso Horário do Sistema (Linux)

```bash
# Definir fuso horário
timedatectl set-timezone America/Sao_Paulo

# Ou usar método de symlink
ln -sf /usr/share/zoneinfo/America/Sao_Paulo /etc/localtime

# Verificar
date
```

## Configuração de URL

### Habilitar URLs Limpas (URLs Amigáveis)

Para URLs como `/pagina/sobre` em vez de `/index.php?page=about`

**Requisitos:**
- Apache com mod_rewrite habilitado
- Arquivo `.htaccess` na raiz XOOPS

**Habilitar no Painel de Administração:**

1. Vá para: **Sistema > Preferências > Configurações de URL**
2. Marque: "Habilitar URLs Amigáveis"
3. Selecione: "Tipo de URL" (Path Info ou Query)
4. Salve

**Verificar se .htaccess Existe:**

```bash
cat /var/www/html/xoops/.htaccess
```

Conteúdo de exemplo de .htaccess:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /xoops/
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.php?$1 [L,QSA]
</IfModule>
```

**Solução de Problemas de URLs Limpas:**

```bash
# Verificar se mod_rewrite está habilitado
apache2ctl -M | grep rewrite

# Habilitar se necessário
a2enmod rewrite

# Reiniciar Apache
systemctl restart apache2

# Testar regra de rewrite
curl -I http://seu-dominio.com/xoops/index.php
```

### Configurar URL do Site

**Painel de Administração:** Sistema > Preferências > Configurações Gerais

Defina a URL correta para seu domínio:

```
URL do Site: http://seu-dominio.com/xoops/
```

Ou se XOOPS está na raiz:

```
URL do Site: http://seu-dominio.com/
```

## Otimização para Motores de Busca (SEO)

Configure configurações de SEO para melhor visibilidade em motores de busca.

### Meta Tags

Defina meta tags globais:

**Painel de Administração:** Sistema > Preferências > Configurações de SEO

```
Palavras-chave de Meta: xoops, cms, gerenciamento de conteúdo
Descrição de Meta: Um sistema dinâmico de gerenciamento de conteúdo
```

Estas aparecem na tag `<head>` da página:

```html
<meta name="keywords" content="xoops, cms, gerenciamento de conteúdo">
<meta name="description" content="Um sistema dinâmico de gerenciamento de conteúdo">
```

### Sitemap

Habilitar mapa do site XML para motores de busca:

1. Vá para: **Sistema > Módulos**
2. Encontre o módulo "Sitemap"
3. Clique para instalar e habilitar
4. Acesse o sitemap em: `/xoops/sitemap.xml`

### Robots.txt

Controle o rastreamento de mecanismo de busca:

Crie `/var/www/html/xoops/robots.txt`:

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /templates_c/
Disallow: /install/
Disallow: /upgrade/

Sitemap: https://seu-dominio.com/xoops/sitemap.xml
```

## Configurações de Usuário

Configure configurações padrão relacionadas ao usuário.

### Registro de Usuário

**Painel de Administração:** Sistema > Preferências > Configurações de Usuário

```
Permitir Registro de Usuário: Sim/Não
Tipo de Registro de Usuário:
  - Instantâneo (Aprovação automática)
  - Aprovação Necessária (Aprovação de admin necessária)
  - Verificação de Email (Confirmação de email necessária)

Confirmação de Email Necessária: Sim/Não
Método de Ativação de Conta: Automático/Manual
```

### Perfil de Usuário

```
Habilitar Perfis de Usuário: Sim
Mostrar Avatar de Usuário: Sim
Tamanho Máximo de Avatar: 100KB
Dimensões de Avatar: 100x100 pixels
```

### Exibição de Email de Usuário

```
Mostrar Email de Usuário: Não (para privacidade)
Usuários Podem Ocultar Email: Sim
Usuários Podem Alterar Avatar: Sim
Usuários Podem Fazer Upload de Arquivos: Sim
```

## Configuração de Cache

Melhore o desempenho com cache apropriado.

### Configurações de Cache

**Painel de Administração:** Sistema > Preferências > Configurações de Cache

```
Habilitar Cache: Sim
Método de Cache: Arquivo (ou APCu/Memcache se disponível)
Tempo de Vida do Cache: 3600 segundos (1 hora)
```

### Limpar Cache

Limpe arquivos de cache antigos:

```bash
# Limpeza manual de cache
rm -rf /var/www/html/xoops/cache/*
rm -rf /var/www/html/xoops/templates_c/*

# Do painel de administração:
# Sistema > Painel > Ferramentas > Limpar Cache
```

## Lista de Verificação de Configurações Iniciais

Após a instalação, configure:

- [ ] Nome e descrição do site definidos corretamente
- [ ] Email de admin configurado
- [ ] Configurações de email SMTP configuradas e testadas
- [ ] Fuso horário definido para sua região
- [ ] URL configurada corretamente
- [ ] URLs limpas (URLs amigáveis) habilitadas se desejado
- [ ] Configurações de registro de usuário configuradas
- [ ] Meta tags para SEO configuradas
- [ ] Idioma padrão selecionado
- [ ] Configurações de cache habilitadas
- [ ] Senha de usuário de admin é forte (16+ caracteres)
- [ ] Testar registro de usuário
- [ ] Testar funcionalidade de email
- [ ] Testar upload de arquivo
- [ ] Visitar página inicial e verificar aparência

## Testando Configuração

### Teste de Email

Envie um email de teste:

**Painel de Administração:** Sistema > Teste de Email

Ou manualmente:

```php
<?php
// Crie arquivo de teste: /var/www/html/xoops/test-email.php
require_once __DIR__ . '/mainfile.php';
require_once XOOPS_ROOT_PATH . '/class/mail/phpmailer/class.phpmailer.php';

$mailer = xoops_getMailer();
$mailer->addRecipient('admin@seu-dominio.com');
$mailer->setSubject('Teste de Email do XOOPS');
$mailer->setBody('Este é um email de teste do XOOPS');

if ($mailer->send()) {
    echo "Email enviado com sucesso!";
} else {
    echo "Falha ao enviar email: " . $mailer->getError();
}
?>
```

### Teste de Conexão de Banco de Dados

```php
<?php
// Crie arquivo de teste: /var/www/html/xoops/test-db.php
require_once __DIR__ . '/mainfile.php';

$connection = XoopsDatabaseFactory::getDatabaseConnection();
if ($connection) {
    echo "Banco de dados conectado com sucesso!";
    $result = $connection->query("SELECT COUNT(*) FROM " . $connection->prefix("users"));
    if ($result) {
        echo "Consulta bem-sucedida!";
    }
} else {
    echo "Conexão com banco de dados falhou!";
}
?>
```

**Importante:** Exclua arquivos de teste após testá-los!

```bash
rm /var/www/html/xoops/test-*.php
```

## Resumo de Arquivos de Configuração

| Arquivo | Propósito | Método de Edição |
|---|---|---|
| mainfile.php | Banco de dados e configurações principais | Editor de texto |
| Painel de Administração | Maioria das configurações | Interface web |
| .htaccess | Reescrita de URL | Editor de texto |
| robots.txt | Rastreamento de mecanismo de busca | Editor de texto |

## Próximos Passos

Após a configuração básica:

1. Configurar definições de sistema em detalhes
2. Reforçar segurança
3. Explorar painel de administração
4. Criar seu primeiro conteúdo
5. Configurar contas de usuário

---

**Tags:** #configuration #setup #email #timezone #seo

**Artigos Relacionados:**
- ../Installation/Installation
- System-Settings
- Security-Configuration
- Performance-Optimization
