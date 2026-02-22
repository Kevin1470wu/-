import { Question, Difficulty, GrammarCategory } from '../types';

export const QUESTIONS: Question[] = [
  {
    id: 'q1',
    sentence: '[[0]] tired, she still finished the report.',
    difficulty: Difficulty.Intermediate,
    category: GrammarCategory.NonFiniteVerbs,
    blanks: [
      {
        id: 'b0',
        correctAnswer: 'Feeling',
        options: [
          { id: 'o1', text: 'Feel', isCorrect: false },
          { id: 'o2', text: 'To feel', isCorrect: false },
          { id: 'o3', text: 'Feeling', isCorrect: true },
          { id: 'o4', text: 'Felt', isCorrect: false },
        ],
        explanation: {
          rule: '现在分词（doing）在句中作原因或时间状语，且主语是动作的发出者。',
          example: 'Feeling hungry, I went to the kitchen. (因为感到饿，我去了厨房。)',
          commonMistake: '当动作是主动且正在进行或持续状态时，误用动词原形 "Feel" 或过去分词 "Felt"。',
        },
      },
    ],
  },
  {
    id: 'q2',
    sentence: 'This is the school [[0]] I studied ten years ago.',
    difficulty: Difficulty.Beginner,
    category: GrammarCategory.RelativeClauses,
    blanks: [
      {
        id: 'b0',
        correctAnswer: 'where',
        options: [
          { id: 'o1', text: 'which', isCorrect: false },
          { id: 'o2', text: 'that', isCorrect: false },
          { id: 'o3', text: 'where', isCorrect: true },
          { id: 'o4', text: 'who', isCorrect: false },
        ],
        explanation: {
          rule: '"where" 是关系副词，引导定语从句并在从句中作地点状语。',
          example: 'The house where I was born is very old. (我出生的那座房子很旧了。)',
          commonMistake: '当先行词在从句中作状语时，误用关系代词 "which" 或 "that"（除非前面有介词，如 "in which"）。',
        },
      },
    ],
  },
  {
    id: 'q3',
    sentence: '[[0]] you study hard, you will not pass the exam.',
    difficulty: Difficulty.Beginner,
    category: GrammarCategory.Conjunctions,
    blanks: [
      {
        id: 'b0',
        correctAnswer: 'Unless',
        options: [
          { id: 'o1', text: 'If', isCorrect: false },
          { id: 'o2', text: 'Because', isCorrect: false },
          { id: 'o3', text: 'Unless', isCorrect: true },
          { id: 'o4', text: 'Since', isCorrect: false },
        ],
        explanation: {
          rule: '"Unless" 意为 "如果不" 或 "除非"，引导否定条件状语从句。',
          example: 'Unless it rains, we will go for a walk. (除非下雨，否则我们会去散步。)',
          commonMistake: '将 "Unless" 与 "If" 混淆，这会导致句意完全相反。',
        },
      },
    ],
  },
  {
    id: 'q4',
    sentence: 'The project [[0]] next month will be very important.',
    difficulty: Difficulty.Intermediate,
    category: GrammarCategory.NonFiniteVerbs,
    blanks: [
      {
        id: 'b0',
        correctAnswer: 'to be finished',
        options: [
          { id: 'o1', text: 'finishing', isCorrect: false },
          { id: 'o2', text: 'finished', isCorrect: false },
          { id: 'o3', text: 'to be finished', isCorrect: true },
          { id: 'o4', text: 'to finish', isCorrect: false },
        ],
        explanation: {
          rule: '动词不定式的被动语态（to be done）用于表示将来要被执行的动作。',
          example: 'The meeting to be held tomorrow is about the new budget. (明天要举行的会议是关于新预算的。)',
          commonMistake: '误用 "finishing"（主动）或 "finished"（已完成），而忽略了动作的将来性和被动性。',
        },
      },
    ],
  },
  {
    id: 'q5',
    sentence: 'With the work [[0]], he went home happily.',
    difficulty: Difficulty.Advanced,
    category: GrammarCategory.AbsoluteConstructions,
    blanks: [
      {
        id: 'b0',
        correctAnswer: 'finished',
        options: [
          { id: 'o1', text: 'finishing', isCorrect: false },
          { id: 'o2', text: 'finished', isCorrect: true },
          { id: 'o3', text: 'to finish', isCorrect: false },
          { id: 'o4', text: 'finish', isCorrect: false },
        ],
        explanation: {
          rule: '在 "with + 宾语 + 分词" 结构中，当宾语与分词之间是被动关系（动作已完成）时，使用过去分词。',
          example: 'With the lights turned off, the room was dark. (灯关了，房间里很黑。)',
          commonMistake: '当宾语是动作的承受者时，误用现在分词 "finishing"。',
        },
      },
    ],
  },
  {
    id: 'q6',
    sentence: 'I don\'t know [[0]] he will come or not.',
    difficulty: Difficulty.Beginner,
    category: GrammarCategory.AdverbialClauses,
    blanks: [
      {
        id: 'b0',
        correctAnswer: 'whether',
        options: [
          { id: 'o1', text: 'if', isCorrect: false },
          { id: 'o2', text: 'that', isCorrect: false },
          { id: 'o3', text: 'whether', isCorrect: true },
          { id: 'o4', text: 'what', isCorrect: false },
        ],
        explanation: {
          rule: '当从句中出现 "or not" 时，通常优先使用 "whether" 而非 "if"。',
          example: 'I am not sure whether it will rain or not. (我不确定是否会下雨。)',
          commonMistake: '在表示“是否”的语境中误用 "that"。',
        },
      },
    ],
  },
  {
    id: 'q7',
    sentence: 'The man [[0]] you met yesterday is my uncle.',
    difficulty: Difficulty.Beginner,
    category: GrammarCategory.RelativeClauses,
    blanks: [
      {
        id: 'b0',
        correctAnswer: 'whom',
        options: [
          { id: 'o1', text: 'whose', isCorrect: false },
          { id: 'o2', text: 'whom', isCorrect: true },
          { id: 'o3', text: 'which', isCorrect: false },
          { id: 'o4', text: 'what', isCorrect: false },
        ],
        explanation: {
          rule: '"whom" 是 "who" 的宾格形式，当关系代词在定语从句中作动词宾语时使用。',
          example: 'The girl whom I saw was very tall. (我见到的那个女孩很高。)',
          commonMistake: '误用 "whose"（所有格）或 "which"（指代物）。',
        },
      },
    ],
  },
  {
    id: 'q8',
    sentence: 'If I [[0]] you, I would take the offer.',
    difficulty: Difficulty.Intermediate,
    category: GrammarCategory.SubjunctiveMood,
    blanks: [
      {
        id: 'b0',
        correctAnswer: 'were',
        options: [
          { id: 'o1', text: 'am', isCorrect: false },
          { id: 'o2', text: 'was', isCorrect: false },
          { id: 'o3', text: 'were', isCorrect: true },
          { id: 'o4', text: 'be', isCorrect: false },
        ],
        explanation: {
          rule: '在虚拟语气中，表示与现在事实相反的假设时，be 动词一律用 "were"。',
          example: 'If he were here, he would help us. (如果他在的话，他会帮我们的。)',
          commonMistake: '在虚拟语气的假设条件句中误用 "am" 或 "was"。',
        },
      },
    ],
  }
];
