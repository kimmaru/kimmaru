import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Student } from '../types';
import StudentCard from '../components/StudentCard';
import GradeFilter from '../components/GradeFilter';
import { loadAllStudents, filterStudentsByGrade } from '../utils/data';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const CenterContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const Controls = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const StudentsGrid = styled.div<{ cardSize: 'small' | 'large' }>`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(
    ${props => props.cardSize === 'small' ? '170px' : '250px'}, 1fr));
  gap: 10px;
  justify-items: center;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(
      ${props => props.cardSize === 'small' ? '150px' : '100%'}, 1fr));
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(
      ${props => props.cardSize === 'small' ? '130px' : '100%'}, 1fr));
  }
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 60px;
  font-size: 18px;
  color: #666;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
`;

const NoStudentsText = styled.div`
  text-align: center;
  padding: 60px;
  font-size: 18px;
  color: #666;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
`;

const StatsText = styled.div`
  text-align: center;
  margin-bottom: 30px;
  color: #666;
  font-size: 17px;
  padding: 15px;
  background-color: #f0f8ff;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
`;

const StatsHighlight = styled.span`
  color: #4a90e2;
  font-weight: 600;
  font-size: 18px;
  margin: 0 4px;
`;

const SizeToggleButton = styled.button<{ isLarge: boolean }>`
  background: none;
  border: 2px solid #4a90e2;
  color: #4a90e2;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: #4a90e2;
    color: white;
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const ListPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [selectedGrades, setSelectedGrades] = useState<number[]>([4, 5, 6]);
  const [loading, setLoading] = useState<boolean>(true);
  const [cardSize, setCardSize] = useState<'small' | 'large'>('small');
  
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      const allStudents = await loadAllStudents();
      setStudents(allStudents);
      setFilteredStudents(filterStudentsByGrade(allStudents, selectedGrades));
      setLoading(false);
    };
    
    fetchStudents();
  }, []);
  
  const handleGradeChange = (grades: number[]) => {
    setSelectedGrades(grades);
    setFilteredStudents(filterStudentsByGrade(students, grades));
  };
  
  const toggleCardSize = () => {
    setCardSize(prev => prev === 'small' ? 'large' : 'small');
  };
  
  const getGradeCounts = () => {
    const counts = { 4: 0, 5: 0, 6: 0 };
    
    students.forEach(student => {
      if (student.grade in counts) {
        counts[student.grade as keyof typeof counts]++;
      }
    });
    
    return counts;
  };
  
  const counts = getGradeCounts();
  
  // 격자 아이콘 SVG
  const GridIcon = ({ isLarge }: { isLarge: boolean }) => (
    <svg viewBox="0 0 24 24" fill="currentColor">
      {isLarge ? (
        // 2x2 격자 (큰 크기)
        <>
          <rect x="3" y="3" width="8" height="8" rx="2"/>
          <rect x="13" y="3" width="8" height="8" rx="2"/>
          <rect x="3" y="13" width="8" height="8" rx="2"/>
          <rect x="13" y="13" width="8" height="8" rx="2"/>
        </>
      ) : (
        // 3x3 격자 (작은 크기)
        <>
          <rect x="3" y="3" width="5" height="5" rx="1"/>
          <rect x="10" y="3" width="5" height="5" rx="1"/>
          <rect x="17" y="3" width="5" height="5" rx="1"/>
          <rect x="3" y="10" width="5" height="5" rx="1"/>
          <rect x="10" y="10" width="5" height="5" rx="1"/>
          <rect x="17" y="10" width="5" height="5" rx="1"/>
          <rect x="3" y="17" width="5" height="5" rx="1"/>
          <rect x="10" y="17" width="5" height="5" rx="1"/>
          <rect x="17" y="17" width="5" height="5" rx="1"/>
        </>
      )}
    </svg>
  );
  
  return (
    <PageContainer>
      <CenterContainer>
        <GradeFilter selectedGrades={selectedGrades} onGradeChange={handleGradeChange} />
      </CenterContainer>
      
      <StatsText>
        총 <StatsHighlight>{students.length}</StatsHighlight>명 
        (4학년: <StatsHighlight>{counts[4]}</StatsHighlight>명, 
        5학년: <StatsHighlight>{counts[5]}</StatsHighlight>명, 
        6학년: <StatsHighlight>{counts[6]}</StatsHighlight>명)
      </StatsText>
      
      <Controls>
        <SizeToggleButton isLarge={cardSize === 'large'} onClick={toggleCardSize}>
          <GridIcon isLarge={cardSize === 'large'} />
        </SizeToggleButton>
      </Controls>
      
      {loading ? (
        <LoadingText>학생 데이터를 불러오는 중...</LoadingText>
      ) : filteredStudents.length === 0 ? (
        <NoStudentsText>선택한 학년의 학생이 없습니다.</NoStudentsText>
      ) : (
        <StudentsGrid cardSize={cardSize}>
          {filteredStudents.map((student) => (
            <StudentCard 
              key={student.id} 
              student={student} 
              cardSize={cardSize === 'small' ? 'small' : 'large'}
            />
          ))}
        </StudentsGrid>
      )}
    </PageContainer>
  );
};

export default ListPage; 