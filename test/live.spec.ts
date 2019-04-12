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
    TeamOptions,
} from "..";
import { ObjectId } from "bson";

describe("Run one game", () => {
    let game: Game, teams: TeamOptions[];
    beforeEach((done) => {
        let content = JSON.parse(
            fs.readFileSync("./test/json/demonstration.json", {
                encoding: "UTF-8",
            }),
        );
        game = new Game(content);

        teams = [
            JSON.parse(
                fs.readFileSync("./test/json/team1.json", {
                    encoding: "UTF-8",
                }),
            ),
            JSON.parse(
                fs.readFileSync("./test/json/team2.json", {
                    encoding: "UTF-8",
                }),
            ),
        ];
        done();
    });

    it("is the correct test game", () => {
        const _id = ObjectId.createFromHexString("5c4d525477b2ba4fa4f4cbc5");
        expect(game.name).equals("Backstory Demonstration");
        expect(game.questions[1]._id.equals(_id)).to.be.true;
        expect(game.questions[2].choices[2].answer).equals(
            "Gregorian Calendar",
        );
        expect(game.token).equals("demonstration");
    });

    it("can add 1 team", () => {
        game.addTeam(teams[0]);
        console.log(game.teams[0]);
        const _id = ObjectId.createFromHexString("5c9324084553530015637836");
        expect(game.teams[0].key.equals(_id)).to.be.true;
        expect(game.teams[0].name).equals("Developer Team");
    });
});
