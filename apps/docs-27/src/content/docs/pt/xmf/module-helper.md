---
title: "XMF Module Helper"
description: 'Operações de módulo simplificadas usando a classe Xmf\Module\Helper e helpers relacionados'
---

A classe `Xmf\Module\Helper` fornece uma maneira fácil de acessar informações relacionadas a módulo, configurações, handlers e muito mais. Usar o module helper simplifica seu código e reduz boilerplate.

## Visão Geral

O module helper fornece:

- Acesso simplificado a configuração
- Recuperação de objeto de módulo
- Instanciação de handler
- Resolução de caminho e URL
- Helpers de permissão e sessão
- Gerenciamento de cache

## Obtendo um Module Helper

### Uso Básico

```php
use Xmf\Module\Helper;

// Obter helper para um módulo específico
$helper = Helper::getHelper('mymodule');

// O helper é automaticamente associado ao diretório do módulo
```

### Do Módulo Atual

Se você não especificar um nome de módulo, ele usa o módulo ativo atual:

```php
$helper = Helper::getHelper('');
// ou
$helper = Helper::getHelper(basename(__DIR__));
```

## Acesso à Configuração

### Forma Tradicional XOOPS

Obter configuração de módulo da forma antiga é verboso:

```php
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname('mymodule');
$config_handler = xoops_gethandler('config');
$moduleConfig = $config_handler->getConfigsByCat(0, $module->getVar('mid'));
$value = isset($moduleConfig['foo']) ? $moduleConfig['foo'] : 'default';
echo "The value of 'foo' is: " . $value;
```

### Forma XMF

Com o module helper, a mesma tarefa fica simples:

```php
$helper = \Xmf\Module\Helper::getHelper('mymodule');
echo "The value of 'foo' is: " . $helper->getConfig('foo', 'default');
```

## Métodos do Helper

### getModule()

Retorna o objeto XoopsModule para o módulo do helper.

```php
$module = $helper->getModule();
$version = $module->getVar('version');
$name = $module->getVar('name');
$mid = $module->getVar('mid');
```

### getConfig($name, $default)

Retorna um valor de configuração de módulo ou todas as configurações.

```php
// Obter configuração única com padrão
$itemsPerPage = $helper->getConfig('items_per_page', 10);
$enableCache = $helper->getConfig('enable_cache', true);

// Obter todas as configurações como array
$allConfigs = $helper->getConfig('');
```

### getHandler($name)

Retorna um object handler para o módulo.

```php
$itemHandler = $helper->getHandler('items');
$categoryHandler = $helper->getHandler('categories');

// Usar o handler
$item = $itemHandler->get($id);
$items = $itemHandler->getObjects($criteria);
```

### loadLanguage($name)

Carrega um arquivo de idioma para o módulo.

```php
$helper->loadLanguage('main');
$helper->loadLanguage('admin');
$helper->loadLanguage('modinfo');
```

### isCurrentModule()

Verifica se este é o módulo ativo atual.

```php
if ($helper->isCurrentModule()) {
    // Estamos nas páginas do próprio módulo
} else {
    // Chamado de outro módulo ou local
}
```

### isUserAdmin()

Verifica se o usuário atual tem direitos de admin para este módulo.

```php
if ($helper->isUserAdmin()) {
    // Mostrar opções de admin
    echo '<a href="' . $helper->url('admin/index.php') . '">Admin</a>';
}
```

## Métodos de Caminho e URL

### url($url)

Retorna uma URL absoluta para um caminho relativo ao módulo.

```php
$logoUrl = $helper->url('images/logo.png');
// Retorna: https://example.com/modules/mymodule/images/logo.png

$adminUrl = $helper->url('admin/index.php');
// Retorna: https://example.com/modules/mymodule/admin/index.php
```

### path($path)

Retorna um caminho absoluto do sistema de arquivos para um caminho relativo ao módulo.

```php
$templatePath = $helper->path('templates/view.tpl');
// Retorna: /var/www/html/modules/mymodule/templates/view.tpl

$includePath = $helper->path('include/functions.php');
require_once $includePath;
```

### uploadUrl($url)

Retorna uma URL absoluta para arquivos de upload de módulo.

```php
$fileUrl = $helper->uploadUrl('documents/manual.pdf');
```

### uploadPath($path)

Retorna um caminho absoluto do sistema de arquivos para arquivos de upload de módulo.

```php
$uploadDir = $helper->uploadPath('');
$filePath = $helper->uploadPath('images/photo.jpg');
```

### redirect($url, $time, $message)

Redireciona dentro do módulo para uma URL relativa ao módulo.

```php
$helper->redirect('index.php', 3, 'Item salvo com sucesso');
$helper->redirect('view.php?id=' . $newId, 2, 'Criado!');
```

## Suporte de Depuração

### setDebug($bool)

Ativa ou desativa o modo debug para o helper.

```php
$helper->setDebug(true);  // Ativar
$helper->setDebug(false); // Desativar
$helper->setDebug();      // Ativar (padrão é true)
```

### addLog($log)

Adiciona uma mensagem ao log do módulo.

```php
$helper->addLog('Processando item ID: ' . $id);
$helper->addLog('Cache miss, carregando do banco de dados');
```

