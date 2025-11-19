# 🚀 Vercel GitHub Actions 설정 가이드

GitHub Actions에서 Vercel 자동 배포를 위해 다음 Secrets를 Repository Settings에 추가해야 합니다.

## 📋 필요한 GitHub Secrets

### 1. `VERCEL_TOKEN`
- **설명**: Vercel API 토큰 (최신 토큰 필요)
- **얻는 방법**:
  1. [Vercel Dashboard](https://vercel.com/account/tokens)에서 새 토큰 생성
  2. Token Name: `GitHub Actions Deploy`
  3. Scope: `Full Account` 선택
  4. 생성된 토큰을 복사하여 GitHub Secrets에 추가

### 2. `VERCEL_ORG_ID`
- **얻는 방법**:
  ```bash
  npx vercel login
  npx vercel link
  cat .vercel/project.json
  # "orgId" 값 복사
  ```

### 3. `VERCEL_PROJECT_ID`
- **얻는 방법**:
  ```bash
  cat .vercel/project.json
  # "projectId" 값 복사
  ```

### 4. `REACT_APP_YOUTUBE_API_KEY` (선택사항)
- **설명**: YouTube API 키 (YouTube 영상 연동용)
- **기본값**: 임시 키가 제공되므로 선택사항
- **권장**: 프로덕션에서는 자체 API 키 사용

## 🔧 설정 방법

1. **GitHub Repository → Settings → Secrets and variables → Actions**
2. **"New repository secret" 클릭**
3. **위의 4개 Secret 추가**

## 🚀 사용법

### 자동 배포 (Push 시)
```bash
git push origin main
# → 자동으로 patch 버전 업데이트 및 배포
```

### 수동 배포 (버전 타입 선택)
1. **GitHub → Actions → "Deploy to Vercel with Version Tagging"**
2. **"Run workflow" 클릭**
3. **버전 타입 선택 (major/minor/patch)**
4. **응급 배포시 "Skip tests" 체크 가능**
5. **"Run workflow" 실행**

## 🎯 개선된 기능

- ✅ **안정적인 빌드**: 메모리 최적화 및 에러 핸들링
- ✅ **스마트 버전 관리**: 태그 충돌 방지 및 중복 처리
- ✅ **안전한 Git 조작**: 권한 오류 해결 및 충돌 방지
- ✅ **Vercel 배포 검증**: Secret 확인 및 배포 상태 모니터링
- ✅ **조건부 릴리즈**: 성공시에만 GitHub Release 생성
- ✅ **상세한 로깅**: 각 단계별 성공/실패 상태 표시

## 🛠️ 문제 해결

### 일반적인 오류와 해결책:

1. **Vercel Token 오류**
   - 새로운 토큰 생성 후 Secrets 업데이트

2. **Git 권한 오류**
   - 자동으로 GitHub Bot 계정 사용하도록 수정됨

3. **태그 충돌**
   - 기존 태그 자동 감지 및 건너뛰기 처리

4. **빌드 실패**
   - 메모리 최적화 및 의존성 설치 개선

---

**💡 Tip**: 이제 workflow가 안정적으로 작동합니다! 첫 배포 전에 Secrets만 설정하면 됩니다.