# 홀씨 Worship 웹사이트

"Here & There" - 우리가 함께 모이는 이곳에서도, 우리가 흩어져 나아갈 그곳에서도

## 프로젝트 소개

이 프로젝트는 홀씨 Worship 웹사이트의 클론으로, React와 Tailwind CSS를 사용하여 구현되었습니다.

## 기술 스택

- React
- Tailwind CSS
- EmailJS (연락 폼)

## 로컬에서 실행하기

1. 저장소 클론하기
```bash
git clone https://github.com/yourusername/holssiworship.git
cd holssiworship
```

2. 의존성 설치하기
```bash
npm install
```

3. 로컬 서버 실행하기
```bash
npm start
```

4. 브라우저에서 확인하기
```
http://localhost:3000
```

## 배포하기

이 프로젝트는 Vercel에 배포되어 있습니다.

### 자동 배포 설정

이 프로젝트는 GitHub Actions를 통해 자동 배포가 설정되어 있습니다. main 브랜치에 변경 사항이 푸시되면 자동으로 Vercel에 배포됩니다.

#### 자동 푸시 및 배포 방법

1. 변경 사항 작업 후 아래 명령어로 자동 푸시 및 배포:
```bash
npm run deploy
```

#### 수동 Vercel 배포 방법

1. [Vercel](https://vercel.com)에 가입하고 GitHub 계정을 연결합니다.
2. "New Project"를 클릭하고 이 저장소를 선택합니다.
3. 기본 설정을 유지하고 "Deploy"를 클릭합니다.

### GitHub Actions 설정 방법

1. GitHub 저장소의 "Settings" > "Secrets" > "Actions"에서 다음 비밀값을 설정합니다:
   - `VERCEL_TOKEN`: Vercel에서 생성한 토큰
   - `VERCEL_ORG_ID`: Vercel 조직 ID
   - `VERCEL_PROJECT_ID`: Vercel 프로젝트 ID

## 컴포넌트 구조

- Header: 네비게이션 및 로고
- Hero: 메인 배너 섹션
- About: 홀씨 예배 소개
- Worship: 예배 유형 안내
- UpcomingEvents: 다가오는 예배 및 이벤트 정보
- Contact: 연락 폼 및 정보
- Footer: 사이트 푸터 및 소셜 미디어 링크

## 라이센스

이 프로젝트는 MIT 라이센스를 따릅니다.

## 연락처

holssi.worship@example.com