import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { Student } from '../types';
import StudentCard from '../components/StudentCard';
import GradeFilter from '../components/GradeFilter';
import { loadAllStudents, filterStudentsByGrade, shuffleStudents } from '../utils/data';

const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const ExamContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f9f9f9;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
`;

const QuestionText = styled.div`
  font-size: 18px;
  margin-bottom: 20px;
  text-align: center;
`;

const AnswerInput = styled.input`
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  width: 300px;
  max-width: 100%;
  text-align: center;
  margin: 20px 0;
  
  &:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
  }
  
  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;

const SubmitButton = styled.button`
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 100px;
  
  &:hover {
    background-color: #3a80d2;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(74, 144, 226, 0.3);
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const SkipButton = styled.button`
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 100px;
  
  &:hover {
    background-color: #5a6268;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(108, 117, 125, 0.3);
  }
`;

const ScoreText = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin: 15px 0;
  color: #4a90e2;
  text-align: center;
`;

const NoStudentsText = styled.div`
  text-align: center;
  margin: 40px 0;
  font-size: 18px;
  color: #666;
`;

const CountText = styled.div`
  text-align: center;
  margin: 10px 0 20px;
  color: #666;
  font-weight: 600;
  font-size: 16px;
`;

const StartButton = styled.button`
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 16px 32px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;
  
  &:hover {
    background-color: #3a80d2;
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(74, 144, 226, 0.3);
  }
`;

const StartContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f9f9f9;
  border-radius: 15px;
  padding: 40px 20px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const StartTitle = styled.h2`
  color: #333;
  margin-bottom: 20px;
  font-size: 24px;
`;

const StartDescription = styled.p`
  color: #666;
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 20px;
`;

const ProgressText = styled.div`
  font-size: 16px;
  color: #666;
  margin-bottom: 10px;
`;

const FinalResultContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f9f9f9;
  border-radius: 15px;
  padding: 40px 20px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const FinalScore = styled.h2`
  color: #4a90e2;
  margin-bottom: 30px;
  font-size: 28px;
`;

const RestartButton = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 20px;
  
  &:hover {
    background-color: #218838;
  }
`;

const WrongAnswersSection = styled.div`
  width: 100%;
  margin-top: 30px;
`;

const WrongAnswersTitle = styled.h3`
  color: #f44336;
  margin-bottom: 20px;
  font-size: 20px;
`;

const WrongAnswersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  justify-items: center;
`;

const WrongAnswerItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const WrongAnswerName = styled.div`
  margin-top: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  text-align: center;
`;

interface WrongAnswer {
  student: Student;
  userAnswer: string;
}

type ExamParams = {
  mode: string;
};

