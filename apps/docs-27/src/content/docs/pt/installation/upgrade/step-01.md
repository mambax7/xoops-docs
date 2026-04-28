---
title: "Preparações para Atualização"
---

## Desligar o Site

Antes de iniciar o processo de atualização do XOOPS, você deve definir o item "Desligar seu site?" como _Sim_ na página Preferências -> Opções de Sistema -> Configurações Gerais no Menu de Administração.

Isso impede que os usuários encontrem um site quebrado durante a atualização. Também mantém a contenção de recursos no mínimo para garantir uma atualização mais suave.

Em vez de erros e um site quebrado, seus visitantes verão algo assim:

![Site Fechado em Mobile](/xoops-docs/2.7/img/installation/mobile-site-closed.png)

## Backup

É uma boa ideia usar a seção _Manutenção_ de administração do XOOPS para _Limpar pasta de cache_ para todos os caches antes de fazer um backup completo dos arquivos do site. Com o site desligado, usar o _Esvaziar tabela de sessões_ também é recomendado para que, se uma restauração for necessária, as sessões obsoletas não façam parte dela.

### Arquivos

O backup de arquivo pode ser feito com FTP, copiando todos os arquivos para sua máquina local. Se você tiver acesso direto ao shell do servidor, pode ser _muito_ mais rápido fazer uma cópia (ou uma cópia de arquivo) lá.

### Banco de Dados

Para fazer um backup de banco de dados, você pode usar as funções integradas na seção _Manutenção_ de administração do XOOPS. Você também pode usar as funções _Exportar_ em _phpMyAdmin_, se disponível. Se você tiver acesso ao shell, você pode usar o comando _mysql_ para despejar seu banco de dados.

Ser fluente em fazer backup e _restaurar_ seu banco de dados é uma habilidade importante de webmaster. Há muitos recursos online que você pode usar para aprender mais sobre essas operações conforme apropriado para sua instalação, como [http://webcheatsheet.com/sql/mysql_backup_restore.php](http://webcheatsheet.com/sql/mysql_backup_restore.php)

![Exportação phpMyAdmin](/xoops-docs/2.7/img/installation/phpmyadmin-export-01.png)

## Copiar Novos Arquivos para o Site

Copiar os novos arquivos para seu site é praticamente idêntico à etapa [Preparações](../../installation/preparations/) durante a instalação. Você deve copiar os diretórios _xoops_data_ e _xoops_lib_ para onde quer que tenham sido relocalizados durante a instalação. Depois, copie o resto do conteúdo do diretório _htdocs_ da distribuição (com algumas exceções cobertas na próxima seção) sobre os arquivos e diretórios existentes em sua raiz da web.

No XOOPS 2.7.0, copiar uma nova distribuição sobre um site existente **não sobrescrita arquivos de configuração existentes** como `mainfile.php` ou `xoops_data/data/secure.php`. Esta é uma mudança bem-vinda em relação às versões anteriores, mas você ainda deve fazer um backup completo antes de começar.

Copie todo o diretório _upgrade_ da distribuição para a raiz da web, criando um diretório _upgrade_ lá.

## Execute a Verificação de Pré-voo Smarty 4

Antes de iniciar o fluxo de trabalho principal do `/upgrade/`, você deve executar o scanner de pré-voo fornecido no diretório `upgrade/`. Ele examina seus templates de tema e módulo existentes para questões de compatibilidade do Smarty 4 e pode reparar muitos deles automaticamente.

1. Aponte seu navegador para _seu-url-site_/upgrade/preflight.php
2. Faça login com uma conta de administrador
3. Execute a varredura e revise o relatório
4. Aplique qualquer reparo automático oferecido ou corrija manualmente os templates marcados
5. Re-execute a varredura até que esteja limpa
6. Apenas então continue para o upgrade principal

Veja a página [Verificação de Pré-voo](preflight.md) para um guia completo.

### Coisas Que Você Pode Não Querer Copiar

Você não deve recopiar o diretório _install_ em um sistema XOOPS funcionando. Deixar a pasta de instalação em sua instalação XOOPS expõe seu sistema a possíveis problemas de segurança. O instalador o renomeia aleatoriamente, mas você deve deletá-lo e certificar-se de que não copie outro.

Há alguns arquivos que você pode ter editado para personalizar seu site, e você vai querer preservar esses. Aqui está uma lista de personalizações comuns.

* _xoops_data/configs/xoopsconfig.php_ se tiver sido alterado desde que o site foi instalado
* quaisquer diretórios em _themes_ se personalizados para seu site. Neste caso, você pode querer comparar arquivos para identificar atualizações úteis.
* qualquer arquivo em _class/captcha/_ começando com "config" se tiver sido alterado desde que o site foi instalado
* quaisquer personalizações em _class/textsanitizer_
* quaisquer personalizações em _class/xoopseditor_

Se você perceber após a atualização que algo foi acidentalmente sobrescrito, não entre em pânico -- é por isso que você começou com um backup completo. _(Você fez um backup, certo?)_

## Verificar mainfile.php (Atualizando de XOOPS Pré-2.5)

Este passo se aplica apenas se você estiver atualizando de uma versão antiga do XOOPS (2.3 ou anterior). Se você estiver atualizando do XOOPS 2.5.x, você pode pular esta seção.

Versões antigas do XOOPS exigiam algumas alterações manuais a serem feitas em `mainfile.php` para ativar o módulo Protector. Em sua raiz da web você deve ter um arquivo chamado `mainfile.php`. Abra esse arquivo em seu editor e procure por essas linhas:

```php
include XOOPS_TRUST_PATH.'/modules/protector/include/precheck.inc.php' ;
```

e

```php
include XOOPS_TRUST_PATH.'/modules/protector/include/postcheck.inc.php' ;
```

Remova essas linhas se as encontrar e salve o arquivo antes de continuar.
