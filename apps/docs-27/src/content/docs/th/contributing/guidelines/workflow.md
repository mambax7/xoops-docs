---
title: "เวิร์กโฟลว์การบริจาค"
description: "คำแนะนำทีละขั้นตอนเพื่อสนับสนุนโครงการ XOOPS"
---
> คู่มือนี้จะแนะนำคุณตลอดกระบวนการทั้งหมดในการร่วมให้ข้อมูลกับ XOOPS ตั้งแต่การตั้งค่าเริ่มต้นไปจนถึงคำขอดึงแบบรวม

---

## ข้อกำหนดเบื้องต้น

ก่อนที่คุณจะเริ่มมีส่วนร่วม ตรวจสอบให้แน่ใจว่าคุณมี:

- **Git** ติดตั้งและกำหนดค่าแล้ว
- **บัญชี GitHub** (ฟรี)
- **PHP 7.4+** สำหรับ XOOPS การพัฒนา
- **ผู้แต่ง** สำหรับการจัดการการพึ่งพา
- ความรู้พื้นฐานเกี่ยวกับเวิร์กโฟลว์ Git
- ความคุ้นเคยกับหลักจรรยาบรรณ

---

## ขั้นตอนที่ 1: แยกพื้นที่เก็บข้อมูล

### บนเว็บอินเตอร์เฟส GitHub

1. ไปที่พื้นที่เก็บข้อมูล (เช่น `XOOPS/XoopsCore27`)
2. คลิกปุ่ม **แยก** ที่มุมขวาบน
3. เลือกตำแหน่งที่จะแยก (บัญชีส่วนตัวของคุณ)
4. รอให้ส้อมเสร็จ

### ทำไมต้องแยก?

- คุณได้รับสำเนาของคุณเองเพื่อดำเนินการ
- ผู้ดูแลไม่จำเป็นต้องบริหารจัดการหลายสาขา
- คุณสามารถควบคุมส้อมของคุณได้อย่างเต็มที่
- Pull Requests อ้างอิงถึง fork ของคุณและ upstream repo

---

## ขั้นตอนที่ 2: โคลนส้อมของคุณในพื้นที่
```bash
# Clone your fork (replace YOUR_USERNAME)
git clone https://github.com/YOUR_USERNAME/XoopsCore27.git
cd XoopsCore27

# Add upstream remote to track original repository
git remote add upstream https://github.com/XOOPS/XoopsCore27.git

# Verify remotes are set correctly
git remote -v
# origin    https://github.com/YOUR_USERNAME/XoopsCore27.git (fetch)
# origin    https://github.com/YOUR_USERNAME/XoopsCore27.git (push)
# upstream  https://github.com/XOOPS/XoopsCore27.git (fetch)
# upstream  https://github.com/XOOPS/XoopsCore27.git (nofetch)
```
---

## ขั้นตอนที่ 3: ตั้งค่าสภาพแวดล้อมการพัฒนา

### ติดตั้งการอ้างอิง
```bash
# Install Composer dependencies
composer install

# Install development dependencies
composer install --dev

# For module development
cd modules/mymodule
composer install
```
### กำหนดค่า Git
```bash
# Set your Git identity
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Optional: Set global Git config
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```
### เรียกใช้การทดสอบ
```bash
# Make sure tests pass in clean state
./vendor/bin/phpunit

# Run specific test suite
./vendor/bin/phpunit --testsuite unit
```
---

## ขั้นตอนที่ 4: สร้างสาขาคุณลักษณะ

### อนุสัญญาการตั้งชื่อสาขา

ทำตามรูปแบบนี้: `<type>/<description>`

**ประเภท:**
- `feature/` - คุณสมบัติใหม่
- `fix/` - แก้ไขข้อผิดพลาด
- `docs/` - เอกสารเท่านั้น
- `refactor/` - การปรับโครงสร้างโค้ดใหม่
- `test/` - ทดสอบเพิ่มเติม
- `chore/`

**ตัวอย่าง:**
```bash
# Feature branch
git checkout -b feature/add-two-factor-auth

# Bug fix branch
git checkout -b fix/prevent-xss-in-forms

# Documentation branch
git checkout -b docs/update-api-guide

# Always branch from upstream/main (or develop)
git checkout -b feature/my-feature upstream/main
```
### ให้สาขาทันสมัยอยู่เสมอ
```bash
# Before you start work, sync with upstream
git fetch upstream
git merge upstream/main

# Later, if upstream has changed
git fetch upstream
git rebase upstream/main
```
---

## ขั้นตอนที่ 5: ทำการเปลี่ยนแปลงของคุณ

### แนวทางปฏิบัติในการพัฒนา

1. **เขียนโค้ด** ตามมาตรฐาน PHP
2. **เขียนการทดสอบ** สำหรับฟังก์ชันใหม่
3. **อัปเดตเอกสาร** หากจำเป็น
4. **เรียกใช้ linters** และตัวจัดรูปแบบโค้ด

