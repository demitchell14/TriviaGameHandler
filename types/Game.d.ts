import Team from "./Team";
import Question, { QuestionOptions } from "./Question";
import { ObjectId } from "bson";
export declare class Game {
    _id: ObjectId;
    name: string;
    description: string;
    image: string;
    token: string;
    started: boolean;
    startTime: string;
    teams: Team[];
    questions: Question[];
    needsUpdate: boolean;
    paused: boolean;
    private currentQuestionId;
    private updatesQueued;
    constructor(options: GameOptions);
    setName(str: string): void;
    setToken(str: string): void;
    setStarted(bool: boolean): void;
    hasTeam(team: string | ObjectId | Team): boolean;
    getTeam(team: string | ObjectId | Team): Team | null;
    addTeam(...teams: any[]): boolean;
    removeTeam(...teams: any[]): boolean;
    addQuestion(question: Question | QuestionOptions): void;
    getQuestion(id: number | Question | string): Question;
    getCurrentQuestionIndex(): number;
    getCurrentQuestion(): Question | -1;
    question(): {
        pause: () => void;
        resume: () => void;
        current: () => Question;
        reset: () => void;
        next: () => Question;
    };
    nextQuestion(): void;
    reset(removeTeams?: boolean): void;
    update(bool?: boolean): boolean;
    compare(comparable: Game): any;
}
export interface GameOptions {
    _id?: ObjectId | string;
    name: string;
    token: string;
    paused?: boolean;
    startTime?: string;
    description?: string;
    image?: string;
    currentQuestionId?: number;
    started?: boolean;
    teams?: Team[] | any;
    questions?: Question[] | any;
    updatesQueued?: number;
    needsUpdate?: boolean;
}
export default Game;
