import { ObjectId } from "bson";
export declare class Question {
    _id: ObjectId;
    type: string;
    question: string;
    questionDetails: string;
    questionImage: string;
    points: number;
    choices: Choice[];
    answer: string;
    started: boolean;
    timeLimit: number;
    timeLeft: number;
    constructor(opts: QuestionOptions);
    addChoice(opts: Choice | ChoiceOpts | string): void;
    addChoices(...choices: ChoiceOpts[]): void;
    removeAllChoices(): void;
    removeChoice(choice: string | number): boolean;
    getChoice(choice: string | number): Choice;
    correct(choice: string | Choice): boolean | undefined;
    setAnswer(arg: string | number): void;
    start(): IterableIterator<number>;
    setStarted(bool: boolean): void;
}
export interface QuestionOptions {
    _id?: string | ObjectId;
    type?: string;
    question?: string;
    points?: number;
    choices?: ChoiceOpts[] | any;
    answer?: string;
    /**
     * @example "Normally would be a few sentences if used."
     */
    questionDetails?: string;
    questionImage?: string;
    started?: boolean;
    timeLimit?: number;
}
export declare class Choice {
    answer: string;
    correct: boolean;
    constructor(opts: ChoiceOpts);
    setCorrect(bool: boolean): void;
}
export interface ChoiceOpts {
    answer?: string;
    correct?: boolean;
}
export declare const Type: {
    OPEN_ENDED: string;
    MULTIPLE_CHOICE: string;
};
export default Question;
