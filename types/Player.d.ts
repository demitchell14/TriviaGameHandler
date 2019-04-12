export declare class Player {
    id: string;
    name: string;
    setKey: (str: string) => void;
    getKey: () => any;
    constructor(id: string | PlayerOptions, nickname?: string);
    toJSON(): {
        id: any;
        name: string;
    };
}
export interface PlayerOptions {
    id?: string;
    name?: string;
}
export default Player;
