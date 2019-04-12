"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Player_1 = require("./Player");
const _ = require("lodash");
const Question_1 = require("./Question");
const bson_1 = require("bson");
const index_1 = require("./index");
// import Answer = GameProps.Answer;
class Team {
    //answer: (str: string) => boolean;
    constructor(options) {
        if (typeof options === "string") {
            this.name = options;
            this.members = [];
            if (this.name === "" || typeof this.name !== "string")
                throw new Error("A team name is required to create a new Team");
            // if (typeof)
            this.key = new bson_1.ObjectId();
        }
        else {
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
            }
            else {
                this.key = new bson_1.ObjectId();
            }
        }
        //console.log(this);
    }
    setKey(key) {
        this.key = key;
        return this;
    }
    getKey() {
        return this.key;
    }
    isAuthorized(key) {
        return typeof key === "string"
            ? this.key.toHexString() === key
            : this.key === key;
    }
    hasMember(name) {
        if (typeof name !== "string")
            name = name.name;
        return this.members.find((p) => p.name === name) !== undefined;
    }
    getMember(name) {
        if (typeof name !== "string")
            name = name.name;
        let uuidPattern = new RegExp(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/);
        let a = name.match(uuidPattern);
        if (a) {
            return this.members.find((p) => p.getKey() === name);
        }
        return this.members.find((p) => p.name === name);
    }
    getMemberByKey(key) { }
    addMember(...players) {
        let success = players.map((player) => {
            //console.log(players);
            if (!this.hasMember(player)) {
                //console.log(player);
                if (player instanceof Player_1.default)
                    this.members.push(player);
                else
                    this.members.push(new Player_1.default(player));
                return true;
            }
            return false;
        });
        return success.every((s) => s === true);
    }
    removeMember(player) {
        if (typeof player !== "string")
            player = player.name;
        let idx = this.members.findIndex((p) => player === p.name);
        if (idx !== -1) {
            this.members.splice(idx, 1);
            return true;
        }
        return false;
    }
    answer(question, choice) {
        let exists = this.answers.find((ans) => {
            if (ans.question) {
                return ans.question === question.question;
            }
        });
        let response = new index_1.Answer({
            _id: question._id,
            type: question.type,
            answer: choice instanceof Question_1.Choice ? choice.answer : choice,
            correct: question.type === Question_1.Type.MULTIPLE_CHOICE
                ? question.correct(choice)
                : "Judgement Required",
            question: question.question,
        });
        if (exists) {
            response = exists;
            response.setAnswer(typeof choice === "string" ? choice : choice.answer, question.type === Question_1.Type.MULTIPLE_CHOICE
                ? question.correct(choice)
                : "Judgement Required");
        }
        else {
            this.answers.push(response);
        }
        console.log(question);
        //console.log(response)
        //console.log(this.answers);
        return response;
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
exports.Team = Team;
exports.default = Team;
//# sourceMappingURL=Team.js.map