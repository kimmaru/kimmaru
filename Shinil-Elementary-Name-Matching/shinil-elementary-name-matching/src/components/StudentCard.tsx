import React, { useState } from 'react';
import styled from 'styled-components';
import { Student } from '../types';

interface StudentCardProps {
  student: Student;
  showName?: boolean;
  isFlippable?: boolean;
  onClick?: () => void;
  isSelected?: boolean;
  cardSize?: 'small' | 'medium' | 'large';
}

interface CardProps {
  isFlipped: boolean;
  isFlippable?: boolean;
  isSelected?: boolean;
  cardSize?: 'small' | 'medium' | 'large';
}

// 카드 크기에 따른 너비/높이 설정
const getCardSize = (size: 'small' | 'medium' | 'large' = 'medium') => {
  switch (size) {
    case 'small':
      return {
        width: '160px',
        height: '200px',
        imgWidth: '140px',
        imgHeight: '140px',
        fontSize: '14px',
        gradeSize: '10px'
      };
    case 'large':
      return {
        width: '240px',
        height: '300px',
        imgWidth: '220px',
        imgHeight: '220px',
        fontSize: '20px',
        gradeSize: '14px'
      };
    case 'medium':
    default:
      return {
        width: '200px',
        height: '250px',
        imgWidth: '180px',
        imgHeight: '180px',
        fontSize: '16px',
        gradeSize: '12px'
      };
  }
};

const CardContainer = styled.div<CardProps>`
  position: relative;
  width: ${props => getCardSize(props.cardSize).width};
  height: ${props => getCardSize(props.cardSize).height};
  perspective: 1000px;
  margin: 8px;
  cursor: ${({ isFlippable }) => (isFlippable ? 'pointer' : 'default')};
  
  .card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.6s, box-shadow 0.3s;
    transform-style: preserve-3d;
    transform: ${({ isFlipped }) => (isFlipped ? 'rotateY(180deg)' : 'rotateY(0)')};
    border-radius: 12px;
    box-shadow: ${({ isSelected }) =>
      isSelected
        ? '0 0 0 3px #4a90e2, 0 8px 16px rgba(0, 0, 0, 0.2)'
        : '0 8px 16px rgba(0, 0, 0, 0.1)'};
        
    &:hover {
      box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15);
    }
  }
  
  .card-front,
  .card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 6px;
    box-sizing: border-box;
    overflow: hidden;
  }
  
  .card-front {
    background: linear-gradient(to bottom, #ffffff, #f8f9fa);
  }
  
  .card-back {
    transform: rotateY(180deg);
    background: linear-gradient(to bottom, #f0f8ff, #e6f2ff);
    border: 1px solid #e0e0e0;
  }
`;

const ImageContainer = styled.div<{ cardSize?: 'small' | 'medium' | 'large' }>`
  position: relative;
  width: ${props => getCardSize(props.cardSize).imgWidth};
  height: ${props => getCardSize(props.cardSize).imgHeight};
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 8px;
`;

const StudentImage = styled.img<{ cardSize?: 'small' | 'medium' | 'large' }>`
  width: ${props => getCardSize(props.cardSize).imgWidth};
  height: ${props => getCardSize(props.cardSize).imgHeight};
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  
  &:hover {
    transform: scale(1.02);
  }
`;

// 학년별로 다른 배경색 사용
const getGradeBadgeColor = (grade: number) => {
  switch (grade) {
    case 4:
      return 'rgba(255, 152, 0, 0.8)'; // 주황색
    case 5:
      return 'rgba(76, 175, 80, 0.8)'; // 녹색
    case 6:
      return 'rgba(33, 150, 243, 0.8)'; // 파란색
    default:
      return 'rgba(0, 0, 0, 0.5)'; // 기본 회색
  }
};

