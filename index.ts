/**
 * @prettier
 */

// import _Game from "./game/Game";
// import _Question from "./game/Question";
// import _Team from "./game/Team";
// import _Answer from "./game/Answer";
// import _Player from "./game/Player";

// export interface Game extends _Game {}
// export interface Question extends _Question {}
// export interface Team extends _Team {}
// export interface Answer extends _Answer {}
// export interface Player extends _Player {}

// export const Game = _Game;
// export const Question = _Question;
// export const Team = _Team;
// export const Answer = _Answer;
// export const Player = _Player;

export * from "./game/Question";
export * from "./game/Game";
export * from "./game/Team";
export * from "./game/Answer";
export * from "./game/player";

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



//export default Game;
