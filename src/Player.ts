//import Team from "./Team";
//import Game from "./Game";

export class Player {
    id: string;
    name: string;
    setKey: (str: string) => void;
    getKey: () => any;
    //key: string;
    //team: Team;
    //game: Game;

    constructor(id: string | PlayerOptions, nickname?: string) {
        if (typeof id === "string") {
            if (typeof nickname === "undefined") {
                this.name = id;
                this.id = undefined;
            } else {
                this.id = id;
                this.name = nickname;
            }
        } else {
            this.id = id.id;
            this.name = id.name;
        }

        let key;

        this.setKey = (str: string) => {
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

export interface PlayerOptions {
    id?: string;
    name?: string;
}

export default Player;
