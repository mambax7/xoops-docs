---
title: "XOOPS의 DTO 패턴"
description: "깔끔한 데이터 처리를 위한 데이터 전송 개체"
---

# XOOPS의 DTO 패턴(데이터 전송 객체)

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::tip[두 버전 모두에서 작동]
DTO는 프레임워크 종속성이 없는 일반 PHP 개체입니다. XOOPS 2.5.x 및 XOOPS 4.0.x에서 동일하게 작동합니다. PHP 8.2+의 경우 더 깔끔한 구문을 위해 생성자 속성 승격 및 읽기 전용 클래스를 사용하세요.
:::

DTO(데이터 전송 개체)는 애플리케이션의 여러 계층 간에 데이터를 전송하는 데 사용되는 간단한 개체입니다. DTO는 레이어 간의 명확한 경계를 유지하고 엔터티 개체에 대한 종속성을 줄이는 데 도움이 됩니다.

## DTO 개념

### DTO란 무엇입니까?
DTO는 다음과 같습니다.
- 속성이 포함된 간단한 값 개체
- 생성 후 불변 또는 읽기 전용
- 비즈니스 로직이나 방법이 없습니다.
- 데이터 전송에 최적화됨
- 지속성 메커니즘과 무관함

### DTO를 사용해야 하는 경우

**다음과 같은 경우 DTO를 사용하세요.**
- 레이어 간 데이터 전송
- API를 통해 데이터 노출
- 여러 엔터티의 데이터 집계
- 내부 구현 세부정보 숨기기
- 다양한 소비자를 위한 데이터 구조 변경

## 기본 DTO 구현

```php
<?php
class UserDTO
{
    private $id;
    private $username;
    private $email;
    private $isActive;
    private $createdAt;
    
    public function __construct($entity = null)
    {
        if ($entity instanceof User) {
            $this->id = $entity->getId();
            $this->username = $entity->getUsername();
            $this->email = $entity->getEmail();
            $this->isActive = $entity->isActive();
            $this->createdAt = $entity->getCreatedAt();
        }
    }
    
    // Read-only accessors
    public function getId() { return $this->id; }
    public function getUsername() { return $this->username; }
    public function getEmail() { return $this->email; }
    public function isActive() { return $this->isActive; }
    public function getCreatedAt() { return $this->createdAt; }
    
    public function toArray()
    {
        return [
            'id' => $this->id,
            'username' => $this->username,
            'email' => $this->email,
            'isActive' => $this->isActive,
            'createdAt' => $this->createdAt,
        ];
    }
    
    public function toJson()
    {
        return json_encode($this->toArray());
    }
}
?>
```

## 요청/입력 DTO

```php
<?php
class CreateUserRequestDTO
{
    private $username;
    private $email;
    private $password;
    private $errors = [];
    
    public function __construct(array $data)
    {
        $this->username = $data['username'] ?? '';
        $this->email = $data['email'] ?? '';
        $this->password = $data['password'] ?? '';
        
        $this->validate();
    }
    
    private function validate()
    {
        if (empty($this->username) || strlen($this->username) < 3) {
            $this->errors['username'] = 'Username too short';
        }
        
        if (empty($this->email) || !filter_var($this->email, FILTER_VALIDATE_EMAIL)) {
            $this->errors['email'] = 'Invalid email';
        }
        
        if (empty($this->password) || strlen($this->password) < 6) {
            $this->errors['password'] = 'Password too short';
        }
    }
    
    public function isValid()
    {
        return empty($this->errors);
    }
    
    public function getErrors()
    {
        return $this->errors;
    }
    
    public function getUsername() { return $this->username; }
    public function getEmail() { return $this->email; }
    public function getPassword() { return $this->password; }
}
?>
```

## 서비스에서의 사용

```php
<?php
class UserService
{
    public function createUserFromRequest(CreateUserRequestDTO $dto)
    {
        if (!$dto->isValid()) {
            throw new ValidationException('Invalid input', $dto->getErrors());
        }
        
        $user = new User();
        $user->setUsername($dto->getUsername());
        $user->setEmail($dto->getEmail());
        $user->setPassword($dto->getPassword());
        
        $userId = $this->userRepository->save($user);
        
        return new UserDTO($user);
    }
}
?>
```

## API 컨트롤러에서의 사용법

```php
<?php
class ApiController
{
    public function createUserAction()
    {
        $input = json_decode(file_get_contents('php://input'), true);
        $dto = new CreateUserRequestDTO($input);
        
        if (!$dto->isValid()) {
            http_response_code(400);
            return ['success' => false, 'errors' => $dto->getErrors()];
        }
        
        try {
            $userDTO = $this->userService->createUserFromRequest($dto);
            http_response_code(201);
            return ['success' => true, 'data' => $userDTO->toArray()];
        } catch (\Exception $e) {
            http_response_code(500);
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
}
?>
```

## 모범 사례

- DTO를 집중적이고 구체적으로 유지하십시오.
- DTO를 불변 또는 읽기 전용으로 만듭니다.
- DTO에 비즈니스 로직을 포함하지 마세요.
- 입력과 출력에 별도의 DTO를 사용합니다.
- DTO 속성을 명확하게 문서화
- DTO를 단순하게 유지 - 데이터 컨테이너만 사용

## 관련 문서

참조:
- 서비스 통합을 위한 [Service-Layer](../Patterns/Service-Layer.md)
- 데이터 접근을 위한 [Repository-Pattern](../Patterns/Repository-Pattern.md)
- 컨트롤러 사용을 위한 [MVC-Pattern](../Patterns/MVC-Pattern.md)
- DTO 테스트를 위한 [테스트](../Best-Practices/Testing.md)

---

태그: #dto #데이터 전송 객체 #디자인 패턴 #모듈 개발
