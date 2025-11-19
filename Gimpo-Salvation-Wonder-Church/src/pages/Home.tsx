import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Title, Subtitle } from '../styles/GlobalStyles';
import { fetchYoutubeShortsVideos, fetchLatestLiveStream, YouTubeVideo } from '../utils/youtubeApi';

const HomeContainer = styled.div`
  min-height: 100vh;
  background: var(--color-bg);
`;

// Hero Section
const HeroSection = styled.section`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.5) 100%),
              url('/main_background.jpeg') center/cover;
  color: var(--color-white);
  position: relative;
  overflow: hidden;
`;

const HeroContent = styled(motion.div)`
  max-width: 1000px;
  padding: 0 clamp(1rem, 4vw, 2rem);
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
  padding-top: clamp(8rem, 15vw, 10rem);
  
  @media (max-width: 768px) {
    padding-top: clamp(10rem, 20vw, 12rem);
  }
  padding-bottom: clamp(4rem, 8vw, 6rem);
  text-align: center;
  
  .hero-title {
    font-size: clamp(1.8rem, 5.5vw, 3.2rem);
    font-weight: 500;
    line-height: 1.3;
    color: var(--color-white);
    font-family: var(--font-primary);
    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    margin-bottom: clamp(1rem, 3vw, 2rem);
  }
  
  .hero-subtitle {
    font-size: clamp(0.9rem, 2.8vw, 1.3rem);
    font-weight: 400;
    opacity: 0.9;
    line-height: 1.8;
    color: var(--color-white);
    font-family: var(--font-primary);
    text-shadow: 0 2px 15px rgba(0, 0, 0, 0.4);
    max-width: 800px;
    margin: 0 auto;
  }
`;

// Scrolling Banner (repositioned behind service cards)
const ScrollingBanner = styled.div`
  background: var(--color-bg);
  color: var(--color-surface-elevated);
  padding: 4rem 0;
  overflow: hidden;
  white-space: nowrap;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  display: flex;
  align-items: flex-end;
  padding-bottom: 2rem;
`;

const ScrollingText = styled(motion.div)`
  display: inline-block;
  font-family: var(--font-primary);
  font-size: clamp(6rem, 18.75vw, 12rem);
  font-weight: 800;
  letter-spacing: 0.1em;
  animation: scroll 300s linear infinite;
  opacity: 0.3;
  color: rgba(128, 128, 128, 0.5);
  white-space: nowrap;
  
  @keyframes scroll {
    0% {
      transform: translateX(100vw);
    }
    100% {
      transform: translateX(-100%);
    }
  }
`;

// Service Cards Section
const ServiceSection = styled.section`
  padding: clamp(4rem, 10vw, 8rem) 0;
  background: var(--color-bg);
  position: relative;
  overflow: hidden;
`;

const ServiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(0.8rem, 2vw, 1.5rem);
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 clamp(1rem, 4vw, 2rem);
  position: relative;
  z-index: 2;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    gap: clamp(0.6rem, 1.5vw, 1rem);
  }
  
  @media (max-width: 768px) {
    display: none; /* 모바일에서는 슬라이더 사용 */
  }
`;

const ServiceCard = styled(motion.div)<{ isHovered: boolean; isCurrentHovered: boolean }>`
  position: relative;
  aspect-ratio: 9/16;
  height: clamp(400px, 50vw, 550px);
  border-radius: clamp(12px, 2.5vw, 16px);
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
  filter: ${props => props.isHovered && !props.isCurrentHovered ? 'blur(2px) brightness(0.7)' : 'none'};
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(108, 52, 131, 0.3) 0%, rgba(0, 0, 0, 0.6) 100%);
    z-index: 1;
    transition: all 0.5s ease;
  }
  
  &:hover {
    transform: translateY(-12px) scale(1.08);
    box-shadow: 0 25px 80px rgba(0, 0, 0, 0.3);
    z-index: 20;
    filter: none !important;
    
    &::before {
      background: linear-gradient(135deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.3) 100%);
    }
  }
`;

// Mobile Service Slider
const MobileServiceSlider = styled.div`
  display: none;
  position: relative;
  max-width: 100%;
  margin: 0 auto;
  padding: 0 1rem;
  z-index: 2;
  
  @media (max-width: 768px) {
    display: block;
    margin-top: 2rem;
  }