### การตรวจสอบคุณภาพรหัส
```bash
# Run all tests
./vendor/bin/phpunit

# Run with coverage
./vendor/bin/phpunit --coverage-html coverage/

# Run PHP CS Fixer
./vendor/bin/php-cs-fixer fix --dry-run

# Run PHPStan static analysis
./vendor/bin/phpstan analyse class/ src/
```
### มุ่งมั่นในการเปลี่ยนแปลงที่ดี
```bash
# Check what you changed
git status
git diff

# Stage specific files
git add class/MyClass.php
git add tests/MyClassTest.php

# Or stage all changes
git add .

# Commit with descriptive message
git commit -m "feat(auth): add two-factor authentication support"
```
---

## ขั้นตอนที่ 6: ทำให้สาขาอยู่ในซิงค์

ในขณะที่ทำงานเกี่ยวกับฟีเจอร์ของคุณ สาขาหลักอาจก้าวหน้าไป:
```bash
# Fetch latest changes from upstream
git fetch upstream

# Option A: Rebase (preferred for clean history)
git rebase upstream/main

# Option B: Merge (simpler but adds merge commits)
git merge upstream/main

# If conflicts occur, resolve them then:
git add .
git rebase --continue  # or git merge --continue
```
---

## ขั้นตอนที่ 7: ดันไปที่ส้อมของคุณ
```bash
# Push your branch to your fork
git push origin feature/my-feature

# On subsequent pushes
git push

# If you rebased, you might need force push (use carefully!)
git push --force-with-lease origin feature/my-feature
```
---

## ขั้นตอนที่ 8: สร้างคำขอดึง

### บนเว็บอินเตอร์เฟส GitHub

1. ไปที่ทางแยกของคุณบน GitHub
2. คุณจะเห็นการแจ้งเตือนให้สร้าง PR จากสาขาของคุณ
3. คลิก **"เปรียบเทียบและดึงคำขอ"**
4. หรือคลิกด้วยตนเอง **"คำขอดึงใหม่"** และเลือกสาขาของคุณ

### PR ชื่อและคำอธิบาย

**รูปแบบชื่อเรื่อง:**
```
<type>(<scope>): <subject>
```
ตัวอย่าง:
```
feat(auth): add two-factor authentication
fix(forms): prevent XSS in text input
docs: update installation guide
refactor(core): improve performance
```
**เทมเพลตคำอธิบาย:**
```
markdown
## Description
Brief explanation of what this PR does.

## Changes
- Changed X from A to B
- Added feature Y
- Fixed bug Z

## Type of Change
- [ ] New feature (adds new functionality)
- [ ] Bug fix (fixes an issue)
- [ ] Breaking change (API/behavior change)
- [ ] Documentation update

## Testing
- [ ] Added tests for new functionality
- [ ] All existing tests pass
- [ ] Manual testing performed

## Screenshots (if applicable)
Include before/after screenshots for UI changes.

## Related Issues
Closes #123
Related to #456

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed own code
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No new warnings generated
- [ ] Tests pass locally
```
### PR รายการตรวจสอบการทบทวน

ก่อนส่ง โปรดตรวจสอบให้แน่ใจว่า:

- [ ] รหัสเป็นไปตามมาตรฐาน PHP
- [ ] รวมการทดสอบและผ่าน
- [ ] อัปเดตเอกสารแล้ว (หากจำเป็น)
- [ ] ไม่มีข้อขัดแย้งในการรวม
- [ ] ข้อความยืนยันมีความชัดเจน
- [ ] มีการอ้างอิงประเด็นที่เกี่ยวข้อง
- [ ] PR คำอธิบายมีรายละเอียด
- [ ] ไม่มีรหัสแก้ไขข้อบกพร่องหรือบันทึกคอนโซล

---

## ขั้นตอนที่ 9: ตอบสนองต่อคำติชม

### ระหว่างการตรวจสอบโค้ด

1. **อ่านความคิดเห็นอย่างละเอียด** - ทำความเข้าใจความคิดเห็น
2. **ถามคำถาม** - หากไม่ชัดเจน ให้ขอคำชี้แจง
3. **หารือเกี่ยวกับทางเลือกอื่น** - อภิปรายแนวทางด้วยความเคารพ
4. **ทำการเปลี่ยนแปลงตามที่ร้องขอ** - อัปเดตสาขาของคุณ
5. **การคอมมิตแบบ Force-push ที่อัปเดต** - หากเขียนประวัติใหม่
```bash
# Make changes
git add .
git commit --amend  # Modify last commit
git push --force-with-lease origin feature/my-feature

# Or add new commits
git commit -m "Address feedback on PR review"
git push origin feature/my-feature
```
### คาดว่าจะมีการทำซ้ำ

