# HWP API Server (for Railway)

이 서버는 hwp.js를 이용해 HWP 파일에서 표를 추출하는 API를 제공합니다.

## 배포 방법 (Railway)

1. 이 폴더를 GitHub에 푸시
2. Railway에서 New Project → GitHub에서 이 레포 선택
3. 별도 환경변수 필요 없음 (PORT 자동 인식)
4. 배포 후, `https://<your-railway-domain>/` 접속 시 "HWP API Server is running" 메시지 확인

## API 사용법

### 1. 서버 상태 확인
- GET /

### 2. HWP 파일 파싱
- POST /parse-hwp
- FormData로 `file` 필드에 HWP 파일 업로드

#### 예시 (curl)
```
curl -F "file=@/path/to/your/test.hwp" https://<your-railway-domain>/parse-hwp
```

## 의존성
- express
- cors
- multer
- hwp.js

---

프론트엔드에서 이 API로 파일 업로드 시 표 데이터(JSON) 반환