`;

const MobileServiceContainer = styled.div`
  overflow: hidden;
  border-radius: 16px;
  position: relative;
  width: 100%;
  height: clamp(450px, 60vw, 600px);
`;

const MobileServiceTrack = styled.div<{ translateX: number }>`
  display: flex;
  height: 100%;
  transition: transform 0.5s ease-in-out;
  transform: translateX(${props => props.translateX}%);
`;

const MobileServiceCard = styled.div`
  flex: 0 0 100%;
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(108, 52, 131, 0.3) 0%, rgba(0, 0, 0, 0.6) 100%);
    z-index: 1;
    transition: all 0.5s ease;
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
    
    &::before {
      background: linear-gradient(135deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.3) 100%);
    }
  }
`;

const MobileArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.7);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--color-accent);
  }
  
  svg {
    width: 16px;
    height: 16px;
    color: white;
  }
`;

const MobileLeftArrow = styled(MobileArrowButton)`
  left: 10px;
`;

const MobileRightArrow = styled(MobileArrowButton)`
  right: 10px;
`;

const ServiceCardImage = styled.div<{ bgImage: string }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url(${props => props.bgImage}) center/cover;
  transition: transform 0.6s ease;
  
  ${ServiceCard}:hover & {
    transform: scale(1.1);
  }
`;

const ServiceCardContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem;
  z-index: 2;
  color: var(--color-white);
  
  h3 {
    font-family: var(--font-primary);
    font-size: 1.5rem;
    font-weight: 500;
    margin-bottom: 0.75rem;
    color: var(--color-white);
  }
  
  p {
    font-size: 0.95rem;
    line-height: 1.6;
    opacity: 0.9;
    margin-bottom: 1rem;
    color: var(--color-white);
    white-space: pre-line;
  }
  
  .card-link {
    font-size: 0.9rem;
    color: var(--color-white);
    text-decoration: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.5);
    padding-bottom: 2px;
    transition: all 0.3s ease;
    
    &:hover {
      border-bottom-color: var(--color-white);
      opacity: 1;
    }
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    
    h3 {
      font-size: 1.3rem;
      margin-bottom: 0.5rem;
    }
    
    p {
      font-size: 0.9rem;
      margin-bottom: 0.8rem;
    }
  }
`;



// Message Section
const MessageSection = styled.section`
  background: linear-gradient(135deg, var(--color-surface) 0%, var(--color-surface-variant) 50%, var(--color-surface-elevated) 100%);
  padding: clamp(4rem, 10vw, 8rem) 0;
  text-align: center;
  position: relative;
  overflow: hidden;
`;

const MessageContent = styled(motion.div)`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 clamp(1rem, 4vw, 2rem);
  position: relative;
  z-index: 2;
  text-align: left;
  
  .message-header {
    margin-bottom: 3rem;
    
    .message-subtitle {
      font-family: var(--font-secondary);
      font-size: clamp(0.9rem, 2vw, 1.1rem);
      font-weight: 700;
      color: var(--color-accent);
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 0.5rem;
    }
    
    .message-title {
      font-family: var(--font-primary);
      font-size: clamp(2rem, 4.5vw, 3.5rem);
      font-weight: 700;
      color: var(--color-primary);
      line-height: 1.2;
      margin: 0;
    }
  }
`;

const VideoPlayer = styled(motion.div)`
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  
  iframe {
    width: 100%;
    height: 450px;
    border: none;
  }
  
  @media (max-width: 768px) {
    iframe {
      height: 250px;
    }
  }
`;

const BackgroundThumbnails = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  opacity: 0.05;
`;

const MovingThumbnail = styled(motion.div)<{ bgImage: string; delay: number }>`
  position: absolute;
  width: 200px;
  height: 120px;
  background: url(${props => props.bgImage}) center/cover;
  border-radius: 8px;
  filter: blur(1px);
  opacity: 0.3;
  
  &:nth-child(1) { top: 10%; left: 5%; }
  &:nth-child(2) { top: 20%; right: 10%; }
  &:nth-child(3) { bottom: 30%; left: 15%; }
  &:nth-child(4) { bottom: 15%; right: 5%; }
  &:nth-child(5) { top: 50%; left: 8%; }
  &:nth-child(6) { top: 60%; right: 12%; }
`;

// YouTube Shorts Section
const ShortsSection = styled.section`
  background: linear-gradient(180deg, var(--color-bg) 0%, var(--color-surface) 50%, var(--color-surface-variant) 100%);
  padding: clamp(4rem, 10vw, 8rem) 0;
