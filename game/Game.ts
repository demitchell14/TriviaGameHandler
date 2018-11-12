
import Team from "./Team";
import Player from "./Player";
import Question, {QuestionOptions, Type as QType} from "./Question";
import * as moment from "moment";
import {Moment} from "moment";

const MAX_QUEUE = 1;

class Game {
    _id: any;
    name: string;
    description:string;
    token: string;
    started: boolean;
    startTime: string;
    teams: Team[];
    questions: Question[];
    needsUpdate:boolean;

    paused:boolean;

    private currentQuestionId: number;
    private updatesQueued:number;


    constructor(options: GameOptions) {
        this.name = options.name;
        this["_id"] = options["_id"];
        this.paused = typeof options.paused !== "undefined" ? options.paused : true;
        this.currentQuestionId = options.currentQuestionId || 0;
        this.description = options.description;

        if (options.teams) {
            options.teams = options.teams.map(team => {
                if (team instanceof Team)
                    return team;
                else
                    return new Team(team);
            });
        }

        //console.log(options.teams);
        this.teams = options.teams || [];

       // this.teams.map((t) => console.log(t.key));

        if (options.questions) {
            options.questions = options.questions.map(question => {
                if (question instanceof Question)
                    return question;
                else
                    return new Question(question);
            });
        }

        this.questions = options.questions || [];
        //console.log(this.questions);
        this.started = options.started || false;
        this.token = options.token || this.name.toLowerCase().replace(/\s+/, "");

        if (this.token === "" || typeof this.token !== "string") {
            throw new Error("Token is required to run a Game.");
        }
        if (this.name === "" || typeof this.name !== "string") {
            throw new Error("Name is required to run a Game.");
        }
        this.needsUpdate = false;
        this.updatesQueued = 0;

        if (typeof options.startTime !== "undefined") {
            this.startTime = options.startTime;
        } else {
            let d = new Date();
            this.startTime = `${d.getFullYear()}-${d.getUTCMonth()+1}-${d.getUTCDate()} ${d.getHours()}:${d.getMinutes()}`
        }
    }

    setName(str:string) {
        this.name = str;
        this.update(true);
    }

    setToken(str: string) {
        this.token = str;
        this.update(true);
    }

    setStarted(bool: boolean) {
        this.started = bool;
        this.update(true);
    }

    // -- >> Team Functions

    hasTeam(team: string|Team): boolean {

        if (typeof team !== "string") {
            //console.log("WTF ", team.name);
            team = team.name;
        }
        let uuidPattern = new RegExp(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/)
        //console.log(team);
        if (!team.match(uuidPattern)) {
            // -- Find team based on name
            return this.teams.find(t => t.name === team) !== undefined;
        } else {
            // -- Find team based on authorize string

            return this.teams.find(t => t.key === team) !== undefined;
        }
        //if (token.key && token.key.match(uuidPattern)) {

    }

    getTeam(team: string|Team):Team {

        if (typeof team !== "string")
            team = team.name;

        //console.log(name);

        let uuidPattern = new RegExp(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/)
        if (!team.match(uuidPattern)) {
            // -- Find team based on name
            return this.teams.find(t => t.name === team);
        } else {
            // -- Find team based on authorize string
            return this.teams.find(t => t.key === team);
        }
    }

    addTeam(...teams: any[]): boolean {

        let success = teams.map(team => {
            //console.log(team, this.hasTeam(team));
            if (!this.hasTeam(team)) {
                //console.log(team);
                if (typeof team !== "string") {
                    //console.log(team);
                    this.teams.push(team)
                } else {
                    //console.log("Here sadly,");
                    let t = new (Function.prototype.bind.apply(Team, [this, team]));
                    //console.log(t);
                    this.teams.push(t);
                }
                return true;
            }
            return false;
        });
        this.update(true);
        return success.every(s => s === true);
    }

    removeTeam(...teams: any[]): boolean {

        let success = teams.map(team => {
            if (team instanceof Team)
                team = team.name;

            let idx = this.teams.findIndex(t => team === t.name);
            if (idx !== -1) {
                this.teams.splice(idx, 1);
                return true;
            }
            return false;
        });
        this.update(true);
        return success.every(s => s === true);
    }

    // -- >> End Team Functions


    // -- >> Question Functions

    addQuestion(question: Question|QuestionOptions) {
        if (question instanceof Question)
            this.questions.push(question);
        else
            this.questions.push(new Question(question));

        //console.log(this.questions);
        //this.questions.push(question);
        this.update(true);
    }

    getQuestion(id: number|Question|string): Question {
        if (id instanceof Question) {
            return undefined;
        } else {
            if (typeof id === "number")
                return this.questions[id];
            else {
                let x = this.questions.find(q => q.question === id);
                return x;
            }
        }

        //return this.questions.find(q => q.id === id);
    }

    getCurrentQuestionIndex() {
        if (this.paused)
            return -1;

        if (this.currentQuestionId >= this.questions.length)
            return -100;

        return this.currentQuestionId;
    }

    getCurrentQuestion() {
        let current = this.questions[this.currentQuestionId];
        if (this.paused)
            return -1;
        if (current) {
            return current;
        } else {
            if (this.currentQuestionId >=this.questions.length) {
                throw new Error("Game is over. No more questions.");
            }
            console.log(this.currentQuestionId, this.questions.length);
        }
    }
    question() {
        return {
            pause: () => this.paused = true,
            resume: () => this.paused = false,

            current: (): Question|undefined => {
                let idx = this.getCurrentQuestionIndex();
                if (idx >= 0)
                    return this.questions[idx];
            },
            reset: () => {
                this.currentQuestionId = 0;
                this.update(true);
            },
            next: () => {
                let idx = this.getCurrentQuestionIndex();
                if (idx + 1 < this.questions.length) {
                    // -- Next question is valid
                    this.currentQuestionId++;
                    return this.question().current();
                } else this.currentQuestionId = -100;
            }
        }
    }


    nextQuestion() {
        this.currentQuestionId ++;
        this.update(true);
    }

    reset(removeTeams?:boolean) {
        this.question().reset();

        if (removeTeams)
            this.teams = [];

    }

    // -- >> End Question Functions

    update(bool?:boolean) {
        // -- todo trigger check
        if (typeof bool !== "undefined") {
            if (bool === false) {
                this.updatesQueued = -1;
            }
            this.updatesQueued++;
            this.needsUpdate = bool;
        } else {
            console.debug(`${this.updatesQueued} Total Updates Queued for Game: '${this.name}.'`)
            return this.updatesQueued >= MAX_QUEUE
        }
    }
}


export interface GameOptions {
    _id?:any;
    name: string;
    token: string;

    paused?: boolean;
    startTime?:string;
    description?:string;
    currentQuestionId?: number;
    started?: boolean;
    teams?: Team[]|any;
    questions?: Question[]|any;
    updatesQueued?: number;
    needsUpdate?: boolean
}

export default Game;