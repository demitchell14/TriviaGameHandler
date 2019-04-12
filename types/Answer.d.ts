import { ObjectId } from "bson";
export declare class Answer {
    _id: ObjectId;
    question: string;
    answer: string;
    order: number;
    correct: boolean | "Judgement Required";
    constructor(answer: string | AnswerOptions, order?: number | boolean, correct?: boolean);
    setQuestion(question: string): void;
    setAnswer(answer: string, correct?: boolean | "Judgement Required"): void;
}
export interface AnswerOptions {
    _id: ObjectId;
    question: string;
    answer: string;
    type?: string;
    order?: number;
    correct?: boolean | "Judgement Required";
}
export default Answer;