- PR ส่วนใหญ่ต้องมีการตรวจสอบหลายรอบ
- มีความอดทนและสร้างสรรค์
- มองคำติชมเป็นโอกาสในการเรียนรู้
- ผู้ดูแลอาจแนะนำการปรับโครงสร้างใหม่

---

## ขั้นตอนที่ 10: ผสานและล้างข้อมูล

### หลังจากได้รับการอนุมัติ

เมื่อผู้ดูแลอนุมัติและรวมเข้าด้วยกัน:

1. **การรวม GitHub อัตโนมัติ** หรือการรวมการคลิกของผู้ดูแล
2. **สาขาของคุณถูกลบ** (ปกติจะเป็นอัตโนมัติ)
3. **การเปลี่ยนแปลงอยู่ในต้นน้ำ**

### การล้างข้อมูลในท้องถิ่น
```bash
# Switch to main branch
git checkout main

# Update main with merged changes
git fetch upstream
git merge upstream/main

# Delete local feature branch
git branch -d feature/my-feature

# Delete from your fork (if not auto-deleted)
git push origin --delete feature/my-feature
```
---

## แผนภาพขั้นตอนการทำงาน
```
mermaid
graph LR
    A[Fork Repository] --> B[Clone Fork]
    B --> C[Create Branch]
    C --> D[Make Changes]
    D --> E[Commit & Push]
    E --> F[Create PR]
    F --> G{Review}
    G -->|Approved| H[Merge]
    G -->|Changes Needed| I[Update PR]
    I --> G
    H --> J[Cleanup]
    J --> K[Done]
```
---

## สถานการณ์ทั่วไป

### การซิงค์ก่อนเริ่ม
```bash
# Always start fresh
git fetch upstream
git checkout -b feature/new-thing upstream/main
```
### การเพิ่มความมุ่งมั่นเพิ่มเติม
```bash
# Just push again
git add .
git commit -m "feat: additional changes"
git push origin feature/new-thing
```
### แก้ไขข้อผิดพลาด
```bash
# Last commit has wrong message
git commit --amend -m "Correct message"
git push --force-with-lease

# Revert to previous state (careful!)
git reset --soft HEAD~1  # Keep changes
git reset --hard HEAD~1  # Discard changes
```
### การจัดการความขัดแย้งในการผสาน
```bash
# Rebase and resolve conflicts
git fetch upstream
git rebase upstream/main

# Edit conflicted files to resolve
# Then continue
git add .
git rebase --continue
git push --force-with-lease
```
---

## แนวทางปฏิบัติที่ดีที่สุด

### ทำ

- ให้สาขามุ่งเน้นไปที่ประเด็นเดียว
- สร้างคอมมิตเล็กๆ แบบลอจิคัล
- เขียนข้อความยืนยันเชิงอธิบาย
- อัปเดตสาขาของคุณบ่อยๆ
- ทดสอบก่อนดัน
- การเปลี่ยนแปลงเอกสาร
- ตอบสนองต่อข้อเสนอแนะ

### อย่า

- ทำงานโดยตรงกับสาขาหลัก/สาขาหลัก
- ผสมผสานการเปลี่ยนแปลงที่ไม่เกี่ยวข้องไว้ใน PR เดียว
- คอมมิตไฟล์ที่สร้างขึ้นหรือ node_modules
- บังคับให้กดหลังจาก PR เป็นแบบสาธารณะ (ใช้ --force-with-lease)
- ละเว้นความคิดเห็นเกี่ยวกับการตรวจสอบโค้ด
- สร้าง PR ขนาดใหญ่ (แบ่งเป็นอันเล็ก ๆ )
- ส่งข้อมูลที่ละเอียดอ่อน (คีย์ API รหัสผ่าน)

---

## เคล็ดลับสู่ความสำเร็จ

### สื่อสาร

- ถามคำถามในประเด็นก่อนเริ่มงาน
- ขอคำแนะนำเกี่ยวกับการเปลี่ยนแปลงที่ซับซ้อน
- อภิปรายแนวทางในคำอธิบาย PR
- ตอบสนองต่อข้อเสนอแนะทันที

### ปฏิบัติตามมาตรฐาน

- ทบทวนมาตรฐาน PHP
- ตรวจสอบแนวทางการรายงานปัญหา
- อ่านภาพรวมการมีส่วนร่วม
- ปฏิบัติตามแนวทางการขอดึง

### เรียนรู้ Codebase

- อ่านรูปแบบโค้ดที่มีอยู่
- ศึกษาการใช้งานที่คล้ายกัน
- เข้าใจสถาปัตยกรรม
- ตรวจสอบแนวคิดหลัก

---

## เอกสารที่เกี่ยวข้อง

- หลักจรรยาบรรณ
- แนวทางการขอดึง
- การรายงานปัญหา
- PHP มาตรฐานการเข้ารหัส
- ภาพรวมการมีส่วนร่วม

---

#xoops #git #github #contributing #workflow #pull-request