import React from 'react';

const BackgroundWithOverlay = ({ children, overlayOpacity = 0.85 }) => {
  return (
    <div className="relative min-h-screen">
      {/* 모던 그라데이션 배경 */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              135deg,
              #0f0f0f 0%,
              #1a1a1a 25%,
              #2a2a3a 50%,
              #1e1e2e 75%,
              #121212 100%
            ),
            radial-gradient(
              ellipse at top right,
              rgba(27, 76, 182, 0.15) 0%,
              transparent 50%
            ),
            radial-gradient(
              ellipse at bottom left,
              rgba(27, 76, 182, 0.08) 0%,
              transparent 50%
            )
          `
        }}
      />

      {/* 미묘한 애니메이션 오버레이 */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            linear-gradient(
              45deg,
              transparent 30%,
              rgba(27, 76, 182, 0.03) 50%,
              transparent 70%
            )
          `,
          animation: 'subtle-float 20s ease-in-out infinite'
        }}
      />

      {/* 컨텐츠 레이어 */}
      <div className="relative z-10">
        {children}
      </div>

      {/* CSS 애니메이션 정의 */}
      <style jsx>{`
        @keyframes subtle-float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
        }
      `}</style>
    </div>
  );
};

export default BackgroundWithOverlay; 