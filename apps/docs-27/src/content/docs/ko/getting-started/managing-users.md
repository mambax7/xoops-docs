---
title: "사용자 관리"
description: "사용자, 사용자 그룹, 권한 및 사용자 역할 생성을 포함하여 XOOPS의 사용자 관리에 대한 종합 가이드"
---

# XOOPS에서 사용자 관리

XOOPS에서 사용자 계정을 생성하고, 사용자를 그룹으로 구성하고, 권한을 관리하는 방법을 알아보세요.

## 사용자 관리 개요

XOOPS는 다음을 통해 포괄적인 사용자 관리를 제공합니다.

```
Users > Accounts
├── Individual users
├── User profiles
├── Registration requests
└── Online users

Users > Groups
├── User groups/roles
├── Group permissions
└── Group membership

System > Permissions
├── Module access
├── Content access
├── Function permissions
└── Group capabilities
```

## 사용자 관리에 접근하기

### 관리자 패널 탐색

1. 관리자로 로그인하세요: `http://your-domain.com/xoops/admin/`
2. 왼쪽 사이드바에서 **사용자**를 클릭합니다.
3. 옵션 중에서 선택하십시오:
   - **사용자:** 개인 계정 관리
   - **그룹:** 사용자 그룹 관리
   - **온라인 사용자:** 현재 활성 사용자 보기
   - **사용자 요청:** 등록 요청 처리

## 사용자 역할 이해

XOOPS에는 사전 정의된 사용자 역할이 함께 제공됩니다.

| 그룹 | 역할 | 기능 | 사용 사례 |
|---|---|---|---|
| **웹마스터** | 관리자 | 전체 사이트 제어 | 주요 관리자 |
| **관리자** | 관리자 | 제한된 관리자 액세스 | 신뢰할 수 있는 사용자 |
| **사회자** | 콘텐츠 제어 | 콘텐츠 승인 | 커뮤니티 관리자 |
| **편집자** | 콘텐츠 제작 | 콘텐츠 생성/편집 | 콘텐츠 스태프 |
| **등록됨** | 회원 | 게시물, 댓글, 프로필 | 일반 사용자 |
| **익명** | 방문객 | 읽기 전용 | 로그인하지 않은 사용자 |

## 사용자 계정 만들기

### 방법 1: 관리자가 사용자 생성

**1단계: 사용자 생성에 액세스**

1. **사용자 > 사용자**로 이동합니다.
2. **"새 사용자 추가"** 또는 **"사용자 만들기"**를 클릭하세요.

**2단계: 사용자 정보 입력**

사용자 세부정보를 입력하세요.

```
Username: [4+ characters, letters/numbers/underscore only]
Example: john_smith

Email Address: [Valid email address]
Example: john@example.com

Password: [Strong password]
Example: MyStr0ng!Pass2025

Confirm Password: [Repeat password]
Example: MyStr0ng!Pass2025

Real Name: [User's full name]
Example: John Smith

URL: [Optional user website]
Example: https://johnsmith.com

Signature: [Optional forum signature]
Example: "Happy XOOPS user!"
```

**3단계: 사용자 설정 구성**

```
User Status: ☑ Active
             ☐ Inactive
             ☐ Pending Approval

User Groups:
☑ Registered Users
☐ Webmasters
☐ Admins
☐ Moderators
```

**4단계: 추가 옵션**

```
Notify User: ☑ Send welcome email
Allow Avatar: ☑ Yes
User Theme: [Default theme]
Show Email: ☐ Public / ☑ Private
```

**5단계: 계정 만들기**

**"사용자 추가"** 또는 **"만들기"**를 클릭하세요.

확인:
```
User created successfully!
Username: john_smith
Email: john@example.com
Groups: Registered Users
```

### 방법 2: 사용자 자가 등록

사용자가 스스로 등록하도록 허용합니다.

**관리자 패널 > 시스템 > 기본 설정 > 사용자 설정**

