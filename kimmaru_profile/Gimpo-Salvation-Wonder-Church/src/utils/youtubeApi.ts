// YouTube API 유틸리티 함수들
const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY || 'AIzaSyDXKRvyixm4auf4pYoDquN-e4bF8rBGnNg';

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  viewCount: string;
  duration: string;
  channelTitle: string;
  isShorts?: boolean;
}

export interface YouTubeApiResponse {
  items: YouTubeVideo[];
  nextPageToken?: string;
  totalResults: number;
}

// 채널 핸들로 채널 ID 가져오기
const getChannelIdByHandle = async (handle: string): Promise<string> => {
  try {
    // 먼저 채널 핸들을 이용해 직접 조회
    const handleUrl = `https://www.googleapis.com/youtube/v3/channels?key=${YOUTUBE_API_KEY}&forHandle=${handle}&part=snippet`;
    const handleResponse = await fetch(handleUrl);
    const handleData = await handleResponse.json();
    
    if (handleData.items && handleData.items.length > 0) {
      console.log('Found channel by handle:', handleData.items[0].id);
      return handleData.items[0].id;
    }
    
    // 핸들로 찾지 못하면 검색으로 시도
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&type=channel&q=${handle}&part=snippet&maxResults=5`;
    const response = await fetch(searchUrl);
    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      // '구원의감격' 또는 '김포' 키워드가 포함된 채널 우선 선택
      const matchingChannel = data.items.find((item: any) => 
        item.snippet.title.includes('구원의감격') || 
        item.snippet.title.includes('김포') ||
        item.snippet.title.includes('Joy_of_salvation')
      );
      
      if (matchingChannel) {
        console.log('Found matching channel:', matchingChannel.snippet.title, matchingChannel.snippet.channelId);
        return matchingChannel.snippet.channelId;
      }
      
      // 일치하는 채널이 없으면 첫 번째 결과 사용
      console.log('Using first search result:', data.items[0].snippet.title, data.items[0].snippet.channelId);
      return data.items[0].snippet.channelId;
    }
    
    // 기본 채널 ID 반환
    console.log('Using default channel ID');
    return 'UC587Qj9ZMVMSxrS39CoCQMA';
  } catch (error) {
    console.error('채널 ID 가져오기 실패:', error);
    return 'UC587Qj9ZMVMSxrS39CoCQMA';
  }
};

// 채널의 최신 라이브 스트림을 가져오는 함수
export const fetchLatestLiveStream = async (channelUrl: string): Promise<YouTubeVideo | null> => {
  if (!YOUTUBE_API_KEY) {
    console.warn('YouTube API key not found');
    return getDummyLiveStream();
  }

  try {
    // 채널 핸들 추출
    const handleMatch = channelUrl.match(/@([a-zA-Z0-9_-]+)/);
    const handle = handleMatch ? handleMatch[1] : 'Joy_of_salvation_kp';
    
    console.log('Looking for latest live stream from handle:', handle);
    const channelId = await getChannelIdByHandle(handle);
    console.log('Found channel ID for live stream:', channelId);

    // 최신 라이브 영상 검색 (완료된 라이브 스트림 포함)
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${channelId}&type=video&order=date&maxResults=10&part=snippet`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (!searchData.items || searchData.items.length === 0) {
      return getDummyLiveStream();
    }

    // 가장 최근 영상을 라이브 스트림으로 사용
    const latestVideo = searchData.items[0];
    
    // 상세 정보 가져오기
    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&id=${latestVideo.id.videoId}&part=snippet,statistics,contentDetails`;
    const detailsResponse = await fetch(detailsUrl);
    const detailsData = await detailsResponse.json();

    if (!detailsData.items || detailsData.items.length === 0) {
      return getDummyLiveStream();
    }

    const videoDetails = detailsData.items[0];

    return {
      id: videoDetails.id,
      title: videoDetails.snippet.title,
      description: videoDetails.snippet.description || '',
      thumbnailUrl: videoDetails.snippet.thumbnails.maxres?.url || videoDetails.snippet.thumbnails.high?.url || videoDetails.snippet.thumbnails.default.url,
      viewCount: formatViewCount(videoDetails.statistics.viewCount || '0'),
      publishedAt: videoDetails.snippet.publishedAt,
      duration: formatDuration(videoDetails.contentDetails.duration),
      channelTitle: videoDetails.snippet.channelTitle || '',
      isShorts: false
    };
  } catch (error) {
    console.error('Failed to fetch latest live stream:', error);
    return getDummyLiveStream();
  }
};

// 더미 라이브 스트림 데이터
const getDummyLiveStream = (): YouTubeVideo => ({
  id: 'dQw4w9WgXcQ',
  title: '주일 2부 예배 - 하나님의 말씀이 우리 삶의 나침반이 됩니다',
  description: '김포 구원의감격교회 주일 2부 예배입니다.',
  thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop',
  viewCount: '1.2천',
  publishedAt: new Date().toISOString(),
  duration: '1:25:30',
  channelTitle: '김포 구원의감격교회',
  isShorts: false
});

// YouTube 쇼츠 영상을 조회수 순으로 가져오는 함수
export const fetchYoutubeShortsVideos = async (
  channelUrl: string,
  maxResults: number = 8
): Promise<YouTubeApiResponse> => {
  try {
    // 채널 핸들 추출 (@Joy_of_salvation_kp -> Joy_of_salvation_kp)
    const handleMatch = channelUrl.match(/@([a-zA-Z0-9_-]+)/);
    const handle = handleMatch ? handleMatch[1] : 'Joy_of_salvation_kp';
    
    console.log('Looking for shorts from handle:', handle);
    // 채널 ID 가져오기
    const channelId = await getChannelIdByHandle(handle);
    console.log('Found channel ID for shorts:', channelId);
    
    // YouTube Shorts 검색 (duration=short로 필터링)
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${channelId}&part=snippet&type=video&videoDuration=short&order=viewCount&maxResults=${maxResults}`;
    
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (!searchResponse.ok || !searchData.items) {
      return getDummyShortsData();
    }

    // 비디오 상세 정보 가져오기
    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');
    const videosUrl = `https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&id=${videoIds}&part=snippet,statistics,contentDetails`;
    
    const videosResponse = await fetch(videosUrl);
    const videosData = await videosResponse.json();

    if (!videosResponse.ok) {
      return getDummyShortsData();
    }

    const formattedVideos: YouTubeVideo[] = videosData.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnailUrl: item.snippet.thumbnails.maxres?.url || 
                    item.snippet.thumbnails.high?.url || 
                    item.snippet.thumbnails.medium?.url || 
                    item.snippet.thumbnails.default?.url,
      publishedAt: item.snippet.publishedAt,
      viewCount: formatViewCount(item.statistics.viewCount || '0'),
      duration: formatDuration(item.contentDetails.duration),
      channelTitle: item.snippet.channelTitle,
      isShorts: true
    }))
    .sort((a: YouTubeVideo, b: YouTubeVideo) => {
      // 조회수 순으로 정렬
      const viewsA = parseInt(a.viewCount.replace(/[^0-9]/g, '')) || 0;
      const viewsB = parseInt(b.viewCount.replace(/[^0-9]/g, '')) || 0;
      return viewsB - viewsA;
    });

    return {
      items: formattedVideos,
      totalResults: formattedVideos.length
    };

  } catch (error) {
    console.error('YouTube Shorts API 에러:', error);
    return getDummyShortsData();
  }
};

