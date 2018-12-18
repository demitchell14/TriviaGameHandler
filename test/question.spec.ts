/**
 * @prettier
 */
import { expect } from "chai";
import "mocha";

import Question, {
    Choice,
    ChoiceOpts,
    Type as QuestionType
} from "../bin/game/Question";

describe("Creating Questions", () => {
    it("w/ no answers", () => {
        const result = new Question({
            question: "Who am I?"
        });

        expect(result.question).equals("Who am I?");
        expect(result.choices).length(0);
    });

    it("w/ 3 answers", () => {
        let other = new Choice({
            answer: "I am me"
        });

        let correct = new Choice({
            answer: "I am you",
            correct: true
        });

        let delayed = new Choice({
            answer: "I am neither"
        });
        const result = new Question({
            question: "Who am I?",
            type: QuestionType.MULTIPLE_CHOICE,
            choices: [other, correct]
        });

        result.addChoice(delayed);
        //result.addAnswer(delayed);
        //result.setStarted(true);

        //expect(result.started, "Question Started").equals(true);
        expect(result.question, "Question Text").equals("Who am I?");
        expect(result.choices, "Total Choices").length(3);
        //expect(result.getCorrect()).equal(correct);
    });
});
