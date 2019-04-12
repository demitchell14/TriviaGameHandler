/**
 * @prettier
 */
import { ObjectId } from "bson";
export * from "./Question";
export * from "./Game";
export * from "./Team";
export * from "./Answer";
export * from "./Player";
export declare namespace GameProps {
    interface Member {
        id?: any;
        name: string;
    }
    interface Answer {
        type: string;
        answer?: any;
        correct: boolean;
        question: string;
    }
    interface Team {
        name: string;
        members: Member[];
        answers: Answer[];
        key: string | ObjectId;
    }
    interface Choice {
        answer: string;
        correct: boolean;
    }
    interface Question {
        _id: ObjectId | string;
        question: string;
        type: string;
        answer: string;
        questionDetails?: any;
        questionImage?: any;
        started: boolean;
        timeLeft: number;
        choices: Choice[];
        points: number;
        timeLimit: number;
    }
    interface Game {
        _id: ObjectId | string;
        name: string;
        description: string;
        image: string;
        token: string;
        startTime: string;
        currentQuestionId: number;
        started: boolean;
        paused: boolean;
        teams: Team[];
        questions: Question[];
        needsUpdate: boolean;
        updatesQueued: number;
    }
}
