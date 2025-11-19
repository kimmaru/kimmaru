# HWPX Table Analyst

HWPX Table Analyst는 한글 문서 파일(.hwpx)에서 테이블을 추출하고 분석할 수 있는 웹 애플리케이션입니다.

## 주요 기능

- HWPX 파일 업로드 및 테이블 추출
- 추출된 테이블 목록 표시
- 테이블 데이터 시각화 (막대 차트, 선 차트, 파이 차트, 영역 차트, 산점도)
- 테이블 데이터 분석

## 기술 스택

- **프론트엔드**: Next.js, TypeScript, TailwindCSS, Recharts
- **백엔드**: FastAPI, Python
- **데이터 처리**: BeautifulSoup4, Pandas
- **배포**: Vercel (프론트엔드), Railway (백엔드)

## 사용 방법

1. 메인 페이지에서 HWPX 파일을 업로드합니다.
2. 파일이 처리되면 추출된 테이블 목록이 왼쪽에 표시됩니다.
3. 테이블을 선택하면 오른쪽 상단에 테이블 데이터가 표시됩니다.
4. 오른쪽 하단에서 다양한 차트 유형과 옵션을 선택하여 데이터를 시각화할 수 있습니다.

## 로컬 개발 환경 설정

### 필수 요구사항

- Node.js (v18 이상)
- Python (v3.8 이상)

### 설치 및 실행

1. 저장소 클론

```bash
git clone https://github.com/yourusername/hwpx-table-analyst.git
cd hwpx-table-analyst
```

2. 프론트엔드 설치 및 실행

```bash
npm install
npm run dev
```

3. 백엔드 설치 및 실행

```bash
cd api
pip install -r requirements.txt
uvicorn main:app --reload
```

4. 웹 브라우저에서 http://localhost:3000 접속

## 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하여 다음 환경 변수를 설정할 수 있습니다:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## API 엔드포인트

- `GET /`: API 상태 확인
- `POST /extract-tables/`: HWPX 파일 업로드 및 테이블 추출 (옵션: `required_columns` 쿼리 파라미터로 필요한 열 수 지정 가능)

## 배포 정보

이 애플리케이션은 Vercel(프론트엔드)과 Railway(백엔드)를 통해 배포할 수 있습니다.

### 배포 전 준비사항

1. 배포를 위해서는 다음이 필요합니다:
   - GitHub 계정
   - Vercel 계정
   - Railway 계정

2. 환경 변수 설정:
   - Vercel: `NEXT_PUBLIC_API_URL` (백엔드 API URL)
   - Railway: 특별한 환경 변수 필요 없음

## 보안 고려사항

- 업로드된 파일은 임시 디렉토리에 저장되며 처리 후 자동으로 삭제됩니다.
- 민감한 정보가 포함된, 문서를 업로드하지 않도록 주의하세요.
- 환경 변수와 토큰은 `.env` 파일에 보관하고 절대 GitHub에 커밋하지 마세요.

## GitHub 업로드 및 배포 방법

자세한 GitHub 업로드 및 배포 방법은 [GITHUB_SETUP.md](./GITHUB_SETUP.md) 문서를 참조하세요.

## 라이선스

MIT
