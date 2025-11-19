import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';

const BACKGROUND_COUNT = 4;
const IMAGE_PATHS = [
  'holssi-background-1.jpeg',
  'holssi-background-2.jpeg',
  'holssi-background-3.jpeg',
  'holssi-background-4.jpeg',
];

// 페이지 헤드에 이미지 프리로드용 링크 태그 추가
const preloadImages = () => {
  IMAGE_PATHS.forEach(src => {
    // 이미지를 직접 프리로드
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);

    // 추가적으로 이미지 객체를 캐시에 로드.
    const img = new Image();
    img.src = src;
  });
};

const HomeSection = () => {
  // const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [transitioning, setTransitioning] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const timeoutRef = useRef();

  // 초기 이미지 프리로드 및 페이드 인 효과
  useEffect(() => {
    // 페이지 로드 시 이미지를 프리로드
    preloadImages();

    // 초기 페이드 인 효과 (300ms 지연 후)
    const initialTimer = setTimeout(() => {
      setInitialLoad(false);
    }, 300);

    return () => clearTimeout(initialTimer);
  }, []);

  // 5초마다 배경 이미지 직접 크로스페이드 효과로 변경.
  useEffect(() => {
    // 초기 로딩 중에는 타이머를 설정하지 않음
    if (initialLoad) return;

    const interval = setInterval(() => {
      // 다음 인덱스 설정
      const next = (currentIndex + 1) % BACKGROUND_COUNT;
      setNextIndex(next);
      
      // 트랜지션 시작
      setTransitioning(true);
      
      // 트랜지션 완료 후 현재 인덱스 업데이트
      timeoutRef.current = setTimeout(() => {
        setCurrentIndex(next);
        setTransitioning(false);
      }, 1000); // 1초 트랜지션 후 업데이트
    }, 5000);
    
    return () => {
      clearInterval(interval);
      clearTimeout(timeoutRef.current);
    };
  }, [currentIndex, initialLoad]);

  // 콘솔 로그로 디버깅
  // console.log(`Current background index: ${currentIndex}`);

  return (
    <section
      id="home"
      className="bg-gray-900 relative transition-all duration-1000"
      style={{
        minHeight: '100vh',
        height: '100vh',
        display: 'flex',
        alignItems: 'flex-end',
        paddingBottom: '5vh',
        paddingTop: '0',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* 배경색 (이미지 로드 전에 표시) */}
      <div className="absolute inset-0 bg-gray-900 z-0"></div>

      {/* 초기 배경 이미지 (페이드 인) */}
      <div
        className="absolute inset-0 transition-opacity duration-1500"
        style={{
          backgroundImage: `url(${IMAGE_PATHS[0]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: initialLoad ? 0 : 1,
          zIndex: 1,
        }}
      ></div>

      {/* 현재 배경 이미지 레이어 */}
      {!initialLoad && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${IMAGE_PATHS[currentIndex]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 2,
          }}
        ></div>
      )}

      {/* 다음 배경 이미지 레이어 (전환 중에만 표시) */}
      {!initialLoad && (
        <div
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            backgroundImage: `url(${IMAGE_PATHS[nextIndex]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: transitioning ? 1 : 0,
            zIndex: 3,
          }}
        ></div>
      )}

      {/* 오버레이 레이어 */}
      <div 
        className="absolute inset-0 bg-dark bg-opacity-70 transition-opacity duration-1500 z-5"
        style={{
          opacity: initialLoad ? 0 : 1
        }}
      ></div>

      {/* 컨텐츠 레이어 */}
      <div 
        className="container-fluid px-4 text-center relative transition-opacity duration-1500 z-10 py-12"
        style={{
          opacity: initialLoad ? 0 : 1
        }}
      >
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-7xl md:text-8xl lg:text-9xl text-white mb-8 tracking-wider text-shadow letter-fade" 
              style={{ fontFamily: 'HolyType' }}>
            {Array.from("Holssi").map((letter, index) => (
              <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>{letter}</span>
            ))}{" "}
            {Array.from("Worship").map((letter, index) => (
              <span key={index + 100} className="text-primary" style={{ animationDelay: `${(index + 7) * 0.1}s` }}>{letter}</span>
            ))}
          </h1>
          <p className="text-4xl md:text-5xl lg:text-6xl text-gray-200 italic text-shadow letter-fade-secondary"
             style={{ fontFamily: 'HolyType' }}>
            {"We are Jesus holssi!".split("").map((letter, index) => (
              <span key={index + 200} style={{ 
                animationDelay: `${(index + 14) * 0.0445}s`,
                marginLeft: letter === " " ? "0.06em" : "0"
              }}>
                {letter === " " ? "\u00A0" : letter}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
};

export default HomeSection;