```
Allow User Registration: ☑ Yes

Registration Type:
☐ Instant (Approve automatically)
☑ Email Verification (Email confirmation)
☐ Admin Approval (You approve each)

Send Verification Email: ☑ Yes
```

그런 다음:
1. 사용자가 등록 페이지를 방문합니다.
2. 기본정보를 입력합니다.
3. 이메일을 확인하거나 승인을 기다립니다.
4. 계정 활성화

## 사용자 계정 관리

### 모든 사용자 보기

**위치:** 사용자 > 사용자

다음을 포함하는 사용자 목록을 표시합니다.
- 사용자 이름
- 이메일 주소
- 등록일
- 마지막 로그인
- 사용자 상태(활성/비활성)
- 그룹 멤버십

### 사용자 계정 편집

1. 사용자 목록에서 사용자 이름을 클릭합니다.
2. 필드를 수정합니다.
   - 이메일 주소
   - 비밀번호
   - 실명
   - 사용자 그룹
   - 현황

3. **"저장"** 또는 **"업데이트"**를 클릭하세요.

### 사용자 비밀번호 변경

1. 목록에서 사용자를 클릭합니다.
2. '비밀번호 변경' 섹션으로 스크롤하세요.
3. 새로운 비밀번호를 입력하세요
4. 비밀번호 확인
5. **"비밀번호 변경"**을 클릭하세요.

사용자는 다음 로그인 시 새 비밀번호를 사용하게 됩니다.

### 사용자 비활성화/정지

삭제하지 않고 계정을 일시적으로 비활성화합니다.

1. 목록에서 사용자를 클릭합니다.
2. **사용자 상태**를 "비활성"으로 설정합니다.
3. **"저장"**을 클릭하세요.

비활성 상태에서는 사용자가 로그인할 수 없습니다.

### 사용자 재활성화

1. 목록에서 사용자를 클릭합니다.
2. **사용자 상태**를 "활성"으로 설정합니다.
3. **"저장"**을 클릭하세요.

사용자는 다시 로그인할 수 있습니다.

### 사용자 계정 삭제

사용자를 영구적으로 제거합니다.

1. 목록에서 사용자를 클릭합니다.
2. 맨 아래로 스크롤
3. **"사용자 삭제"**를 클릭하세요.
4. 확인: "사용자 및 모든 데이터를 삭제하시겠습니까?"
5. **"예"**를 클릭하세요.

**경고:** 삭제는 영구적입니다!

### 사용자 프로필 보기

사용자 프로필 세부정보 보기:

1. 사용자 목록에서 사용자 이름을 클릭합니다.
2. 프로필 정보를 검토합니다.
   - 실명
   - 이메일
   - 웹사이트
   - 가입 날짜
   - 마지막 로그인
   - 사용자 약력
   - 아바타
   - 게시물/기고

## 사용자 그룹 이해하기

### 기본 사용자 그룹

XOOPS에는 기본 그룹이 포함됩니다.

| 그룹 | 목적 | 특별 | 편집 |
|---|---|---|---|
| **익명** | 로그인하지 않은 사용자 | 고정 | 아니요 |
| **등록된 사용자** | 정회원 | 기본값 | 예 |
| **웹마스터** | 사이트 관리자 | 관리자 | 예 |
| **관리자** | 제한된 관리자 | 관리자 | 예 |
| **사회자** | 콘텐츠 중재자 | 맞춤 | 예 |

### 사용자 정의 그룹 만들기

특정 역할에 대한 그룹 만들기:

**위치:** 사용자 > 그룹

1. **"새 그룹 추가"**를 클릭하세요.
2. 그룹 세부정보를 입력하세요.

```
Group Name: Content Editors
Group Description: Users who can create and edit content

Display Group: ☑ Yes (Show in member profiles)
Group Type: ☑ Regular / ☐ Admin
```

3. **"그룹 만들기"**를 클릭하세요.

### 그룹 멤버십 관리

사용자를 그룹에 할당합니다.

**옵션 A: 사용자 목록에서**

