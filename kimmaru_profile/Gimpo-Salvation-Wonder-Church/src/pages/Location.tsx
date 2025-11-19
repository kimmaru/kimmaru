import React, { useEffect } from 'react';
import styled from 'styled-components';
// Title, Subtitle 제거 - 헤더 없는 즉시 표시형 페이지로 최적화

// Kakao Maps API 타입 선언
declare global {
  interface Window {
    kakao: any;
    daum: any;
  }
}

const LocationContainer = styled.div`
  min-height: 100vh;
  background: var(--color-bg);
  padding: 80px 2rem 2rem 2rem;
`;

const MainLayout = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 3rem;
  max-width: 1600px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const MapWrapper = styled.div`
  width: 100%;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const KakaoMapContainer = styled.div`
  width: 100%;
  height: 490px;
  border-radius: 15px;
  position: relative;
  background: var(--color-surface);
  overflow: hidden;
  
  #daumRoughmapContainer1754894877981,
  #daumRoughmapContainer1755565033042 {
    width: 100% !important;
    height: 100% !important;
    min-height: 400px !important;
    border-radius: 20px;
    position: relative;
    z-index: 1;
  }
  
  .root_daum_roughmap {
    border-radius: 20px !important;
    overflow: hidden;
    width: 100% !important;
    height: 100% !important;
  }
  
  .root_daum_roughmap_landing {
    border-radius: 20px !important;
  }
  
  /* 정적 이미지 컨테이너 최적화 */
  > div {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    box-sizing: border-box;
  }
  
  /* 기본 패딩으로 컨텐츠 영역 확보 */
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 768px) {
    height: 400px;
    
    #daumRoughmapContainer1754894877981,
    #daumRoughmapContainer1755565033042 {
      height: 400px !important;
      min-height: 350px !important;
    }
  }
  
  @media (max-width: 480px) {
    height: 350px;
    
    #daumRoughmapContainer1754894877981,
    #daumRoughmapContainer1755565033042 {
      height: 350px !important;
      min-height: 300px !important;
    }
  }
`;



const AddressInfo = styled.div`
  padding: 1.5rem;
  background: var(--color-surface);
  border-radius: 12px;
  border: 1px solid var(--border-color);
`;

const InfoTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 1rem;
  border-bottom: 2px solid var(--color-primary);
  padding-bottom: 0.5rem;
`;

const InfoContent = styled.div`
  color: var(--color-text);
  line-height: 1.6;
  
  .address-main {
    font-family: var(--font-primary);
    font-size: clamp(1.4rem, 3.5vw, 1.8rem);
    font-weight: 500;
    color: var(--color-primary);
    margin-bottom: 1rem;
  }
  
  .address-sub {
    font-size: clamp(1rem, 2.5vw, 1.1rem);
    color: var(--color-secondary);
    margin-bottom: 2rem;
  }
  
  .copy-button {
    background: var(--color-accent);
    color: var(--color-white);
    border: none;
    padding: 0.75rem 2rem;
    border-radius: 25px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      background: var(--color-accent-light);
      transform: translateY(-2px);
      box-shadow: var(--shadow-medium);
    }
  }
  
  .quick-links {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
    flex-wrap: wrap;
    
    @media (max-width: 480px) {
      flex-direction: column;
      gap: 0.8rem;
    }
  }
  
  .quick-link {
    background: transparent;
    color: var(--color-accent);
    border: 2px solid var(--color-accent);
    padding: 0.6rem 1.5rem;
    border-radius: 20px;
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 600;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    
    &:hover {
      background: var(--color-accent);
      color: var(--color-white);
      transform: translateY(-2px);
    }
    
    @media (max-width: 480px) {
      justify-content: center;
    }
  }
`;

const TransportInfo = styled.div`
  background: var(--color-surface);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
`;

const TransportList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TransportItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem;
  background: var(--color-bg);
  border-radius: 8px;
  border-left: 3px solid var(--color-primary);
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-strong);
  }
  
  .icon {
    width: 60px;
    height: 60px;
    background: var(--color-accent);
    border-radius: 50%;
    margin: 0 auto 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: var(--color-white);
  }
  
  h3 {
    font-family: var(--font-primary);
    font-size: clamp(1.2rem, 3vw, 1.5rem);
    font-weight: 500;
    margin-bottom: 1.5rem;
    color: var(--color-primary);
    text-align: center;
  }
  
  .transport-info {
    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 0;
      border-bottom: 1px solid var(--border-color);
      
      &:last-child {
        border-bottom: none;
      }
      
      .label {
        font-weight: 500;
        color: var(--color-primary);
      }
      
      .value {
        color: var(--color-secondary);
        text-align: right;
        font-size: 0.95rem;
      }
    }
  }
