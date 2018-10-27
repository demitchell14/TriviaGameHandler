
import Game from "./game/Game";

import * as fs from "fs";

let content = JSON.parse(fs.readFileSync("json/game123.json", {encoding: "UTF-8"}));

let game = new Game(content);

console.log(game)