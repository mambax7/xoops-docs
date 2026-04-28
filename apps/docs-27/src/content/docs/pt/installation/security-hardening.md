---
title: "Apêndice 5: Aumentar a segurança da sua instalação XOOPS"
---

Após instalar o XOOPS 2.7.0, tome os seguintes passos para proteger o site. Cada etapa é individual opcional, mas juntas elas aumentam significativamente a segurança básica da instalação.

## 1. Instalar e configurar o módulo Protector

O módulo `protector` incluído é o firewall do XOOPS. Se você não o instalou durante o assistente inicial, instale-o na tela Admin → Módulos agora.

![](/xoops-docs/2.7/img/installation/img_73.jpg)

Abra o painel de administração do Protector e revise os avisos exibidos. Diretivas PHP legadas como `register_globals` não existem mais (PHP 8.2+ as removeu), portanto você não verá mais esses avisos. Os avisos atuais geralmente se referem a permissões de diretório, configurações de sessão e configuração de caminho de confiança.

## 2. Bloquear `mainfile.php` e `secure.php`

Quando o instalador termina, tenta marcar ambos os arquivos como somente leitura, mas alguns hosts revertem as permissões. Verifique e reaplique se necessário:

- `mainfile.php` → `0444` (proprietário, grupo, outro somente leitura)
- `xoops_data/data/secure.php` → `0444`

`mainfile.php` define as constantes de caminho (`XOOPS_ROOT_PATH`, `XOOPS_PATH`, `XOOPS_VAR_PATH`, `XOOPS_URL`, `XOOPS_COOKIE_DOMAIN`, `XOOPS_COOKIE_DOMAIN_USE_PSL`) e sinalizadores de produção. `secure.php` contém as credenciais do banco de dados:

- Na versão 2.5.x, as credenciais do banco de dados costumavam morar em `mainfile.php`. Agora estão armazenadas em `xoops_data/data/secure.php`, que é carregado por `mainfile.php` em tempo de execução. Manter `secure.php` dentro de `xoops_data/` — um diretório que você é encorajado a realocar fora da raiz de documentos — torna muito mais difícil para um invasor alcançar as credenciais via HTTP.

## 3. Mover `xoops_lib/` e `xoops_data/` para fora da raiz de documentos

Se você ainda não o fez, mova esses dois diretórios um nível acima de sua raiz web e renomeie-os. Em seguida, atualize as constantes correspondentes em `mainfile.php`:

```php
define('XOOPS_ROOT_PATH', '/home/you/www');
define('XOOPS_PATH',      '/home/you/zubra_mylib');
define('XOOPS_VAR_PATH',  '/home/you/zubra_mydata');
define('XOOPS_TRUST_PATH', XOOPS_PATH);
```

Colocar esses diretórios fora da raiz de documentos evita acesso direto à árvore `vendor/` do Composer, templates em cache, arquivos de sessão, dados enviados e as credenciais do banco de dados em `secure.php`.

## 4. Configuração de domínio de cookie

O XOOPS 2.7.0 introduz duas constantes de domínio de cookie em `mainfile.php`:

```php
// Use a Public Suffix List (PSL) para derivar o domínio registrável.
define('XOOPS_COOKIE_DOMAIN_USE_PSL', true);

// Domínio de cookie explícito; pode ser em branco, o host completo, ou o domínio registrável.
define('XOOPS_COOKIE_DOMAIN', '');
```

Diretrizes:

- Deixe `XOOPS_COOKIE_DOMAIN` em branco se você servir XOOPS a partir de um único nome de host ou de um IP.
- Use o host completo (por exemplo, `www.example.com`) para escopo de cookies apenas para esse nome de host.
- Use o domínio registrável (por exemplo, `example.com`) quando você quiser que cookies sejam compartilhados em `www.example.com`, `blog.example.com`, etc.
- `XOOPS_COOKIE_DOMAIN_USE_PSL = true` permite que o XOOPS divida corretamente TLDs compostos (`co.uk`, `com.au`, …) em vez de acidentalmente definir um cookie no TLD efetivo.

## 5. Sinalizadores de produção em `mainfile.php`

`mainfile.dist.php` é fornecido com esses dois sinalizadores definidos como `false` para produção:

```php
define('XOOPS_DB_LEGACY_LOG', false); // desabilitar registro de uso de SQL legado
define('XOOPS_DEBUG',         false); // desabilitar avisos de depuração
```

Deixe-os desativados em produção. Ative-os temporariamente em um ambiente de desenvolvimento ou staging quando quiser:

- Caçar chamadas de banco de dados legado remanescentes (`XOOPS_DB_LEGACY_LOG = true`);
- Avisos de superfície `E_USER_DEPRECATED` e outras saídas de depuração (`XOOPS_DEBUG = true`).

## 6. Deletar o instalador

Após a conclusão da instalação:

1. Delete qualquer diretório `install_remove_*` renomeado da raiz web.
2. Delete qualquer script `install_cleanup_*.php` que o assistente criou durante a limpeza.
3. Confirme se o diretório `install/` não está mais acessível via HTTP.

Deixar um instalador desabilitado mas presente é um risco de baixa gravidade mas evitável.

## 7. Manter XOOPS e módulos atualizados

O XOOPS segue uma cadência de patch regular. Subscreva o repositório XoopsCore27 GitHub para notificações de lançamento e atualize seu site e quaisquer módulos de terceiros sempre que um novo lançamento for enviado. As atualizações de segurança para 2.7.x são publicadas através da página Releases do repositório.