`;

const ContactInfo = styled.div`
  background: var(--color-surface);
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  font-size: 0.9rem;
`;

const ContactList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ContactItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border-color);
  
  &:last-child {
    border-bottom: none;
  }
`;

const ContactLabel = styled.span`
  color: var(--color-text-secondary);
  font-weight: 500;
`;

const ContactValue = styled.span`
  color: var(--color-text);
  font-weight: 400;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-strong);
  }
  
  .icon {
    width: 50px;
    height: 50px;
    background: var(--color-accent);
    color: var(--color-white);
    border-radius: 50%;
    margin: 0 auto 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
  }
  
  h4 {
    font-family: var(--font-primary);
    font-size: clamp(1rem, 2.5vw, 1.2rem);
    margin-bottom: 0.5rem;
    color: var(--color-primary);
  }
  
  p {
    color: var(--color-secondary);
    font-size: 0.95rem;
  }
`;

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    alert('주소가 클립보드에 복사되었습니다!');
  });
};

const Location: React.FC = () => {
  const [mapStatus, setMapStatus] = React.useState<'loading' | 'success' | 'error'>('loading');

  const mapRef = React.useRef<HTMLDivElement>(null);
  const kakaoMapRef = React.useRef<any>(null);

  // 지도 로딩 상태 초기화
  useEffect(() => {
    setMapStatus('loading');
  }, []);
  
  // 홍익돈까스 김포운양점 2층 정확한 좌표 (kko.kakao.com/pRfyVSvD-G 기준)
  const churchPosition = {
    lat: 37.6158847,
    lng: 126.7151906
  };

  // 교회 정확한 주소 정보 (카카오맵 링크 기반)
  const churchAddress = "경기 김포시 김포한강11로255번길 97 2층";
  const churchFullName = "홍익돈까스 김포운양점 2층";

  useEffect(() => {
    console.log('🗺️ 카카오맵 JavaScript API 방식으로 초기화 시작');
    
    // 기존 스크립트 정리
    const existingScript = document.querySelector('script[src*="dapi.kakao.com"]');
    if (existingScript) {
      existingScript.remove();
      console.log('기존 카카오맵 스크립트 제거');
    }

    const loadKakaoMapAPI = () => {
      // 하드코딩된 API 키 사용 (환경변수 의존성 제거)
      const API_KEY = 'a0db6498450e082812e7a3554bf14f3a';
      
      console.log('🔑 카카오맵 API 키 사용:', API_KEY);
      console.log('🌐 현재 도메인:', window.location.origin);
      console.log('🌐 카카오맵 JavaScript API 로딩 시작...');
      console.log('📍 교회 위치 정보:', churchPosition);
      console.log('🏢 교회 이름:', churchFullName);
      console.log('📮 교회 주소:', churchAddress);
      
      // 도메인 검증 로그
      const allowedDomains = [
        'https://gimpo-salvation-wonder-church.vercel.app',
        'http://localhost:3000',
        'https://localhost:3000'
      ];
      const currentDomain = window.location.origin;
      const isDomainAllowed = allowedDomains.includes(currentDomain);
      console.log('🔍 도메인 검증:', isDomainAllowed ? '✅ 허용됨' : '❌ 미등록', currentDomain);
      
      if (!isDomainAllowed) {
        console.warn('⚠️ 현재 도메인이 카카오 개발자사이트에 등록되지 않았을 수 있습니다.');
        console.warn('📋 카카오 개발자사이트에서 다음 도메인을 등록해주세요:', currentDomain);
      }
      
      // 기존 스크립트가 있다면 제거
      const existingScript = document.querySelector('script[src*="dapi.kakao.com"]');
      if (existingScript) {
        existingScript.remove();
        console.log('🧹 기존 카카오맵 스크립트 제거');
      }
      
      // 카카오맵 JavaScript API 로드
      // document.write 문제 우회를 위한 설정
      const originalWrite = document.write;
      document.write = function() {
        console.warn('🚫 document.write 호출이 차단되었습니다 (React 환경 보호)');
      };
      
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${API_KEY}&libraries=services`;
      script.async = true;
      script.defer = true;
      // CORS 문제 해결을 위해 crossOrigin 제거

      script.onload = () => {
        // document.write 복구
        document.write = originalWrite;
        console.log('✅ 카카오맵 JavaScript API 로드 완료');
        console.log('🔍 window.kakao 확인:', !!window.kakao);
        console.log('🔍 window.kakao.maps 확인:', !!(window.kakao && window.kakao.maps));
        
        // API가 완전히 준비될 때까지 대기 (최대 3초, 200ms 간격)
        let retryCount = 0;
        const maxRetries = 15; // 3초 (15 * 200ms)
        
        const waitForAPI = () => {
          retryCount++;
          
          // 상세한 API 상태 디버깅
          console.log(`📊 API 상태 체크 ${retryCount}/${maxRetries}:`);
          console.log('  🔍 window.kakao:', !!window.kakao);
          console.log('  🔍 window.kakao.maps:', !!(window.kakao && window.kakao.maps));
          console.log('  🔍 window.kakao.maps.LatLng:', !!(window.kakao && window.kakao.maps && window.kakao.maps.LatLng));
          console.log('  🔍 window.kakao.maps.Map:', !!(window.kakao && window.kakao.maps && window.kakao.maps.Map));
          console.log('  🔍 window.kakao.maps.Marker:', !!(window.kakao && window.kakao.maps && window.kakao.maps.Marker));
          
          if (window.kakao && window.kakao.maps && window.kakao.maps.LatLng) {
            console.log('✅ 모든 API 컴포넌트가 준비되었습니다!');
            console.log('🎯 지도 초기화를 시작합니다...');
            initializeMap();
          } else if (retryCount >= maxRetries) {
            console.error('❌ API 초기화 시간 초과 (3초)');
            console.error('🔍 document.write 오류로 인한 React 환경 호환성 문제');
            console.log('🔄 정적 지도 이미지로 안전하게 전환합니다...');
            loadRoughMap();
          } else {
            console.log(`⏳ API 로딩 중... ${retryCount}/${maxRetries} (200ms 후 재시도)`);
            setTimeout(waitForAPI, 200);
          }
        };
        
        // API 준비 상태 확인 시작
        waitForAPI();
      };

      script.onerror = (error) => {
        // document.write 복구
        document.write = originalWrite;
        console.error('❌ 카카오맵 JavaScript API 로딩 실패:', error);
        console.error('🔍 가능한 원인:');
        console.error('  1. 네트워크 연결 문제');
        console.error('  2. API 키가 유효하지 않음:', API_KEY);
        console.error('  3. 현재 도메인이 카카오 개발자사이트에 미등록:', window.location.origin);
        console.error('  4. 카카오맵 서비스가 활성화되지 않음');
        console.error('📋 해결 방법:');
        console.error('  - https://developers.kakao.com 에서 Web 플랫폼에 현재 도메인 등록');
        console.error('  - 제품 설정에서 카카오맵 Web 서비스 활성화 확인');
        console.log('🔄 정적 지도 이미지로 안전하게 전환합니다...');
        loadRoughMap();
      };

      document.head.appendChild(script);
    };

    const loadRoughMap = () => {
      console.log('🗺️ roughmap 방식으로 지도 로드 시작');
      
      // 기존 지도 컨테이너 초기화
      if (mapRef.current) {
        mapRef.current.innerHTML = '';
      }

      // 제공된 지도 소스를 기반으로 정확한 지도 구현
      const staticMapContainer = document.createElement('div');
      staticMapContainer.style.cssText = `
        width: 100%;
        height: 100%;
        border-radius: 20px;
        background: #fff;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        gap: 0.5rem;
        padding: 1rem;
        text-align: center;
        overflow: hidden;
        box-sizing: border-box;
      `;

      // 지도 이미지 컨테이너
      const imageContainer = document.createElement('div');
      imageContainer.style.cssText = `
        width: 100%;
        max-width: 640px;
        height: auto;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 10px;
        overflow: hidden;
        background: #f9f9f9;
        border: 1px solid rgba(0, 0, 0, 0.1);
        margin-bottom: 1rem;
        flex-shrink: 0;
      `;

      // 제공된 지도 소스의 정적 이미지 사용
      const staticMapImage = document.createElement('img');
      staticMapImage.src = 'https://t1.daumcdn.net/roughmap/imgmap/ea7d84ea6634a1488db9c8552c7b9ff065aef481945c8c518b281bbcb21e18aa';
      staticMapImage.alt = '홍익돈까스 김포운양점 2층 지도';
      staticMapImage.style.cssText = `
        width: 100%;
        max-width: 638px;
        height: auto;
        display: block;
        border: none;
        border-radius: 0;
      `;

      // 이미지 로드 완료 시 최적화
      staticMapImage.onload = () => {
        console.log('✅ 정적 지도 이미지 로드 완료:', staticMapImage.naturalWidth + 'x' + staticMapImage.naturalHeight);
      };

      // 이미지 로드 실패 시 대체 처리
      staticMapImage.onerror = () => {
        console.error('❌ 정적 지도 이미지 로드 실패');
        staticMapImage.style.display = 'none';
        const errorMsg = document.createElement('div');
        errorMsg.innerHTML = '지도 이미지를 불러올 수 없습니다';
        errorMsg.style.cssText = `
          padding: 2rem;
          color: #666;
          font-size: 1rem;
          text-align: center;
        `;
        imageContainer.appendChild(errorMsg);
      };

      // 이미지를 컨테이너에 추가
      imageContainer.appendChild(staticMapImage);

      // 지도 설명
      const mapDescription = document.createElement('div');
      mapDescription.innerHTML = `
        <h3 style="margin: 0; color: #333; font-size: 1.2rem;">🗺️ 홍익돈까스 김포운양점 2층</h3>
        <p style="margin: 0.5rem 0; color: #666; font-size: 1rem;">${churchAddress}</p>
        <p style="margin: 0; color: #888; font-size: 0.9rem;">정적 지도 이미지 (CORS 문제로 인해)</p>
      `;

      // 인터랙티브 링크들
      const interactiveLinks = document.createElement('div');
      interactiveLinks.style.cssText = `
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        justify-content: center;
        margin-top: 1rem;
      `;

      const createLink = (href: string, text: string, icon: string) => {
        const link = document.createElement('a');
        link.href = href;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.style.cssText = `
          padding: 0.75rem 1.5rem;
          background: #007bff;
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 500;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        `;
        link.innerHTML = `${icon} ${text}`;
        link.onmouseover = () => link.style.background = '#0056b3';
        link.onmouseout = () => link.style.background = '#007bff';
        return link;
      };

      // 제공된 지도 소스의 정확한 링크들 사용
      interactiveLinks.appendChild(createLink(
        'https://map.kakao.com/?urlX=429061.9999999992&urlY=1155474.9999999977&itemId=1929098611&q=%ED%99%8D%EC%9D%B5%EB%8F%88%EA%B9%80%EC%8A%A4%20%EA%B9%80%ED%8F%AC%EC%9A%B4%EC%96%91%EC%A0%90&srcid=1929098611&map_type=TYPE_MAP&from=roughmap',
        '지도 크게 보기',
        '🗺️'
      ));
      interactiveLinks.appendChild(createLink(
        'https://map.kakao.com/?from=roughmap&srcid=1929098611&confirmid=1929098611&q=%ED%99%8D%EC%9D%B5%EB%8F%88%EA%B9%80%EC%8A%A4%20%EA%B9%80%ED%8F%AC%EC%9A%B4%EC%96%91%EC%A0%90&rv=on',
        '로드뷰',
        '📷'
      ));
      interactiveLinks.appendChild(createLink(
        'https://map.kakao.com/?from=roughmap&eName=%ED%99%8D%EC%9D%B5%EB%8F%88%EA%B9%80%EC%8A%A4%20%EA%B9%80%ED%8F%AC%EC%9A%B4%EC%96%91%EC%A0%90&eX=429061.9999999992&eY=1155474.9999999977',
        '길찾기',
        '🧭'
      ));

      // 컨테이너에 요소들 추가
      staticMapContainer.appendChild(imageContainer);
      staticMapContainer.appendChild(mapDescription);
      staticMapContainer.appendChild(interactiveLinks);

      if (mapRef.current) {
        mapRef.current.appendChild(staticMapContainer);
      }

      console.log('🎉 홍익돈까스 김포운양점 2층 정적 지도 + 인터랙티브 링크 방식으로 지도 표시 완료!');
      setMapStatus('success');
    };

    const initializeMap = () => {
      console.log('🎯 initializeMap 함수 시작');
      console.log('📊 상세 API 상태 체크:');
      console.log('  🔍 window.kakao:', !!window.kakao);
      console.log('  🔍 window.kakao.maps:', !!(window.kakao && window.kakao.maps));
      console.log('  🔍 window.kakao.maps.LatLng:', !!(window.kakao && window.kakao.maps && window.kakao.maps.LatLng));
      console.log('  🔍 window.kakao.maps.Map:', !!(window.kakao && window.kakao.maps && window.kakao.maps.Map));
      console.log('  🔍 window.kakao.maps.Marker:', !!(window.kakao && window.kakao.maps && window.kakao.maps.Marker));
      console.log('  🔍 window.kakao.maps.InfoWindow:', !!(window.kakao && window.kakao.maps && window.kakao.maps.InfoWindow));
      
      // 카카오맵 API 로딩 확인
      if (!window.kakao || !window.kakao.maps) {
        console.error('❌ 카카오맵 API가 로드되지 않았습니다');
        console.log('🔄 정적 지도로 안전하게 전환합니다...');
        loadRoughMap();
        return;
      }

      // LatLng 생성자 확인
      if (!window.kakao.maps.LatLng) {
        console.error('❌ LatLng 생성자가 아직 준비되지 않았습니다');
        console.log('🔄 정적 지도로 안전하게 전환합니다...');
        loadRoughMap();
        return;
      }

      // 지도 컨테이너 확인
      if (!mapRef.current) {
        console.error('❌ 지도 컨테이너를 찾을 수 없습니다');
        setMapStatus('error');
        return;
      }

      console.log('✅ 모든 필수 API 컴포넌트 확인 완료!');

      try {
        console.log('🎯 지도 초기화 중...');
        console.log('🔍 지도 컨테이너:', mapRef.current);
        console.log('🔍 교회 위치:', churchPosition);

        // 지도를 담을 영역의 DOM 레퍼런스
        const container = mapRef.current;
        
        // 지도를 생성할 때 필요한 기본 옵션 (가이드 권장사항)
        const options = {
          center: new window.kakao.maps.LatLng(churchPosition.lat, churchPosition.lng), // 지도의 중심좌표
          level: 3 // 지도의 레벨(확대, 축소 정도)
        };

        console.log('🔍 지도 옵션:', options);

        // 지도 생성 및 객체 리턴
        console.log('🏗️ 지도 객체 생성 중...');
        const map = new window.kakao.maps.Map(container, options);
        kakaoMapRef.current = map;
        
        console.log('✅ 지도 객체 생성 완료:', !!map);
        console.log('🔍 지도 정보:', {
          center: map.getCenter(),
          level: map.getLevel(),
          mapTypeId: map.getMapTypeId()
        });

        // 마커가 표시될 위치입니다
        console.log('📍 마커 위치 생성 중...');
        const markerPosition = new window.kakao.maps.LatLng(churchPosition.lat, churchPosition.lng);
        console.log('🔍 마커 위치:', markerPosition);

        // 마커를 생성합니다
        console.log('🎯 마커 객체 생성 중...');
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
          title: '홍익돈까스 김포운양점 2층' // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
        });
        console.log('🔍 생성된 마커 객체:', !!marker);

        // 마커가 지도 위에 표시되도록 설정합니다
        console.log('🎯 마커를 지도에 추가 중...');
        marker.setMap(map);
        console.log('✅ 마커가 지도에 성공적으로 추가됨');

        // 커스텀 인포윈도우 컨텐츠
        const iwContent = `
          <div style="
            padding: 15px 20px;
            font-family: 'Noto Serif KR', serif;
            text-align: center;
            min-width: 200px;
            border-radius: 8px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          ">
            <div style="
              font-size: 16px;
              font-weight: 600;
              color: #6c3483;
              margin-bottom: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 6px;
            ">
              <span>⛪</span>
                              <span>홍익돈까스 김포운양점 2층</span>
            </div>
            <div style="
              font-size: 13px;
              color: #555;
              line-height: 1.4;
              margin-bottom: 10px;
            ">
              경기 김포시 김포한강11로255번길 97 2층
            </div>
            <div style="
              font-size: 11px;
              color: #888;
              border-top: 1px solid #eee;
              padding-top: 8px;
            ">
              클릭하시면 상세정보를 확인할 수 있습니다
            </div>
          </div>
        `;

        // 마커 위에 표시할 인포윈도우를 생성합니다
        const infowindow = new window.kakao.maps.InfoWindow({
          content: iwContent,
          removable: true // 닫기 버튼 표시
        });

        // 마커에 클릭이벤트를 등록합니다
        window.kakao.maps.event.addListener(marker, 'click', function() {
          // 마커 위에 인포윈도우를 표시합니다
          infowindow.open(map, marker);
        });

        // 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성합니다
        const mapTypeControl = new window.kakao.maps.MapTypeControl();

        // 지도에 컨트롤을 추가해야 지도위에 표시됩니다
        // 지도타입 컨트롤은 지도 우상단에 표시됩니다
        map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT);

        // 지도 확대 축소를 제어할 수 있는 줌 컨트롤을 생성합니다
        const zoomControl = new window.kakao.maps.ZoomControl();
        map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

        console.log('🎉 카카오맵 초기화 완료!');
        setMapStatus('success');

        // 지도 크기 재조정 (반응형 대응)
        setTimeout(() => {
          try {
            map.relayout();
            map.setCenter(new window.kakao.maps.LatLng(churchPosition.lat, churchPosition.lng));
            console.log('✅ 지도 크기 재조정 및 중심점 설정 완료');
          } catch (error) {
            console.error('⚠️ 지도 크기 재조정 실패:', error);
          }
        }, 200);

      } catch (error) {
        console.error('❌ 지도 초기화 실패:', error);
        console.log('🔄 roughmap으로 전환합니다...');
        loadRoughMap();
      }
    };

    // 최적화된 지도 로딩 (카카오맵 JavaScript API 우선 시도)
    const loadOptimizedMap = () => {
      console.log('🚀 최적화된 지도 시스템 시작 - JavaScript API 우선 시도');
      
      // 먼저 JavaScript API 시도
      setTimeout(() => {
        loadKakaoMapAPI();
      }, 100);
      
      // 2초 후에도 성공하지 못하면 정적 지도로 fallback
      setTimeout(() => {
        if (mapStatus === 'loading') {
          console.log('🔄 JavaScript API 타임아웃, 정적 지도로 전환');
          loadRoughMap();
        }
      }, 2000);
    };

    // API 로딩 시작
    console.log('🎯 카카오맵 최적화 시스템: JavaScript API → 정적 지도 이중 안전장치');
    setMapStatus('loading');
    loadOptimizedMap();

    // 윈도우 리사이즈 시 지도 크기 재조정
    const handleResize = () => {
      if (kakaoMapRef.current) {
        kakaoMapRef.current.relayout();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      console.log('🧹 useEffect cleanup 시작');
      window.removeEventListener('resize', handleResize);
      
      // JavaScript API 스크립트 정리
      const kakaoScript = document.querySelector('script[src*="dapi.kakao.com"]');
      if (kakaoScript) {
        kakaoScript.remove();
        console.log('✅ 카카오맵 JavaScript API 스크립트 제거 완료');
      }
      
      // roughmap 스크립트 정리
      const roughmapScript = document.querySelector('.daum_roughmap_loader_script');
      if (roughmapScript) {
        roughmapScript.remove();
        console.log('✅ roughmap 로더 스크립트 제거 완료');
      }
      
      // roughmap 컨테이너 정리
      if (mapRef.current) {
        mapRef.current.innerHTML = '';
        console.log('✅ 지도 컨테이너 정리 완료');
      }
      
      console.log('🧹 useEffect cleanup 완료');
    };
  }, []);

  // 카카오맵 URL 링크 함수들 (정확한 kko.kakao.com 링크 기반)
  const openKakaoMap = () => {
    // 정확한 카카오맵 단축 링크 사용
    const mapUrl = 'https://kko.kakao.com/pRfyVSvD-G';
    console.log('🗺️ 카카오맵 열기:', mapUrl);
    window.open(mapUrl, '_blank');
  };

  const openDirections = () => {
    // 길찾기 바로가기: 정확한 좌표로 재설정
    const exactLat = 37.6158847;
    const exactLng = 126.7151906;
    const directionsUrl = `https://map.kakao.com/link/to/홍익돈까스 김포운양점 2층,${exactLat},${exactLng}`;
    console.log('🧭 길찾기 열기 (정확한 좌표):', directionsUrl);
    console.log('📍 사용된 좌표:', { lat: exactLat, lng: exactLng });
    window.open(directionsUrl, '_blank');
  };

  const openRoadView = () => {
    // 로드뷰 바로가기: 정확한 좌표로 재설정
    const exactLat = 37.6158847;
    const exactLng = 126.7151906;
    const roadViewUrl = `https://map.kakao.com/link/roadview/${exactLat},${exactLng}`;
    console.log('🛣️ 로드뷰 열기 (정확한 좌표):', roadViewUrl);
    console.log('📍 사용된 좌표:', { lat: exactLat, lng: exactLng });
    window.open(roadViewUrl, '_blank');
  };

  return (
    <LocationContainer>
      <MainLayout>
        {/* 좌측 섹션: 지도 + 오시는 길 */}
        <LeftSection>
          {/* 지도 */}
          <MapWrapper>
            <KakaoMapContainer>
              {mapStatus === 'loading' && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  background: 'var(--color-surface)',
                  borderRadius: '15px',
                  color: 'var(--color-secondary)',
                  fontSize: '1rem'
                }}>
                  지도를 불러오는 중...
                </div>
              )}
              
              {mapStatus === 'error' && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  background: 'var(--color-surface)',
                  borderRadius: '15px',
                  color: 'var(--color-secondary)',
                  fontSize: '1rem',
                  textAlign: 'center',
                  padding: '2rem'
                }}>
                  지도를 불러올 수 없습니다
                </div>
              )}
              
              <div 
                ref={mapRef}
                style={{ 
                  width: '100%', 
                  height: '100%',
                  borderRadius: '15px',
                  display: mapStatus === 'success' ? 'block' : 'none'
                }}
              />
            </KakaoMapContainer>
          </MapWrapper>
          
          {/* 주소 정보 */}
          <AddressInfo>
            <InfoTitle>오시는 길</InfoTitle>
            <InfoContent>
              <div style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                {churchAddress}
              </div>
              <div style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                홍익돈까스 김포운양점 2층
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => copyToClipboard(churchAddress)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'var(--color-primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                  }}
                >
                  주소 복사
                </button>
                <button 
                  onClick={openKakaoMap}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'var(--color-surface-elevated)',
                    color: 'var(--color-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                  }}
                >
                  지도 보기
                </button>
                <button 
                  onClick={openDirections}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'var(--color-surface-elevated)',
                    color: 'var(--color-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                  }}
                >
                  길찾기
                </button>
                <button 
                  onClick={openRoadView}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'var(--color-surface-elevated)',
                    color: 'var(--color-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                  }}
                >
                  로드뷰
                </button>
              </div>
            </InfoContent>
          </AddressInfo>
        </LeftSection>

        {/* 우측 섹션: 교통 정보 + 연락처 */}
        <RightSection>
          {/* 교통 정보 */}
          <TransportInfo>
            <InfoTitle>교통편</InfoTitle>
            <TransportList>
              <TransportItem>
                <div>
                  <div style={{ fontWeight: '600' }}>자가용</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                    김포IC 10분 · 서울 35분 · 주차 가능
                  </div>
                </div>
              </TransportItem>
              <TransportItem>
                <div>
                  <div style={{ fontWeight: '600' }}>대중교통</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                    김포한강로 버스정류장 도보 3분 · 시내버스 이용
                  </div>
                </div>
              </TransportItem>
              <TransportItem>
                <div>
                  <div style={{ fontWeight: '600' }}>공항접근</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                    김포공항 15분 · 인천공항 25분
                  </div>
                </div>
              </TransportItem>
            </TransportList>
          </TransportInfo>

          {/* 연락처 정보 */}
          <ContactInfo>
            <InfoTitle>문의</InfoTitle>
            <ContactList>
              <ContactItem>
                <ContactLabel>전화</ContactLabel>
                <ContactValue>031-000-0000</ContactValue>
              </ContactItem>
              <ContactItem>
                <ContactLabel>이메일</ContactLabel>
                <ContactValue>info@gsw-church.org</ContactValue>
              </ContactItem>
              <ContactItem>
                <ContactLabel>운영시간</ContactLabel>
                <ContactValue>평일 9:00-18:00</ContactValue>
              </ContactItem>
              <ContactItem>
                <ContactLabel>카카오톡</ContactLabel>
                <ContactValue>홍익돈까스 김포운양점</ContactValue>
              </ContactItem>
            </ContactList>
          </ContactInfo>
        </RightSection>
      </MainLayout>
    </LocationContainer>
  );
};

export default Location;