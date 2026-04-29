---
title: "권한 도우미"
description: "XMF 권한 도우미를 사용하여 XOOPS 그룹 권한 관리"
---

XOOPS는 사용자 그룹 멤버십을 기반으로 하는 강력하고 유연한 권한 시스템을 갖추고 있습니다. XMF 권한 도우미는 이러한 권한 작업을 단순화하여 복잡한 권한 확인을 단일 메서드 호출로 줄입니다.

## 개요

XOOPS 권한 시스템은 그룹을 다음과 연결합니다.
- 모듈 ID
- 권한 이름
- 아이템 ID

권한을 확인하려면 일반적으로 사용자 그룹 찾기, 모듈 ID 조회 및 권한 테이블 쿼리가 필요합니다. XMF 권한 도우미는 이 모든 것을 자동으로 처리합니다.

## 시작하기

### 권한 도우미 만들기

```php
// For the current module
$permHelper = new \Xmf\Module\Helper\Permission();

// For a specific module
$permHelper = new \Xmf\Module\Helper\Permission('mymodule');
```

도우미는 자동으로 현재 사용자의 그룹과 지정된 모듈의 ID를 사용합니다.

## 권한 확인

### 사용자에게 권한이 있습니까?

현재 사용자에게 항목에 대한 특정 권한이 있는지 확인하십시오.

```php
$permHelper = new \Xmf\Module\Helper\Permission();

// Check if user can view topic ID 42
$canView = $permHelper->checkPermission('viewtopic', 42);

if ($canView) {
    // Display the topic
} else {
    // Show access denied message
}
```

### 리디렉션으로 확인

권한이 없는 사용자를 자동으로 리디렉션합니다.

```php
$permHelper = new \Xmf\Module\Helper\Permission();
$topicId = 42;

// Redirects to index.php after 3 seconds if no permission
$permHelper->checkPermissionRedirect(
    'viewtopic',
    $topicId,
    'index.php',
    3,
    'You are not allowed to view that topic'
);

// Code here only runs if user has permission
displayTopic($topicId);
```

### 관리자 재정의

기본적으로 관리자 사용자에게는 항상 권한이 있습니다. 관리자에게도 확인하려면 다음을 수행하세요.

```php
// Normal check - admins always have permission
$hasPermission = $permHelper->checkPermission('viewtopic', $id);

// Check even for admins (third parameter = false)
$hasPermission = $permHelper->checkPermission('viewtopic', $id, false);
```

### 허용된 항목 ID 가져오기

특정 그룹이 다음에 대한 권한을 갖고 있는 모든 항목 ID를 검색합니다.

```php
// Get items the current user's groups can view
$viewableIds = $permHelper->getItemIds('viewtopic', $GLOBALS['xoopsUser']->getGroups());

// Get items a specific group can view
$viewableIds = $permHelper->getItemIds('viewtopic', [XOOPS_GROUP_USERS]);

// Use in queries
$criteria = new Criteria('topic_id', '(' . implode(',', $viewableIds) . ')', 'IN');
```

## 권한 관리

### 항목에 대한 그룹 가져오기

특정 권한이 있는 그룹을 찾으십시오.

```php
$permHelper = new \Xmf\Module\Helper\Permission();

// Get groups that can view topic 42
$groups = $permHelper->getGroupsForItem('viewtopic', 42);
// Returns: [1, 2, 5] (array of group IDs)
```

### 저장 권한

특정 그룹에 권한을 부여합니다.

```php
$permHelper = new \Xmf\Module\Helper\Permission();

// Allow groups 1, 2, and 3 to view topic 42
$groups = [1, 2, 3];
$permHelper->savePermissionForItem('viewtopic', 42, $groups);
```

### 권한 삭제

항목에 대한 모든 권한을 제거합니다(일반적으로 항목을 삭제할 때).

```php
$permHelper = new \Xmf\Module\Helper\Permission();
$topicId = 42;

// Delete view permission for this topic
$permHelper->deletePermissionForItem('viewtopic', $topicId);
```

여러 권한 유형의 경우:

```php
// Delete multiple permission types at once
$permissionNames = ['viewtopic', 'posttopic', 'edittopic'];
$permHelper->deletePermissionForItem($permissionNames, $topicId);
```

## 양식 통합

### 양식에 권한 선택 추가

도우미는 그룹 선택을 위한 양식 요소를 만들 수 있습니다.

```php
$permHelper = new \Xmf\Module\Helper\Permission();

// Build your form
$form = new XoopsThemeForm('Edit Topic', 'topicform', 'save.php');

// Add title field, etc.
$form->addElement(new XoopsFormText('Title', 'title', 50, 255, $topic->getVar('title')));

// Add permission selector
$form->addElement(
    $permHelper->getGroupSelectFormForItem(
        'viewtopic',                           // Permission name
        $topicId,                              // Item ID
        'Groups with View Topic Permission'   // Caption
    )
);

$form->addElement(new XoopsFormButton('', 'submit', 'Save', 'submit'));
```

### 양식 요소 옵션

전체 메소드 서명:

```php
getGroupSelectFormForItem(
    $gperm_name,      // Permission name
    $gperm_itemid,    // Item ID
    $caption,         // Form element caption
    $name,            // Element name (auto-generated if empty)
    $include_anon,    // Include anonymous group (default: false)
    $size,            // Number of visible rows (default: 5)
    $multiple         // Allow multiple selection (default: true)
)
```

### 양식 제출 처리 중

```php
use Xmf\Request;

$permHelper = new \Xmf\Module\Helper\Permission();
$topicId = Request::getInt('topic_id', 0);

// Get the auto-generated field name
$fieldName = $permHelper->defaultFieldName('viewtopic', $topicId);

// Get selected groups from form
$selectedGroups = Request::getArray($fieldName, [], 'POST');

// Save the permissions
$permHelper->savePermissionForItem('viewtopic', $topicId, $selectedGroups);
```

