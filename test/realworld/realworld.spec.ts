import { expect } from "chai";
import 'mocha';

import * as fs from "fs";


describe("Build Game 1", () => {
    const game1 = fs.readFileSync("./game-1.json", {encoding: "UTF-8"});

    it("loads", () => {

    });
});