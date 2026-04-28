---
title: "Movendo um Site"
---

Pode ser uma técnica muito útil fazer um protótipo de um novo site XOOPS em um sistema local ou em um servidor de desenvolvimento. Também pode ser muito prudente testar uma atualização do XOOPS em uma cópia do seu site de produção primeiro, apenas no caso de algo dar errado. Para fazer isso, você precisa ser capaz de mover seu site XOOPS de um site para outro. Aqui está o que você precisa saber para mover com sucesso seu site XOOPS.

O primeiro passo é estabelecer seu novo ambiente de site. Os mesmos itens cobertos na seção [Preparações Avançadas](../installation/preparations/) também se aplicam aqui.

Em resumo, essas etapas são:

* obter hospedagem, incluindo quaisquer requisitos de nome de domínio ou e-mail
* obter uma conta e senha de usuário MySQL
* obter um banco de dados MySQL que o usuário acima tem todos os privilégios

O resto do processo é bastante semelhante a uma instalação normal, mas:

* em vez de copiar os arquivos da distribuição do XOOPS, você os copiará do site existente
* em vez de executar o instalador, você importará um banco de dados já populado
* em vez de inserir respostas no instalador, você alterará as respostas anteriores nos arquivos e banco de dados

## Copiar os Arquivos do Site Existente

Faça uma cópia completa dos arquivos do seu site existente para sua máquina local, onde você possa editá-los. Se você estiver trabalhando com um host remoto, você pode usar FTP para copiar os arquivos. Você precisa de uma cópia para trabalhar mesmo se o site estiver sendo executado na sua máquina local, basta fazer outra cópia dos diretórios do site nesse caso.

É importante lembrar de incluir os diretórios _xoops_data_ e _xoops_lib_ mesmo se forem renomeados e/ou realocados.

Para tornar as coisas mais suaves, você deve eliminar os arquivos de cache e templates compilados do Smarty da sua cópia. Esses arquivos serão recriados no seu novo ambiente e podem causar problemas se forem mantidas informações antigas incorretas se não forem limpas. Para fazer isso, delete todos os arquivos, exceto _index.html_, em todos esses três diretórios:

* _xoops_data_/caches/smarty_cache
* _xoops_data_/caches/smarty_compile
* _xoops_data_/caches/xoops_cache

> **Nota:** Limpar `smarty_compile` é especialmente importante ao mover um site para ou do XOOPS 2.7.0. O XOOPS 2.7.0 usa Smarty 4, e os templates compilados do Smarty 4 não são intercambiáveis com os templates compilados do Smarty 3. Deixar arquivos compilados obsoletos no lugar causará erros de template no primeiro carregamento de página no novo site.

### `xoops_lib` e Dependências do Composer

O XOOPS 2.7.0 gerencia suas dependências PHP através do Composer, dentro de `xoops_lib/`. O diretório `xoops_lib/vendor/` contém as bibliotecas de terceiros que o XOOPS precisa em tempo de execução (Smarty 4, PHPMailer, HTMLPurifier, etc.). Ao mover um site, você deve copiar toda a árvore `xoops_lib/` — incluindo `vendor/` — para o novo host. Não tente regenerar `vendor/` no host de destino, a menos que seja um desenvolvedor que tenha personalizado `composer.json` e tenha o Composer disponível no destino.

## Configurar o Novo Ambiente

Os mesmos itens cobertos na seção [Preparações Avançadas](../installation/preparations/) também se aplicam aqui. Assumiremos aqui que você tem qualquer hospedagem que precisar para o site que está movendo.

### Informações Chave (mainfile.php e secure.php)

Mover um site com sucesso envolve alterar quaisquer referências a nomes de arquivo absolutos e nomes de caminho, URLs, parâmetros de banco de dados e credenciais de acesso.

Dois arquivos, `mainfile.php` na raiz web do seu site, e `data/secure.php` no diretório _xoops_data_ (renomeado e/ou realocado) do seu site definem os parâmetros básicos do site, como sua URL, onde fica no sistema de arquivos do host, e como ele se conecta ao banco de dados.

Você precisará saber quais são os valores no sistema antigo e quais serão no sistema novo.

#### mainfile.php

| Nome | Valor Antigo em mainfile.php | Novo Valor em mainfile.php |
| :--- | :--- | :--- |
| XOOPS_ROOT_PATH |  |  |
| XOOPS_PATH |  |  |
| XOOPS_VAR_PATH |  |  |
| XOOPS_URL |  |  |
| XOOPS_COOKIE_DOMAIN |  |  |

Abra _mainfile.php_ no seu editor. Altere os valores das definições mostradas no gráfico acima dos valores antigos para os valores apropriados para o novo site.

Mantenha notas dos valores antigos e novos, pois precisaremos fazer alterações semelhantes em outros lugares em algumas etapas posteriores.

Como exemplo, se você estiver movendo um site do seu PC local para um serviço de hospedagem comercial, seus valores podem ser assim:

| Nome | Valor Antigo em mainfile.php | Novo Valor em mainfile.php |
| :--- | :--- | :--- |
| XOOPS_ROOT_PATH | c:/wamp/xoopscore27/htdocs | /home8/example/public_html |
| XOOPS_PATH | c:/wamp/xoopscore27/htdocs/xoops_lib | /home8/example/private/xoops_lib |
| XOOPS_VAR_PATH | c:/wamp/xoopscore27/htdocs/xoops_data | /home8/example/private/xoops_data |
| XOOPS_URL | http://localhost/xoops | https://example.com |
| XOOPS_COOKIE_DOMAIN | localhost | example.com |

Após alterar _mainfile.php_, salve-o.

