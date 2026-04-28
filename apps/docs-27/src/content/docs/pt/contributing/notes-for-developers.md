---
title: "Notas para Desenvolvedores"
---

Embora a instalação real de XOOPS para uso de desenvolvimento seja semelhante à instalação normal já descrita, há diferenças principais ao construir um sistema pronto para desenvolvedor.

Uma grande diferença em uma instalação de desenvolvedor é que em vez de apenas focar no conteúdo do diretório _htdocs_, uma instalação de desenvolvedor mantém todos os arquivos e os mantém sob controle de código-fonte usando git.

Outra diferença é que os diretórios _xoops_data_ e _xoops_lib_ geralmente podem permanecer no lugar sem renomeação, contanto que seu sistema de desenvolvimento não seja diretamente acessível na internet aberta (ou seja, em uma rede privada, como atrás de um roteador.)

A maioria dos desenvolvedores trabalha em um sistema _localhost_, que tem o código-fonte, uma pilha de servidor web e quaisquer ferramentas necessárias para trabalhar com o código e banco de dados.

Você pode encontrar mais informações no capítulo [Ferramentas do Ofício](../tools/tools.md).

## Git e Virtual Hosts

A maioria dos desenvolvedores quer ser capaz de manter-se atualizada com fontes atuais e contribuir mudanças de volta para o repositório upstream [XOOPS/XoopsCore27 no GitHub](https://github.com/XOOPS/XoopsCore27). Isso significa que em vez de baixar um arquivo de release, você vai querer [fazer fork](https://help.github.com/articles/fork-a-repo/) de uma cópia de XOOPS e usar **git** para [clonar](https://help.github.com/categories/bootcamp/) esse repositório para sua caixa de dev.

Como o repositório tem uma estrutura específica, em vez de _copiar_ arquivos do diretório _htdocs_ para seu servidor web, é melhor apontar seu servidor web para a pasta htdocs dentro de seu repositório clonado localmente. Para realizar isso, geralmente criamos um novo _Virtual Host_, ou _vhost_ que aponta para nosso código-fonte controlado por git.

Em um ambiente [WAMP](http://www.wampserver.com/), a página padrão [localhost](http://localhost/) tem em uma seção _Tools_ um link para _Add a Virtual Host_ que leva aqui:

![WAMP Add Virtual Host](/xoops-docs/2.7/img/installation/wamp-vhost-03.png)

Usando isto você pode configurar uma entrada VirtualHost que cairá direto em seu repositório (ainda) controlado por git.

Aqui está uma entrada de exemplo em `wamp64/bin/apache/apache2.x.xx/conf/extra/httpd-vhosts.conf`

```text
<VirtualHost *:80>
    ServerName xoops.localhost
    DocumentRoot "c:/users/username/documents/github/xoopscore27/htdocs"
    <Directory  "c:/users/username/documents/github/xoopscore27/htdocs/">
        Options +Indexes +Includes +FollowSymLinks +MultiViews
        AllowOverride All
        Require local
    </Directory>
</VirtualHost>
```

Você também pode precisar adicionar uma entrada em `Windows/System32/drivers/etc/hosts`:

```text
127.0.0.1    xoops.localhost
```

Agora, você pode instalar em `http://xoops.localhost/` para testes, enquanto mantém seu repositório intacto e mantém o servidor web dentro do diretório htdocs com uma URL simples. Além disso, você pode atualizar sua cópia local de XOOPS para o master mais recente a qualquer momento sem precisar reinstalar ou copiar arquivos. E, você pode fazer aprimoramentos e correções ao código para contribuir de volta para XOOPS através do GitHub.

## Dependências do Composer

XOOPS 2.7.0 usa [Composer](https://getcomposer.org/) para gerenciar suas dependências de PHP. A árvore de dependências fica em `htdocs/xoops_lib/` dentro do repositório de fontes:

* `composer.dist.json` é a lista mestre de dependências enviadas com a release.
* `composer.json` é a cópia local, que você pode personalizar para seu ambiente de desenvolvimento se necessário.
* `composer.lock` fixa versões exatas para que instalações sejam reproduzíveis.
* `vendor/` contém as bibliotecas instaladas (Smarty 4, PHPMailer, HTMLPurifier, firebase/php-jwt, monolog, symfony/var-dumper, xoops/xmf, xoops/regdom, e outras).

Para um clone git fresco de XOOPS 2.7.0, começando pela raiz do repositório, execute:

```text
cd htdocs/xoops_lib
composer install
```

Observe que não há `composer.json` na raiz do repositório — o projeto fica em `htdocs/xoops_lib/`, então você deve `cd` para esse diretório antes de executar o Composer.

Os tarballs de release são enviados com `vendor/` pré-populado, mas clones git podem não ter. Mantenha `vendor/` intacto em instalações de desenvolvimento — XOOPS carregará suas dependências de lá em tempo de execução.

A biblioteca [XMF (XOOPS Module Framework)](https://github.com/XOOPS/xmf) é enviada como uma dependência do Composer em 2.7.0, para que você possa usar `Xmf\Request`, `Xmf\Database\TableLoad` e classes relacionadas em seu código de módulo sem qualquer instalação adicional.

## Módulo DebugBar

XOOPS 2.7.0 envia um módulo **DebugBar** baseado em Symfony VarDumper. Ele adiciona uma barra de ferramentas de debug às páginas renderizadas que expõe informações de request, banco de dados e template. Instale-o na área de administrador de Módulos em sites de desenvolvimento e staging. Não o deixe instalado em um site de produção voltado para o público a menos que você saiba que deseja.