`;

const ShortsContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 clamp(3rem, 6vw, 4rem);
  position: relative;
  text-align: left;
  
  .shorts-header {
    margin-bottom: 3rem;
    
    .shorts-subtitle {
      font-family: var(--font-secondary);
      font-size: clamp(0.9rem, 2vw, 1.1rem);
      font-weight: 700;
      color: var(--color-accent);
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 0.5rem;
    }
  }
`;

const ShortsSlider = styled.div`
  position: relative;
  margin-top: 3rem;
  overflow: hidden;
`;

const ShortsGrid = styled.div<{ translateX: number }>`
  display: flex;
  gap: 1.5rem;
  transition: transform 0.4s ease;
  transform: translateX(${props => props.translateX}px);
  width: fit-content;
`;

const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  z-index: 10;
  
  &:hover {
    background: var(--color-accent);
    transform: translateY(-50%) scale(1.1);
    
    svg {
      color: var(--color-white);
    }
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    
    &:hover {
      transform: translateY(-50%);
    }
  }
  
  svg {
    width: 20px;
    height: 20px;
    color: var(--color-primary);
  }
`;

const LeftArrow = styled(ArrowButton)`
  left: -25px;
`;

const RightArrow = styled(ArrowButton)`
  right: -25px;
`;

const ShortsCard = styled(motion.div)`
  background: var(--color-surface);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--shadow-soft);
  transition: var(--transition);
  cursor: pointer;
  flex-shrink: 0;
  width: 250px;
  border: 1px solid var(--border-color);
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-medium);
    border-color: var(--color-accent);
  }
`;

const ShortsImage = styled.div<{ bgImage: string }>`
    width: 100%;
  height: 280px;
  background: url(${props => props.bgImage}) center/cover;
  position: relative;
  
  &::before {
    content: '▶';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.7);
    color: white;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    transition: all 0.3s ease;
  }
  
  ${ShortsCard}:hover &::before {
    background: rgba(0, 0, 0, 0.9);
    transform: translate(-50%, -50%) scale(1.1);
  }
`;

const ShortsInfo = styled.div`
  padding: 1rem;
  
  h4 {
    font-size: 0.9rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
    color: var(--color-primary);
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .shorts-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8rem;
    color: var(--color-secondary);
    
    .views {
      color: var(--color-accent);
      font-weight: 500;
    }
  }