1. **사용자 > 사용자**로 이동합니다.
2. 사용자를 클릭하세요
3. "사용자 그룹" 섹션에서 그룹을 선택/선택 취소합니다.
4. **"저장"**을 클릭하세요.

**옵션 B: 그룹에서**

1. **사용자 > 그룹**으로 이동합니다.
2. 그룹명을 클릭하세요.
3. 회원목록 조회/수정
4. 사용자 추가 또는 제거
5. **"저장"**을 클릭하세요.

### 그룹 속성 편집

그룹 설정 사용자 정의:

1. **사용자 > 그룹**으로 이동합니다.
2. 그룹명을 클릭하세요.
3. 수정:
   - 그룹 이름
   - 그룹 설명
   - 표시 그룹(표시/숨기기)
   - 그룹 유형
4. **"저장"**을 클릭하세요.

## 사용자 권한

### 권한 이해하기

세 가지 권한 수준:

| 레벨 | 범위 | 예 |
|---|---|---|
| **모듈 액세스** | 모듈 보기/사용 가능 | 포럼 모듈에 액세스할 수 있습니다 |
| **컨텐츠 권한** | 특정 콘텐츠를 볼 수 있습니다 | 출판된 뉴스를 읽을 수 있습니다 |
| **기능 권한** | 작업을 수행할 수 있습니다 | 댓글을 게시할 수 있습니다 |

### 모듈 액세스 구성

**위치:** 시스템 > 권한

각 모듈에 액세스할 수 있는 그룹을 제한합니다.

```
Module: News

Admin Access:
☑ Webmasters
☑ Admins
☐ Moderators
☐ Registered Users
☐ Anonymous

User Access:
☐ Webmasters
☐ Admins
☑ Moderators
☑ Registered Users
☑ Anonymous
```

적용하려면 **"저장"**을 클릭하세요.

### 콘텐츠 권한 설정

특정 콘텐츠에 대한 액세스 제어:

예 - 뉴스 기사:
```
View Permission:
☑ All groups can read

Post Permission:
☑ Registered Users
☑ Content Editors
☐ Anonymous

Moderate Comments:
☑ Moderators required
```

### 권한 모범 사례

```
Public Content (News, Pages):
├── View: All groups
├── Post: Registered Users + Editors
└── Moderate: Admins + Moderators

Community (Forum, Comments):
├── View: All groups
├── Post: Registered Users
└── Moderate: Moderators + Admins

Admin Tools:
├── View: Webmasters + Admins only
├── Configure: Webmasters only
└── Delete: Webmasters only
```

## 사용자 등록 관리

### 등록 요청 처리

"관리자 승인"이 활성화된 경우:

1. **사용자 > 사용자 요청**으로 이동합니다.
2. 보류 중인 등록 보기:
   - 사용자 이름
   - 이메일
   - 등록일
   - 요청 상태

3. 각 요청에 대해:
   - 검토하려면 클릭하세요.
   - 활성화하려면 **"승인"**을 클릭하세요.
   - 거부하려면 **"거부"**를 클릭하세요.

### 등록 이메일 보내기

환영/확인 이메일 다시 보내기:

1. **사용자 > 사용자**로 이동합니다.
2. 사용자를 클릭하세요
3. **"이메일 보내기"** 또는 **"인증서 다시 보내기"**를 클릭하세요.
4. 사용자에게 전송된 이메일

## 온라인 사용자 모니터링

### 현재 온라인 사용자 보기

활성 사이트 방문자 추적:

**위치:** 사용자 > 온라인 사용자

쇼:
- 현재 온라인 사용자
- 손님 방문자 수
- 마지막 활동 시간
- IP 주소
- 찾아보기 위치

### 사용자 활동 모니터링

사용자 행동 이해:

```
Active Users: 12
Registered: 8
Anonymous: 4

Recent Activity:
- User1 - Forum post (2 min ago)
- User2 - Comment (5 min ago)
- User3 - Page view (8 min ago)
```

## 사용자 프로필 맞춤설정

### 사용자 프로필 활성화

사용자 프로필 옵션을 구성합니다.

