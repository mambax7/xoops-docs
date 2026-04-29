---
title: 빠른 시작
description: 5분 이내에 XOOPS 2.7을 실행해 보세요.
---

## 요구 사항

| 구성요소 | 최소 | 추천 |
|------------|-------------------------|---------------|
| PHP | 8.2 | 8.4+ |
| MySQL | 5.7 | 8.0+ |
| MariaDB | 10.4 | 10.11+ |
| 웹 서버 | Apache 2.4 / Nginx 1.20 | 최신 안정 |

## 다운로드

[GitHub 릴리스](https://github.com/XOOPS/XoopsCore27/releases)에서 최신 릴리스를 다운로드하세요.

```bash
# Or clone directly
git clone https://github.com/XOOPS/XoopsCore27.git mysite
cd mysite
```

## 설치 단계

1. 웹 서버 문서 루트(예: `public_html/`)에 **파일을 업로드**합니다.
2. **MySQL 데이터베이스**를 생성하고 해당 데이터베이스에 대한 모든 권한을 가진 사용자를 생성합니다.
3. **브라우저를 열고** 도메인으로 이동하세요. XOOPS 설치 프로그램이 자동으로 시작됩니다.
4. **5단계 마법사를 따르세요** — 경로를 구성하고, 테이블을 생성하고, 관리자 계정을 설정합니다.
5. **메시지가 표시되면 `install/` 폴더를 삭제합니다**. 이는 보안을 위해 필수입니다.

## 설치 확인

설정 후 다음을 방문하세요.

- **첫 페이지:** `https://yourdomain.com/`
- **관리자 패널:** `https://yourdomain.com/xoops_data/` *(설치 시 선택한 경로)*

## 다음 단계

- [전체 설치 가이드](./installation/) — 서버 구성, 권한, 문제 해결
- [모듈 가이드](./module-guide/introduction/) — 첫 번째 모듈 구축
- [테마 가이드](./theme-guide/introduction/) — 테마를 생성하거나 맞춤 설정하세요.
