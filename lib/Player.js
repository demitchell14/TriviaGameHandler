"use strict";
//import Team from "./Team";
//import Game from "./Game";
Object.defineProperty(exports, "__esModule", { value: true });
class Player {
    //key: string;
    //team: Team;
    //game: Game;
    constructor(id, nickname) {
        if (typeof id === "string") {
            if (typeof nickname === "undefined") {
                this.name = id;
                this.id = undefined;
            }
            else {
                this.id = id;
                this.name = nickname;
            }
        }
        else {
            this.id = id.id;
            this.name = id.name;
        }
        let key;
        this.setKey = (str) => {
            if (typeof key === "undefined") {
                key = str;
            }
        };
        this.getKey = () => key;
    }
    toJSON() {
        return {
            id: this.getKey(),
            name: this.name,
        };
    }
}
exports.Player = Player;
exports.default = Player;
