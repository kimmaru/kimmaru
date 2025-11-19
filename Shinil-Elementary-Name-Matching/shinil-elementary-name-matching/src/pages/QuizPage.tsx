import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Student, QuizOption, QuizResult } from '../types';
import StudentCard from '../components/StudentCard';
import GradeFilter from '../components/GradeFilter';
import { loadAllStudents, filterStudentsByGrade, shuffleStudents, generateQuizOptions } from '../utils/data';
import GradeSelector from '../components/GradeSelector';

const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 30px;
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0,0,0,0.1);
`;

const QuizContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f9f9f9;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
`;

const QuestionText = styled.h2`
  margin-bottom: 20px;
  text-align: center;
  color: #333;
  font-weight: 600;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
  width: 100%;
  max-width: 400px;
`;

const OptionButton = styled.button<{ selected: boolean, correct?: boolean, incorrect?: boolean }>`
  padding: 12px 15px;
  border-radius: 8px;
  border: 2px solid ${props => {
    if (props.correct) return '#4caf50';
    if (props.incorrect) return '#f44336';
    if (props.selected) return '#4a90e2';
    return '#e0e0e0';
  }};
  background-color: ${props => {
    if (props.correct) return 'rgba(76, 175, 80, 0.1)';
    if (props.incorrect) return 'rgba(244, 67, 54, 0.1)';
    if (props.selected) return 'rgba(74, 144, 226, 0.1)';
    return 'white';
  }};
  color: #333;
  font-size: 16px;
  font-weight: ${props => props.selected ? 'bold' : 'normal'};
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  text-align: center;
  
  &:hover {
    background-color: ${props => {
      if (props.correct) return 'rgba(76, 175, 80, 0.2)';
      if (props.incorrect) return 'rgba(244, 67, 54, 0.2)';
      if (props.selected) return 'rgba(74, 144, 226, 0.2)';
      return '#f5f5f5';
    }};
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: default;
  }
`;

const ResultsContainer = styled.div`
  margin-top: 30px;
  text-align: center;
  width: 100%;
`;

const ResultsText = styled.p`
  font-size: 18px;
  margin-bottom: 10px;
  color: #333;
`;

const ResultsHeader = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
  font-weight: 600;
`;

const Button = styled.button`
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(74, 144, 226, 0.2);
  margin-top: 15px;
  
  &:hover {
    background-color: #3a80d2;
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(74, 144, 226, 0.3);
  }
`;

const StartButton = styled(Button)`
  margin-top: 30px;
  padding: 16px 32px;
  font-size: 18px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
  margin: 20px 0;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  background-color: #4a90e2;
  width: ${({ progress }) => `${progress}%`};
  transition: width 0.3s ease;
`;

const FeedbackContainer = styled.div`
  margin-top: 15px;
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const FeedbackText = styled.div<{ correct: boolean }>`
  font-size: 18px;
  font-weight: bold;
  color: ${props => props.correct ? '#4caf50' : '#f44336'};
  margin-top: 15px;
  text-align: center;
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #666;
`;

const NoStudentsText = styled.div`
  text-align: center;
  margin: 40px 0;
  font-size: 18px;
  color: #666;
`;

const InstructionText = styled.p`
  text-align: center;
  margin: 20px 0;
  color: #555;
  font-size: 17px;
  line-height: 1.6;
  background-color: #f0f8ff;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
`;

const ResultsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
`;

const IncorrectItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  width: 220px;
`;

const IncorrectName = styled.div`
  margin-top: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  text-align: center;
`;

const IncorrectGrade = styled.div`
  font-size: 14px;
  color: #666;
  margin-top: 4px;
`;

const CountText = styled.div`
  text-align: center;
  margin: 10px 0 20px;
  color: #666;
  font-weight: 600;
  font-size: 16px;
`;

const ScoreContainer = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin: 15px 0;
  color: #4a90e2;
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

const ResultContainer = styled.div`
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

const ProgressText = styled.div`
  font-size: 16px;
  color: #666;
  margin-bottom: 10px;
