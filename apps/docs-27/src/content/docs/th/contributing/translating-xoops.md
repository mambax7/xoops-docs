---
title: "ภาคผนวก 3: การแปล XOOPS เป็นภาษาท้องถิ่น"
---
XOOPS 2.7.0 ships with English language files only. Translations into other languages are maintained by the community and distributed through GitHub and the various local XOOPS support sites.

## จะหาคำแปลที่มีอยู่ได้ที่ไหน

- **GitHub** — community translations are increasingly published as separate repositories under the [XOOPS organization](https://github.com/XOOPS) and on individual contributors' accounts. ค้นหา GitHub สำหรับ `xoops-language-<your-language>` หรือเรียกดูองค์กร XOOPS เพื่อดูแพ็คเกจปัจจุบัน
- **ไซต์สนับสนุน XOOPS ในพื้นที่** — ชุมชน XOOPS ระดับภูมิภาคหลายแห่งเผยแพร่คำแปลบนไซต์ของตนเอง Visit [https://xoops.org](https://xoops.org) and follow the links to local communities.
- **Module translations** — translations for individual community modules typically live next to the module itself in the `XoopsModules25x` GitHub organization (the `25x` in the name is historical; modules there are maintained for both XOOPS 2.5.x และ 2.7.x)

If a translation for your language already exists, drop the language directories into your XOOPS install (see "How to install a translation" below).

## ต้องแปลอะไรบ้าง

XOOPS 2.7.0 keeps language files next to the code that consumes them. A complete translation covers all of these locations:

- **Core** — `htdocs/language/english/` — site-wide constants used by every page (login, common errors, dates, mail templates, etc.).
- **ตัวติดตั้ง** — `htdocs/install/language/english/` — สตริงที่แสดงโดยวิซาร์ดการติดตั้ง Translate these *before* running the installer if you want a localized install experience.
- **โมดูลระบบ** — `htdocs/modules/system/language/english/` — โดยชุดที่ใหญ่ที่สุด ครอบคลุมแผงควบคุมของผู้ดูแลระบบทั้งหมด
- **Bundled modules** — each of `htdocs/modules/pm/language/english/`, `htdocs/modules/profile/language/english/`, `htdocs/modules/protector/language/english/`, and `htdocs/modules/debugbar/language/english/`.
- **Themes** — a handful of themes ship their own language files; ตรวจสอบ `htdocs/themes/<theme>/language/` ถ้ามีอยู่

A "core only" translation is the minimum useful unit and corresponds to the first two bullets above.

## แปลยังไง.

1. คัดลอกไดเร็กทอรี `english/` ที่อยู่ข้างๆ และเปลี่ยนชื่อสำเนาเป็นภาษาของคุณ The directory name should be the lowercase English name of the language (`spanish`, `german`, `french`, `japanese`, `arabic`, etc.).

   
```
   htdocs/ภาษา/อังกฤษ/ → htdocs/ภาษา/สเปน/
   
```

2. Open each `.php` file in the new directory and translate the **string values** inside the `define()` calls. อย่า **อย่า** เปลี่ยนชื่อคงที่ โดยอ้างอิงจากโค้ด PHP ทั่วทั้งแกนกลาง

   
```php
   // ก่อน:
   กำหนด('_CM_COMDELETED', 'ลบความคิดเห็นแล้ว');
   define('_CM_COMDELETENG', 'Could not delete comment.');
   define('_CM_DELETESELECT', 'Delete all its child comments?');

   // หลัง (ภาษาสเปน):
   define('_CM_COMDELETED',  'Comentario(s) eliminado(s).');
   define('_CM_COMDELETENG', 'No se pudo eliminar el comentario.');
   define('_CM_DELETESELECT', '¿Eliminar también todos sus comentarios secundarios?');
   
```

3. **Save every file as UTF-8 *without* BOM.** XOOPS 2.7.0 uses `utf8mb4` end-to-end (database, sessions, output) และปฏิเสธไฟล์ที่มีเครื่องหมายลำดับไบต์ ใน Notepad++ นี่คือตัวเลือก **"UTF-8"** *ไม่ใช่* "UTF-8-BOM" ในโค้ด VS เป็นค่าเริ่มต้น เพียงยืนยันการเข้ารหัสในแถบสถานะ

4. Update the language and charset metadata at the top of each file to match your language:

   
```php
   // _LANGCODE: เช่น
   // _CHARSET : UTF-8
   // ผู้แปล: ชื่อของคุณ
   
```

   `_LANGCODE` ควรเป็นโค้ด [ISO 639-1](https://www.loc.gov/standards/iso639-2/php/code_list.php) สำหรับภาษาของคุณ `_CHARSET` is always `UTF-8` in XOOPS 2.7.0 — there is no longer an ISO-8859-1 variant.

5. ทำซ้ำสำหรับตัวติดตั้ง โมดูลระบบ และโมดูลที่รวมมาที่คุณต้องการ

## วิธีการติดตั้งการแปล

หากคุณได้รับการแปลเสร็จแล้วเป็นแผนผังไดเร็กทอรี:1. คัดลอกไดเรกทอรี `<language>/` แต่ละรายการลงในไดเร็กทอรี `language/english/` ที่ตรงกันในการติดตั้ง XOOPS ของคุณ ตัวอย่างเช่น คัดลอก `language/spanish/` ลงใน `htdocs/language/`, `install/language/spanish/` ลงใน `htdocs/install/language/` และอื่นๆ
2. ตรวจสอบให้แน่ใจว่าเว็บเซิร์ฟเวอร์สามารถอ่านความเป็นเจ้าของและการอนุญาตไฟล์ได้
3. เลือกภาษาใหม่ ณ เวลาติดตั้ง (วิซาร์ดจะสแกน `htdocs/language/` สำหรับภาษาที่มี) หรือบนไซต์ที่มีอยู่ ให้เปลี่ยนภาษาใน **ผู้ดูแลระบบ → ระบบ → การตั้งค่า → การตั้งค่าทั่วไป**

## แบ่งปันคำแปลของคุณกลับ

กรุณาสนับสนุนการแปลของคุณกลับไปยังชุมชน

1. สร้างพื้นที่เก็บข้อมูล GitHub (หรือแยกพื้นที่เก็บข้อมูลภาษาที่มีอยู่ หากมีสำหรับภาษาของคุณ)
2. ใช้ชื่อที่ชัดเจน เช่น `xoops-language-<language-code>` (เช่น `xoops-language-es`, `xoops-language-pt-br`¤)
3. จำลองโครงสร้างไดเรกทอรี XOOPS ภายในพื้นที่เก็บข้อมูลของคุณ เพื่อให้ไฟล์เรียงตามตำแหน่งที่คัดลอก:

   
```
   xoops-ภาษา-es/
   ├── ภาษา/สเปน/(ไฟล์).php
   ├── ติดตั้ง/ภาษา/สเปน/(ไฟล์).php
   └── โมดูล/ระบบ/ภาษา/สเปน/(ไฟล์).php
   
```

4. รวมเอกสาร `README.md`:
   - ชื่อภาษาและรหัส ISO
   - XOOPS เวอร์ชันที่เข้ากันได้ (เช่น `XOOPS 2.7.0+`)
   - นักแปลและเครดิต
   - ไม่ว่าการแปลจะเป็นแบบแกนหลักเท่านั้นหรือครอบคลุมโมดูลที่รวมกลุ่ม
5. เปิดคำขอดึงข้อมูลโมดูล/พื้นที่เก็บข้อมูลหลักที่เกี่ยวข้องบน GitHub หรือโพสต์ประกาศบน [https://xoops.org](https://xoops.org¤) เพื่อให้ชุมชนสามารถค้นพบได้

> **หมายเหตุ**
>
> หากภาษาของคุณต้องการการเปลี่ยนแปลงแกนหลักสำหรับการจัดรูปแบบวันที่หรือปฏิทิน ให้รวมการเปลี่ยนแปลงเหล่านั้นไว้ในแพ็คเกจด้วย ภาษาที่มีสคริปต์จากขวาไปซ้าย (อารบิก ฮีบรู เปอร์เซีย อูรดู) ทำงานได้ทันทีใน XOOPS 2.7.0 — RTL มีการเพิ่มการสนับสนุนในรุ่นนี้ และแต่ละธีมจะถูกเลือกโดยอัตโนมัติ