## Classes Helper Relacionadas

XMF fornece helpers especializados que estendem `Xmf\Module\Helper\AbstractHelper`:

### Permission Helper

Veja ../Recipes/Permission-Helper para documentação detalhada.

```php
$permHelper = new \Xmf\Module\Helper\Permission('mymodule');

// Verificar permissão
if ($permHelper->checkPermission('view', $itemId)) {
    // Usuário tem permissão
}

// Verificar e redirecionar se sem permissão
$permHelper->checkPermissionRedirect('edit', $itemId, 'index.php', 3, 'Acesso negado');
```

### Session Helper

Armazenamento de sessão consciente de módulo com prefixação automática de chave.

```php
$session = new \Xmf\Module\Helper\Session('mymodule');

// Armazenar valor
$session->set('last_viewed', $itemId);

// Recuperar valor
$lastViewed = $session->get('last_viewed', 0);

// Deletar valor
$session->del('last_viewed');

// Limpar todos os dados de sessão do módulo
$session->destroy();
```

### Cache Helper

Cache consciente de módulo com prefixação automática de chave.

```php
$cache = new \Xmf\Module\Helper\Cache('mymodule');

// Escrever para cache (TTL em segundos)
$cache->write('item_' . $id, $itemData, 3600);

// Ler do cache
$data = $cache->read('item_' . $id, null);

// Deletar do cache
$cache->delete('item_' . $id);

// Ler com regeneração automática
$data = $cache->cacheRead(
    'expensive_data',
    function() {
        // Isto executa apenas se cache miss
        return computeExpensiveData();
    },
    3600
);
```

## Exemplo Completo

Aqui está um exemplo abrangente usando o module helper:

```php
<?php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;
use Xmf\Module\Helper\Session;

require_once dirname(dirname(__DIR__)) . '/mainfile.php';

// Inicializar helpers
$helper = Helper::getHelper('mymodule');
$permHelper = new Permission('mymodule');
$session = new Session('mymodule');

// Carregar idioma
$helper->loadLanguage('main');

// Obter configuração
$itemsPerPage = $helper->getConfig('items_per_page', 10);
$enableComments = $helper->getConfig('enable_comments', true);

// Manipular requisição
$op = Request::getCmd('op', 'list');
$id = Request::getInt('id', 0);

require_once XOOPS_ROOT_PATH . '/header.php';

switch ($op) {
    case 'view':
        // Verificar permissão
        if (!$permHelper->checkPermission('view', $id)) {
            redirect_header($helper->url('index.php'), 3, _NOPERM);
        }

        // Rastrear em sessão
        $session->set('last_viewed', $id);

        // Obter handler e item
        $itemHandler = $helper->getHandler('items');
        $item = $itemHandler->get($id);

        if (!$item) {
            redirect_header($helper->url('index.php'), 3, 'Item não encontrado');
        }

        // Exibir item
        $xoopsTpl->assign('item', $item->toArray());
        break;

    case 'list':
    default:
        $itemHandler = $helper->getHandler('items');

        $criteria = new CriteriaCompo();
        $criteria->setLimit($itemsPerPage);
        $criteria->setSort('created');
        $criteria->setOrder('DESC');

        $items = $itemHandler->getObjects($criteria);
        $xoopsTpl->assign('items', $items);

        // Mostrar último visualizado se existe
        $lastViewed = $session->get('last_viewed', 0);
        if ($lastViewed > 0) {
            $xoopsTpl->assign('last_viewed', $lastViewed);
        }
        break;
}

// Link de admin se autorizado
if ($helper->isUserAdmin()) {
    $xoopsTpl->assign('admin_url', $helper->url('admin/index.php'));
}

require_once XOOPS_ROOT_PATH . '/footer.php';
```

## Classe Base AbstractHelper

Todas as classes helper XMF estendem `Xmf\Module\Helper\AbstractHelper`, que fornece:

### Constructor

```php
public function __construct($dirname)
```

Instancia com um nome de diretório de módulo. Se vazio, usa o módulo atual.

### dirname()

Retorna o nome do diretório de módulo associado ao helper.

```php
$dirname = $helper->dirname();
```

### init()

Chamado pelo construtor após o módulo ser carregado. Anule em helpers customizados para lógica de inicialização.

## Criando Helpers Customizados

Você pode estender o helper para funcionalidade específica do módulo:

```php
<?php
// mymodule/class/Helper.php
namespace XoopsModules\Mymodule;

class Helper extends \Xmf\Module\Helper\GenericHelper
{
    public function init()
    {
        // Inicialização customizada
    }

    public function getItemUrl($id)
    {
        return $this->url('item.php?id=' . $id);
    }

    public function getUploadDirectory()
    {
        $path = $this->uploadPath('');
        if (!is_dir($path)) {
            mkdir($path, 0755, true);
        }
        return $path;
    }
}
```

## Veja Também

- Getting-Started-with-XMF - Uso básico de XMF
- XMF-Request - Manipulação de requisições
- ../Recipes/Permission-Helper - Gerenciamento de permissões
- ../Recipes/Module-Admin-Pages - Criação de interface admin

---

#xmf #module-helper #configuration #handlers #session #cache