**관리 > 시스템 > 기본 설정 > 사용자 설정**

```
Allow User Profiles: ☑ Yes
Show Member List: ☑ Yes
Users Can Edit Profile: ☑ Yes
Show User Avatar: ☑ Yes
Show Last Online: ☑ Yes
Show Email Address: ☐ Yes / ☑ No
```

### 프로필 필드

사용자가 프로필에 추가할 수 있는 항목을 구성합니다.

프로필 필드 예:
- 실명
- 웹사이트 URL
- 전기
- 위치
- 아바타(사진)
- 서명
- 관심분야
- 소셜 미디어 링크

모듈 설정에서 사용자 정의하세요.

## 사용자 인증

### 2단계 인증 활성화

향상된 보안 옵션(사용 가능한 경우):

**관리자 > 사용자 > 설정**

```
Two-Factor Authentication: ☑ Enabled

Methods:
☑ Email
☑ SMS
☑ Authenticator App
```

사용자는 두 번째 방법으로 인증해야 합니다.

### 비밀번호 정책

강력한 비밀번호 시행:

**관리 > 시스템 > 기본 설정 > 사용자 설정**

```
Minimum Password Length: 8 characters
Require Uppercase: ☑ Yes
Require Numbers: ☑ Yes
Require Special Chars: ☑ Yes

Password Expiration: 90 days
Force Change on First Login: ☑ Yes
```

### 로그인 시도

무차별 대입 공격을 방지합니다.

```
Lock After Failed Attempts: 5
Lock Duration: 15 minutes
Log All Attempts: ☑ Yes
Notify Admin: ☑ Yes
```

## 사용자 이메일 관리

### 그룹에 대량 이메일 보내기

여러 사용자에게 메시지 보내기:

1. **사용자 > 사용자**로 이동합니다.
2. 여러 사용자 선택(체크박스)
3. **"이메일 보내기"**를 클릭하세요.
4. 메시지 작성:
   - 주제
   - 메시지 본문
   - 서명 포함
5. **"보내기"**를 클릭하세요.

### 이메일 알림 설정

사용자가 수신할 이메일을 구성합니다.

**관리 > 시스템 > 기본 설정 > 이메일 설정**

```
New Registration: ☑ Send welcome email
Password Reset: ☑ Send reset link
Comments: ☑ Notify on replies
Messages: ☑ Notify new messages
Notifications: ☑ Site announcements
Frequency: ☐ Immediate / ☑ Daily / ☐ Weekly
```

## 사용자 통계

### 사용자 보고서 보기

사용자 측정항목 모니터링:

**관리 > 시스템 > 대시보드**

```
User Statistics:
├── Total Users: 256
├── Active Users: 189
├── New This Month: 24
├── Registration Requests: 3
├── Currently Online: 12
└── Last 24h Posts: 45
```

### 사용자 성장 추적

등록 추세 모니터링:

```
Registrations Last 7 Days: 12 users
Registrations Last 30 Days: 48 users
Active Users (30 days): 156
Inactive Users (30+ days): 100
```

## 일반적인 사용자 관리 작업

### 관리자 생성

1. 새 사용자 생성(위 단계)
2. **웹마스터** 또는 **관리자** 그룹에 할당
3. 시스템 > 권한에서 권한 부여
4. 관리자 액세스가 작동하는지 확인

### 중재자 만들기

1. 새로운 사용자 생성
2. **운영자** 그룹에 할당
3. 특정 모듈을 관리하기 위한 권한 구성
4. 사용자는 콘텐츠 승인, 댓글 관리 등을 할 수 있습니다.

### 콘텐츠 편집자 설정

1. **콘텐츠 편집자** 그룹 만들기
2. 사용자 생성, 그룹에 할당
3. 다음 권한을 부여합니다.
   - 페이지 생성/편집
   - 게시물 작성/수정
   - 댓글 검토
4. 관리자 패널 액세스 제한

### 잊어버린 비밀번호 재설정

사용자가 비밀번호를 잊어버렸습니다:

