---
title: "XOOPS의 서비스 레이어 패턴"
description: "비즈니스 로직 추상화 및 종속성 주입"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::참고[이 패턴이 맞는지 확실하지 않나요?]
핸들러, 리포지토리, 서비스 및 CQRS를 비교하는 의사결정 트리는 [데이터 액세스 패턴 선택](../Choosing-Data-Access-Pattern.md)을 참조하세요.
:::

:::tip[오늘과 내일 모두 작동]
서비스 레이어 패턴은 **XOOPS 2.5.x 및 XOOPS 4.0.x**에서 작동합니다. 개념은 보편적이며 구문만 다릅니다.

| 기능 | XOOPS 2.5.x | XOOPS 4.0 |
|---------|-------------|------------|
| PHP 버전 | 7.4+ | 8.2+ |
| 생성자 주입 | ✅ 수동 배선 | ✅ 컨테이너 자동 배선 |
| 유형화된 속성 | `@var` 문서블록 | 네이티브 유형 선언 |
| 읽기 전용 속성 | ❌ 이용 불가 | ✅ `readonly` 키워드 |

아래 코드 예제는 PHP 8.2+ 구문을 사용합니다. 2.5.x의 경우 `readonly`을 생략하고 기존 속성 선언을 사용합니다.
:::

서비스 레이어 패턴은 전용 서비스 클래스에 비즈니스 로직을 캡슐화하여 컨트롤러와 데이터 액세스 레이어를 명확하게 구분합니다. 이 패턴은 코드 재사용성, 테스트 가능성 및 유지 관리성을 향상시킵니다.

## 서비스 계층 개념

### 목적
서비스 계층:
- 도메인 비즈니스 로직을 포함합니다.
- 여러 저장소를 조정합니다.
- 복잡한 작업을 처리합니다.
- 거래를 관리합니다.
- 검증 및 승인을 수행합니다.
- 컨트롤러에 높은 수준의 작업을 제공합니다.

### 혜택
- 여러 컨트롤러에서 재사용 가능한 비즈니스 로직
- 독립적으로 테스트가 용이함
- 중앙 집중식 비즈니스 규칙 구현
- 관심사의 명확한 분리
- 단순화된 컨트롤러 코드

## 의존성 주입

```php
<?php
// Service with injected dependencies
class UserService
{
    private $userRepository;
    private $emailService;
    
    public function __construct(
        UserRepositoryInterface $userRepository,
        EmailServiceInterface $emailService
    ) {
        $this->userRepository = $userRepository;
        $this->emailService = $emailService;
    }
    
    public function registerUser($username, $email, $password)
    {
        // Validate
        $this->validate($username, $email, $password);
        
        // Create user
        $user = new User();
        $user->setUsername($username);
        $user->setEmail($email);
        $user->setPassword($password);
        
        // Save
        $userId = $this->userRepository->save($user);
        
        // Send welcome email
        $this->emailService->sendWelcome($email, $username);
        
        return $userId;
    }
    
    private function validate($username, $email, $password)
    {
        $errors = [];
        
        if (strlen($username) < 3) {
            $errors['username'] = 'Username too short';
        }
        
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Invalid email';
        }
        
        if (strlen($password) < 6) {
            $errors['password'] = 'Password too short';
        }
        
        if (!empty($errors)) {
            throw new ValidationException('Invalid input', $errors);
        }
    }
}
?>
```

## 서비스 컨테이너

```php
<?php
class ServiceContainer
{
    private $services = [];
    
    public function __construct($db)
    {
        // Register repositories
        $this->services['userRepository'] = new UserRepository($db);
        
        // Register services
        $this->services['userService'] = new UserService(
            $this->services['userRepository']
        );
    }
    
    public function get($name)
    {
        if (!isset($this->services[$name])) {
            throw new \InvalidArgumentException("Service not found: $name");
        }
        return $this->services[$name];
    }
}
?>
```

## 컨트롤러에서의 사용법

```php
<?php
class UserController
{
    private $userService;
    
    public function __construct(ServiceContainer $container)
    {
        $this->userService = $container->get('userService');
    }
    
    public function registerAction()
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            return [];
        }
        
        try {
            $userId = $this->userService->registerUser(
                $_POST['username'],
                $_POST['email'],
                $_POST['password']
            );
            
            return [
                'success' => true,
                'userId' => $userId,
            ];
        } catch (ValidationException $e) {
            return [
                'success' => false,
                'errors' => $e->getErrors(),
            ];
        }
    }
}
?>
```

## 모범 사례

- 각 서비스는 하나의 도메인 문제를 처리합니다.
- 서비스는 구현이 아닌 인터페이스에 의존합니다.
- 종속성을 위해 생성자 주입을 사용합니다.
- 서비스는 독립적으로 테스트 가능해야 합니다.
- 도메인별 예외 발생
- 서비스는 HTTP 요청 세부정보에 의존해서는 안 됩니다.
- 서비스를 집중적이고 응집력있게 유지하십시오.

## 관련 문서

참조:
- 컨트롤러 통합을 위한 [MVC-Pattern](../Patterns/MVC-Pattern.md)
- 데이터 접근을 위한 [Repository-Pattern](../Patterns/Repository-Pattern.md)
- 데이터 전송 객체의 [DTO-Pattern](DTO-Pattern.md)
- 서비스 테스트를 위한 [테스트](../Best-Practices/Testing.md)

---

태그: #서비스 레이어 #비즈니스 로직 #의존성 주입 #디자인 패턴