// YouTube Data API v3를 사용한 채널 영상 조회
export const fetchChannelVideos = async (
  channelId: string,
  maxResults: number = 12,
  order: 'relevance' | 'date' | 'viewCount' | 'title' = 'viewCount'
): Promise<YouTubeApiResponse> => {
  try {
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${channelId}&part=snippet&order=${order}&maxResults=${maxResults}&type=video`;
    
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (!searchResponse.ok) {
      throw new Error(`YouTube API Error: ${searchData.error?.message || 'Unknown error'}`);
    }

    // 영상의 상세 정보 (조회수, 시간 등) 가져오기
    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');
    const videosUrl = `https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&id=${videoIds}&part=snippet,statistics,contentDetails`;
    
    const videosResponse = await fetch(videosUrl);
    const videosData = await videosResponse.json();

    if (!videosResponse.ok) {
      throw new Error(`YouTube API Error: ${videosData.error?.message || 'Unknown error'}`);
    }

    const formattedVideos: YouTubeVideo[] = videosData.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnailUrl: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default.url,
      publishedAt: item.snippet.publishedAt,
      viewCount: formatViewCount(item.statistics.viewCount),
      duration: formatDuration(item.contentDetails.duration),
      channelTitle: item.snippet.channelTitle,
      isShorts: false
    }));

    return {
      items: formattedVideos,
      totalResults: searchData.pageInfo.totalResults
    };

  } catch (error) {
    console.error('YouTube API fetch error:', error);
    // 에러 발생 시 더미 데이터 반환
    return getDummyVideoData(maxResults);
  }
};

// 채널 핸들로 영상 가져오기
export const fetchChannelVideosByHandle = async (
  channelUrl: string,
  maxResults: number = 12,
  order: 'relevance' | 'date' | 'viewCount' | 'title' = 'date'
): Promise<YouTubeApiResponse> => {
  try {
    // 채널 핸들 추출
    const handleMatch = channelUrl.match(/@([a-zA-Z0-9_-]+)/);
    const handle = handleMatch ? handleMatch[1] : 'Joy_of_salvation_kp';
    
    // 채널 ID 가져오기
    const channelId = await getChannelIdByHandle(handle);
    
    // 일반 영상들 가져오기 (쇼츠 제외)
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${channelId}&part=snippet&order=${order}&maxResults=${maxResults}&type=video&videoDuration=medium,long`;
    
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (!searchResponse.ok || !searchData.items) {
      return getDummyVideoData(maxResults);
    }

    // 영상의 상세 정보 가져오기
    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');
    const videosUrl = `https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&id=${videoIds}&part=snippet,statistics,contentDetails`;
    
    const videosResponse = await fetch(videosUrl);
    const videosData = await videosResponse.json();

    if (!videosResponse.ok) {
      return getDummyVideoData(maxResults);
    }

    const formattedVideos: YouTubeVideo[] = videosData.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnailUrl: item.snippet.thumbnails.maxres?.url || 
                    item.snippet.thumbnails.high?.url || 
                    item.snippet.thumbnails.medium?.url || 
                    item.snippet.thumbnails.default?.url,
      publishedAt: item.snippet.publishedAt,
      viewCount: formatViewCount(item.statistics.viewCount || '0'),
      duration: formatDuration(item.contentDetails.duration),
      channelTitle: item.snippet.channelTitle,
      isShorts: false
    }));

    return {
      items: formattedVideos,
      totalResults: formattedVideos.length
    };

  } catch (error) {
    console.error('YouTube API fetch error:', error);
    return getDummyVideoData(maxResults);
  }
};

