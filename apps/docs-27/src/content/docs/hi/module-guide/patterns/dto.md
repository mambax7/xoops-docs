---
title: "XOOPS में डीटीओ पैटर्न"
description: "स्वच्छ डेटा प्रबंधन के लिए डेटा ट्रांसफर ऑब्जेक्ट"
---
# डीटीओ पैटर्न (डेटा ट्रांसफर ऑब्जेक्ट) XOOPS में

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::टिप[दोनों संस्करणों में काम करता है]
डीटीओ सादे PHP ऑब्जेक्ट हैं जिनमें कोई फ्रेमवर्क निर्भरता नहीं है। वे XOOPS 2.5.x और XOOPS 4.0.x में समान रूप से काम करते हैं। PHP 8.2+ के लिए, क्लीनर सिंटैक्स के लिए कंस्ट्रक्टर प्रॉपर्टी प्रमोशन और रीडओनली क्लास का उपयोग करें।
:::

डेटा ट्रांसफर ऑब्जेक्ट (डीटीओ) सरल ऑब्जेक्ट हैं जिनका उपयोग किसी एप्लिकेशन की विभिन्न परतों के बीच डेटा स्थानांतरित करने के लिए किया जाता है। डीटीओ परतों के बीच स्पष्ट सीमाएं बनाए रखने और इकाई वस्तुओं पर निर्भरता कम करने में मदद करते हैं।

## डीटीओ संकल्पना

### डीटीओ क्या है?
एक डीटीओ है:
- गुणों के साथ एक साधारण मूल्य वस्तु
- सृजन के बाद अपरिवर्तनीय या केवल पढ़ने योग्य
- कोई व्यावसायिक तर्क या पद्धति नहीं
- डेटा स्थानांतरण के लिए अनुकूलित
- दृढ़ता तंत्र से स्वतंत्र

### डीटीओ का उपयोग कब करें

**डीटीओ का उपयोग तब करें जब:**
- परतों के बीच डेटा स्थानांतरित करना
- API के माध्यम से डेटा को उजागर करना
- एकाधिक संस्थाओं से डेटा एकत्र करना
- आंतरिक कार्यान्वयन विवरण छिपाना
- विभिन्न उपभोक्ताओं के लिए डेटा संरचना बदलना

## बेसिक डीटीओ कार्यान्वयन

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

## अनुरोध/इनपुट डीटीओ

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

## सेवाओं में उपयोग

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

## API नियंत्रकों में उपयोग

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

## सर्वोत्तम प्रथाएँ

- डीटीओ को केंद्रित और विशिष्ट रखें
- डीटीओ को अपरिवर्तनीय या केवल पढ़ने योग्य बनाएं
- डीटीओ में व्यावसायिक तर्क शामिल न करें
- इनपुट और आउटपुट के लिए अलग-अलग डीटीओ का उपयोग करें
- दस्तावेज़ डीटीओ संपत्तियों को स्पष्ट रूप से
- डीटीओ को सरल रखें - केवल डेटा कंटेनर

## संबंधित दस्तावेज़ीकरण

यह भी देखें:
- सेवा एकीकरण के लिए [सेवा-परत](../Patterns/Service-Layer.md)।
- डेटा एक्सेस के लिए [रिपॉजिटरी-पैटर्न](../Patterns/Repository-Pattern.md)।
- नियंत्रक उपयोग के लिए [एमवीसी-पैटर्न](../Patterns/MVC-Pattern.md)।
- [परीक्षण](../Best-Practices/Testing.md) डीटीओ परीक्षण के लिए

---

टैग: #डीटीओ #डेटा-ट्रांसफर-ऑब्जेक्ट्स #डिज़ाइन-पैटर्न #मॉड्यूल-विकास