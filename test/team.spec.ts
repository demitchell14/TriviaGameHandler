/**
 * @prettier
 */

import { expect } from "chai";
import "mocha";

import Team from "../bin/game/Team";
import Player from "../bin/game/Player";

const uuidv1 = require("uuid/v1");

describe("Ways to create Team", () => {
    it("Name Only", () => {
        const result = new Team("Team 1");

        expect(result.name).equals("Team 1");
        expect(result.members).length(0);
    });

    it("Name w/ Players", () => {
        let player1 = new Player("Player 1");
        let player2 = new Player("Player 2");

        let result = new Team({
            name: "Team 2",
            members: [player1]
        });

        expect(result.name).equals("Team 2");
        expect(result.members.length).equals(1);
        expect(result.members[0]).contains({ name: "Player 1" });

        //result = new Team("Team 2", player2, player1);
        result = new Team({
            name: "Team 2",
            members: [player2, player1]
        });

        expect(result.name).equals("Team 2");
        expect(result.members).length(2);
        expect(result.members[0]).contains({ name: "Player 2" });
        expect(result.members[1]).contains({ name: "Player 1" });

        result = new (Function.prototype.bind.apply(Team, [
            null,
            { name: "Team 1", members: [player1] }
        ]))();

        expect(result.name).equals("Team 1");
        expect(result.members).length(1);
        expect(result.members[0]).contains({ name: "Player 1" });

        result = new (Function.prototype.bind.call(Team, null, {
            name: "Team 1",
            members: [player2]
        }))();

        expect(result.name).equals("Team 1");
        expect(result.members).length(1);
        expect(result.members[0]).contains({ name: "Player 2" });
    });
});

describe("Team Functions", () => {
    const result = new Team({ name: "Team 1" });

    it("Add 1 member by string", () => {
        result.addMember("Player 1");

        expect(result.name).equals("Team 1");
        expect(result.members).length(1);
        expect(result.members[0]).contains({ name: "Player 1" });
        expect(result.getMember("Player 1")).contains({ name: "Player 1" });
    });

    it("Add 2 members by string", () => {
        result.addMember("Player 2", "Player 3");

        expect(result.members).length(3);
        expect(result.members[2]).contains({ name: "Player 3" });
        expect(result.getMember("Player 2")).contains({ name: "Player 2" });
    });

    it("Removes 1 player by name", () => {
        result.removeMember("Player 2");

        expect(result.members).length(2);
        expect(result.members[1]).contains({ name: "Player 3" });
    });

    it("Adds 1 member by Object", () => {
        let playerX = new Player("Player X");
        let uid = uuidv1();
        playerX.setKey(uid);

        result.addMember(playerX);

        expect(result.members).length(3);
        expect(result.getMember(uid)).contains({ name: "Player X" });
    });
});
