import { expect } from "chai";
import "mocha";

import * as fs from "fs";

import {
    Game,
    Team,
    Question,
    Choice,
    ChoiceOpts,
    Type as QuestionType,
    Player,
} from "../src";

describe("Ways to create Game", () => {
    it("Title/token Only", () => {
        const result = new Game({ name: "Test", token: "atoken" });

        expect(result.name).equal("Test");
        expect(result.teams).length(0);
        expect(result.questions).length(0);
    });

    it("Title w/ Team Objects", () => {
        let teams = [new Team("Team 1"), new Team("Team 2")];
        const result = new Game({
            name: "Test 2",
            token: "atoken",
            teams: teams,
        });

        //console.log(result);

        expect(result.name).equal("Test 2");
        expect(result.teams).length(2);

        expect(result.teams[0]).contains({ name: "Team 1" });
        expect(result.teams[0].members).length(0);

        expect(result.teams[1]).contains({ name: "Team 2" });
        expect(result.teams[1].members).length(0);

        expect(result.questions).length(0);
    });

    it("Title w/ Question Objects", () => {
        let questions = [
            new Question({
                //id: 1,
                question: "Who am I?",
                choices: [new Choice({ answer: "Me" })],
            }),
            new Question({
                //id: 2,
                question: "Who are you??",
                type: QuestionType.OPEN_ENDED,
            }),
        ];
        const result = new Game({
            name: "Test 2",
            token: "atoken",
            questions: questions,
        });

        expect(result.name).equal("Test 2");
        expect(result.questions).length(2);

        expect(result.questions[0]).contains({ question: "Who am I?" });
        expect(result.questions[0].choices).length(1);

        expect(result.questions[1]).contains({ question: "Who are you??" });
        expect(result.questions[1].choices).length(0);

        expect(result.teams).length(0);
    });

    it("Title w/ Team Objects and Question Objects", () => {
        let questions = [
            new Question({
                //id: 1,
                question: "Who am I?",
                choices: [new Choice({ answer: "Me" })],
            }),
            new Question({
                //id: 2,
                question: "Who are you??",
                type: QuestionType.OPEN_ENDED,
            }),
        ];

        let teams = [new Team("Team 1"), new Team("Team 2")];

        const result = new Game({
            name: "Test 2",
            token: "atoken",
            teams: teams,
            questions: questions,
        });

        expect(result.name).equal("Test 2");
        expect(result.questions).length(2);
        expect(result.teams).length(2);

        expect(result.questions[0]).contains({ question: "Who am I?" });
        expect(result.questions[0].choices).length(1);

        expect(result.questions[1]).contains({ question: "Who are you??" });
        expect(result.questions[1].choices).length(0);

        expect(result.teams[0]).contains({ name: "Team 1" });
        expect(result.teams[0].members).length(0);

        expect(result.teams[1]).contains({ name: "Team 2" });
        expect(result.teams[1].members).length(0);
    });

    it("Build from JSON", () => {
        let content = JSON.parse(
            fs.readFileSync("./test/json/game123.json", { encoding: "UTF-8" }),
        );
        const result = new Game(content);

        expect(result.teams.length, "Teams did not import correctly.").equals(
            content.teams.length,
        );
        expect(
            result.questions.length,
            "Questions did not import correctly.",
        ).equals(content.questions.length);
        expect(result.token).equals(content.token);
        expect(result.name).equals(content.name);
    });
});
