import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Card } from '../styles/GlobalStyles';
import { fetchChannelVideosByHandle, YouTubeVideo } from '../utils/youtubeApi';

const SermonContainer = styled.div`
  min-height: 100vh;
  background: var(--color-bg);
  padding-top: 80px;
`;



const Section = styled.section`
  padding: 8rem 0;
  background: var(--color-bg);
  position: relative;
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }
`;

const FilterTabs = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 3rem 0;
  flex-wrap: wrap;
`;

const TabButton = styled.button<{ active: boolean }>`
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  font-weight: 500;
  transition: all 0.3s ease;
  font-family: var(--font-secondary);
  
  ${props => props.active ? `
    background-color: var(--color-black);
    color: var(--color-white);
    box-shadow: var(--shadow-soft);
  ` : `
    background-color: var(--color-light-gray);
    color: var(--color-secondary);
    
    &:hover {
      background-color: #e9ecef;
      color: var(--color-black);
      transform: translateY(-1px);
    }
  `}
`;

const SermonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const SermonCard = styled(Card)`
  padding: 0;
  overflow: hidden;
  transition: all 0.4s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-strong);
  }
  
  .video-thumbnail {
    width: 100%;
    height: 220px;
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.5) 100%),
                url('https://images.unsplash.com/photo-1507692049790-de58290a4334?w=400&h=220&fit=crop') center/cover;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    color: var(--color-white);
    position: relative;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      opacity: 0.9;
    }
    
    .play-button {
      position: absolute;
      width: 60px;
      height: 60px;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      color: var(--color-black);
      transition: all 0.3s ease;
      
      &:hover {
        background: var(--color-white);
        transform: scale(1.1);
      }
    }
  }
  
  .sermon-info {
    padding: 1.5rem;
    
    .date {
      color: var(--color-secondary);
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
      font-family: var(--font-secondary);
    }
    
    h3 {
      font-size: 1.3rem;
      margin-bottom: 0.8rem;
      color: var(--color-black);
      font-family: var(--font-primary);
      font-weight: 500;
    }
    
    .scripture {
      color: var(--color-black);
      font-weight: 500;
      margin-bottom: 1rem;
      font-family: var(--font-primary);
    }
    
    .description {
      color: var(--color-secondary);
      line-height: 1.6;
      margin-bottom: 1.5rem;
      font-family: var(--font-secondary);
    }
    
    .meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.9rem;
      color: var(--color-gray);
      font-family: var(--font-secondary);
    }
  }
`;

const VideoPlayerSection = styled.div`
  margin-bottom: 4rem;
`;

const VideoPlayer = styled.div`
  position: relative;
  max-width: 900px;
  margin: 0 auto 2rem auto;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  background: #000;
  
  iframe {
    width: 100%;
    height: 500px;
    border: none;
  }
  
  @media (max-width: 768px) {
    iframe {
      height: 300px;
    }
  }
`;

const VideoInfo = styled.div`
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
  
  h2 {
    font-size: 1.5rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
    color: var(--color-black);
    font-family: var(--font-primary);
  }
  
  .video-meta {
    display: flex;
    justify-content: center;
    gap: 2rem;
    font-size: 0.9rem;
    color: var(--color-secondary);
    margin-bottom: 1rem;
    
    @media (max-width: 768px) {
      flex-direction: column;
      gap: 0.5rem;
    }
  }
  
  .description {
    font-size: 1rem;
    line-height: 1.6;
    color: var(--color-secondary);
    max-width: 600px;
    margin: 0 auto;
  }
`;

const YoutubeEmbed = styled.div`
  margin: 3rem 0;
  text-align: center;
  
  .youtube-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.8rem 1.5rem;
    background: #ff0000;
    color: white;
    border-radius: 25px;
    font-weight: 500;
    font-size: 0.9rem;
    text-decoration: none;
    transition: all 0.3s ease;
    
    &:hover {
      background: #cc0000;
      transform: translateY(-2px);
    }
  }
