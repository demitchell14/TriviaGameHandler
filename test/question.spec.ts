import { expect } from "chai";
import 'mocha';

import Question from "../bin/game/Question";
import Answer from "../bin/game/Answer";

describe("Creating Questions", () => {

    it("w/ no answers", () => {
        const result = new Question({
            id: 1,
            question: "Who am I?",
        });

        expect(result.question).equals("Who am I?");
        expect(result.answers).length(0);

    });

    it("w/ 3 answers", () => {
        let other = new Answer("I am me");
        let correct = new Answer("I am you", true);

        let delayed = new Answer("I am neither", 2);
        const result = new Question({
            id: 1,
            question: "Who am I?",
            answers: [
                other,
                correct
            ]
        });

        result.addAnswer(delayed);
        result.setStarted(true);

        expect(result.started).equals(true);
        expect(result.question).equals("Who am I?");
        expect(result.answers).length(3);
        expect(result.getCorrect()).equal(correct);
    })
});