---
title: "ตะขอและกิจกรรม"
---
## ภาพรวม

XOOPS จัดให้มี hooks และเหตุการณ์เป็นจุดขยายที่อนุญาตให้โมดูลโต้ตอบกับฟังก์ชันการทำงานหลักและซึ่งกันและกันโดยไม่ต้องพึ่งพาโดยตรง

## ตะขอกับเหตุการณ์

| ด้าน | ตะขอ | กิจกรรม |
|--------|-------|--------|
| วัตถุประสงค์ | แก้ไขพฤติกรรม/ข้อมูล | ตอบสนองต่อเหตุการณ์ที่เกิดขึ้น |
| กลับ | สามารถส่งคืนข้อมูลที่แก้ไขได้ | โดยทั่วไปจะเป็นโมฆะ |
| เวลา | ก่อน/ระหว่างการดำเนินการ | หลังการกระทำ |
| รูปแบบ | โซ่กรอง | ผู้สังเกตการณ์ / pub-sub |

## ระบบตะขอ

### การลงทะเบียน Hooks
```php
// Register a hook in xoops_version.php
$modversion['hooks'][] = [
    'name'     => 'user.profile.display',
    'callback' => 'mymodule_hook_user_profile',
    'priority' => 10,
];
```
### ขอการโทรกลับ
```php
// include/hooks.php

function mymodule_hook_user_profile(array $data): array
{
    $userId = $data['user_id'];

    // Add custom profile fields
    $data['fields']['reputation'] = mymodule_get_user_reputation($userId);
    $data['fields']['badges'] = mymodule_get_user_badges($userId);

    return $data;
}
```
### ตะขอแกนที่มีอยู่

| ชื่อฮุค | ข้อมูล | คำอธิบาย |
|-----------|-|-------------|
| `user.profile.display` | อาร์เรย์ข้อมูลผู้ใช้ | แก้ไขการแสดงโปรไฟล์ |
| `content.render` | เนื้อหา HTML | กรองเนื้อหาออก |
| `form.submit` | ข้อมูลแบบฟอร์ม | ตรวจสอบ/แก้ไขข้อมูลแบบฟอร์ม |
| `search.results` | อาร์เรย์ผลลัพธ์ | กรองผลการค้นหา |
| `menu.main` | รายการเมนู | แก้ไขเมนูหลัก |

## ระบบกิจกรรม

### กิจกรรมจัดส่ง
```php
// In your module code
$eventHandler = xoops_getHandler('event');

$eventHandler->trigger('mymodule.article.created', [
    'article_id' => $article->id(),
    'author_id'  => $article->authorId(),
    'title'      => $article->title(),
]);
```
### การรับฟังเหตุการณ์
```php
// class/Preload.php

class MyModulePreload extends \Xmf\Module\Helper\AbstractHelper
{
    public function eventMymoduleArticleCreated(array $args): void
    {
        $articleId = $args['article_id'];

        // Notify subscribers
        $this->notifyNewArticle($articleId);
    }

    public function eventUserLogin(array $args): void
    {
        $userId = $args['userid'];

        // Update last login for module
        $this->updateUserActivity($userId);
    }
}
```
## โหลดข้อมูลอ้างอิงกิจกรรมล่วงหน้า

### เหตุการณ์หลัก
```php
// Header/Footer
public function eventCoreHeaderStart(array $args): void {}
public function eventCoreHeaderEnd(array $args): void {}
public function eventCoreFooterStart(array $args): void {}
public function eventCoreFooterEnd(array $args): void {}

// Includes
public function eventCoreIncludeCommonStart(array $args): void {}
public function eventCoreIncludeCommonEnd(array $args): void {}

// Exceptions
public function eventCoreException(array $args): void {}
```
### เหตุการณ์ของผู้ใช้
```php
public function eventUserLogin(array $args): void {}
public function eventUserLogout(array $args): void {}
public function eventUserRegister(array $args): void {}
public function eventUserActivate(array $args): void {}
public function eventUserDelete(array $args): void {}
```
### เหตุการณ์โมดูล
```php
public function eventSystemModuleInstall(array $args): void {}
public function eventSystemModuleUninstall(array $args): void {}
public function eventSystemModuleUpdate(array $args): void {}
public function eventSystemModuleActivate(array $args): void {}
public function eventSystemModuleDeactivate(array $args): void {}
```
## เหตุการณ์โมดูลที่กำหนดเอง

### การกำหนดเหตุการณ์
```php
// Define event constants
class ArticleEvents
{
    public const CREATED = 'mymodule.article.created';
    public const UPDATED = 'mymodule.article.updated';
    public const DELETED = 'mymodule.article.deleted';
    public const PUBLISHED = 'mymodule.article.published';
}
```
### ทริกเกอร์เหตุการณ์
```php
class ArticleService
{
    public function publish(Article $article): void
    {
        $article->publish();
        $this->repository->save($article);

        // Trigger event
        $GLOBALS['xoopsPreload']->triggerEvent(
            ArticleEvents::PUBLISHED,
            ['article' => $article]
        );
    }
}
```
### การฟังเหตุการณ์โมดูล
```php
// In another module's Preload.php

public function eventMymoduleArticlePublished(array $args): void
{
    $article = $args['article'];

    // Index for search
    $this->searchIndexer->index($article);

    // Update sitemap
    $this->sitemapGenerator->addUrl($article->url());
}
```
## แนวทางปฏิบัติที่ดีที่สุด

1. **ใช้ชื่อเฉพาะ** - รูปแบบ `module.entity.action`
2. **ส่งผ่านข้อมูลน้อยที่สุด** - เฉพาะสิ่งที่ผู้ฟังต้องการเท่านั้น
3. **เหตุการณ์เอกสาร** - แสดงรายการเหตุการณ์ในเอกสารโมดูล
4. **หลีกเลี่ยงผลข้างเคียง** - ทำให้ผู้ฟังมีสมาธิ
5. **จัดการข้อผิดพลาด** - อย่าปล่อยให้ข้อผิดพลาดของผู้ฟังมาขัดจังหวะ

## เอกสารที่เกี่ยวข้อง

- Event-System - เอกสารประกอบเหตุการณ์โดยละเอียด
- ../03-Module-Development/Module-Development - การพัฒนาโมดูล
- ../07-XOOPS-4.0/Implementation-Guides/Event-System-Guide - PSR-14 เหตุการณ์