import React from 'react';
import styled from 'styled-components';

interface GradeFilterProps {
  selectedGrades: number[];
  onGradeChange: (grades: number[]) => void;
  disabled?: boolean;
}

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const Label = styled.div`
  font-weight: bold;
  margin-bottom: 15px;
  font-size: 18px;
  color: #333;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 15px;
  
  @media (max-width: 480px) {
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
  }
`;

const GradeButton = styled.button<{ selected: boolean; disabled?: boolean }>`
  background-color: ${({ selected, disabled }) => {
    if (disabled) return '#cccccc';
    return selected ? '#4a90e2' : '#f0f0f0';
  }};
  color: ${({ selected, disabled }) => {
    if (disabled) return '#666666';
    return selected ? 'white' : '#333';
  }};
  border: none;
  padding: 12px 20px;
  border-radius: 25px;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  font-weight: ${({ selected }) => (selected ? 'bold' : 'normal')};
  font-size: 16px;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  
  &:hover {
    background-color: ${({ selected, disabled }) => {
      if (disabled) return '#cccccc';
      return selected ? '#2a7ad2' : '#e0e0e0';
    }};
    transform: ${({ disabled }) => disabled ? 'none' : 'translateY(-1px)'};
    box-shadow: ${({ disabled }) => disabled ? '0 2px 4px rgba(0,0,0,0.1)' : '0 3px 6px rgba(0,0,0,0.15)'};
  }
  
  @media (max-width: 480px) {
    padding: 10px 16px;
    font-size: 14px;
  }
`;

const GradeFilter: React.FC<GradeFilterProps> = ({ selectedGrades, onGradeChange, disabled = false }) => {
  // 학년 토글 함수
  const toggleGrade = (grade: number) => {
    if (disabled) return;
    if (selectedGrades.includes(grade)) {
      onGradeChange(selectedGrades.filter(g => g !== grade));
    } else {
      onGradeChange([...selectedGrades, grade]);
    }
  };
  
  // 모든 학년 선택/해제
  const toggleAll = () => {
    if (disabled) return;
    if (selectedGrades.length === 3) { // 모든 학년이 이미 선택됨
      onGradeChange([]);
    } else {
      onGradeChange([4, 5, 6]);
    }
  };
  
  return (
    <FilterContainer>
      <Label>학년 선택</Label>
      <ButtonContainer>
        <GradeButton 
          selected={selectedGrades.length === 3 || selectedGrades.length === 0} 
          disabled={disabled}
          onClick={toggleAll}
        >
          전체
        </GradeButton>
        <GradeButton 
          selected={selectedGrades.includes(4)} 
          disabled={disabled}
          onClick={() => toggleGrade(4)}
        >
          4학년
        </GradeButton>
        <GradeButton 
          selected={selectedGrades.includes(5)} 
          disabled={disabled}
          onClick={() => toggleGrade(5)}
        >
          5학년
        </GradeButton>
        <GradeButton 
          selected={selectedGrades.includes(6)} 
          disabled={disabled}
          onClick={() => toggleGrade(6)}
        >
          6학년
        </GradeButton>
      </ButtonContainer>
    </FilterContainer>
  );
};

export default GradeFilter; 