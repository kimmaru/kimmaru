import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Card } from '../styles/GlobalStyles';
import { fetchChannelVideosByHandle, fetchYoutubeShortsVideos, YouTubeVideo } from '../utils/youtubeApi';

const MediaContainer = styled.div`
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

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 3rem 0;
  flex-wrap: wrap;
`;

const TabButton = styled.button<{ active: boolean }>`
  padding: 1rem 2rem;
  border-radius: var(--border-radius);
  font-weight: 500;
  font-size: 1.1rem;
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

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 3rem;
`;

const PhotoAlbum = styled(Card)`
  padding: 0;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s ease;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-strong);
  }
  
  .album-cover {
    width: 100%;
    height: 200px;
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.5) 100%),
                url('https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=300&h=200&fit=crop') center/cover;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    color: var(--color-white);
    transition: all 0.3s ease;
    
    &:hover {
      opacity: 0.9;
    }
  }
  
  .album-info {
    padding: 1.5rem;
    
    h3 {
      font-size: 1.2rem;
      margin-bottom: 0.5rem;
      color: var(--color-black);
      font-family: var(--font-primary);
      font-weight: 500;
    }
    
    .date {
      color: var(--color-secondary);
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
      font-family: var(--font-secondary);
    }
    
    .photo-count {
      color: var(--color-gray);
      font-size: 0.9rem;
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

const InstagramSection = styled.div`
  margin-top: 4rem;
  text-align: center;
  
  h3 {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: #333;
  }
  
  p {
    color: #666;
    margin-bottom: 2rem;
    font-size: 1.1rem;
  }
  
  .instagram-embed {
    background: #f8f9fa;
    padding: 3rem;
    border-radius: 12px;
    margin: 2rem 0;
    
    .instagram-placeholder {
      font-size: 4rem;
      color: #E4405F;
      margin-bottom: 1rem;
    }
    
    p {
      color: #666;
      margin-bottom: 2rem;
    }
  }
  
  .instagram-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 2rem;
    background: linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%);
    color: white;
    border-radius: 8px;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    }
  }
`;

const MediaHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  
  .media-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    
    .stat-item {
      padding: 1rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      
      .stat-number {
        font-size: 2rem;
        font-weight: 700;
        color: #333;
        margin-bottom: 0.5rem;
      }
      
      .stat-label {
        color: #666;
        font-size: 0.9rem;
      }
    }
  }
`;

const Media: React.FC = () => {
  const [activeTab, setActiveTab] = useState('videos');
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [shorts, setShorts] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);

  useEffect(() => {
    const loadMediaContent = async () => {
      setLoading(true);
      try {
        const [videosResponse, shortsResponse] = await Promise.all([
          fetchChannelVideosByHandle(
            'https://www.youtube.com/@Joy_of_salvation_kp/featured',
            16,
            'date'
          ),
          fetchYoutubeShortsVideos(
            'https://www.youtube.com/@Joy_of_salvation_kp/featured',
            12
          )
        ]);
        setVideos(videosResponse.items);
        setShorts(shortsResponse.items);
        // 첫 번째 영상을 기본 선택
        if (videosResponse.items.length > 0) {
          setSelectedVideo(videosResponse.items[0]);
        }
      } catch (error) {
        console.error('Failed to load media content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMediaContent();
  }, []);

  // 탭 변경 시 선택된 비디오 업데이트
  useEffect(() => {
    if (activeTab === 'videos' && videos.length > 0) {
      setSelectedVideo(videos[0]);
    } else if (activeTab === 'shorts' && shorts.length > 0) {
      setSelectedVideo(shorts[0]);
    }
  }, [activeTab, videos, shorts]);

  return (
    <MediaContainer>
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

          <MediaHeader>
            <div className="media-stats">
              <div className="stat-item">
                <div className="stat-number">{videos.length}</div>
                <div className="stat-label">일반 영상</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{shorts.length}</div>
                <div className="stat-label">쇼츠</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{videos.length + shorts.length}</div>
                <div className="stat-label">전체</div>
              </div>
            </div>
          </MediaHeader>
          
          <TabContainer>
            <TabButton 
              active={activeTab === 'videos'} 
              onClick={() => setActiveTab('videos')}
            >
              일반 영상
            </TabButton>
            <TabButton 
              active={activeTab === 'shorts'} 
              onClick={() => setActiveTab('shorts')}
            >
              YouTube 쇼츠
            </TabButton>
          </TabContainer>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p>콘텐츠를 불러오는 중...</p>
            </div>
          ) : (
            <>
              {activeTab === 'videos' && (
                <PhotoGrid>
                  {videos.map(video => (
                    <PhotoAlbum 
                      key={video.id}
                      onClick={() => {
                        setSelectedVideo(video);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      style={{
                        border: selectedVideo?.id === video.id ? '3px solid var(--color-primary)' : 'none'
                      }}
                    >
                      <div className="album-cover" style={{
                        backgroundImage: `url(${video.thumbnailUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}>
                        <div style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          color: 'white',
                          fontSize: '2rem',
                          textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                        }}>▶</div>
                      </div>
                      <div className="album-info">
                        <h3>{video.title}</h3>
                        <div className="date">{new Date(video.publishedAt).toLocaleDateString('ko-KR')}</div>
                        <div className="photo-count">{video.duration} • {video.viewCount}회</div>
                      </div>
                    </PhotoAlbum>
                  ))}
                </PhotoGrid>
              )}
              
              {activeTab === 'shorts' && (
                <PhotoGrid>
                  {shorts.map(short => (
                    <PhotoAlbum 
                      key={short.id}
                      onClick={() => {
                        setSelectedVideo(short);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      style={{
                        border: selectedVideo?.id === short.id ? '3px solid var(--color-primary)' : 'none'
                      }}
                    >
                      <div className="album-cover" style={{
                        backgroundImage: `url(${short.thumbnailUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}>
                        <div style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          color: 'white',
                          fontSize: '2rem',
                          textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                        }}>▶</div>
                      </div>
                      <div className="album-info">
                        <h3>{short.title}</h3>
                        <div className="date">{new Date(short.publishedAt).toLocaleDateString('ko-KR')}</div>
                        <div className="photo-count">{short.duration} • {short.viewCount}회</div>
                      </div>
                    </PhotoAlbum>
                  ))}
                </PhotoGrid>
              )}
            </>
          )}
        </div>
      </Section>
    </MediaContainer>
  );
};

export default Media;