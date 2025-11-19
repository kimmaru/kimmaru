import { Student, QuizOption } from '../types';

// 미리 정의된 이미지 경로
const IMAGE_BASE_PATH = 'https://shinil-elementary-name-matching.vercel.app/images';

// 이미지 파일 이름에서 학생 정보 추출
const extractStudentInfo = (imageName: string): Student | null => {
  // 이름_학년.png 형식으로 파일명 예상
  const match = imageName.match(/(.+)_([456])학년\.png$/);
  
  if (match) {
    const name = match[1];
    const grade = parseInt(match[2], 10);
    const id = `${name}-${grade}`;
    
    // 단순히 /images/ 경로 사용
    return {
      id,
      name,
      grade,
      imagePath: `${IMAGE_BASE_PATH}/${imageName}`
    };
  }
  
  return null;
};

// 이미지 파일 존재 여부 확인 함수 (개발 환경에서만 사용)
const checkImageExists = async (imagePath: string): Promise<boolean> => {
  try {
    // 절대 경로로 변환
    const fullPath = imagePath.includes('/') 
      ? imagePath // 이미 경로 포함
      : `${window.location.origin}/images/${imagePath}`; // 파일명만 있는 경우
      
    // 한글 이름 URL 인코딩 처리 (중요!)
    const encodedPath = encodeURI(fullPath);
    
    const response = await fetch(encodedPath, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.warn(`이미지 체크 오류: ${imagePath}`, error);
    return false;
  }
};

// 모든 학생 데이터 로드
export const loadAllStudents = async (): Promise<Student[]> => {
  try {
    // 미리 정의된 학생 데이터
    const students: Student[] = [
      // 4학년
      { id: '권지율-4', name: '권지율', grade: 4, imagePath: `/images/권지율_4학년.png` },
      { id: '김시율-4', name: '김시율', grade: 4, imagePath: `/images/김시율_4학년.png` },
      { id: '김유은-4', name: '김유은', grade: 4, imagePath: `/images/김유은_4학년.png` },
      { id: '김유한-4', name: '김유한', grade: 4, imagePath: `/images/김유한_4학년.png` },
      { id: '박민성-4', name: '박민성', grade: 4, imagePath: `/images/박민성_4학년.png` },
      { id: '박시우-4', name: '박시우', grade: 4, imagePath: `/images/박서우_4학년.png` },
      { id: '성예서-4', name: '성예서', grade: 4, imagePath: `/images/성예서_4학년.png` },
      { id: '송민후-4', name: '송민후', grade: 4, imagePath: `/images/송민후_4학년.png` },
      { id: '송해림-4', name: '송해림', grade: 4, imagePath: `/images/송해림_4학년.png` },
      { id: '유지성-4', name: '유지성', grade: 4, imagePath: `/images/유지성_4학년.png` },
      { id: '윤하민-4', name: '윤하민', grade: 4, imagePath: `/images/윤하민_4학년.png` },
      { id: '이래희-4', name: '이래희', grade: 4, imagePath: `/images/이래희_4학년.png` },
      { id: '이승재-4', name: '이승재', grade: 4, imagePath: `/images/이승재_4학년.png` },
      { id: '이예나-4', name: '이예나', grade: 4, imagePath: `/images/이예나_4학년.png` },
      { id: '이예찬-4', name: '이예찬', grade: 4, imagePath: `/images/이예찬_4학년.png` },
      { id: '정세은-4', name: '정세은', grade: 4, imagePath: `/images/정세은_4학년.png` },
      { id: '정호영-4', name: '정호영', grade: 4, imagePath: `/images/정호영_4학년.png` },
      { id: '최준혁-4', name: '최준혁', grade: 4, imagePath: `/images/최준혁_4학년.png` },
      { id: '홍태선-4', name: '홍태선', grade: 4, imagePath: `/images/홍태선_4학년.png` },
      
      // 5학년
      { id: '고주원-5', name: '고주원', grade: 5, imagePath: `/images/고주원_5학년.png` },
      { id: '권윤-5', name: '권윤', grade: 5, imagePath: `/images/권윤_5학년.png` },
      { id: '김다원-5', name: '김다원', grade: 5, imagePath: `/images/김다원_5학년.png` },
      { id: '김단아-5', name: '김단아', grade: 5, imagePath: `/images/김단아_5학년.png` },
      { id: '김사랑-5', name: '김사랑', grade: 5, imagePath: `/images/김사랑_5학년.png` },
      { id: '김소율-5', name: '김소율', grade: 5, imagePath: `/images/김소율_5학년.png` },
      { id: '김승혜-5', name: '김승혜', grade: 5, imagePath: `/images/김승혜_5학년.png` },
      { id: '김예준-5', name: '김예준', grade: 5, imagePath: `/images/김예준_5학년.png` },
      { id: '김주아-5', name: '김주아', grade: 5, imagePath: `/images/김주아_5학년.png` },
      { id: '박시온-5', name: '박시온', grade: 5, imagePath: `/images/박시온_5학년.png` },
      { id: '박주하-5', name: '박주하', grade: 5, imagePath: `/images/박주하_5학년.png` },
      { id: '송하영-5', name: '송하영', grade: 5, imagePath: `/images/송하영_5학년.png` },
      { id: '오현승-5', name: '오현승', grade: 5, imagePath: `/images/오현승_5학년.png` },
      { id: '윤민석-5', name: '윤민석', grade: 5, imagePath: `/images/윤민석_5학년.png` },
      { id: '이은채-5', name: '이은채', grade: 5, imagePath: `/images/이은채_5학년.png` },
      { id: '임하늘-5', name: '임하늘', grade: 5, imagePath: `/images/임하늘_5학년.png` },
      { id: '장온유-5', name: '장온유', grade: 5, imagePath: `/images/장온유_5학년.png` },
      { id: '정하윤-5', name: '정하윤', grade: 5, imagePath: `/images/정하윤_5학년.png` },
      { id: '홍윤우-5', name: '홍윤우', grade: 5, imagePath: `/images/홍윤우_5학년.png` },
      { id: '황하준-5', name: '황하준', grade: 5, imagePath: `/images/황하준_5학년.png` },
      
      // 6학년
      { id: '강래혁-6', name: '강래혁', grade: 6, imagePath: `/images/강래혁_6학년.png` },
      { id: '김다은-6', name: '김다은', grade: 6, imagePath: `/images/김다은_6학년.png` },
      { id: '김도희-6', name: '김도희', grade: 6, imagePath: `/images/김도희_6학년.png` },
      { id: '김지환-6', name: '김지환', grade: 6, imagePath: `/images/김지환_6학년.png` },
      { id: '문별-6', name: '문별', grade: 6, imagePath: `/images/문별_6학년.png` },
      { id: '박시연-6', name: '박시연', grade: 6, imagePath: `/images/박시연_6학년.png` },
      { id: '박예주-6', name: '박예주', grade: 6, imagePath: `/images/박예주_6학년.png` },
      { id: '박지윤-6', name: '박지윤', grade: 6, imagePath: `/images/박지윤_6학년.png` },
      { id: '백제후-6', name: '백제후', grade: 6, imagePath: `/images/백제후_6학년.png` },
      { id: '성하은-6', name: '성하은', grade: 6, imagePath: `/images/성하은_6학년.png` },
      { id: '오현빈-6', name: '오현빈', grade: 6, imagePath: `/images/오현빈_6학년.png` },
      { id: '유다엘-6', name: '유다엘', grade: 6, imagePath: `/images/유다엘_6학년.png` },
      { id: '이민서-6', name: '이민서', grade: 6, imagePath: `/images/이민서_6학년.png` },
      { id: '이정현-6', name: '이정현', grade: 6, imagePath: `/images/이정현_6학년.png` },
      { id: '이채원-6', name: '이채원', grade: 6, imagePath: `/images/이채원_6학년.png` },
      { id: '임봄-6', name: '임봄', grade: 6, imagePath: `/images/임봄_6학년.png` },
      { id: '장율-6', name: '장율', grade: 6, imagePath: `/images/장율_6학년.png` },
      { id: '장예하-6', name: '장예하', grade: 6, imagePath: `/images/장예하_6학년.png` },
      { id: '정다은-6', name: '정다은', grade: 6, imagePath: `/images/정다은_6학년.png` },
      { id: '지세민-6', name: '지세민', grade: 6, imagePath: `/images/지세민_6학년.png` },
      { id: '채예은-6', name: '채예은', grade: 6, imagePath: `/images/채예은_6학년.png` },
      { id: '홍예성-6', name: '홍예성', grade: 6, imagePath: `/images/홍예성_6학년.png` },
      { id: '윤하음-6', name: '윤하음', grade: 6, imagePath: `/images/윤하음_6학년.png` }
    ];
    
    console.log(`총 ${students.length}명의 학생 데이터를 로드했습니다.`);
    
    return students;
  } catch (error) {
    console.error('학생 데이터 로드 실패:', error);
    return [];
  }
};

// 학년별로 학생 필터링
export const filterStudentsByGrade = (students: Student[], grades: number[]): Student[] => {
  if (grades.length === 0) {
    return students; // 선택된 학년이 없으면 모든 학생 반환
  }
  
  return students.filter(student => grades.includes(student.grade));
};

// 랜덤으로 학생 배열 섞기
export const shuffleStudents = (students: Student[]): Student[] => {
  const shuffled = [...students];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// 퀴즈 옵션 생성 (정답 1개 + 오답 2개)
export const generateQuizOptions = (correctStudent: Student, allStudents: Student[]): QuizOption[] => {
  // 현재 학생을 제외한 모든 학생 목록
  const otherStudents = allStudents.filter(student => student.id !== correctStudent.id);
  
  // 랜덤하게 오답 2개 선택
  const shuffledOthers = shuffleStudents(otherStudents);
  const wrongOptions = shuffledOthers.slice(0, 2).map(student => ({
    id: student.id,
    name: student.name,
    correct: false
  }));
  
  // 정답 옵션 추가
  const correctOption = {
    id: correctStudent.id,
    name: correctStudent.name,
    correct: true
  };
  
  // 모든 옵션을 합치고 섞기
  const options = [...wrongOptions, correctOption];
  
  // 섞은 옵션 배열을 반환
  return shuffleStudents(options as unknown as Student[]) as unknown as QuizOption[];
}; 