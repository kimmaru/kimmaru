import React from 'react';
import styled from 'styled-components';

interface GradeSelectorProps {
  selectedGrades: number[];
  onChange: (grades: number[]) => void;
}

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 15px;
  }
`;

const Label = styled.span`
  font-weight: bold;
  font-size: 16px;
`;

const GradeButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  
  @media (max-width: 480px) {
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const GradeButton = styled.button<{ selected: boolean }>`
  padding: 8px 16px;
  border-radius: 20px;
  border: none;
  background-color: ${props => props.selected ? '#4a90e2' : '#f0f0f0'};
  color: ${props => props.selected ? 'white' : '#333'};
  cursor: pointer;
  font-weight: ${props => props.selected ? 'bold' : 'normal'};
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.selected ? '#2a7ad2' : '#e0e0e0'};
  }
`;

const GradeSelector: React.FC<GradeSelectorProps> = ({ selectedGrades, onChange }) => {
  // 학년 토글 함수
  const toggleGrade = (grade: number) => {
    if (selectedGrades.includes(grade)) {
      onChange(selectedGrades.filter(g => g !== grade));
    } else {
      onChange([...selectedGrades, grade]);
    }
  };
  
  // 모든 학년 선택/해제
  const toggleAll = () => {
    if (selectedGrades.length === 3) {  // 모든 학년이 이미 선택됨
      onChange([]);
    } else {
      onChange([4, 5, 6]);
    }
  };
  
  return (
    <Container>
      <Label>학년 선택:</Label>
      <GradeButtonGroup>
        <GradeButton 
          selected={selectedGrades.length === 3 || selectedGrades.length === 0} 
          onClick={toggleAll}
        >
          전체
        </GradeButton>
        <GradeButton 
          selected={selectedGrades.includes(4)} 
          onClick={() => toggleGrade(4)}
        >
          4학년
        </GradeButton>
        <GradeButton 
          selected={selectedGrades.includes(5)} 
          onClick={() => toggleGrade(5)}
        >
          5학년
        </GradeButton>
        <GradeButton 
          selected={selectedGrades.includes(6)} 
          onClick={() => toggleGrade(6)}
        >
          6학년
        </GradeButton>
      </GradeButtonGroup>
    </Container>
  );
};

export default GradeSelector; 