`;

const Sermon: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);

  useEffect(() => {
    const loadVideos = async () => {
      setLoading(true);
      try {
        const response = await fetchChannelVideosByHandle(
          'https://www.youtube.com/@Joy_of_salvation_kp/featured',
          20,
          'date'
        );
        setVideos(response.items);
        // 첫 번째 영상을 기본 선택
        if (response.items.length > 0) {
          setSelectedVideo(response.items[0]);
        }
      } catch (error) {
        console.error('Failed to load videos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, []);

  const getVideoType = (title: string): string => {
    if (title.includes('주일') || title.includes('예배')) return 'sunday';
    if (title.includes('수요') || title.includes('수요예배')) return 'wednesday';
    if (title.includes('금요') || title.includes('기도회')) return 'friday';
    return 'sunday';
  };

  const filteredVideos = videos.filter(video => {
    if (activeTab === 'all') return true;
    return getVideoType(video.title) === activeTab;
  });

  return (
    <SermonContainer>
      <Section>
        <div className="container">
          
          {selectedVideo && (
            <VideoPlayerSection>
              <VideoPlayer>
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideo.id}`}
                  title={selectedVideo.title}
                  allowFullScreen
                />
              </VideoPlayer>
              <VideoInfo>
                <h2>{selectedVideo.title}</h2>
                <div className="video-meta">
                  <span>{new Date(selectedVideo.publishedAt).toLocaleDateString('ko-KR')}</span>
                  <span>{selectedVideo.duration}</span>
                  <span>{selectedVideo.viewCount}회 시청</span>
                </div>
                <div className="description">
                  {selectedVideo.description.slice(0, 200)}...
                </div>
              </VideoInfo>
            </VideoPlayerSection>
          )}

          <YoutubeEmbed>
            <a 
              href="https://www.youtube.com/@Joy_of_salvation_kp/featured" 
              target="_blank" 
              rel="noopener noreferrer"
              className="youtube-link"
            >
              김포 구원의감격교회 유튜브 채널 방문
            </a>
          </YoutubeEmbed>
          
          <FilterTabs>
            <TabButton 
              active={activeTab === 'all'} 
              onClick={() => setActiveTab('all')}
            >
              전체
            </TabButton>
            <TabButton 
              active={activeTab === 'sunday'} 
              onClick={() => setActiveTab('sunday')}
            >
              주일설교
            </TabButton>
            <TabButton 
              active={activeTab === 'wednesday'} 
              onClick={() => setActiveTab('wednesday')}
            >
              수요예배
            </TabButton>
            <TabButton 
              active={activeTab === 'friday'} 
              onClick={() => setActiveTab('friday')}
            >
              금요기도회
            </TabButton>
          </FilterTabs>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p>영상을 불러오는 중...</p>
            </div>
          ) : (
            <SermonGrid>
              {filteredVideos.map(video => (
                <SermonCard 
                  key={video.id}
                  onClick={() => {
                    setSelectedVideo(video);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{
                    border: selectedVideo?.id === video.id ? '3px solid var(--color-primary)' : 'none'
                  }}
                >
                  <div className="video-thumbnail" style={{
                    backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.5) 100%), url(${video.thumbnailUrl})`
                  }}>
                    <div className="play-button">▶</div>
                  </div>
                  <div className="sermon-info">
                    <div className="date">{new Date(video.publishedAt).toLocaleDateString('ko-KR')}</div>
                    <h3>{video.title}</h3>
                    <div className="description">{video.description.slice(0, 100)}...</div>
                    <div className="meta">
                      <span>{video.duration}</span>
                      <span>{video.viewCount}회</span>
                    </div>
                  </div>
                </SermonCard>
              ))}
            </SermonGrid>
          )}
        </div>
      </Section>
    </SermonContainer>
  );
};

export default Sermon;