### 기본 필드 이름

도우미는 일관된 필드 이름을 생성합니다.

```php
$fieldName = $permHelper->defaultFieldName('viewtopic', 42);
// Returns something like: 'mymodule_viewtopic_42'
```

## 전체 예: 권한으로 보호되는 항목

### 권한이 있는 항목 만들기

```php
<?php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;

require_once dirname(dirname(__DIR__)) . '/mainfile.php';
require_once XOOPS_ROOT_PATH . '/header.php';

$helper = Helper::getHelper('mymodule');
$permHelper = new Permission('mymodule');

$op = Request::getCmd('op', 'form');
$itemId = Request::getInt('id', 0);

switch ($op) {
    case 'save':
        // Save item data
        $handler = $helper->getHandler('items');

        if ($itemId > 0) {
            $item = $handler->get($itemId);
        } else {
            $item = $handler->create();
        }

        $item->setVar('title', Request::getString('title', ''));
        $item->setVar('content', Request::getText('content', ''));

        if ($handler->insert($item)) {
            $newId = $item->getVar('item_id');

            // Save view permission
            $viewFieldName = $permHelper->defaultFieldName('view', $newId);
            $viewGroups = Request::getArray($viewFieldName, [], 'POST');
            $permHelper->savePermissionForItem('view', $newId, $viewGroups);

            // Save edit permission
            $editFieldName = $permHelper->defaultFieldName('edit', $newId);
            $editGroups = Request::getArray($editFieldName, [], 'POST');
            $permHelper->savePermissionForItem('edit', $newId, $editGroups);

            redirect_header('index.php', 2, 'Item saved');
        }
        break;

    case 'form':
    default:
        $handler = $helper->getHandler('items');

        if ($itemId > 0) {
            $item = $handler->get($itemId);
        } else {
            $item = $handler->create();
            $itemId = 0;
        }

        $form = new XoopsThemeForm('Edit Item', 'itemform', 'edit.php');
        $form->addElement(new XoopsFormHidden('op', 'save'));
        $form->addElement(new XoopsFormHidden('id', $itemId));

        $form->addElement(new XoopsFormText('Title', 'title', 50, 255, $item->getVar('title')));
        $form->addElement(new XoopsFormTextArea('Content', 'content', $item->getVar('content')));

        // View permission selector
        $form->addElement(
            $permHelper->getGroupSelectFormForItem('view', $itemId, 'Groups that can view')
        );

        // Edit permission selector
        $form->addElement(
            $permHelper->getGroupSelectFormForItem('edit', $itemId, 'Groups that can edit')
        );

        $form->addElement(new XoopsFormButton('', 'submit', 'Save', 'submit'));

        $form->display();
        break;
}

require_once XOOPS_ROOT_PATH . '/footer.php';
```

### 권한 확인으로 보기

```php
<?php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;

require_once dirname(dirname(__DIR__)) . '/mainfile.php';

$helper = Helper::getHelper('mymodule');
$permHelper = new Permission('mymodule');

$itemId = Request::getInt('id', 0);

// Check view permission - redirects if denied
$permHelper->checkPermissionRedirect(
    'view',
    $itemId,
    'index.php',
    3,
    'You do not have permission to view this item'
);

require_once XOOPS_ROOT_PATH . '/header.php';

// User has permission, display the item
$handler = $helper->getHandler('items');
$item = $handler->get($itemId);

$xoopsTpl->assign('item', $item->toArray());

// Show edit button only if user has edit permission
if ($permHelper->checkPermission('edit', $itemId)) {
    $xoopsTpl->assign('can_edit', true);
    $xoopsTpl->assign('edit_url', $helper->url('edit.php?id=' . $itemId));
}

require_once XOOPS_ROOT_PATH . '/footer.php';
```

### 권한 정리로 삭제

```php
<?php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;

$helper = Helper::getHelper('mymodule');
$permHelper = new Permission('mymodule');

$itemId = Request::getInt('id', 0);

// Delete the item
$handler = $helper->getHandler('items');
$item = $handler->get($itemId);

if ($item && $handler->delete($item)) {
    // Clean up all permissions for this item
    $permissionNames = ['view', 'edit', 'delete'];
    $permHelper->deletePermissionForItem($permissionNames, $itemId);

    redirect_header('index.php', 2, 'Item deleted');
}
```

## API 참조

| 방법 | 설명 |
|--------|-------------|
| `checkPermission($name, $itemId, $trueIfAdmin)` | 사용자에게 권한이 있는지 확인 |
| `checkPermissionRedirect($name, $itemId, $url, $time, $message, $trueIfAdmin)` | 거부된 경우 확인하고 리디렉션 |
| `getItemIds($name, $groupIds)` | 그룹이 액세스할 수 있는 항목 ID 가져오기 |
| `getGroupsForItem($name, $itemId)` | 권한이 있는 그룹 가져오기 |
| `savePermissionForItem($name, $itemId, $groups)` | 권한 저장 |
| `deletePermissionForItem($name, $itemId)` | 권한 삭제 |
| `getGroupSelectFormForItem(...)` | 양식 선택 요소 만들기 |
| `defaultFieldName($name, $itemId)` | 기본 양식 필드 이름 가져오기 |

## 참고 항목

-../Basics/XMF-Module-Helper - 모듈 도우미 문서
- 모듈-관리-페이지 - 관리 인터페이스 생성
-../기본/XMF 시작하기 - XMF 기본

---

#xmf #권한 #보안 #그룹 #양식
