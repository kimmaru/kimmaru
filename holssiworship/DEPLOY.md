# 홀씨 Worship 자동 배포 가이드

## 배포 전 준비사항

1. GitHub 및 Vercel 계정이 필요합니다.
2. 저장소에 Vercel 배포가 설정되어 있어야 합니다.

## GitHub Actions 설정

저장소에 GitHub Actions가 설정되어 있습니다. 다음 비밀 값을 GitHub 저장소 설정에 추가해야 합니다:

1. GitHub 저장소의 "Settings" > "Secrets" > "Actions"에서 다음 비밀값을 설정합니다:
   - `VERCEL_TOKEN`: Vercel에서 생성한 토큰
   - `VERCEL_ORG_ID`: Vercel 조직 ID
   - `VERCEL_PROJECT_ID`: Vercel 프로젝트 ID

## Vercel 토큰 및 ID 얻는 방법

1. **Vercel 토큰 얻기**:
   - Vercel 계정 설정 > Tokens에서 새 토큰 생성

2. **Vercel 조직 ID 및 프로젝트 ID 얻기**:
   - Vercel CLI를 설치: `npm i -g vercel`
   - `vercel link`를 실행하고 프로젝트 연결
   - `.vercel/project.json` 파일에서 ID 확인

## 자동 배포 실행 방법

프로젝트에 변경 사항을 적용한 후 다음 명령어를 실행하면 자동으로 GitHub에 푸시하고 Vercel에 배포됩니다:

```bash
npm run deploy
```

이 명령어를 실행하면 다음이 자동으로 수행됩니다:
1. 모든 변경 사항을 Git에 추가
2. 타임스탬프를 포함한 커밋 메시지 생성
3. 변경 사항을 GitHub의 main 브랜치에 푸시
4. GitHub Actions에 의해 Vercel 배포 자동 시작

## 수동 배포 방법

자동 배포가 실패할 경우, 다음 단계로 수동 배포를 진행할 수 있습니다:

1. 변경 사항을 수동으로 커밋 및 푸시:
```bash
git add .
git commit -m "수동 업데이트"
git push origin main
```

2. Vercel 대시보드에서 수동 배포:
   - Vercel 프로젝트 페이지 방문
   - "Deployments" 탭으로 이동
   - "Deploy" 버튼 클릭 