/**
 * @prettier
 */

import * as path from "path";
import * as fs from "fs";
import * as _ from "lodash";

import { expect } from "chai";
import "mocha";

import { Game, GameProps } from "../../src"


describe("Manage Game 1", () => {
    const GAME1_LOCATION = path.join(__dirname, "./game-1.json");
    let data: GameProps.Game;

    it("starts ./game-1.json", (done) => {
        const exists = fs.existsSync(GAME1_LOCATION);

        expect(
            exists,
            "game-1.json does not exist. This test requires a valid Game schema"
        ).equal(true);

        if (exists) {
            const tmp = fs.readFileSync(GAME1_LOCATION, { encoding: "UTF-8" });
            data = JSON.parse(tmp) as GameProps.Game;
            const game = new Game(data);

            for (let k in game) {
                if (game.hasOwnProperty(k)) {
                    expect(game[k]).to.deep.equal(data[k]);
                }
            }
        }

        done();
    });

    it("handles new teams", () => {
        const game = new Game(data);
    });
});
