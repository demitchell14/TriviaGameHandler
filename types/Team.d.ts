import Player from "./Player";
import Question, { Choice } from "./Question";
import { ObjectID } from "bson";
import { Answer } from "./index";
export declare class Team {
    key: ObjectID;
    name: string;
    members: Player[];
    answers: Answer[];
    constructor(options?: TeamOptions | string);
    setKey(key: ObjectID): this;
    getKey(): ObjectID;
    isAuthorized(key: string | ObjectID): boolean;
    hasMember(name: string | Player): boolean;
    getMember(name: string | Player): Player;
    getMemberByKey(key: string): void;
    addMember(...players: any[]): boolean;
    removeMember(player: any): boolean;
    answer(question: Partial<Question>, choice: string | Choice): Answer;
    toJSON(): {
        name: string;
        members: {
            id: any;
            name: string;
        }[];
        answers: Answer[];
        key: ObjectID;
    };
    cleanName(): string;
}
export interface TeamOptions {
    name: string;
    members?: Player[];
    answers?: Answer[];
    key?: ObjectID;
}
export default Team;