1. **사용자 > 사용자**로 이동합니다.
2. 사용자 찾기
3. 사용자 이름을 클릭하세요
4. **"비밀번호 재설정"**을 클릭하거나 비밀번호 필드를 편집하세요.
5. 임시 비밀번호 설정
6. 사용자에게 알림(이메일 보내기)
7. 사용자 로그인, 비밀번호 변경

### 사용자 대량 가져오기

사용자 목록 가져오기(고급):

많은 호스팅 패널은 다음을 위한 도구를 제공합니다.
1. 사용자 데이터가 포함된 CSV 파일 준비
2. 관리자 패널을 통해 업로드
3. 대량 계정 생성

또는 가져오기에 사용자 정의 스크립트/플러그인을 사용하십시오.

## 사용자 개인정보 보호

### 사용자 개인정보 존중

개인정보 보호 모범 사례:

```
Do:
✓ Hide emails by default
✓ Let users choose visibility
✓ Protect against spam

Don't:
✗ Share private data
✗ Display without permission
✗ Use for marketing without consent
```

### GDPR 준수

EU 사용자에게 서비스를 제공하는 경우:

1. 데이터 수집에 대한 동의를 받습니다.
2. 사용자가 자신의 데이터를 다운로드할 수 있도록 허용
3. 계정 삭제 옵션 제공
4. 개인정보 보호정책을 유지합니다.
5. 로그 데이터 처리 활동

## 사용자 문제 해결

### 사용자가 로그인할 수 없습니다

**문제:** 사용자가 비밀번호를 잊어버렸거나 계정에 액세스할 수 없습니다.

**해결책:**
1. 사용자 계정이 "활성"인지 확인합니다.
2. 비밀번호 재설정:
   - 관리 > 사용자 > 사용자 찾기
   - 새로운 임시 비밀번호 설정
   - 이메일을 통해 사용자에게 보내기
3. 사용자 쿠키/캐시 지우기
4. 계정이 잠겨있지 않은지 확인하세요

### 사용자 등록이 중단되었습니다.

**문제:** 사용자가 등록을 완료할 수 없습니다.

**해결책:**
1. 등록이 허용되는지 확인하세요.
   - 관리 > 시스템 > 환경설정 > 사용자 설정
   - 등록 활성화
2. 이메일 설정 작업 확인
3. 이메일 인증이 필요한 경우:
   - 인증메일 재전송
   - 스팸 폴더를 확인해보세요
4. 너무 엄격한 경우 비밀번호 요구 사항을 낮춥니다.

### 중복 계정

**문제:** 사용자에게 여러 계정이 있습니다.

**해결책:**
1. 사용자 목록에서 중복 계정 식별
2. 기본 계정 유지
3. 가능하다면 데이터를 병합하세요
4. 중복 계정 삭제
5. 설정에서 "이메일 중복 방지"를 활성화하세요.

## 사용자 관리 체크리스트

초기 설정의 경우:

- [ ] 사용자 등록 유형 설정(인스턴트/이메일/관리자)
- [ ] 필수 사용자 그룹 생성
- [ ] 그룹 권한 구성
- [ ] 비밀번호 정책 설정
- [ ] 사용자 프로필 활성화
- [ ] 이메일 알림 구성
- [ ] 사용자 아바타 옵션 설정
- [ ] 시험 등록 절차
- [ ] 테스트 계정 만들기
- [ ] 권한이 작동하는지 확인
- [ ] 문서 그룹 구조
- [ ] 사용자 온보딩 계획

## 다음 단계

사용자를 설정한 후:

1. 사용자에게 필요한 모듈 설치
2. 사용자를 위한 콘텐츠 만들기
3. 보안 사용자 계정
4. 더 많은 관리 기능 살펴보기
5. 시스템 전체 설정 구성

---

**태그:** #사용자 #그룹 #권한 #관리 #액세스 제어

**관련 기사:**
- 관리자 패널 개요
- 모듈 설치
-../구성/보안-구성
-../구성/시스템 설정
