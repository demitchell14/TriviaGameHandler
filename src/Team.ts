import Player, { PlayerOptions } from "./Player";
import * as _ from "lodash";
import Question, { Choice, Type } from "./Question";
import { ObjectID, ObjectId } from "bson";
import {GameProps, Answer} from "../index";
// import Answer = GameProps.Answer;

export class Team {
    key: ObjectID;
    name: string;
    members: Player[];
    answers: Answer[];
    //answer: (str: string) => boolean;

    constructor(options?: TeamOptions | string) {
        if (typeof options === "string") {
            this.name = options;
            this.members = [];
            if (this.name === "" || typeof this.name !== "string")
                throw new Error("A team name is required to create a new Team");
            // if (typeof)
            this.key = new ObjectId();
        } else {
            this.name = options.name;
            if (this.name === "" || typeof this.name !== "string")
                throw new Error("A team name is required to create a new Team");
            this.members = [];

            if (options.members) {
                //this.addMember(options.members);
                //console.log(options.members);
                options.members = options.members.map((member) => {
                    //console.log(member);
                    this.addMember(member);
                    return this.getMember(member.name);
                });
            }

            //console.log(options.members);
            this.answers = options.answers || [];

            if (options.key) {
                this.key = options.key;
            } else {
                this.key = new ObjectId();
            }
        }

        //console.log(this);
    }

    setKey(key: ObjectID) {
        this.key = key;
        return this;
    }

    getKey() {
        return this.key;
    }

    isAuthorized(key: string | ObjectID) {
        return typeof key === "string"
            ? this.key.toHexString() === key
            : this.key === key;
    }

    hasMember(name: string | Player): boolean {
        if (typeof name !== "string") name = name.name;

        return this.members.find((p) => p.name === name) !== undefined;
    }

    getMember(name: string | Player): Player {
        if (typeof name !== "string") name = name.name;

        let uuidPattern = new RegExp(
            /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/,
        );
        let a = name.match(uuidPattern);
        if (a) {
            return this.members.find((p) => p.getKey() === name);
        }
        return this.members.find((p) => p.name === name);
    }

    getMemberByKey(key: string) {}

    addMember(...players: any[]): boolean {
        let success = players.map((player) => {
            //console.log(players);
            if (!this.hasMember(player)) {
                //console.log(player);
                if (player instanceof Player) this.members.push(player);
                else this.members.push(new Player(player));
                return true;
            }
            return false;
        });

        return success.every((s) => s === true);
    }

    removeMember(player: any) {
        if (typeof player !== "string") player = player.name;

        let idx = this.members.findIndex((p) => player === p.name);
        if (idx !== -1) {
            this.members.splice(idx, 1);
            return true;
        }
        return false;
    }

    answer(question: Partial<Question>, choice: string | Choice): Answer {
        let exists = this.answers.find((ans) => {
            if (ans.question) {
                return ans.question === question.question;
            }
        });
        if (exists) {
            //console.debug(exists);
            throw new Error(`${this.name} has already answered that question.`);
        } else {
            let response = new Answer({
                _id: question._id,
                type: question.type,
                answer: choice instanceof Choice ? choice.answer : choice,
                correct:
                    question.type === Type.MULTIPLE_CHOICE
                        ? question.correct(choice)
                        : "Judgement Required",
                question: question.question,
            });

            //console.log(response)
            this.answers.push(response);

            //console.log(this.answers);
            return response;
        }
    }

    toJSON() {
        let tmp = _.cloneDeep(this);
        return {
            name: tmp.name,
            members: tmp.members
                ? tmp.members.map((r) => r.toJSON())
                : undefined,
            answers: tmp.answers
                ? tmp.answers.map((a) => {
                      //delete a.answer;
                      return a;
                  })
                : undefined,
            key: tmp.key,
        };
    }

    cleanName() {
        return this.name.replace(/\W+/g, "");
    }
}

// export interface Answer {
//     type?: string;
//     correct?: boolean | string;
//     question?: string;
//     answer?: string;
// }

export interface TeamOptions {
    name: string;
    members?: Player[];
    answers?: Answer[];
    key?: ObjectID;
}

export default Team;
