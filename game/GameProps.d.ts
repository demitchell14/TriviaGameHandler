export declare module GameProps {

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
        key: string;
    }

    export interface Choice {
        answer: string;
        correct: boolean;
    }

    export interface Question {
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
        _id: string;
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
