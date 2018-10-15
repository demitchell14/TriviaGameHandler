import Answer from "./Answer";

const questionTypes = {
    OPEN_ENDED: "Open Ended",
    MULTIPLE_CHOICE: "Multiple Choice",
    
    OE: this.OPEN_ENDED,
    MC: this.MULTIPLE_CHOICE
};


class Question {
    id: number;
    type: string;
    question: string;
    points: number;

    answers: Answer[];
    answer: string;

    started: boolean;

    constructor(options: QuestionOptions) {
        this.id = options.id;
        this.question = options.question;
        this.started = options.started || false;
        this.points = options.points || 1;
        this.type = options.type || options.answer && typeof options.answers === "undefined" ? "Open Ended" : "Multiple Choice";

        if (options.answers) {
            options.answers = options.answers.map(ans => {
                if (ans instanceof Answer)
                    ans.setQuestion(options.question);
                else {
                    ans = new Answer(ans);
                    ans.setQuestion(options.question);
                }
                return ans;
            })
        }
        this.answer = options.answer;
        this.answers = options.answers || [];
    }

    setStarted(bool: boolean):void {
        this.started = bool;
    }

    setPoints(num: number):void {
        this.points = num;
    }

    getAnswers() {
        //let ans = {};
        //return this.answers;
        switch (this.type.toLowerCase()) {
            case "multiple choice":
                return this.answers.map(answer => {
                    return {
                        answer: answer.answer
                    };
                });
            case "open ended":
                return this.answer;
        }
    }

    getCorrect() {
        switch (this.type.toLowerCase()) {
            case "multiple choice":
                return this.answers.find(ans => {
                    //console.log(ans);
                    return ans.correct === true
                });
            case "open ended":
                return this.answer;
        }
    }

    addAnswer(..._answers:Answer[]): Question {
        //console.log(answers);
        _answers.map((ans) => {
            this.answers.push(ans);
        });
        return this;
    }
}

export interface QuestionOptions {
    id?: number;
    type?: string;
    question: string;
    points?: number;
    answers?: Answer[];
    answer?: string;
    started?: boolean;
}

export default Question;

export const Types = questionTypes;