---
title: "XOOPS में रिपोजिटरी पैटर्न"
description: "डेटा एक्सेस एब्स्ट्रैक्शन परत कार्यान्वयन"
---
<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::ध्यान दें[निश्चित नहीं कि यह सही पैटर्न है?]
हैंडलर, रिपॉजिटरी, सेवाओं और CQRS की तुलना करने वाले निर्णय वृक्ष के लिए [डेटा एक्सेस पैटर्न चुनना](../Choosing-Data-Access-Pattern.md) देखें।
:::

:::टिप[आज और कल काम करता है]
रिपॉजिटरी पैटर्न **XOOPS 2.5.x और XOOPS 4.0.x** दोनों में काम करता है। 2.5.x में, अमूर्त लाभ प्राप्त करने के लिए अपने मौजूदा `XoopsPersistableObjectHandler` को रिपॉजिटरी क्लास में लपेटें:

| दृष्टिकोण | XOOPS 2.5.x | XOOPS 4.0 |
|---|----|----|
| डायरेक्ट हैंडलर एक्सेस | `xoops_getModuleHandler()` | डीआई कंटेनर के माध्यम से |
| रिपॉजिटरी रैपर | ✅ अनुशंसित | ✅ मूल पैटर्न |
| मॉक के साथ परीक्षण | ✅ मैनुअल डीआई के साथ | ✅ कंटेनर ऑटोवायरिंग |

**XOOPS 4.0 माइग्रेशन के लिए अपने मॉड्यूल तैयार करने के लिए आज ही रिपॉजिटरी पैटर्न से शुरुआत करें**।
:::

रिपोजिटरी पैटर्न एक डेटा एक्सेस पैटर्न है जो डेटाबेस संचालन को अमूर्त करता है, डेटा तक पहुंचने के लिए एक स्वच्छ इंटरफ़ेस प्रदान करता है। यह व्यावसायिक तर्क और डेटा मैपिंग परतों के बीच मध्यस्थ के रूप में कार्य करता है।

## रिपॉजिटरी अवधारणा

रिपोजिटरी पैटर्न प्रदान करता है:
- डेटाबेस कार्यान्वयन विवरण का सार
- यूनिट परीक्षण के लिए आसान मॉकिंग
- केंद्रीकृत डेटा एक्सेस तर्क
- व्यावसायिक तर्क को प्रभावित किए बिना डेटाबेस बदलने की लचीलापन
- पूरे एप्लिकेशन में पुन: प्रयोज्य डेटा एक्सेस लॉजिक

## रिपॉजिटरी का उपयोग कब करें

**रिपॉजिटरी का उपयोग तब करें जब:**
- एप्लिकेशन परतों के बीच डेटा स्थानांतरित करना
- डेटाबेस कार्यान्वयन को बदलने की आवश्यकता
- मॉक के साथ परीक्षण योग्य कोड लिखना
- डेटा एक्सेस पैटर्न का सार

## कार्यान्वयन पैटर्न

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

## सेवाओं में उपयोग

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

## सर्वोत्तम प्रथाएँ

- रिपॉजिटरी अनुबंधों को परिभाषित करने के लिए इंटरफेस का उपयोग करें
- प्रत्येक रिपॉजिटरी एक इकाई प्रकार को संभालती है
- व्यावसायिक तर्क को सेवाओं में रखें, रिपॉजिटरी में नहीं
- डेटा मैपिंग के लिए इकाई ऑब्जेक्ट का उपयोग करें
-अमान्य संचालन के लिए उचित अपवाद फेंकें

## संबंधित दस्तावेज़ीकरण

यह भी देखें:
- नियंत्रक एकीकरण के लिए [एमवीसी-पैटर्न](../Patterns/MVC-Pattern.md)।
- सेवा कार्यान्वयन के लिए [सेवा-परत](../Patterns/Service-Layer.md)।
- डेटा ट्रांसफर ऑब्जेक्ट के लिए [डीटीओ-पैटर्न](DTO-Pattern.md)।
- रिपॉजिटरी परीक्षण के लिए [परीक्षण](../Best-Practices/Testing.md)।

---

टैग: #रिपॉजिटरी-पैटर्न #डेटा-एक्सेस #डिज़ाइन-पैटर्न #मॉड्यूल-डेवलपमेंट