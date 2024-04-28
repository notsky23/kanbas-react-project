export interface Quiz {
    _id: string;
    title: string;
    course: string;
    description: string;
    quiztype: string;
    points: number;
    assignmentGroup: string;
    shuffleAnswers: boolean;
    timeLimitCheck: boolean;
    timeLimit: number;
    MultipleAttempts: boolean;
    showCorrectAnswers: string;
    accessCode: string;
    oneQuestionAtATime: boolean;
    webcamRequired: boolean;
    lockQuestionsAfterAnswering: boolean;
    dueDate: string;
    availableDate: string;
    untilDate: string;
    published: boolean;
    questions: Question[];
}

// Define a base interface for all questions
export interface BaseQuestion {
    _id: string;
    type: string;
    title: string;
    points: number;
    question: string;
    answers: any[];
}

// Define interfaces for each specific type of question
export interface TrueFalseQuestion extends BaseQuestion {
    answers: TrueFalseAnswer[];
}

export interface MultipleChoiceQuestion extends BaseQuestion {
    answers: MultipleChoiceAnswer[];
}

export interface FillInMultipleBlanksQuestion extends BaseQuestion {
    answers: FillInBlankAnswer[];
}

// Define answer interfaces for different types of questions
interface TrueFalseAnswer {
    _id: string;
    blankIndex: number;
    answer: string;
    correct: boolean;
}

interface MultipleChoiceAnswer {
    _id: string;
    blankIndex: number;
    answer: string;
    correct: boolean;
}

interface FillInBlankAnswer {
    _id: string;
    blankIndex: number;
    answer: string;
    correct: boolean;
}

// Define a union type for questions
type Question = TrueFalseQuestion | MultipleChoiceQuestion | FillInMultipleBlanksQuestion;