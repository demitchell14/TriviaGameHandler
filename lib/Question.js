"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
const bson_1 = require("bson");
const questionTypes = {
    OPEN_ENDED: "Open Ended",
    MULTIPLE_CHOICE: "Multiple Choice",
};
class Question {
    constructor(opts) {
        //console.log("Making new Question,", opts.question);
        if (typeof opts._id !== "undefined") {
            if (typeof opts._id === "string")
                this._id = bson_1.ObjectId.createFromHexString(opts._id);
            else
                this._id = opts._id;
        }
        else
            this._id = new bson_1.ObjectId();
        this.question = opts.question || "";
        this.type = opts.type || questionTypes.OPEN_ENDED;
        this.answer = opts.answer || "";
        this.questionDetails = opts.questionDetails;
        this.questionImage = opts.questionImage;
        this.started = opts.started || false;
        this.timeLeft = -1;
        // @ts-ignore
        if (opts.answers) {
            // @ts-ignore
            opts.choices = opts.answers;
        }
        if (opts.choices) {
            opts.choices = opts.choices.map((choice) => {
                if (choice instanceof Choice)
                    return choice;
                else
                    return new Choice(choice);
            });
        }
        // @ts-ignore
        this.choices = opts.choices || [];
        if (typeof opts.timeLimit === "string")
            //@ts-ignore
            opts.timeLimit = Number.parseInt(opts.timeLimit);
        if (typeof opts.points === "string")
            //@ts-ignore
            opts.points = Number.parseInt(opts.points);
        this.points = opts.points || 0;
        this.timeLimit = opts.timeLimit || 0;
        if (this.type === questionTypes.MULTIPLE_CHOICE) {
            try {
                this.answer = this.choices.find((c) => c.correct).answer;
            }
            catch (err) { }
        }
    }
    addChoice(opts) {
        if (this.type === questionTypes.MULTIPLE_CHOICE) {
            if (opts instanceof Choice) {
                if (opts.correct) {
                    this.choices.map((c) => c.setCorrect(false));
                    this.answer = opts.answer;
                }
                this.choices.push(opts);
            }
            else {
                if (typeof opts === "string")
                    this.choices.push(new Choice({ answer: opts }));
                else {
                    if (opts.correct) {
                        this.choices.map((c) => c.setCorrect(false));
                        this.answer = opts.answer;
                    }
                    this.choices.push(new Choice(opts));
                }
            }
        }
        else
            throw new Error("Not a multiple choice question.");
    }
    addChoices(...choices) {
        choices.map((choice) => {
            this.addChoice(choice);
        });
    }
    removeAllChoices() {
        this.choices = [];
    }
    removeChoice(choice) {
        if (typeof choice === "number") {
            if (this.choices.length > choice)
                this.choices.splice(choice, 1);
            else
                return false;
            return true;
        }
        else {
            let idx = this.choices.findIndex((p) => choice === p.answer);
            if (idx !== -1) {
                this.choices.splice(idx, 1);
                return true;
            }
            return false;
        }
    }
    getChoice(choice) {
        //console.log(choice, this.type);
        if (this.type === "Open Ended" && typeof choice === "string")
            return new Choice({
                answer: choice,
            });
        if (typeof choice === "string") {
            return this.choices.find((c) => c.answer === choice);
        }
        else
            return this.choices[choice];
    }
    correct(choice) {
        if (this.type === questionTypes.MULTIPLE_CHOICE) {
            if (choice instanceof Choice)
                choice = choice.answer;
            let ans = this.choices.find((c) => c.answer === choice);
            if (ans)
                return ans.correct;
            return false;
        }
    }
    setAnswer(arg) {
        if (this.type === questionTypes.MULTIPLE_CHOICE) {
            let choice;
            if (typeof arg === "string")
                choice = this.choices.find((c) => c.answer === arg);
            else
                choice = this.choices[arg];
            if (choice) {
                this.choices.map((c) => c.setCorrect(false));
                this.getChoice(arg).setCorrect(true);
            }
            this.answer = choice ? choice.answer : "";
        }
        else {
            this.answer =
                typeof arg === "string" ? arg : this.choices[arg].answer;
        }
    }
    *start() {
        this.setStarted(true);
        let max = this.timeLimit;
        if (this.timeLeft !== -1)
            max = this.timeLeft;
        //let current= moment();
        let end = moment().add(max, "seconds");
        yield end.diff(moment(), "seconds");
        while (end.diff(moment(), "seconds") > 0 && this.started) {
            //console.log(this)
            this.timeLeft = end.diff(moment(), "seconds");
            yield this.timeLeft;
        }
        this.setStarted(false);
        //yield this.timeLeft = -1;
    }
    setStarted(bool) {
        this.started = bool;
    }
}
exports.Question = Question;
class Choice {
    constructor(opts) {
        this.answer = opts.answer;
        this.correct = opts.correct || false;
    }
    setCorrect(bool) {
        this.correct = bool;
    }
}
exports.Choice = Choice;
exports.Type = questionTypes;
exports.default = Question;