const GradeBadge = styled.div<{ grade: number, cardSize?: 'small' | 'medium' | 'large' }>`
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: ${props => getGradeBadgeColor(props.grade)};
  color: white;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: ${props => getCardSize(props.cardSize).gradeSize};
  font-weight: bold;
  opacity: 0.9;
  z-index: 2;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const StudentName = styled.h3<{ cardSize?: 'small' | 'medium' | 'large' }>`
  margin-top: 6px;
  margin-bottom: 2px;
  font-size: ${props => getCardSize(props.cardSize).fontSize};
  color: #333;
  font-weight: 600;
`;

const StudentGrade = styled.p<{ cardSize?: 'small' | 'medium' | 'large' }>`
  margin: 0;
  font-size: ${props => parseInt(getCardSize(props.cardSize).fontSize, 10) - 2}px;
  color: #666;
  background-color: #f0f0f0;
  padding: 2px 6px;
  border-radius: 10px;
`;

const ImageErrorPlaceholder = styled.div<{ cardSize?: 'small' | 'medium' | 'large' }>`
  width: ${props => getCardSize(props.cardSize).imgWidth};
  height: ${props => getCardSize(props.cardSize).imgHeight};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  border-radius: 8px;
  font-size: ${props => parseInt(getCardSize(props.cardSize).fontSize, 10) - 2}px;
  color: #666;
  text-align: center;
  padding: 10px;
`;

const StudentInitial = styled.div<{ cardSize?: 'small' | 'medium' | 'large' }>`
  width: ${props => parseInt(getCardSize(props.cardSize).imgWidth, 10) / 2.5}px;
  height: ${props => parseInt(getCardSize(props.cardSize).imgWidth, 10) / 2.5}px;
  border-radius: 50%;
  background-color: #4a90e2;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => parseInt(getCardSize(props.cardSize).fontSize, 10) + 10}px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const ErrorText = styled.p`
  margin: 0;
  font-size: 12px;
`;

const StudentCard: React.FC<StudentCardProps> = ({
  student,
  showName = true,
  isFlippable = false,
  onClick,
  isSelected = false,
  cardSize = 'medium'
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const handleClick = () => {
    if (isFlippable) {
      setIsFlipped(!isFlipped);
    }
    
    if (onClick) {
      onClick();
    }
  };
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error(`이미지 로드 실패: ${student.name}, 경로: ${student.imagePath}`);
    setImageError(true);
  };
  
  const getInitial = (name: string): string => {
    return name.charAt(0);
  };
  
  // 이미지 URL 인코딩
  const encodedImageUrl = encodeURI(student.imagePath);

  return (
    <CardContainer
      isFlipped={isFlipped}
      isFlippable={isFlippable}
      isSelected={isSelected}
      onClick={handleClick}
      cardSize={cardSize}
    >
      <div className="card-inner">
        <div className="card-front">
          {imageError ? (
            <ImageErrorPlaceholder cardSize={cardSize}>
              <StudentInitial cardSize={cardSize}>{getInitial(student.name)}</StudentInitial>
              <ErrorText>
                이미지를 찾을 수 없음<br/>
                {student.name}
              </ErrorText>
            </ImageErrorPlaceholder>
          ) : (
            <ImageContainer cardSize={cardSize}>
              <StudentImage 
                src={encodedImageUrl}
                alt={student.name} 
                onError={handleImageError}
                loading="eager"
                cardSize={cardSize}
              />
              <GradeBadge grade={student.grade} cardSize={cardSize}>
                {student.grade}학년
              </GradeBadge>
            </ImageContainer>
          )}
          {showName && (
            <>
              <StudentName cardSize={cardSize}>{student.name}</StudentName>
            </>
          )}
        </div>
        <div className="card-back">
          <StudentName cardSize={cardSize}>{student.name}</StudentName>
          <StudentGrade cardSize={cardSize}>{student.grade}학년</StudentGrade>
        </div>
      </div>
    </CardContainer>
  );
};

export default StudentCard; 