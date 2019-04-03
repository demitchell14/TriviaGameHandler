/**
 * @prettier
 */
import { ObjectId } from "bson";

export * from "./src/Question";
export * from "./src/Game";
export * from "./src/Team";
export * from "./src/Answer";
export * from "./src/Player";

export namespace GameProps {
    export interface Member {
        id?: any;
        name: string;
    }

    export interface Answer {
        type: string;
        answer?: any;
        correct: boolean;
        question: string;
    }

    export interface Team {
        name: string;
        members: Member[];
        answers: Answer[];
        key: string | ObjectId;
    }

    export interface Choice {
        answer: string;
        correct: boolean;
    }

    export interface Question {
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

    export interface Game {
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

//export default Game;
