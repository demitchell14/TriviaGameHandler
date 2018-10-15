import { expect } from "chai";
import 'mocha';

import Game from "../bin/Game";
import Team from "../bin/game/Team";
import Question from "../bin/game/Question";
import Answer from "../bin/game/Answer";
import Player from "../bin/game/Player";


describe("Ways to create Game", () => {

    it('Title Only', () => {
        const result = new Game("Test");

        expect(result.name).equal("Test", );
        expect(result.teams).length(0);
        expect(result.questions).length(0);
    });

    it('Title w/ Team Objects', () => {
        let teams = [
            new Team("Team 1"),
            new Team("Team 2")
        ];
        const result = new Game("Test 2", teams);

        //console.log(result);

        expect(result.name).equal("Test 2");
        expect(result.teams).length(2);

        expect(result.teams[0]).contains({name: 'Team 1'});
        expect(result.teams[0].members).length(0);

        expect(result.teams[1]).contains({name: 'Team 2'});
        expect(result.teams[1].members).length(0);

        expect(result.questions).length(0);
    });

    it("Title w/ Question Objects", () => {
        let questions = [
            new Question({
                id: 1,
                question: "Who am I?",
                answers: [
                    new Answer("Me")
                ]
            }),
            new Question({
                id: 2,
                question: "Who are you??",
            })
        ];
        const result = new Game("Test 2", [], questions);

        expect(result.name).equal("Test 2");
        expect(result.questions).length(2);

        expect(result.questions[0]).contains({question: "Who am I?"});
        expect(result.questions[0].answers).length(1);

        expect(result.questions[1]).contains({question: "Who are you??"});
        expect(result.questions[1].answers).length(0);

        expect(result.teams).length(0);
    });

    it('Title w/ Team Objects and Question Objects', () => {
        let questions = [
            new Question({
                id: 1,
                question: "Who am I?",
                answers: [
                    new Answer("Me")
                ]
            }),
            new Question({
                id: 2,
                question: "Who are you??",
            })
        ];

        let teams = [
            new Team("Team 1"),
            new Team("Team 2")
        ];
        const result = new Game("Test 2", teams, questions);

        expect(result.name).equal("Test 2");
        expect(result.questions).length(2);
        expect(result.teams).length(2);

        expect(result.questions[0]).contains({question: "Who am I?"});
        expect(result.questions[0].answers).length(1);

        expect(result.questions[1]).contains({question: "Who are you??"});
        expect(result.questions[1].answers).length(0);

        expect(result.teams[0]).contains({name: 'Team 1'});
        expect(result.teams[0].members).length(0);

        expect(result.teams[1]).contains({name: 'Team 2'});
        expect(result.teams[1].members).length(0);

    });

});