`;

const Home: React.FC = () => {
  const [shortsVideos, setShortsVideos] = useState<YouTubeVideo[]>([]);
  const [latestStream, setLatestStream] = useState<YouTubeVideo | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [mobileServiceSlide, setMobileServiceSlide] = useState(0);

  // 슬라이더 관련 함수들
  const cardWidth = 250;
  const gap = 24; // 1.5rem = 24px
  const itemWidth = cardWidth + gap;
  
  useEffect(() => {
    const updateContainerWidth = () => {
      const container = document.querySelector('[data-shorts-container]');
      if (container) {
        setContainerWidth(container.clientWidth);
      }
    };
    
    updateContainerWidth();
    window.addEventListener('resize', updateContainerWidth);
    return () => window.removeEventListener('resize', updateContainerWidth);
  }, []);

  // 모바일 서비스 슬라이더 자동재생
  useEffect(() => {
    const interval = setInterval(() => {
      nextMobileService();
    }, 4000); // 4초마다 자동으로 다음 슬라이드

    return () => clearInterval(interval);
  }, [mobileServiceSlide]);

  const getVisibleItems = () => {
    return Math.floor(containerWidth / itemWidth) || 1;
  };

  const getMaxSlide = () => {
    const visibleItems = getVisibleItems();
    return Math.max(0, shortsVideos.length - visibleItems);
  };

  const nextSlide = () => {
    const maxSlide = getMaxSlide();
    setCurrentSlide(prev => (prev >= maxSlide ? 0 : prev + 1));
  };

  const prevSlide = () => {
    const maxSlide = getMaxSlide();
    setCurrentSlide(prev => (prev <= 0 ? maxSlide : prev - 1));
  };

  const getTranslateX = () => {
    return -currentSlide * itemWidth;
  };

  // 모바일 서비스 슬라이더 함수들
  const nextMobileService = () => {
    setMobileServiceSlide(prev => prev < serviceCards.length - 1 ? prev + 1 : 0);
  };

  const prevMobileService = () => {
    setMobileServiceSlide(prev => prev > 0 ? prev - 1 : serviceCards.length - 1);
  };

  useEffect(() => {
    const loadYouTubeData = async () => {
      const channelUrl = 'https://www.youtube.com/@Joy_of_salvation_kp';
      
      // 동시에 로딩하여 성능 향상
      const [shortsResponse, latestStreamResponse] = await Promise.allSettled([
        fetchYoutubeShortsVideos(channelUrl, 6),
        fetchLatestLiveStream(channelUrl)
      ]);

      // 쇼츠 데이터 처리
      if (shortsResponse.status === 'fulfilled' && shortsResponse.value.items.length > 0) {
        console.log('✅ YouTube Shorts loaded successfully:', shortsResponse.value.items.length);
        setShortsVideos(shortsResponse.value.items);
      } else {
        console.log('⚠️ Using fallback shorts data');
        setShortsVideos([
          {
            id: 'shorts1',
            title: '30초 기도의 능력',
            description: '짧지만 강력한 기도의 힘을 경험해보세요',
            thumbnailUrl: '/logo.png',
            publishedAt: '2024-01-20T15:30:00Z',
            viewCount: '12만',
            duration: '0:30',
            channelTitle: '구원의감격교회',
            isShorts: true
          },
          {
            id: 'shorts2',
            title: '하루 한 말씀',
            description: '마음을 위로하는 하나님의 말씀',
            thumbnailUrl: '/logo.png',
            publishedAt: '2024-01-19T12:00:00Z',
            viewCount: '8만',
            duration: '0:45',
            channelTitle: '구원의감격교회',
            isShorts: true
          },
          {
            id: 'shorts3',
            title: '감사의 고백',
            description: '매일매일 감사함으로 살아가기',
            thumbnailUrl: '/logo.png',
            publishedAt: '2024-01-18T18:20:00Z',
            viewCount: '6만',
            duration: '0:35',
            channelTitle: '구원의감격교회',
            isShorts: true
          }
        ]);
      }

      // 라이브 스트림 데이터 처리
      if (latestStreamResponse.status === 'fulfilled' && latestStreamResponse.value) {
        console.log('✅ Latest stream loaded successfully:', latestStreamResponse.value.title);
        setLatestStream(latestStreamResponse.value);
      } else {
        console.log('⚠️ Using fallback stream data');
        setLatestStream({
          id: 'dQw4w9WgXcQ',
          title: '주일 2부 예배 - 하나님의 말씀이 우리 삶의 나침반이 됩니다',
          description: '구원의감격교회 주일 2부 예배입니다.',
          thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop',
          viewCount: '1.2천',
          publishedAt: new Date().toISOString(),
          duration: '1:25:30',
          channelTitle: '구원의감격교회',
          isShorts: false
        });
      }
    };

    loadYouTubeData();
  }, []);

  const serviceCards = [
    {
      title: '담임목사 인사말',
      description: '오직 감사! 범사의 감사함으로 나아가는\n2025년 한 해가 되도록 결단하십시오.',
      link: '/about/pastor',
      image: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=600&h=400&fit=crop&crop=center&auto=format'
    },
    {
      title: '말씀, 더 가까이',
      description: '말씀으로 하루하루를 살아내는\n김포 구원의감격교회 성도님들이 됩시다.',
      link: '/sermon',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop&crop=center&auto=format'
    },
    {
      title: '예배 안내',
      description: '김포 구원의감격교회의 모든 예배는\n언제나 누구에게나 열려 있습니다.',
      link: '/about/service',
      image: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=600&h=400&fit=crop&crop=center&auto=format'
    }
  ];

  const thumbnailImages = [
    'https://images.unsplash.com/photo-1519452634681-4b2ede4b37b7?w=200&h=120&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=120&fit=crop',
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=120&fit=crop',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=120&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=120&fit=crop',
    'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=200&h=120&fit=crop'
  ];

  return (
    <HomeContainer>
      {/* Hero Section */}
      <HeroSection>
        <HeroContent
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <h1 className="hero-title">
            구원의 감격이 식어버린 시대에,<br />
            우리는 다시 복음 앞에 섭니다.
          </h1>
          
          <p className="hero-subtitle">
            이곳은 처음 예수님을 만났던 그 벅찬 감동을 다시 회복하고,<br />
            그 감격을 삶으로 살아내는 사람들의 공동체입니다.
          </p>
        </HeroContent>
      </HeroSection>

      {/* Service Cards Section */}
      <ServiceSection>
        {/* Scrolling Banner behind cards */}
        <ScrollingBanner>
          <ScrollingText>
            GIMPO SALVATION WONDER CHURCH   GIMPO SALVATION WONDER CHURCH   GIMPO SALVATION WONDER CHURCH   GIMPO SALVATION WONDER CHURCH   GIMPO SALVATION WONDER CHURCH   GIMPO SALVATION WONDER CHURCH   GIMPO SALVATION WONDER CHURCH   GIMPO SALVATION WONDER CHURCH 
          </ScrollingText>
        </ScrollingBanner>
        <Title style={{ textAlign: 'center', marginBottom: '4rem', position: 'relative', zIndex: 2 }}>2025 김포 구원의감격교회</Title>
          
          <ServiceGrid>
          {serviceCards.map((card, index) => (
            <ServiceCard
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => window.location.href = card.link}
              isHovered={hoveredCard !== null}
              isCurrentHovered={hoveredCard === index}
            >
              <ServiceCardImage bgImage={card.image} />
              <ServiceCardContent>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
                <span className="card-link">더 보기 +</span>
              </ServiceCardContent>
            </ServiceCard>
          ))}
        </ServiceGrid>
        
        {/* Mobile Service Slider */}
        <MobileServiceSlider>
          <MobileServiceContainer>
            <MobileServiceTrack translateX={-mobileServiceSlide * 100}>
              {serviceCards.map((card, index) => (
                <MobileServiceCard 
                  key={index}
                  onClick={() => window.location.href = card.link}
                >
                  <ServiceCardImage bgImage={card.image} />
                  <ServiceCardContent>
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                    <span className="card-link">더 보기 +</span>
                  </ServiceCardContent>
                </MobileServiceCard>
              ))}
            </MobileServiceTrack>
            
            <MobileLeftArrow onClick={prevMobileService}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </MobileLeftArrow>
            
            <MobileRightArrow onClick={nextMobileService}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </MobileRightArrow>
          </MobileServiceContainer>
        </MobileServiceSlider>
      </ServiceSection>

      {/* Message Section */}
      <MessageSection>
        <BackgroundThumbnails>
          {thumbnailImages.map((image, index) => (
            <MovingThumbnail
              key={index}
              bgImage={image}
              delay={index}
              animate={{
                x: [0, 20, -20, 0],
                y: [0, -15, 15, 0],
              }}
              transition={{
                duration: 8 + index * 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </BackgroundThumbnails>
        
        <MessageContent
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="message-header">
            <div className="message-subtitle">the Message</div>
            <h2 className="message-title">
              하나님의 말씀,<br />
              우리 삶의 나침반이 됩니다.
            </h2>
          </div>
          
          <VideoPlayer
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <iframe
              src={`https://www.youtube.com/embed/${latestStream?.id || 'dQw4w9WgXcQ'}`}
              title={latestStream?.title || "주일 2부 예배"}
              allowFullScreen
            />
          </VideoPlayer>
        </MessageContent>
      </MessageSection>

      {/* YouTube Shorts Section */}
      <ShortsSection>
        <ShortsContainer data-shorts-container>
          <div className="shorts-header">
            <div className="shorts-subtitle">Short Messages</div>
          </div>
          
          <ShortsSlider>
            <LeftArrow 
              onClick={prevSlide}
              disabled={shortsVideos.length <= getVisibleItems()}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
              </svg>
            </LeftArrow>
            
            <ShortsGrid translateX={getTranslateX()}>
              {shortsVideos.map((video, index) => (
                <ShortsCard
                  key={video.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  onClick={() => window.open(`https://youtube.com/watch?v=${video.id}`, '_blank')}
                >
                  <ShortsImage bgImage={video.thumbnailUrl} />
                  <ShortsInfo>
                    <h4>{video.title}</h4>
                    <div className="shorts-meta">
                      <span className="views">{video.viewCount} 조회</span>
                      <span>{video.duration}</span>
                    </div>
                  </ShortsInfo>
                </ShortsCard>
              ))}
            </ShortsGrid>
            
            <RightArrow 
              onClick={nextSlide}
              disabled={shortsVideos.length <= getVisibleItems()}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
              </svg>
            </RightArrow>
          </ShortsSlider>
        </ShortsContainer>
      </ShortsSection>
    </HomeContainer>
  );
};

export default Home;