const ExamPage: React.FC = () => {
  const { mode } = useParams<ExamParams>();
  const navigate = useNavigate();
  
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [examStudents, setExamStudents] = useState<Student[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedGrades, setSelectedGrades] = useState<number[]>([4, 5, 6]);
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [isExamCompleted, setIsExamCompleted] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);
  
  // 모드 확인 (이름 → 사진, 사진 → 이름)
  const isNameToPhoto = mode === 'name-to-photo';
  
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const allStudents = await loadAllStudents();
        setStudents(allStudents);
        const filtered = filterStudentsByGrade(allStudents, selectedGrades);
        setFilteredStudents(filtered);
      } catch (error) {
        console.error('학생 데이터 로드 중 오류 발생:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudents();
  }, []);
  
  // 학년 선택 변경 시
  const handleGradeChange = (grades: number[]) => {
    setSelectedGrades(grades);
    const filtered = filterStudentsByGrade(students, grades);
    setFilteredStudents(filtered);
    
    // 학년 변경 시 시험 중단
    setIsExamStarted(false);
    setIsExamCompleted(false);
    resetExam();
  };
  
  // 시험 시작
  const startExam = () => {
    if (filteredStudents.length === 0) return;
    
    const shuffled = shuffleStudents(filteredStudents);
    setExamStudents(shuffled);
    setIsExamStarted(true);
  };
  
  // 시험 초기화
  const resetExam = () => {
    setScore(0);
    setCurrentIndex(0);
    setUserAnswer('');
    setExamStudents([]);
    setWrongAnswers([]);
  };
  
  // 답안 제출 처리
  const handleSubmit = () => {
    if (!userAnswer.trim()) return;
    
    const currentStudent = examStudents[currentIndex];
    if (!currentStudent) return;
    
    // 정답 확인 (공백 제거하고 비교)
    const trimmedAnswer = userAnswer.trim().replace(/\s+/g, '');
    const correctAnswer = currentStudent.name.replace(/\s+/g, '');
    
    const isAnswerCorrect = trimmedAnswer === correctAnswer;
    
    if (isAnswerCorrect) {
      setScore(prevScore => prevScore + 1);
    } else {
      // 틀린 답안 기록
      setWrongAnswers(prev => [...prev, {
        student: currentStudent,
        userAnswer: userAnswer.trim()
      }]);
    }
    
    // 바로 다음 문제로 이동
    handleNextQuestion();
  };
  
  // 건너뛰기 처리
  const handleSkip = () => {
    const currentStudent = examStudents[currentIndex];
    if (currentStudent) {
      // 건너뛴 답안을 틀린 답안으로 기록 (빈 답안으로)
      setWrongAnswers(prev => [...prev, {
        student: currentStudent,
        userAnswer: ''
      }]);
    }
    
    // 다음 문제로 이동
    handleNextQuestion();
  };
  
  // 다음 문제로 이동
  const handleNextQuestion = () => {
    if (currentIndex < examStudents.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setUserAnswer('');
    } else {
      // 모든 문제 완료
      setIsExamCompleted(true);
    }
  };
  
  // Enter 키 처리
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && userAnswer.trim()) {
      handleSubmit();
    }
  };
  
  // 시험 재시작
  const restartExam = () => {
    setIsExamCompleted(false);
    setIsExamStarted(false);
    resetExam();
  };
  
  if (loading) {
    return <PageContainer>데이터를 불러오는 중...</PageContainer>;
  }
  
  const currentStudent = examStudents[currentIndex] || null;
  
  return (
    <PageContainer>
      <GradeFilter 
        selectedGrades={selectedGrades} 
        onGradeChange={handleGradeChange}
        disabled={isExamStarted || isExamCompleted}
      />
      
      <CountText>
        선택된 학년: {filteredStudents.length}명의 학생
      </CountText>
      
      {isExamCompleted ? (
        <FinalResultContainer>
          <FinalScore>
            최종 점수: {score}/{examStudents.length}
          </FinalScore>
          <StartDescription>
            정답률: {examStudents.length > 0 ? Math.round((score / examStudents.length) * 100) : 0}%
          </StartDescription>
          
          {wrongAnswers.length > 0 && (
            <WrongAnswersSection>
              <WrongAnswersTitle>틀린 문제</WrongAnswersTitle>
              <WrongAnswersGrid>
                {wrongAnswers.map((wrongAnswer, index) => (
                  <WrongAnswerItem key={index}>
                    <StudentCard 
                      student={wrongAnswer.student} 
                      showName={true}
                      cardSize="small"
                    />
                  </WrongAnswerItem>
                ))}
              </WrongAnswersGrid>
            </WrongAnswersSection>
          )}
          
          <RestartButton onClick={restartExam}>
            다시 시험보기
          </RestartButton>
        </FinalResultContainer>
      ) : !isExamStarted ? (
        <StartContainer>
          <StartTitle>시험 시작</StartTitle>
          <StartDescription>
            선택한 학년의 학생들로 시험을 시작합니다.<br/>
            사진을 보고 학생의 이름을 직접 입력하세요.
          </StartDescription>
          {filteredStudents.length === 0 ? (
            <NoStudentsText>학년을 선택해주세요.</NoStudentsText>
          ) : (
            <StartButton onClick={startExam}>
              시험 시작 ({filteredStudents.length}명)
            </StartButton>
          )}
        </StartContainer>
      ) : currentStudent ? (
        <>
          <ProgressText>
            문제 {currentIndex + 1}/{examStudents.length}
          </ProgressText>
          
          <ExamContainer>
            <QuestionText>
              다음 학생의 이름을 입력하세요:
            </QuestionText>
            
            <StudentCard 
              student={currentStudent} 
              showName={false}
            />
            
            <AnswerInput
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="이름을 입력하세요"
              autoFocus
            />
            
            <ButtonContainer>
              <SubmitButton 
                onClick={handleSubmit}
                disabled={!userAnswer.trim()}
              >
                제출
              </SubmitButton>
              <SkipButton onClick={handleSkip}>
                건너뛰기
              </SkipButton>
            </ButtonContainer>
          </ExamContainer>
        </>
      ) : (
        <NoStudentsText>시험을 시작할 수 없습니다.</NoStudentsText>
      )}
    </PageContainer>
  );
};

export default ExamPage; 