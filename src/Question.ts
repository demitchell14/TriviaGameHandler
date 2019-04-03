import Answer from "./Answer";
import * as moment from "moment";
import { ObjectId } from "bson";

const questionTypes = {
    OPEN_ENDED: "Open Ended",
    MULTIPLE_CHOICE: "Multiple Choice",
};

export class Question {
    _id: ObjectId;
    type: string;
    question: string;
    questionDetails: string;
    questionImage: string;
    points: number;

    choices: Choice[];
    answer: string;

    started: boolean;
    timeLimit: number;
    timeLeft: number;

    constructor(opts: QuestionOptions) {
        //console.log("Making new Question,", opts.question);
        if (typeof opts._id !== "undefined") {
            if (typeof opts._id === "string")
                this._id = ObjectId.createFromHexString(opts._id);
            else this._id = opts._id;
        } else this._id = new ObjectId();

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
                if (choice instanceof Choice) return choice;
                else return new Choice(choice);
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
            } catch (err) {}
        }
    }

    addChoice(opts: Choice | ChoiceOpts | string) {
        if (this.type === questionTypes.MULTIPLE_CHOICE) {
            if (opts instanceof Choice) {
                if (opts.correct) {
                    this.choices.map((c) => c.setCorrect(false));
                    this.answer = opts.answer;
                }
                this.choices.push(opts);
            } else {
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
        } else throw new Error("Not a multiple choice question.");
    }

    addChoices(...choices: ChoiceOpts[]) {
        choices.map((choice) => {
            this.addChoice(choice);
        });
    }

    removeAllChoices() {
        this.choices = [];
    }

    removeChoice(choice: string | number) {
        if (typeof choice === "number") {
            if (this.choices.length > choice) this.choices.splice(choice, 1);
            else return false;
            return true;
        } else {
            let idx = this.choices.findIndex((p) => choice === p.answer);
            if (idx !== -1) {
                this.choices.splice(idx, 1);
                return true;
            }
            return false;
        }
    }

    getChoice(choice: string | number): Choice {
        //console.log(choice, this.type);
        if (this.type === "Open Ended" && typeof choice === "string")
            return new Choice({
                answer: choice,
            });
        if (typeof choice === "string") {
            return this.choices.find((c) => c.answer === choice);
        } else return this.choices[choice];
    }

    correct(choice: string | Choice): boolean | undefined {
        if (this.type === questionTypes.MULTIPLE_CHOICE) {
            if (choice instanceof Choice) choice = choice.answer;

            let ans = this.choices.find((c) => c.answer === choice);
            if (ans) return ans.correct;

            return false;
        }
    }

    setAnswer(arg: string | number) {
        if (this.type === questionTypes.MULTIPLE_CHOICE) {
            let choice;
            if (typeof arg === "string")
                choice = this.choices.find((c) => c.answer === arg);
            else choice = this.choices[arg];

            if (choice) {
                this.choices.map((c) => c.setCorrect(false));
                this.getChoice(arg).setCorrect(true);
            }

            this.answer = choice ? choice.answer : "";
        } else {
            this.answer =
                typeof arg === "string" ? arg : this.choices[arg].answer;
        }
    }

    *start() {
        this.setStarted(true);
        let max = this.timeLimit;
        if (this.timeLeft !== -1) max = this.timeLeft;
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

    setStarted(bool: boolean) {
        this.started = bool;
    }
}

export interface QuestionOptions {
    _id?: string | ObjectId;
    type?: string;
    question?: string;
    points?: number;

    choices?: ChoiceOpts[] | any;
    answer?: string;

    /**
     * @example "Normally would be a few sentences if used."
     */
    questionDetails?: string;
    questionImage?: string;

    started?: boolean;
    timeLimit?: number;
}

export class Choice {
    answer: string;
    correct: boolean;
    constructor(opts: ChoiceOpts) {
        this.answer = opts.answer;
        this.correct = opts.correct || false;
    }
    setCorrect(bool: boolean) {
        this.correct = bool;
    }
}

export interface ChoiceOpts {
    answer?: string;
    correct?: boolean;
}

export const Type = questionTypes;
export default Question;
