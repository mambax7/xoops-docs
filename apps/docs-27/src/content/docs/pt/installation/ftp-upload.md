---
title: "Apêndice 2: Envio de XOOPS via FTP"
---

Este apêndice apresenta o processo de implantação do XOOPS 2.7.0 em um servidor remoto usando FTP ou SFTP. Qualquer painel de controle (cPanel, Plesk, DirectAdmin, etc.) exposará os mesmos passos subjacentes.

## 1. Prepare o banco de dados

Através do painel de controle do seu host:

1. Crie um novo banco de dados MySQL para XOOPS.
2. Crie um usuário de banco de dados com uma senha forte.
3. Conceda ao usuário privilégios totais no banco de dados recém-criado.
4. Registre o nome do banco de dados, nome de usuário, senha e host — você os inserirá no instalador do XOOPS.

> **Dica**
>
> Painéis de controle modernos geram senhas fortes para você. Como a aplicação armazena a senha em `xoops_data/data/secure.php`, você não precisa digitá-la frequentemente — prefira um valor longo e gerado aleatoriamente.

## 2. Crie uma caixa de correio de administrador

Crie uma caixa de correio de e-mail que receberá notificações de administração do site. O instalador do XOOPS solicita este endereço durante a configuração da conta de webmaster e o valida com `FILTER_VALIDATE_EMAIL`.

## 3. Envie os arquivos

O XOOPS 2.7.0 é fornecido com suas dependências de terceiros pré-instaladas em `xoops_lib/vendor/` (pacotes Composer, Smarty 4, HTMLPurifier, PHPMailer, Monolog, TCPDF e muito mais). Isso torna `xoops_lib/` significativamente maior do que na versão 2.5.x — espere dezenas de megabytes.

**Não pule seletivamente arquivos dentro de `xoops_lib/vendor/`.** Pular arquivos na árvore do fornecedor Composer quebrará o carregamento automático e a instalação falhará.

Estrutura de envio (assumindo que `public_html` é a raiz de documentos):

1. Envie `xoops_data/` e `xoops_lib/` **ao lado de** `public_html`, não dentro dele. Colocá-los fora da raiz da web é a posição de segurança recomendada para a versão 2.7.0.

   ```
   /home/seu-usuario/
   ├── public_html/
   ├── xoops_data/     ← envie aqui
   └── xoops_lib/      ← envie aqui
   ```

   ![](/xoops-docs/2.7/img/installation/img_66.jpg)
   ![](/xoops-docs/2.7/img/installation/img_67.jpg)

2. Envie o conteúdo restante do diretório `htdocs/` da distribuição para `public_html/`.

   ![](/xoops-docs/2.7/img/installation/img_68.jpg)

> **Se seu host não permitir diretórios fora da raiz de documentos**
>
> Envie `xoops_data/` e `xoops_lib/` **dentro de** `public_html/` e **renomeie-os para nomes não óbvios** (por exemplo `xdata_8f3k2/` e `xlib_7h2m1/`). Você inserirá os caminhos renomeados no instalador quando ele solicitar o Caminho de Dados do XOOPS e o Caminho de Biblioteca do XOOPS.

## 4. Tornar os diretórios graváveis graváveis

Através do diálogo CHMOD do cliente FTP (ou SSH), torne os diretórios listados no Capítulo 2 graváveis pelo servidor web. Na maioria dos hosts compartilhados, `0775` em diretórios e `0664` em `mainfile.php` são suficientes. `0777` é aceitável durante a instalação se seu host executar PHP sob um usuário diferente do usuário FTP, mas aperte as permissões após a conclusão da instalação.

## 5. Inicie o instalador

Aponte seu navegador para a URL pública do site. Se todos os arquivos estiverem no lugar, o Assistente de Instalação do XOOPS inicia e você pode seguir o resto deste guia a partir do [Capítulo 2](chapter-2-introduction.md) em diante.
