---
title: "XOOPS में सेवा परत पैटर्न"
description: "व्यावसायिक तर्क अमूर्तता और निर्भरता इंजेक्शन"
---
<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::ध्यान दें[निश्चित नहीं कि यह सही पैटर्न है?]
हैंडलर, रिपॉजिटरी, सेवाओं और CQRS की तुलना करने वाले निर्णय वृक्ष के लिए [डेटा एक्सेस पैटर्न चुनना](../Choosing-Data-Access-Pattern.md) देखें।
:::

:::टिप[आज और कल काम करता है]
सर्विस लेयर पैटर्न **XOOPS 2.5.x और XOOPS 4.0.x** दोनों में काम करता है। अवधारणाएँ सार्वभौमिक हैं - केवल वाक्यविन्यास भिन्न है:

| फ़ीचर | XOOPS 2.5.x | XOOPS 4.0 |
|---------|----|---|
| PHP संस्करण | 7.4+ | 8.2+ |
| कंस्ट्रक्टर इंजेक्शन | ✅ मैनुअल वायरिंग | ✅ कंटेनर ऑटोवायरिंग |
| टाइप किए गए गुण | `@var` डॉकब्लॉक्स | मूल प्रकार की घोषणाएँ |
| केवल पढ़ने योग्य गुण | ❌ उपलब्ध नहीं है | ✅ `readonly` कीवर्ड |

नीचे दिए गए कोड उदाहरण PHP 8.2+ सिंटैक्स का उपयोग करते हैं। 2.5.x के लिए, `readonly` को हटा दें और पारंपरिक संपत्ति घोषणाओं का उपयोग करें।
:::

सर्विस लेयर पैटर्न समर्पित सेवा वर्गों में व्यावसायिक तर्क को समाहित करता है, जो नियंत्रकों और डेटा एक्सेस परतों के बीच स्पष्ट अलगाव प्रदान करता है। यह पैटर्न कोड पुन: प्रयोज्यता, परीक्षणशीलता और रखरखाव को बढ़ावा देता है।

## सेवा परत संकल्पना

### उद्देश्य
सेवा परत:
- इसमें डोमेन व्यवसाय तर्क शामिल है
- एकाधिक रिपॉजिटरी का समन्वय करता है
- जटिल ऑपरेशन संभालता है
- लेनदेन का प्रबंधन करता है
- सत्यापन और प्राधिकरण करता है
- नियंत्रकों को उच्च-स्तरीय संचालन प्रदान करता है

### लाभ
- एकाधिक नियंत्रकों में पुन: प्रयोज्य व्यावसायिक तर्क
- अलगाव में परीक्षण करना आसान है
- केंद्रीकृत व्यापार नियम कार्यान्वयन
- चिंताओं का स्पष्ट पृथक्करण
- सरलीकृत नियंत्रक कोड

## निर्भरता इंजेक्शन

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

## सर्विस कंटेनर

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

## नियंत्रकों में उपयोग

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

## सर्वोत्तम प्रथाएँ

- प्रत्येक सेवा एक डोमेन चिंता को संभालती है
- सेवाएँ इंटरफ़ेस पर निर्भर करती हैं, कार्यान्वयन पर नहीं
- निर्भरता के लिए कंस्ट्रक्टर इंजेक्शन का उपयोग करें
- सेवाएँ पृथक रूप से परीक्षण योग्य होनी चाहिए
- डोमेन-विशिष्ट अपवाद फेंकें
- सेवाएँ HTTP अनुरोध विवरण पर निर्भर नहीं होनी चाहिए
- सेवाओं को केंद्रित और एकजुट रखें

## संबंधित दस्तावेज़ीकरण

यह भी देखें:
- नियंत्रक एकीकरण के लिए [एमवीसी-पैटर्न](../Patterns/MVC-Pattern.md)।
- डेटा एक्सेस के लिए [रिपॉजिटरी-पैटर्न](../Patterns/Repository-Pattern.md)।
- डेटा ट्रांसफर ऑब्जेक्ट के लिए [डीटीओ-पैटर्न](DTO-Pattern.md)।
- सेवा परीक्षण के लिए [परीक्षण](../Best-Practices/Testing.md)।

---

टैग: #सेवा-परत #व्यापार-तर्क #निर्भरता-इंजेक्शन #डिज़ाइन-पैटर्न