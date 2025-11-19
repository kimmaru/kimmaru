# 카카오 지도 API 설정 가이드

[카카오맵 웹 API 가이드](https://apis.map.kakao.com/web/guide/)에 따라 지도 기능을 구현했습니다.

**현재 설정된 API 키**: `a0db6498450e082812e7a3554bf14f3a`

## 🔑 API 키 발급 및 설정

### 1. 카카오 개발자 계정 생성 및 API 키 발급

1. **카카오 개발자사이트** (https://developers.kakao.com) 접속
2. **개발자 등록** 및 **앱 생성**
3. **웹 플랫폼 추가**: 
   - 앱 선택 → [플랫폼] → [Web 플랫폼 등록] → 사이트 도메인 등록
   - 개발: `http://localhost:3000`
   - 배포: `https://your-domain.com`
4. **사이트 도메인 등록**: [웹] 플랫폼을 선택하고, [사이트 도메인]을 등록
5. 페이지 상단의 **[JavaScript 키]**를 지도 API의 appkey로 사용

### 2. 환경변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음과 같이 설정:

```bash
# .env 파일
REACT_APP_KAKAO_MAP_API_KEY=your_javascript_key_here
```

**주의사항:**
- `.env` 파일은 git에 커밋하지 마세요 (이미 .gitignore에 포함됨)
- `REACT_APP_` 접두사는 React에서 환경변수를 사용하기 위해 필요합니다
- 실제 JavaScript 키로 `your_javascript_key_here`를 교체하세요

### 3. 배포 환경 설정

배포 플랫폼에서도 환경변수를 설정해야 합니다:

**Vercel:**
```bash
vercel env add REACT_APP_KAKAO_MAP_API_KEY
```

**Netlify:**
- Site settings → Environment variables → Add new variable

## 🗺️ 구현된 기능

### 이중 지도 시스템
- **JavaScript API (우선)**: 풀 기능 지도 (마커, 인포윈도우, 컨트롤)
- **roughmap (대안)**: JavaScript API 실패 시 자동 전환
- **자동 fallback**: 네트워크 문제 시 안정적인 지도 표시

### 지도 기본 기능
- **위치 표시**: 김포 구원의감격교회 위치
- **마커**: 교회 위치에 표시되는 마커 (JavaScript API 모드)
- **인포윈도우**: 마커 클릭 시 교회 정보 표시 (JavaScript API 모드)
- **지도 컨트롤**: 확대/축소, 지도타입 변경 (JavaScript API 모드)
- **roughmap**: 정적 지도 표시 (안정적인 대안)

### 카카오맵 연동 링크
가이드의 URL 패턴을 따라 구현:

1. **지도 보기**: `/link/map/이름,위도,경도`
2. **길찾기**: `/link/to/이름,위도,경도`  
3. **로드뷰**: `/link/roadview/위도,경도`

### 반응형 디자인
- **데스크톱**: 900px 최대 너비
- **태블릿**: 768px 이하에서 높이 조정
- **모바일**: 480px 이하에서 최적화

## 🛠️ 코드 구조

### 주요 컴포넌트
```typescript
// 지도 초기화
const initializeMap = () => {
  const container = mapRef.current;
  const options = {
    center: new window.kakao.maps.LatLng(lat, lng),
    level: 3
  };
  const map = new window.kakao.maps.Map(container, options);
}

// 마커 생성
const marker = new window.kakao.maps.Marker({
  position: markerPosition,
  title: '김포 구원의감격교회'
});

// 인포윈도우 생성
const infowindow = new window.kakao.maps.InfoWindow({
  content: iwContent,
  removable: true
});
```

### 에러 처리
- **API 로딩 실패**: 대체 링크 제공
- **지도 초기화 실패**: 사용자 친화적 오류 메시지
- **네트워크 오류**: 새로고침 옵션 제공

## 🔧 개발 모드에서 테스트

1. 환경변수 설정 후 개발 서버 재시작:
```bash
npm start
```

2. 브라우저에서 `http://localhost:3000/location` 접속

3. 지도가 정상적으로 로드되는지 확인

## 📱 모바일 최적화

- **터치 제스처**: 핀치 줌, 드래그 지원
- **반응형 레이아웃**: 화면 크기에 따른 지도 크기 조정
- **빠른 링크**: 카카오맵 앱으로 바로 이동

## 🚨 문제 해결

### 지도가 표시되지 않는 경우
1. API 키가 올바른지 확인
2. 도메인이 카카오 개발자 콘솔에 등록되었는지 확인
3. 브라우저 콘솔에서 오류 메시지 확인

### 성능 최적화
- API 스크립트는 필요할 때만 로드
- 지도 인스턴스는 컴포넌트 언마운트 시 정리
- 윈도우 리사이즈 이벤트 최적화

## 📚 참고 자료

- [카카오맵 웹 API 가이드](https://apis.map.kakao.com/web/guide/)
- [카카오맵 JavaScript API 문서](https://apis.map.kakao.com/web/documentation/)
- [카카오 개발자센터](https://developers.kakao.com/)