`;

interface WrongAnswer {
  student: Student;
  userAnswer: string;
}

const QuizPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [quizStudents, setQuizStudents] = useState<Student[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [quizOptions, setQuizOptions] = useState<QuizOption[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedGrades, setSelectedGrades] = useState<number[]>([4, 5, 6]);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);
  
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
    
    // 학년 변경 시 퀴즈 중단
    setIsQuizStarted(false);
    setIsQuizCompleted(false);
    resetQuiz();
  };
  
  // 퀴즈 시작
  const startQuiz = () => {
    if (filteredStudents.length === 0) return;
    
    const shuffled = shuffleStudents(filteredStudents);
    setQuizStudents(shuffled);
    
    if (shuffled.length > 0) {
      setQuizOptions(generateQuizOptions(shuffled[0], filteredStudents));
    }
    
    setIsQuizStarted(true);
  };
  
  // 퀴즈 초기화
  const resetQuiz = () => {
    setScore(0);
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setShowResult(false);
    setQuizStudents([]);
    setQuizOptions([]);
    setWrongAnswers([]);
  };
  
  // 옵션 선택 처리
  const handleOptionClick = (optionId: string) => {
    if (showResult) return;
    
    setSelectedOptionId(optionId);
    
    // 정답 확인
    const selectedOption = quizOptions.find(option => option.id === optionId);
    const isAnswerCorrect = selectedOption?.correct || false;
    
    setIsCorrect(isAnswerCorrect);
    
    if (isAnswerCorrect) {
      setScore(prevScore => prevScore + 1);
    } else {
      // 틀린 답안 기록
      const currentStudent = quizStudents[currentIndex];
      if (currentStudent && selectedOption) {
        setWrongAnswers(prev => [...prev, {
          student: currentStudent,
          userAnswer: selectedOption.name
        }]);
      }
    }
    
    setShowResult(true);
    
    // 자동으로 다음 문제로 넘어가기
    setTimeout(() => {
      handleNextQuestion();
    }, 1000);
  };
  
  // 다음 문제로 이동
  const handleNextQuestion = () => {
    if (currentIndex < quizStudents.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setQuizOptions(generateQuizOptions(quizStudents[nextIndex], filteredStudents));
      setSelectedOptionId(null);
      setShowResult(false);
    } else {
      // 모든 문제 완료
      setIsQuizCompleted(true);
    }
  };
  
  // 퀴즈 재시작
  const restartQuiz = () => {
    setIsQuizCompleted(false);
    setIsQuizStarted(false);
    resetQuiz();
  };
  
  if (loading) {
    return <PageContainer>데이터를 불러오는 중...</PageContainer>;
  }
  
  const currentStudent = quizStudents[currentIndex] || null;
  
  return (
    <PageContainer>
      <GradeFilter 
        selectedGrades={selectedGrades} 
        onGradeChange={handleGradeChange}
        disabled={isQuizStarted || isQuizCompleted}
      />
      
      <CountText>
        선택된 학년: {filteredStudents.length}명의 학생
      </CountText>
      
      {isQuizCompleted ? (
        <ResultContainer>
          <FinalScore>
            최종 점수: {score}/{quizStudents.length}
          </FinalScore>
          <StartDescription>
            정답률: {quizStudents.length > 0 ? Math.round((score / quizStudents.length) * 100) : 0}%
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
          
          <RestartButton onClick={restartQuiz}>
            다시 퀴즈하기
          </RestartButton>
        </ResultContainer>
      ) : !isQuizStarted ? (
        <StartContainer>
          <StartTitle>퀴즈 시작</StartTitle>
          <StartDescription>
            선택한 학년의 학생들로 퀴즈를 시작합니다.<br/>
            사진을 보고 올바른 이름을 선택하세요.
          </StartDescription>
          {filteredStudents.length === 0 ? (
            <NoStudentsText>학년을 선택해주세요.</NoStudentsText>
          ) : (
            <StartButton onClick={startQuiz}>
              퀴즈 시작 ({filteredStudents.length}명)
            </StartButton>
          )}
        </StartContainer>
      ) : currentStudent ? (
        <>
          <ProgressText>
            문제 {currentIndex + 1}/{quizStudents.length}
          </ProgressText>
          
          <ScoreContainer>
            점수: {score}/{filteredStudents.length}
          </ScoreContainer>
          
          <QuizContainer>
            <QuestionText>
              다음 학생의 이름은 무엇인가요?
            </QuestionText>
            <StudentCard 
              student={currentStudent} 
              showName={false}
            />
            
            <OptionsContainer>
              {quizOptions.map(option => {
                const isSelected = selectedOptionId === option.id;
                const showCorrect = showResult && option.correct;
                const showIncorrect = showResult && isSelected && !option.correct;
                
                return (
                  <OptionButton
                    key={option.id}
                    selected={isSelected}
                    correct={showCorrect}
                    incorrect={showIncorrect}
                    onClick={() => handleOptionClick(option.id)}
                    disabled={showResult}
                  >
                    {option.name}
                  </OptionButton>
                );
              })}
            </OptionsContainer>
            
            {showResult && (
              <FeedbackText correct={isCorrect}>
                {isCorrect ? '정답입니다!' : '틀렸습니다.'}
              </FeedbackText>
            )}
          </QuizContainer>
        </>
      ) : (
        <NoStudentsText>퀴즈를 시작할 수 없습니다.</NoStudentsText>
      )}
    </PageContainer>
  );
};

export default QuizPage; 