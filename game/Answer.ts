class Answer {

    question: string;
    answer: string;
    order: number;
    correct: boolean;

    constructor(answer:string|AnswerOptions, order?:number|boolean, correct?:boolean) {
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
        } else {
            this.answer = answer.answer;
            this.question = answer.question || "";
            this.correct = answer.correct || false;
            this.order = answer.order || -1;
        }
    }

    setQuestion(question:string) {
        this.question = question;
    }

}

export interface AnswerOptions {
    question?: string;
    answer: string;
    order?: number;
    correct?: boolean;
};
export default Answer;