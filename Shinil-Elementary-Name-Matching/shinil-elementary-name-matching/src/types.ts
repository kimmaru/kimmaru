export interface Student {
  id: string;
  name: string;
  grade: number; // 4, 5, 6
  imagePath: string;
}

export interface QuizOption {
  id: string;
  name: string;
  correct: boolean;
}

export interface QuizResult {
  student: Student;
  correct: boolean;
  answer?: string;
} 