import React from 'react';
import { useNavigate } from 'react-router-dom';
import BackgroundWithOverlay from '../components/BackgroundWithOverlay';

const MinistriesSection = () => {
  const navigate = useNavigate();
  
  const ministries = [
    {
      title: '월간 정기 예배',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-12 h-12">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
        </svg>
      ),
      description: '월간 정기 예배를 통해 하나님과의 교제를 깊게 하고, 공동체와 함께 은혜를 나누는 시간을 갖습니다.',
      list: [
        '시간: 매월 셋째 주 금요일 오후 7:30',
        '장소: 믿음교회 본당',
        '특징: 찬양, 말씀, 중보기도, 간증'
      ],
      link: '참여 문의하기',
      path: '/contact'
    },
    {
      title: '특별 집회',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-12 h-12">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
        </svg>
      ),
      description: '특별한 주제와 메시지를 담은 집회를 통해 새로운 은혜를 경험하고, 영적으로 성장하는 시간을 제공합니다.',
      list: [
        '주제: "깊은 은혜, 넓은 사랑"',
        '강사: 김믿음 목사',
        '프로그램: 찬양, 말씀, 치유기도회'
      ],
      link: '일정 확인하기',
      path: '/contact'
    },
    {
      title: '문화 사역',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-12 h-12">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
        </svg>
      ),
      description: '음악, 영상, 디자인 등 다양한 문화 콘텐츠를 통해 복음을 전하고 사람들과 소통합니다. 하나님의 아름다움을 예술로 표현합니다.',
      list: [
        '콘서트: "찬양의 밤" (분기별)',
        '영상: 월간 예배 프로모션 영상',
        '음반: "Here and There" 앨범 제작'
      ],
      link: '갤러리 보기',
      path: '/gallery'
    }
  ];

  return (
    <BackgroundWithOverlay overlayOpacity={1.0}>
      <section id="ministries" className="py-20 md:py-32">
        <div className="container mx-auto px-4">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ministries.map((ministry, index) => (
              <MinistryCard 
                key={index} 
                ministry={ministry} 
                navigate={navigate} 
              />
            ))}
          </div>
        </div>
      </section>
    </BackgroundWithOverlay>
  );
};

const MinistryCard = ({ ministry, navigate }) => {
  return (
    <div className="bg-dark-light rounded-lg shadow-md p-6 transform transition duration-300 hover:translate-y-[-5px] border-t-4 border-primary">
      <div className="mb-4 text-primary">
        {ministry.icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-4">{ministry.title}</h3>
      <p className="text-gray-400 mb-4">
        {ministry.description}
      </p>
      <ul className="list-disc list-inside text-gray-400 mb-4">
        {ministry.list.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
      <button
        onClick={() => navigate(ministry.path)}
        className="text-primary hover:text-primary-light font-medium inline-flex items-center"
      >
        {ministry.link}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 ml-1">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </button>
    </div>
  );
};

export default MinistriesSection;