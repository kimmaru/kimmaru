# 🗺️ 카카오맵 Web API 완벽 구현 가이드

본 가이드는 [카카오맵 Web API 공식 가이드](https://apis.map.kakao.com/web/guide/)를 기반으로 김포 구원의감격교회 웹사이트에 최적화된 지도 구현 방법을 제공합니다.

## 📋 목차

1. [준비하기](#1-준비하기)
2. [API 키 발급 및 설정](#2-api-키-발급-및-설정)
3. [기본 지도 구현](#3-기본-지도-구현)
4. [고급 기능 구현](#4-고급-기능-구현)
5. [라이브러리 활용](#5-라이브러리-활용)
6. [지도 URL 활용](#6-지도-url-활용)
7. [문제 해결](#7-문제-해결)

---

## 1. 준비하기

### 1.1 카카오 개발자 계정 필요사항
카카오맵 JavaScript API를 사용하기 위해서는 다음이 필요합니다:

- **카카오 계정** (개인/비즈니스)
- **카카오 개발자사이트 등록** ([https://developers.kakao.com](https://developers.kakao.com))
- **앱 생성 및 플랫폼 등록**
- **JavaScript 키 발급**

### 1.2 현재 프로젝트 설정 상태

✅ **완료된 설정**:
- JavaScript 키: `a0db6498450e082812e7a3554bf14f3a`
- 웹 플랫폼 등록: `https://gimpo-salvation-wonder-church.vercel.app`
- 로컬 개발 도메인: `http://localhost:3000`

---

## 2. API 키 발급 및 설정

### 2.1 카카오 개발자사이트 설정

#### 단계별 설정 방법:

1. **카카오 개발자사이트 접속**
   ```
   https://developers.kakao.com
   ```

2. **개발자 등록 및 앱 생성**
   - 내 애플리케이션 > 애플리케이션 추가하기
   - 앱 이름: "김포 구원의감격교회"
   - 회사명: 선택사항

3. **웹 플랫폼 추가**
   ```
   앱 선택 → [플랫폼] → [Web 플랫폼 등록]
   ```

4. **사이트 도메인 등록**
   ```
   배포 도메인: https://gimpo-salvation-wonder-church.vercel.app
   개발 도메인: http://localhost:3000
   ```

5. **JavaScript 키 확인**
   ```
   앱 설정 → 앱 키 → JavaScript 키 복사
   ```

### 2.2 환경 변수 설정

#### `.env` 파일 설정:
```env
# 카카오맵 API 키
REACT_APP_KAKAO_MAP_API_KEY=a0db6498450e082812e7a3554bf14f3a

# YouTube API 키 (기존)
REACT_APP_YOUTUBE_API_KEY=your_youtube_api_key
```

#### Vercel 환경 변수 설정:
```bash
# Vercel CLI 사용
vercel env add REACT_APP_KAKAO_MAP_API_KEY

# 또는 Vercel 대시보드에서 직접 설정
# Project Settings → Environment Variables
```

---

## 3. 기본 지도 구현

### 3.1 HTML 구조

[카카오맵 가이드](https://apis.map.kakao.com/web/guide/)에 따르면, 지도를 표시하기 위한 기본 HTML 구조는 다음과 같습니다:

```html
<!-- 지도를 담을 영역 만들기 -->
<div id="map" style="width:500px;height:400px;"></div>

<!-- 카카오맵 JavaScript API 불러오기 -->
<script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=발급받은 APP KEY"></script>
```

### 3.2 React/TypeScript 구현

#### 컴포넌트 구조:
```typescript
import React, { useEffect, useRef } from 'react';

// Kakao Maps API 타입 선언
declare global {
  interface Window {
    kakao: any;
  }
}

const LocationMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // API 로딩 및 지도 초기화
    loadKakaoMapAPI();
  }, []);

  return (
    <div 
      ref={mapRef}
      style={{ width: '100%', height: '500px' }}
    />
  );
};
```

### 3.3 API 로딩 및 초기화

#### 안전한 API 로딩:
```typescript
const loadKakaoMapAPI = () => {
  const API_KEY = process.env.REACT_APP_KAKAO_MAP_API_KEY || 'a0db6498450e082812e7a3554bf14f3a';
  
  // 기존 스크립트 제거
  const existingScript = document.querySelector('script[src*="dapi.kakao.com"]');
  if (existingScript) {
    existingScript.remove();
  }
  
  // 새 스크립트 생성
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${API_KEY}&libraries=services`;
  script.async = true;
  
  script.onload = () => {
    // API 준비 상태 확인
    waitForAPI();
  };
  
  script.onerror = (error) => {
    console.error('카카오맵 API 로딩 실패:', error);
    // fallback 처리
  };
  
  document.head.appendChild(script);
};
```

#### API 준비 상태 확인:
```typescript
const waitForAPI = () => {
  let retryCount = 0;
  const maxRetries = 50; // 10초 제한
  
  const checkAPI = () => {
    retryCount++;
    
    if (window.kakao && window.kakao.maps && window.kakao.maps.LatLng) {
      console.log('✅ 카카오맵 API 준비 완료');
      initializeMap();
    } else if (retryCount >= maxRetries) {
      console.error('❌ API 초기화 시간 초과');
      loadStaticMapFallback();
    } else {
      console.log(`⏳ API 로딩 중... ${retryCount}/${maxRetries}`);
      setTimeout(checkAPI, 200);
    }
  };
  
  checkAPI();
};
```

### 3.4 지도 생성 및 마커 표시

#### 기본 지도 생성:
```typescript
const initializeMap = () => {
  if (!mapRef.current) return;
  
  // 교회 위치 좌표
  const churchPosition = {
    lat: 37.6158,
    lng: 126.7152
  };
  
  // 지도 옵션 설정
  const options = {
    center: new window.kakao.maps.LatLng(churchPosition.lat, churchPosition.lng),
    level: 3 // 확대/축소 레벨
  };
  
  // 지도 생성
  const map = new window.kakao.maps.Map(mapRef.current, options);
  
  // 마커 생성 및 표시
  const markerPosition = new window.kakao.maps.LatLng(churchPosition.lat, churchPosition.lng);
  const marker = new window.kakao.maps.Marker({
    position: markerPosition,
    title: '홍익돈까스 김포운양점 2층'
  });
  
  marker.setMap(map);
  
  // 인포윈도우 추가
  const infoWindow = new window.kakao.maps.InfoWindow({
    content: `
      <div style="padding:15px 20px; text-align:center;">
        <strong>홍익돈까스 김포운양점 2층</strong><br>
        <span>경기 김포시 김포한강11로255번길 97 2층</span>
      </div>
    `
  });
  
  // 마커 클릭 시 인포윈도우 표시
  window.kakao.maps.event.addListener(marker, 'click', () => {
    infoWindow.open(map, marker);
  });
};
```

---

## 4. 고급 기능 구현

### 4.1 지도 컨트롤 추가

#### 확대/축소 컨트롤:
```typescript
// 확대/축소 컨트롤 추가
const zoomControl = new window.kakao.maps.ZoomControl();
map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

// 지도 타입 컨트롤 추가
const mapTypeControl = new window.kakao.maps.MapTypeControl();
map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT);
```

### 4.2 사용자 정의 컨트롤

#### 커스텀 버튼 컨트롤:
```typescript
const CustomControl = () => {
  return (
    <div style={{
      position: 'absolute',
      top: '15px',
      right: '15px',
      zIndex: 1000
    }}>
      <button onClick={openKakaoMap}>🗺️ 큰 지도</button>
      <button onClick={openDirections}>🧭 길찾기</button>
      <button onClick={openRoadView}>📷 로드뷰</button>
    </div>
  );
};
```

---

## 5. 라이브러리 활용

### 5.1 Services 라이브러리

[카카오맵 가이드](https://apis.map.kakao.com/web/guide/)에서 제공하는 Services 라이브러리를 활용한 주소 검색:

#### 라이브러리 로딩:
```html
<script src="//dapi.kakao.com/v2/maps/sdk.js?appkey=API_KEY&libraries=services"></script>
```

#### 주소로 좌표 검색:
```typescript
const searchAddressToCoordinate = (address: string) => {
  const geocoder = new window.kakao.maps.services.Geocoder();
  
  geocoder.addressSearch(address, (result: any, status: any) => {
    if (status === window.kakao.maps.services.Status.OK) {
      const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
      
      // 지도 중심을 결과값으로 이동
      map.setCenter(coords);
      
      // 마커 표시
      const marker = new window.kakao.maps.Marker({
        map: map,
        position: coords
      });
    }
  });
};
```

### 5.2 Clusterer 라이브러리

#### 마커 클러스터링:
```typescript
// 클러스터러 생성
const clusterer = new window.kakao.maps.MarkerClusterer({
  map: map,
  averageCenter: true,
  minLevel: 10
});

// 마커 배열을 클러스터러에 추가
clusterer.addMarkers(markers);
```

---

## 6. 지도 URL 활용

### 6.1 카카오맵 바로가기 URL

[카카오맵 가이드](https://apis.map.kakao.com/web/guide/)에서 제공하는 URL 패턴을 활용:

#### 지도 바로가기:
```typescript
const openKakaoMap = () => {
  const url = `https://map.kakao.com/link/map/${churchFullName},${churchPosition.lat},${churchPosition.lng}`;
  window.open(url, '_blank');
};
```

#### 길찾기 바로가기:
```typescript
const openDirections = () => {
  const url = `https://map.kakao.com/link/to/${churchFullName},${churchPosition.lat},${churchPosition.lng}`;
  window.open(url, '_blank');
};
```

#### 로드뷰 바로가기:
```typescript
const openRoadView = () => {
  const url = `https://map.kakao.com/link/roadview/${churchPosition.lat},${churchPosition.lng}`;
  window.open(url, '_blank');
};
```

### 6.2 이동수단별 길찾기

#### 다양한 이동수단 지원:
```typescript
const openDirectionsByTransport = (transport: 'car' | 'traffic' | 'walk' | 'bicycle') => {
  const url = `https://map.kakao.com/link/by/${transport}/${churchFullName},${churchPosition.lat},${churchPosition.lng}`;
  window.open(url, '_blank');
};

// 사용 예시
openDirectionsByTransport('car');      // 자동차
openDirectionsByTransport('traffic');  // 대중교통
openDirectionsByTransport('walk');     // 도보
openDirectionsByTransport('bicycle');  // 자전거
```

---

## 7. 문제 해결

### 7.1 일반적인 문제와 해결방법

#### 문제 1: API 로딩 실패
```typescript
// 원인: 네트워크 문제, 잘못된 API 키, CORS 정책
// 해결: Fallback 시스템 구현
script.onerror = (error) => {
  console.error('카카오맵 API 로딩 실패:', error);
  loadStaticMapFallback(); // 정적 지도로 전환
};
```

#### 문제 2: `window.kakao.maps.LatLng is not a constructor`
```typescript
// 원인: API가 완전히 로드되지 않음
// 해결: API 준비 상태 확인 시스템
const waitForAPI = () => {
  if (window.kakao && window.kakao.maps && window.kakao.maps.LatLng) {
    initializeMap();
  } else {
    setTimeout(waitForAPI, 100);
  }
};
```

#### 문제 3: CORS 정책 위반
```typescript
// 원인: HTTP/HTTPS 프로토콜 불일치
// 해결: HTTPS 프로토콜 강제 사용
const script = document.createElement('script');
script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${API_KEY}`;
```

### 7.2 Fallback 시스템

#### 정적 지도 이미지 사용:
```typescript
const loadStaticMapFallback = () => {
  if (!mapRef.current) return;
  
  // 정적 지도 이미지 URL
  const staticMapUrl = `https://map2.daum.net/map2service?level=3&centerX=${churchPosition.lng}&centerY=${churchPosition.lat}&w=600&h=400`;
  
  // 이미지 엘리먼트 생성
  const img = document.createElement('img');
  img.src = staticMapUrl;
  img.alt = '홍익돈까스 김포운양점 2층 지도';
  img.style.cssText = `
    width: 100%;
    height: auto;
    border-radius: 10px;
  `;
  
  mapRef.current.appendChild(img);
};
```

### 7.3 디버깅 도구

#### 상세한 로깅 시스템:
```typescript
const debugAPI = () => {
  console.log('🔍 API 상태 체크:');
  console.log('  window.kakao:', !!window.kakao);
  console.log('  window.kakao.maps:', !!(window.kakao && window.kakao.maps));
  console.log('  window.kakao.maps.LatLng:', !!(window.kakao && window.kakao.maps && window.kakao.maps.LatLng));
  console.log('  window.kakao.maps.Map:', !!(window.kakao && window.kakao.maps && window.kakao.maps.Map));
  console.log('  window.kakao.maps.Marker:', !!(window.kakao && window.kakao.maps && window.kakao.maps.Marker));
};
```

---

## 8. 최적화 및 성능

### 8.1 로딩 성능 최적화

#### 지연 로딩:
```typescript
// 사용자가 지도 섹션에 도달했을 때만 로드
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      loadKakaoMapAPI();
      observer.disconnect();
    }
  });
});

if (mapRef.current) {
  observer.observe(mapRef.current);
}
```

### 8.2 메모리 관리

#### 클린업 함수:
```typescript
useEffect(() => {
  loadKakaoMapAPI();
  
  return () => {
    // 지도 객체 정리
    if (mapRef.current) {
      mapRef.current.innerHTML = '';
    }
    
    // 스크립트 정리
    const script = document.querySelector('script[src*="dapi.kakao.com"]');
    if (script) {
      script.remove();
    }
  };
}, []);
```

---

## 9. 보안 고려사항

### 9.1 API 키 보안

#### 환경 변수 사용:
```typescript
// ❌ 하드코딩 (보안 위험)
const API_KEY = 'a0db6498450e082812e7a3554bf14f3a';

// ✅ 환경 변수 사용 (권장)
const API_KEY = process.env.REACT_APP_KAKAO_MAP_API_KEY;
```

#### Fallback 키 시스템:
```typescript
const API_KEY = process.env.REACT_APP_KAKAO_MAP_API_KEY || 'fallback_key';
```

### 9.2 도메인 제한

#### 카카오 개발자사이트에서 허용 도메인 설정:
```
✅ 등록된 도메인:
- https://gimpo-salvation-wonder-church.vercel.app
- http://localhost:3000

❌ 미등록 도메인에서는 API 호출 차단
```

---

## 10. 배포 및 운영

### 10.1 Vercel 배포 설정

#### 환경 변수 설정:
```bash
# Vercel CLI
vercel env add REACT_APP_KAKAO_MAP_API_KEY production
vercel env add REACT_APP_KAKAO_MAP_API_KEY preview
vercel env add REACT_APP_KAKAO_MAP_API_KEY development
```

### 10.2 도메인 등록 확인

#### 카카오 개발자사이트에서 확인:
1. 내 애플리케이션 선택
2. 플랫폼 > Web 플랫폼
3. 사이트 도메인 확인
4. 배포 도메인 추가 등록

---

## 📚 참고 자료

- [카카오맵 Web API 가이드](https://apis.map.kakao.com/web/guide/) - 공식 가이드
- [카카오맵 Web API 문서](https://apis.map.kakao.com/web/documentation/) - API 레퍼런스
- [카카오맵 Web API 샘플](https://apis.map.kakao.com/web/sample/) - 예제 코드
- [카카오 개발자 포럼](https://devtalk.kakao.com/) - 개발자 커뮤니티

---

## 🎯 현재 프로젝트 적용 상태

### ✅ 구현 완료
- [x] API 키 발급 및 설정
- [x] 기본 지도 표시
- [x] 마커 및 인포윈도우
- [x] 지도 URL 바로가기
- [x] Fallback 시스템
- [x] 상세 디버깅 시스템
- [x] 반응형 디자인
- [x] 보안 설정

### 🔄 개선 가능한 영역
- [ ] Services 라이브러리 활용 (주소 검색)
- [ ] Clusterer 라이브러리 (다중 마커)
- [ ] 지연 로딩 최적화
- [ ] 사용자 위치 기반 기능

이 가이드를 참조하여 카카오맵 Web API를 안전하고 효율적으로 구현할 수 있습니다. 추가 질문이나 문제가 있으면 [카카오 개발자 포럼](https://devtalk.kakao.com/)을 활용하세요.
