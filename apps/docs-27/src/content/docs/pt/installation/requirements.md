---
title: "Requisitos"
---

## Ambiente de Software (a Pilha)

A maioria dos sites de produção do XOOPS funciona em uma pilha _LAMP_ (um sistema **L**inux executando **A**pache, **M**ySQL e **P**HP) mas, existem muitas pilhas possíveis diferentes.

Geralmente é mais fácil fazer protótipos de um novo site em uma máquina local. Para este caso, muitos usuários do XOOPS escolhem uma pilha _WAMP_ (usando **W**indows como o SO), enquanto outros executam pilhas _LAMP_ ou _MAMP_ (**M**AC).

### PHP

Qualquer versão do PHP >= 8.2.0 (PHP 8.4 ou superior é fortemente recomendado)

> **Importante:** O XOOPS 2.7.0 requer **PHP 8.2 ou mais novo**. PHP 7.x e versões anteriores não são mais suportados. Se você estiver atualizando um site antigo, confirme que seu host oferece PHP 8.2+ antes de começar.

### MySQL

MySQL server 5.7 ou superior (MySQL Server 8.4 ou superior é fortemente recomendado.) MySQL 9.0 também é suportado. MariaDB é um substituto compatível com versões anteriores e compatível com binários do MySQL e também funciona bem com XOOPS.

### Servidor Web

Um servidor web que suporta a execução de scripts PHP, como Apache, NGINX, LiteSpeed, etc.

### Extensões PHP Necessárias

O instalador do XOOPS verifica as seguintes extensões antes de permitir a continuação da instalação:

* `mysqli` — Driver de banco de dados MySQL
* `session` — Manipulação de sessão
* `pcre` — Expressões regulares compatíveis com Perl
* `filter` — Filtragem e validação de entrada
* `fileinfo` — Detecção de tipo MIME para uploads

### Configurações PHP Necessárias

Além das extensões acima, o instalador verifica a seguinte configuração `php.ini`:

* `file_uploads` deve ser **On** — sem ela, o XOOPS não pode aceitar arquivos enviados

### Extensões PHP Recomendadas

O instalador também verifica essas extensões. Eles não são estritamente necessários, mas o XOOPS e a maioria dos módulos contam com eles para funcionalidade completa. Habilite o máximo possível que seu host permite:

* `mbstring` — Manipulação de strings multibyte
* `intl` — Internacionalização
* `iconv` — Conversão de conjunto de caracteres
* `xml` — Análise de XML
* `zlib` — Compressão
* `gd` — Processamento de imagem
* `exif` — Metadados de imagem
* `curl` — Cliente HTTP para feeds e chamadas de API

## Serviços

### Acesso ao Sistema de Arquivos (para Acesso de Webmaster)

Você precisará de algum método (FTP, SFTP, etc.) para transferir os arquivos de distribuição do XOOPS para o servidor web.

### Acesso ao Sistema de Arquivos (para Processo do Servidor Web)

Para executar o XOOPS, a capacidade de criar, ler e excluir arquivos e diretórios é necessária. Os seguintes caminhos devem ser graváveis pelo processo do servidor web para uma instalação normal e operação normal do dia a dia:

* `uploads/`
* `uploads/avatars/`
* `uploads/files/`
* `uploads/images/`
* `uploads/ranks/`
* `uploads/smilies/`
* `mainfile.php` (gravável durante instalação e atualização)
* `xoops_data/`
* `xoops_data/caches/`
* `xoops_data/caches/xoops_cache/`
* `xoops_data/caches/smarty_cache/`
* `xoops_data/caches/smarty_compile/`
* `xoops_data/configs/`
* `xoops_data/configs/captcha/`
* `xoops_data/configs/textsanitizer/`
* `xoops_data/data/`
* `xoops_data/protector/`

### Banco de Dados

O XOOPS precisará criar, modificar e consultar tabelas no MySQL. Para isso você precisará de:

* Uma conta de usuário e senha MySQL
* Um banco de dados MySQL que o usuário tenha todos os privilégios (ou alternativamente, o usuário pode ter privilégio para criar tal banco de dados)

### E-mail

Para um site em tempo real, você precisará de um endereço de e-mail funcionando que o XOOPS possa usar para comunicação do usuário, como ativações de conta e redefinições de senha. Embora não seja estritamente necessário, é recomendável, se possível, usar um endereço de e-mail que corresponda ao domínio em que seu XOOPS é executado. Isso ajuda a evitar que suas comunicações sejam rejeitadas ou marcadas como spam.

## Ferramentas

Você pode precisar de algumas ferramentas adicionais para configurar e personalizar sua instalação do XOOPS. Estas podem incluir:

* Software Cliente FTP
* Editor de Texto
* Software de Arquivo para trabalhar com versões do XOOPS (arquivos _.zip_ ou _.tar.gz_).

Veja a seção [Ferramentas do Comércio](../tools/tools.md) para algumas sugestões de ferramentas adequadas e pilhas de servidor web, se necessário.

## Tópicos Especiais

Algumas combinações específicas de software de sistema podem exigir configurações adicionais para funcionar com o XOOPS. Se você estiver usando um ambiente SELinux ou atualizando um site antigo com temas personalizados, consulte [Tópicos Especiais](specialtopics.md) para obter mais informações.
