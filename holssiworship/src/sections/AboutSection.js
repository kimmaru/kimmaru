import React from 'react';
import BackgroundWithOverlay from '../components/BackgroundWithOverlay';

const AboutSection = () => {
  const teamMembers = [
    { 
      name: '장휘린', 
      role: 'Worship Leader', 
      quote: '"햇살보다 밝게 빛나는 분을 노래합니다"', 
      letter: 'H',
      image: '/team/jangwhirin.jpeg',
      instagram: 'https://www.instagram.com/hwirinpitl/'
    },
    { 
      name: '조건호', 
      role: 'Worship Leader', 
      quote: '""', 
      letter: 'O',
      image: '/team/jokeonho.jpeg',
      instagram: 'https://www.instagram.com/whrjsgh_/'
    },
    { 
      name: '허대현', 
      role: 'Vocal', 
      quote: '""', 
      letter: 'L',
      image: '/team/heodaehyeon.jpeg',
      instagram: 'https://www.instagram.com/heodaehyun_/'
    },
    { 
      name: '박영진', 
      role: 'Keyboard', 
      quote: '""', 
      letter: 'S',
      gridSpan: 'md:col-span-1',
      image: '/team/parkyoungjin.jpeg',
      instagram: 'https://www.instagram.com/ynjn_00/'
    },
    { 
      name: '이주영', 
      role: 'Bass', 
      quote: '""', 
      letter: 'I',
      image: '/team/leejuyoung.jpeg',
      instagram: 'https://www.instagram.com/l._._.ju/'
    },
    { 
      name: '신민석', 
      role: 'Drum', 
      quote: '""', 
      letter: 'W',
      image: '/team/shinminseok.jpeg',
      instagram: 'https://www.instagram.com/mingseoku_0/'
    }
  ];

  return (
    <BackgroundWithOverlay overlayOpacity={1.0}>
      <section id="about" className="py-20 md:py-32">
        <div className="container mx-auto px-4">


          {/* 메인 소개 섹션 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="order-2 lg:order-1">
              <h3 className="text-2xl md:text-3xl font-semibold text-white mb-6">홀씨워십 (Holssi Worship)</h3>
              <p className="text-xl md:text-2xl text-yellow-400 font-semibold mb-6">
                "우리는 예수님 홀씨!"
              </p>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                홀씨워십은 예수 그리스도를 퍼뜨립니다.<br />
                바람을 타고 날아가 널리 퍼지는 민들레 홀씨처럼,<br />
                우리는 예수 그리스도의 홀씨 된 자들입니다.
              </p>
            </div>
            <div className="order-1 lg:order-2">
              <img
                src="/holssi-intro.jpeg"
                alt="홀씨워십 팀 소개"
                className="rounded-lg shadow-xl w-full h-auto object-cover"
              />
            </div>
          </div>
          
          {/* 팀원 소개 섹션 */}
          <div className="mt-8">
            <h3 className="text-2xl md:text-3xl font-semibold text-white mb-8 text-center">팀원 소개</h3>
            
            {/* 상단 3명 (Worship Leaders & Vocal) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
              {teamMembers.slice(0, 3).map((member, index) => (
                <TeamMemberCard key={index} member={member} />
              ))}
            </div>
            
            {/* 하단 3명 (Instrumentalists) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {teamMembers.slice(3, 6).map((member, index) => (
                <TeamMemberCard key={index + 3} member={member} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </BackgroundWithOverlay>
  );
};

const TeamMemberCard = ({ member }) => {
  const imageSource = member.image || `https://placehold.co/300x300/1b4cb6/FFFFFF?text=${member.letter}`;
  
  const handleCardClick = () => {
    if (member.instagram) {
      window.open(member.instagram, '_blank', 'noopener,noreferrer');
    }
  };
  
  return (
    <div 
      className="bg-dark-light rounded-xl p-3 md:p-4 shadow-xl text-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl backdrop-blur-sm border border-gray-800 cursor-pointer group"
      onClick={handleCardClick}
      role="button"
      tabIndex="0"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleCardClick();
        }
      }}
      aria-label={`${member.name}의 인스타그램으로 이동`}
    >
      {/* 이미지를 더 크게 하고 여백 최소화 */}
      <div className="relative mb-3">
        <img
          src={imageSource}
          alt={member.name}
          className="w-full aspect-square rounded-xl mx-auto border-3 border-primary object-cover shadow-lg group-hover:border-primary-light transition-colors duration-300"
        />
        {/* 호버 시 오버레이 효과 */}
        <div className="absolute inset-0 bg-primary bg-opacity-0 group-hover:bg-opacity-10 rounded-xl transition-all duration-300"></div>
        {/* 인스타그램 아이콘 */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-1.5">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </div>
        </div>
      </div>
      
      {/* 텍스트 정보 - 여백 최소화 */}
      <div className="space-y-1">
        <h4 className="text-white font-bold text-base md:text-lg group-hover:text-primary transition-colors duration-300">{member.name}</h4>
        <p className="text-primary font-medium text-sm md:text-base">{member.role}</p>
        {member.quote && member.quote !== '""' && (
          <p className="text-gray-400 text-xs md:text-sm italic leading-relaxed">{member.quote}</p>
        )}
      </div>
    </div>
  );
};

export default AboutSection;