// 더미 쇼츠 데이터 생성 함수
const getDummyShortsData = (): YouTubeApiResponse => {
  const dummyShorts: YouTubeVideo[] = [
    {
      id: 'shorts1',
      title: '30초 기도의 능력',
      description: '짧지만 강력한 기도의 힘을 경험해보세요',
      thumbnailUrl: '/logo.png',
      publishedAt: '2024-01-20T15:30:00Z',
      viewCount: '12만',
      duration: '0:30',
      channelTitle: '김포 구원의감격교회',
      isShorts: true
    },
    {
      id: 'shorts2',
      title: '하루 한 말씀 #성경구절',
      description: '마음을 위로하는 하나님의 말씀',
      thumbnailUrl: '/logo.png',
      publishedAt: '2024-01-19T12:00:00Z',
      viewCount: '8만',
      duration: '0:45',
      channelTitle: '김포 구원의감격교회',
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
      channelTitle: '김포 구원의감격교회',
      isShorts: true
    },
    {
      id: 'shorts4',
      title: '찬양 한 구절',
      description: '마음을 울리는 아름다운 찬양',
      thumbnailUrl: '/logo.png',
      publishedAt: '2024-01-17T09:15:00Z',
      viewCount: '4만',
      duration: '0:50',
      channelTitle: '김포 구원의감격교회',
      isShorts: true
    },
    {
      id: 'shorts5',
      title: '오늘의 말씀',
      description: '하루를 시작하는 은혜로운 말씀',
      thumbnailUrl: '/logo.png',
      publishedAt: '2024-01-16T07:00:00Z',
      viewCount: '3만',
      duration: '0:40',
      channelTitle: '김포 구원의감격교회',
      isShorts: true
    },
    {
      id: 'shorts6',
      title: '기도제목',
      description: '함께 기도해요',
      thumbnailUrl: '/logo.png',
      publishedAt: '2024-01-15T20:30:00Z',
      viewCount: '2만',
      duration: '0:25',
      channelTitle: '김포 구원의감격교회',
      isShorts: true
    }
  ];

  return {
    items: dummyShorts,
    totalResults: dummyShorts.length
  };
};

