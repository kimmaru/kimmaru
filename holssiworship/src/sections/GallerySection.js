import React from 'react';
import BackgroundWithOverlay from '../components/BackgroundWithOverlay';

const GallerySection = () => {
  const galleryItems = [
    { title: '워십 콘서트', date: '2024년 3월', text: 'Worship+Session', index: '0' },
    { title: '앨범 녹음', date: '2024년 2월', text: 'Recording', index: '1' },
    { title: '팀 연습', date: '매주 목요일', text: 'Rehearsal', index: '2' },
    { title: '팀 모임', date: '2024년 1월', text: 'Community', index: '3' },
    { title: '지역 아웃리치', date: '2023년 12월', text: 'Outreach', index: '0' },
    { title: '찬양 워크샵', date: '분기별 진행', text: 'Workshop', index: '1' }
  ];

  return (
    <BackgroundWithOverlay overlayOpacity={1.0}>
      <section id="gallery" className="py-20 md:py-32">
        <div className="container mx-auto px-4">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {galleryItems.map((item, index) => (
              <GalleryItem key={index} item={item} />
            ))}
          </div>
        </div>
      </section>
    </BackgroundWithOverlay>
  );
};

const GalleryItem = ({ item }) => {
  // 이미지 파일 이름을 index에 따라 순환
  const imageIndex = (parseInt(item.index) % 4) + 1;
  const imagePath = `/holssi-background-${imageIndex}.jpeg`;
  
  return (
    <div className="overflow-hidden rounded-lg shadow-md bg-dark-light border border-dark-lighter">
      <div className="overflow-hidden">
        <img
          src={imagePath}
          alt={item.title}
          className="w-full h-64 object-cover object-center transition duration-300 hover:scale-110"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white">{item.title}</h3>
        <p className="text-sm text-gray-400">{item.date}</p>
        <p className="text-primary text-xs mt-2">{item.text}</p>
      </div>
    </div>
  );
};

export default GallerySection;