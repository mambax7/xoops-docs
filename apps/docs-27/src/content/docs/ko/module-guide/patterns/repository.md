---
title: "XOOPS의 저장소 패턴"
description: "데이터 액세스 추상화 계층 구현"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::참고[이 패턴이 맞는지 확실하지 않나요?]
핸들러, 리포지토리, 서비스 및 CQRS를 비교하는 의사결정 트리는 [데이터 액세스 패턴 선택](../Choosing-Data-Access-Pattern.md)을 참조하세요.
:::

:::tip[오늘과 내일 모두 작동]
리포지토리 패턴은 **XOOPS 2.5.x 및 XOOPS 4.0.x**에서 작동합니다. 2.5.x에서는 기존 `XoopsPersistableObjectHandler`을 Repository 클래스로 래핑하여 추상화 이점을 얻습니다.

| 접근 | XOOPS 2.5.x | XOOPS 4.0 |
|----------|-------------|------------|
| 직접 핸들러 액세스 | `xoops_getModuleHandler()` | DI 컨테이너를 통해 |
| 저장소 래퍼 | ✅ 추천 | ✅ 기본 패턴 |
| 모의 테스트 | ✅ 수동 DI 포함 | ✅ 컨테이너 자동 배선 |

**지금 저장소 패턴으로 시작**하여 XOOPS 4.0 마이그레이션을 위한 모듈을 준비하세요.
:::

리포지토리 패턴은 데이터베이스 작업을 추상화하여 데이터 액세스를 위한 깔끔한 인터페이스를 제공하는 데이터 액세스 패턴입니다. 이는 비즈니스 로직과 데이터 매핑 계층 사이의 중개자 역할을 합니다.

## 저장소 개념

리포지토리 패턴은 다음을 제공합니다.
- 데이터베이스 구현 세부사항 추상화
- 단위 테스트를 위한 쉬운 모킹
- 중앙 집중식 데이터 액세스 논리
- 비즈니스 로직에 영향을 주지 않고 데이터베이스를 변경할 수 있는 유연성
- 애플리케이션 전체에서 재사용 가능한 데이터 액세스 논리

## 리포지토리를 사용해야 하는 경우

**다음과 같은 경우 저장소를 사용하세요.**
- 애플리케이션 레이어 간 데이터 전송
- 데이터베이스 구현을 변경해야 함
- 모의 객체를 사용하여 테스트 가능한 코드 작성
- 데이터 액세스 패턴 추상화

## 구현 패턴

```php
<?php
// Define repository interface
interface UserRepositoryInterface
{
    public function find($id);
    public function findAll($limit = null, $offset = 0);
    public function findBy(array $criteria);
    public function save($entity);
    public function update($id, $entity);
    public function delete($id);
}

// Implement repository
class UserRepository implements UserRepositoryInterface
{
    private $db;
    
    public function __construct($connection)
    {
        $this->db = $connection;
    }
    
    public function find($id)
    {
        // Implementation
    }
    
    public function save($entity)
    {
        // Implementation
    }
}
?>
```

## 서비스에서의 사용

```php
<?php
class UserService
{
    private $userRepository;
    
    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }
    
    public function registerUser($username, $email, $password)
    {
        // Check if user exists
        if ($this->userRepository->findByUsername($username)) {
            throw new \InvalidArgumentException('Username exists');
        }
        
        // Create user
        $user = new User();
        $user->setUsername($username);
        $user->setEmail($email);
        $user->setPassword($password);
        
        return $this->userRepository->save($user);
    }
}
?>
```

## 모범 사례

- 인터페이스를 사용하여 저장소 계약 정의
- 각 저장소는 하나의 엔터티 유형을 처리합니다.
- 리포지토리가 아닌 서비스에 비즈니스 로직을 유지합니다.
- 데이터 매핑을 위해 엔터티 개체를 사용합니다.
- 유효하지 않은 작업에 대해 적절한 예외를 발생시킵니다.

## 관련 문서

참조:
- 컨트롤러 통합을 위한 [MVC-Pattern](../Patterns/MVC-Pattern.md)
- 서비스 구현을 위한 [Service-Layer](../Patterns/Service-Layer.md)
- 데이터 전송 객체의 [DTO-Pattern](DTO-Pattern.md)
- 저장소 테스트를 위한 [테스트](../Best-Practices/Testing.md)

---

태그: #저장소 패턴 #데이터 액세스 #디자인 패턴 #모듈 개발
