---
title: "경로 설정"
---

이 페이지에서는 XOOPS가 작동하는데 필요한 파일 시스템과 웹 주소에 대한 정보를 수집합니다. 설치 프로그램은 사용자가 액세스하는 데 사용하는 URL과 실행 중인 PHP 스크립트의 위치를 ​​기반으로 이 정보를 추측하려고 시도합니다.

문제를 검토하고 수정한 후 "계속" 버튼을 선택하여 계속 진행하세요.

![XOOPS Installer Path Settings](/xoops-docs/2.7/img/installation/installer-04-02.png)

## 이 단계에서 수집된 데이터

### XOOPS 물리적 경로

#### XOOPS 문서 루트 실제 경로

후행 슬래시가 없는 XOOPS 문서(제공) 디렉터리의 실제 경로

#### XOOPS 데이터 파일 디렉터리

후행 슬래시가 없는 XOOPS 데이터 파일(쓰기 가능) 디렉터리의 물리적 경로입니다. 보안을 위해 XOOPS 문서 루트에서 폴더를 찾으세요.

#### XOOPS 라이브러리 디렉토리

후행 슬래시가 없는 XOOPS 라이브러리 디렉터리의 실제 경로입니다. 보안을 위해 XOOPS 문서 루트에서 폴더를 찾으세요.

### 웹 위치

#### 웹사이트 위치(URL)

XOOPS 설치에 액세스하는 데 사용되는 기본 URL입니다. XOOPS는 이를 사용하여 XOOPS 내부에 모든 URL을 구축합니다. _https_ 사이트를 원하시면 반드시 지정해주세요. 사이트 도메인에 앞에 _www._를 원하거나 원하지 않는 경우 원하는 방식으로 지정해야 합니다.

이는 설치 프로그램을 시작하는 데 사용되는 URL이 기본값입니다.

#### 웹사이트용 쿠키 도메인

쿠키를 설정하는 도메인입니다. 비어 있을 수 있으며, URL의 전체 호스트(www.example.com) 또는 하위 도메인(www.example.com 및 blog.example.com) 간에 공유할 하위 도메인이 없는 등록된 도메인(example.com)일 수 있습니다.

## 오류

입력한 경로를 찾을 수 없으면 오류가 표시됩니다. 계속하기 전에 문제를 수정하세요.

![XOOPS Installer Path Settings Error](/xoops-docs/2.7/img/installation/installer-04-01.png)

## 도움말

설치 프로세스 중에 자세한 설명을 볼 수 있습니다. 페이지 상단 모서리에 있는 "구명 조끼" 아이콘을 선택하면 자세한 설명 표시가 전환됩니다.

![XOOPS Installer Path Settings Help](/xoops-docs/2.7/img/installation/installer-04-03.png)