É possível que alguns outros arquivos possam conter referências codificadas à sua URL ou mesmo caminhos. Isso é mais provável em temas e menus personalizados, mas com seu editor, você pode pesquisar em todos os arquivos, apenas para ter certeza.

No seu editor, faça uma pesquisa em todos os arquivos da sua cópia, procurando pelo valor antigo de XOOPS_URL, e substitua-o pelo novo valor.

Faça o mesmo para o valor antigo de XOOPS_ROOT_PATH, substituindo todas as ocorrências pelo novo valor.

Mantenha suas notas, porque precisaremos usá-las novamente mais tarde conforme movemos o banco de dados.

#### data/secure.php

| Nome | Valor Antigo em data/secure.php | Novo Valor em data/secure.php |
| :--- | :--- | :--- |
| XOOPS_DB_HOST |  |  |
| XOOPS_DB_USER |  |  |
| XOOPS_DB_PASS |  |  |
| XOOPS_DB_NAME |  |  |

Abra a _data/secure.php_ no diretório _xoops_data_ renomeado e/ou realocado no seu editor. Altere os valores das definições mostradas no gráfico acima dos valores antigos para os valores apropriados para o novo site.

#### Outros Arquivos

Pode haver outros arquivos que podem precisar de atenção quando seu site se move. Alguns exemplos comuns são chaves de API para vários serviços que podem estar vinculadas ao domínio, como:

* Mapas do Google
* Recaptcha2
* Botões de gosto
* Compartilhamento de link e/ou publicidade como Shareaholic ou AddThis

Alterar esses tipos de associações não pode ser facilmente automatizado, pois as conexões ao domínio antigo são tipicamente parte do registro no lado do serviço. Em alguns casos, isso pode simplesmente ser adicionar ou alterar o domínio associado ao serviço.

### Copiar os Arquivos para o Novo Site

Copie seus arquivos agora modificados para o seu novo site. As técnicas são as mesmas que foram usadas durante a [Instalação](../installation/installation/), ou seja, usando FTP.

## Copiar o Banco de Dados do Site Existente

### Fazer Backup do Banco de Dados do Servidor Antigo

Para esta etapa, usar _phpMyAdmin_ é altamente recomendado. Faça login no _phpMyAdmin_ do seu site existente, selecione seu banco de dados e escolha _Exportar_.

As configurações padrão geralmente estão bem, portanto, basta selecionar "Método de exportação" de _Rápido_ e "Formato" de _SQL_.

Use o botão _Ir_ para baixar o backup do banco de dados.

![Exportando um Banco de Dados com phpMyAdmin](/xoops-docs/2.7/img/installation/phpmyadmin-export-01.png)

Se você tiver tabelas no seu banco de dados que não são do XOOPS ou de seus módulos, e NÃO devem ser movidas, você deverá selecionar o "Método de exportação" de _Personalizado_ e escolher apenas as tabelas relacionadas ao XOOPS no seu banco de dados. (Estas começam com o "prefixo" que você especificou durante a instalação. Você pode procurar seu prefixo de banco de dados no arquivo `xoops_data/data/secure.php`.)

### Restaurar o Banco de Dados para o Novo Servidor

No seu novo host, usando seu novo banco de dados, restaure o banco de dados usando [ferramentas](../tools/tools.md) como a aba _Importar_ no _phpMyAdmin_ (ou _bigdump_ se necessário.)

### Atualizar URLs e Caminhos no Banco de Dados

Atualize todos os links HTTP para recursos no seu site no seu banco de dados. Isso pode ser um esforço enorme, e há uma [ferramenta](../tools/tools.md) para facilitar isso.

Interconnect/it tem um produto chamado Search-Replace-DB que pode ajudar com isso. Ele vem com conscientização dos ambientes Wordpress e Drupal integrados. Como está, essa ferramenta pode ser muito útil, mas é ainda melhor quando está ciente de seu XOOPS. Você pode encontrar uma versão ciente do XOOPS em [https://github.com/geekwright/srdb](https://github.com/geekwright/srdb)

Siga as instruções no arquivo README.md para baixar e instalar temporariamente esse utilitário no seu site. Anteriormente, alteramos a definição de XOOPS_URL. Quando você executar essa ferramenta, deseja substituir a definição original de XOOPS_URL pela nova definição, ou seja, substituir [http://localhost/xoops](http://localhost/xoops) por [https://example.com](https://example.com)

![Usando Pesquisa e Substituição DB](/xoops-docs/2.7/img/installation/srdb-01.png)

Inserir as URLs antigas e novas e escolher a opção de execução seca. Revise as alterações e, se tudo parecer bem, vá para a opção de execução ao vivo. Esta etapa capturará itens de configuração e links dentro do seu conteúdo que se referem à URL do seu site.

![Revisando Alterações em SRDB](/xoops-docs/2.7/img/installation/srdb-02.png)

Repita o processo usando seus valores antigos e novos para XOOPS_ROOT_PATH.

#### Abordagem Alternativa Sem SRDB

Outra forma de realizar esta etapa sem a ferramenta srdb seria despejar seu banco de dados, editar o despejo em um editor de texto alterando os URLs e caminhos, e depois recarregar o banco de dados a partir do seu despejo editado. Sim, esse processo é envolvido o suficiente e carrega risco suficiente que as pessoas foram motivadas a criar ferramentas especializadas como Search-Replace-DB.

## Tente Seu Site Realocado

Neste ponto, seu site deve estar pronto para ser executado em seu novo ambiente!

Obviamente, sempre pode haver problemas. Não tenha medo de postar qualquer pergunta nos [Fóruns do xoops.org](https://xoops.org/modules/newbb/index.php).
