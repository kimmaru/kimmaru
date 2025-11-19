# GitHub 리포지토리 설정 및 배포 가이드

이 문서는 HWPX Table Analyst 프로젝트를 GitHub에 업로드하고 Vercel과 Railway에 배포하는 방법을 안내합니다.

## 1. GitHub 리포지토리 생성

1. [GitHub](https://github.com) 웹사이트에 로그인합니다.
2. 오른쪽 상단의 + 버튼을 클릭하고 "New repository"를 선택합니다.
3. 리포지토리 이름을 `hwpx-table-analyst`로 입력합니다.
4. 리포지토리 설명을 입력합니다: "한글 문서 파일(.hwpx)에서 테이블을 추출하고 분석하는 웹 애플리케이션"
5. 리포지토리를 Public 또는 Private으로 설정합니다.
6. 추가 옵션은 선택 사항입니다.
7. "Create repository" 버튼을 클릭합니다.

## 2. 로컬 코드를 GitHub에 푸시

리포지토리가 생성되면 다음 명령어를 사용하여 로컬 코드를 GitHub에 푸시합니다:

```bash
# 리모트 저장소 추가 (YOUR_USERNAME을 실제 GitHub 사용자 이름으로 변경)
git remote add origin https://github.com/YOUR_USERNAME/hwpx-table-analyst.git

# 메인 브랜치 푸시
git push -u origin main
```

## 3. Vercel에 프론트엔드 배포

1. [Vercel](https://vercel.com) 웹사이트에 로그인합니다 (GitHub 계정으로 로그인 가능).
2. "New Project" 버튼을 클릭합니다.
3. 방금 생성한 GitHub 리포지토리를 선택합니다.
4. 프로젝트 설정:
   - Framework Preset은 "Next.js"로 자동 설정됩니다.
   - Root Directory: 기본값 유지
   - 환경 변수 설정: `NEXT_PUBLIC_API_URL`에 Railway 백엔드 URL 입력 (배포 후)
5. "Deploy" 버튼을 클릭합니다.

## 4. Railway에 백엔드 배포

1. [Railway](https://railway.app) 웹사이트에 로그인합니다 (GitHub 계정으로 로그인 가능).
2. "New Project" 버튼을 클릭합니다.
3. "Deploy from GitHub repo" 옵션을 선택합니다.
4. 방금 생성한 GitHub 리포지토리를 선택합니다.
5. Root Directory를 `/api`로 설정합니다.
6. "Deploy" 버튼을 클릭합니다.
7. 배포가 완료되면 자동 생성된 URL을 확인합니다.
8. 이 URL을 Vercel 환경 변수 `NEXT_PUBLIC_API_URL`에 설정합니다.

## 5. 배포 확인

1. Vercel에서 제공하는 URL로 접속하여 애플리케이션이 정상적으로 동작하는지 확인합니다.
2. HWPX 파일을 업로드하여 테이블 추출 및 시각화 기능이 정상 작동하는지 테스트합니다.

## 참고사항

- 배포 중 문제가 발생하면 각 플랫폼의 로그를 확인하여 문제를 진단하세요.
- Vercel과 Railway의 무료 티어를 사용할 경우 일정 사용량 제한이 있을 수 있습니다.
- 보안을 위해 토큰과 API 키는 환경 변수에 저장하고 GitHub에 직접 커밋하지 마세요.

## 추가 참고사항

- Vercel이 아직도 이전 커밋(b98a7cc)을 사용하고 있습니다. 이는 푸시한 변경사항이 Vercel 배포에 적용되지 않고 있다는 의미입니다.
- 이 문제를 해결하기 위해 다음과 같은 조치를 취할 수 있습니다:
  - **배포 설정 확인:** Vercel 대시보드에서 프로젝트 설정을 확인하고 "Production Branch"가 `main`으로 설정되어 있는지 확인합니다.
  - **수동 배포 트리거:** Vercel 대시보드에서 "Redeploy" 또는 "Trigger Deployment" 옵션을 찾아 최신 커밋으로 수동 배포를 트리거합니다.
  - **다른 접근 방식으로 배포:** Next.js 프로젝트를 다음 방법으로 배포해 볼 수 있습니다:

```bash
npx vercel
```

이 명령어를 실행하면 현재 디렉토리의 프로젝트를 Vercel에 직접 배포합니다. 로그인 및 프로젝트 설정을 요구할 수 있습니다.

또는, 문제가 지속된다면 Vercel 프로젝트를 삭제하고 처음부터 다시 생성하는 것이 가장 빠른 해결책일 수 있습니다. Vercel에서 새 프로젝트를 생성할 때 GitHub 리포지토리를 연결하면 최신 커밋을 기반으로 배포가 시작됩니다. 