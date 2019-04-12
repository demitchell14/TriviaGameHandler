import { ObjectId } from "bson";
import { symlink } from "fs";
import { Type as QuestionType } from "..";

export class Answer {
    _id: ObjectId;
    question: string;
    answer: string;
    order: number;
    correct: boolean | "Judgement Required";

    constructor(
        answer: string | AnswerOptions,
        order?: number | boolean,
        correct?: boolean,
    ) {
        if (typeof answer === "string") {
            this.question = "";
            this.answer = answer;
            if (typeof order === "boolean") this.correct = order;
            else {
                if (typeof correct === "boolean") {
                    this.correct = correct;
                }
                if (typeof order === "number") this.order = order;
            }
        } else {
            this._id = answer._id;
            this.answer = answer.answer;
            this.question = answer.question || "";
            this.correct = answer.correct || false;
            this.order = answer.order || -1;
        }
    }

    setQuestion(question: string) {
        this.question = question;
    }

    setAnswer(answer: string, correct:boolean|"Judgement Required" = false) {
        this.answer  = answer;
        this.correct = false;
    }
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
