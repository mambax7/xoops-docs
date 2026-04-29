---
title: "XOOPS의 MVC 패턴"
description: "XOOPS 모듈에서 모델-뷰-컨트롤러 아키텍처 구현"
---

<span class="version-badge version-xmf">XMF 필수</span> <span class="version-badge version-40x">4.0.x 네이티브</span>

:::참고[이 패턴이 맞는지 확실하지 않나요?]
MVC와 더 간단한 패턴을 사용하는 경우에 대한 지침은 [데이터 액세스 패턴 선택](../Choosing-Data-Access-Pattern.md)을 참조하세요.
:::

:::주의[설명: XOOPS 아키텍처]
**표준 XOOPS 2.5.x**는 MVC가 아닌 **페이지 컨트롤러** 패턴(트랜잭션 스크립트라고도 함)을 사용합니다. 레거시 모듈은 직접 포함, 전역 개체(`$xoopsUser`, `$xoopsDB`) 및 처리기 기반 데이터 액세스와 함께 `index.php`을 사용합니다.

**XOOPS 2.5.x**에서 MVC를 사용하려면 라우팅 및 컨트롤러 지원을 제공하는 **XMF 프레임워크**가 필요합니다.

**XOOPS 4.0**은 기본적으로 PSR-15 미들웨어 및 적절한 라우팅을 통해 MVC를 지원합니다.

참조: [현재 XOOPS 아키텍처](../../02-Core-Concepts/Architecture/XOOPS-Architecture.md)
:::

MVC(Model-View-Controller) 패턴은 XOOPS 모듈에서 문제를 분리하기 위한 기본 아키텍처 패턴입니다. 이 패턴은 애플리케이션을 세 개의 상호 연결된 구성 요소로 나눕니다.

## MVC 설명

### 모델
**모델**은 애플리케이션의 데이터와 비즈니스 로직을 나타냅니다. 그것:
- 데이터 지속성을 관리합니다.
- 비즈니스 규칙을 구현합니다.
- 데이터 유효성을 검사합니다.
- 데이터베이스와 통신
- UI와 독립적입니다.

### 보기
**보기**는 사용자에게 데이터를 표시하는 역할을 합니다. 그것:
- HTML 템플릿을 렌더링합니다.
- 모델 데이터를 표시합니다.
- 사용자 인터페이스 프레젠테이션을 처리합니다.
- 사용자 작업을 컨트롤러에 보냅니다.
- 최소한의 로직을 포함해야 합니다.

### 컨트롤러
**컨트롤러**는 사용자 상호작용을 처리하고 모델과 뷰 사이를 조정합니다. 그것:
- 사용자 요청을 받습니다.
- 입력 데이터 처리
- 모델 메소드 호출
- 적절한 뷰 선택
- 지원서 흐름 관리

## XOOPS 구현

XOOPS에서 MVC 패턴은 템플릿 지원을 제공하는 Smarty 엔진과 함께 핸들러 및 템플릿을 사용하여 구현됩니다.

### 기본 모델 구조
```php
<?php
class UserModel
{
    private $db;
    
    public function getUserById($id)
    {
        // Database query implementation
    }
    
    public function createUser($data)
    {
        // Create user implementation
    }
}
?>
```

### 컨트롤러 구현
```php
<?php
class UserController
{
    private $model;
    
    public function listAction()
    {
        $users = $this->model->getAllUsers();
        return ['users' => $users];
    }
}
?>
```

### 뷰 템플릿
```smarty
{foreach from=$users item=user}
    <div>{$user.username|escape}</div>
{/foreach}
```

## 모범 사례

- 모델에 비즈니스 로직 유지
- 뷰에 프레젠테이션 유지  
- 컨트롤러에서 라우팅/조정 유지
- 레이어 간에 우려사항을 혼동하지 마세요.
- 컨트롤러 수준에서 모든 입력의 유효성을 검사합니다.

## 관련 문서

참조:
- 고급 데이터 접근을 위한 [Repository-Pattern](../Patterns/Repository-Pattern.md)
- 비즈니스 로직 추상화를 위한 [서비스 계층](../Patterns/Service-Layer.md)
- 프로젝트 구조를 위한 [코드 구성](../Best-Practices/Code-Organization.md)
- MVC 테스트 전략을 위한 [테스트](../Best-Practices/Testing.md)

---

태그: #mvc #패턴 #아키텍처 #모듈 개발 #디자인 패턴