// 더미 데이터 생성 함수
const getDummyVideoData = (maxResults: number): YouTubeApiResponse => {
  const dummyVideos: YouTubeVideo[] = [
    {
      id: 'dummy1',
      title: '다시 복음으로, 다시 감격으로 - 주일예배',
      description: '김포 구원의감격교회 주일예배 실황입니다.',
      thumbnailUrl: '/logo.png',
      publishedAt: '2024-01-21T11:00:00Z',
      viewCount: '1.2만',
      duration: '45:30',
      channelTitle: '김포 구원의감격교회',
      isShorts: false
    },
    {
      id: 'dummy2',
      title: '감격이 식지 않는 믿음 - 찬양 메들리',
      description: '은혜로운 찬양 시간을 함께하세요.',
      thumbnailUrl: '/logo.png',
      publishedAt: '2024-01-14T11:00:00Z',
      viewCount: '856',
      duration: '12:45',
      channelTitle: '김포 구원의감격교회',
      isShorts: false
    },
    {
      id: 'dummy3',
      title: '새해 감사 간증 - 성도 간증',
      description: '하나님의 은혜를 간증하는 성도님의 이야기입니다.',
      thumbnailUrl: '/logo.png',
      publishedAt: '2024-01-07T19:30:00Z',
      viewCount: '634',
      duration: '8:20',
      channelTitle: '김포 구원의감격교회',
      isShorts: false
    },
    {
      id: 'dummy4',
      title: '말씀 묵상 - 로마서 강해',
      description: '로마서 말씀을 통한 깊이 있는 묵상 시간입니다.',
      thumbnailUrl: '/logo.png',
      publishedAt: '2024-01-03T20:00:00Z',
      viewCount: '445',
      duration: '25:15',
      channelTitle: '김포 구원의감격교회',
      isShorts: false
    }
  ].slice(0, maxResults);

  return {
    items: dummyVideos,
    totalResults: dummyVideos.length
  };
};

// 조회수 포맷팅 함수
const formatViewCount = (viewCount: string): string => {
  const count = parseInt(viewCount, 10);
  if (count >= 100000000) {
    return `${Math.floor(count / 100000000)}억`;
  } else if (count >= 10000) {
    return `${Math.floor(count / 10000)}만`;
  } else if (count >= 1000) {
    return `${Math.floor(count / 1000)}천`;
  }
  return count.toString();
};

// 영상 길이 포맷팅 함수 (ISO 8601 duration을 MM:SS 형식으로)
const formatDuration = (duration: string): string => {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return '0:00';
  
  const hours = parseInt(match[1]?.replace('H', '') || '0', 10);
  const minutes = parseInt(match[2]?.replace('M', '') || '0', 10);
  const seconds = parseInt(match[3]?.replace('S', '') || '0', 10);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};