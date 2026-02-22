export enum Difficulty {
  Beginner = '初级',
  Intermediate = '中级',
  Advanced = '高级',
}

export enum GrammarCategory {
  NonFiniteVerbs = '非谓语动词',
  RelativeClauses = '定语从句',
  AdverbialClauses = '状语从句',
  Conjunctions = '连词',
  AbsoluteConstructions = '独立主格',
  SubjunctiveMood = '虚拟语气',
}

export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Blank {
  id: string;
  options: Option[];
  correctAnswer: string;
  explanation: {
    rule: string;
    example: string;
    commonMistake: string;
  };
}

export interface Question {
  id: string;
  sentence: string; // Use [[0]], [[1]] for blanks
  blanks: Blank[];
  difficulty: Difficulty;
  category: GrammarCategory;
}

export interface UserAnswer {
  questionId: string;
  blankId: string;
  selectedOptionId: string;
}

export interface QuizResult {
  score: number;
  total: number;
  answers: UserAnswer[];
}
