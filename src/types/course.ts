export interface Grade {
  id: string;
  examName: string;
  score: number;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  grades: Grade[];
  finalGrade: number;
}

export interface Course {
  id: string;
  name: string;
  students: Student[];
  exams: string[];
}