"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Answer {
    constructor(answer, order, correct) {
        if (typeof answer === "string") {
            this.question = "";
            this.answer = answer;
            if (typeof order === "boolean")
                this.correct = order;
            else {
                if (typeof correct === "boolean") {
                    this.correct = correct;
                }
                if (typeof order === "number")
                    this.order = order;
            }
        }
        else {
            this._id = answer._id;
            this.answer = answer.answer;
            this.question = answer.question || "";
            this.correct = answer.correct || false;
            this.order = answer.order || -1;
        }
    }
    setQuestion(question) {
        this.question = question;
    }
    setAnswer(answer, correct = false) {
        this.answer = answer;
        this.correct = false;
    }
}
exports.Answer = Answer;
exports.default = Answer;
