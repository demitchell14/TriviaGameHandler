import Team from "./Team";
// import Player from "./Player";
import Question, { QuestionOptions, Type as QType } from "./Question";
import * as moment from "moment";
// import { Moment } from "moment";
import { ObjectId } from "bson";

const MAX_QUEUE = 1;

export class Game {
    _id: ObjectId;
    name: string;
    description: string;
    image: string;
    token: string;
    started: boolean;
    startTime: string;
    teams: Team[];
    questions: Question[];
    needsUpdate: boolean;

    paused: boolean;

    private currentQuestionId: number;
    private updatesQueued: number;

    constructor(options: GameOptions) {
        this.name = options.name;

        if (typeof options._id !== "undefined") {
            if (typeof options._id === "string")
                this._id = ObjectId.createFromHexString(options._id);
            else this._id = options._id;
        } else this._id = new ObjectId();

        this.paused =
            typeof options.paused !== "undefined" ? options.paused : true;
        this.currentQuestionId = options.currentQuestionId || 0;
        this.description = options.description;
        this.image = options.image; // TODO || "some default image"

        if (options.teams) {
            options.teams = options.teams.map((team) => {
                if (team instanceof Team) return team;
                else return new Team(team);
            });
        }

        //console.log(options.teams);
        this.teams = options.teams || [];

        // this.teams.map((t) => console.log(t.key));

        if (options.questions) {
            options.questions = options.questions.map((question) => {
                if (question instanceof Question) return question;
                else return new Question(question);
            });
        }

        this.questions = options.questions || [];
        //console.log(this.questions);
        this.started = options.started || false;
        this.token =
            options.token || this.name.toLowerCase().replace(/\s+/, "");

        if (this.token === "" || typeof this.token !== "string") {
            throw new Error("Token is required to run a Game.");
        }
        if (this.name === "" || typeof this.name !== "string") {
            throw new Error("Name is required to run a Game.");
        }
        this.needsUpdate = false;
        this.updatesQueued = 0;

        if (typeof options.startTime !== "undefined") {
            this.startTime = moment(options.startTime).format(
                "YYYY/MM/DD HH:MM a",
            );
        } else {
            this.startTime = moment().format("YYYY/MM/DD HH:MM a");
            // let d = new Date();
            // this.startTime = `${d.getFullYear()}-${d.getUTCMonth()+1}-${d.getUTCDate()} ${d.getHours()}:${d.getMinutes()}`
        }
    }

    setName(str: string) {
        this.name = str;
        this.update(true);
    }

    setToken(str: string) {
        this.token = str;
        this.update(true);
    }

    setStarted(bool: boolean) {
        this.questions.map((q) => q.setStarted(false));
        this.started = bool;
        this.update(true);
    }

    // -- >> Team Functions

    hasTeam(team: string | ObjectId | Team): boolean {
        let method = "key";
        if (typeof team === "string" && !team.match(/^\/(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)) {
            let uuidPattern = new RegExp(
                /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/,
            );
            if (team.match(uuidPattern)) throw "This is old method.";
            method = "name";
        }
        if (team instanceof Team) {
            team = team.key
        }
        console.log(team);
        // @ts-ignore
        return this.teams.find((t) => typeof team === "string" ? t[method] === team : team.equals(t[method])) !== undefined;
    }

    getTeam(team: string | ObjectId | Team): Team | null {
        let method = "key";
        if (typeof team === "string" && !team.match(/^\/(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)) {
            let uuidPattern = new RegExp(
                /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/,
            );
            if (team.match(uuidPattern)) throw "This is old method.";
            method = "name";
        }

        return this.teams.find((t) => t[method] === team);
    }

    addTeam(...teams: any[]): boolean {
        let success = teams.map((team) => {
            //console.log(team, this.hasTeam(team));
            if (!this.hasTeam(team)) {
                //console.log(team);
                if (typeof team !== "string") {
                    //console.log(team);
                    this.teams.push(team);
                } else {
                    //console.log("Here sadly,");
                    let t = new (Function.prototype.bind.apply(Team, [
                        this,
                        team,
                    ]))();
                    //console.log(t);
                    this.teams.push(t);
                }
                return true;
            }
            return false;
        });
        this.update(true);
        return success.every((s) => s === true);
    }

    removeTeam(...teams: any[]): boolean {
        let success = teams.map((team) => {
            if (team instanceof Team) team = team.name;

            let idx = this.teams.findIndex((t) => team === t.name);
            if (idx !== -1) {
                this.teams.splice(idx, 1);
                return true;
            }
            return false;
        });
        this.update(true);
        return success.every((s) => s === true);
    }

    // -- >> End Team Functions

    // -- >> Question Functions

    addQuestion(question: Question | QuestionOptions) {
        if (question instanceof Question) this.questions.push(question);
        else this.questions.push(new Question(question));

        //console.log(this.questions);
        //this.questions.push(question);
        this.update(true);
    }

    getQuestion(id: number | Question | string): Question {
        if (id instanceof Question) {
            return undefined;
        } else {
            if (typeof id === "number") return this.questions[id];
            else {
                let x = this.questions.find((q) => q.question === id);
                return x;
            }
        }

        //return this.questions.find(q => q.id === id);
    }

    getCurrentQuestionIndex() {
        if (this.currentQuestionId >= this.questions.length) return -100;

        return this.currentQuestionId;
    }

    getCurrentQuestion() {
        let current = this.questions[this.currentQuestionId];
        if (this.paused) return -1;
        if (current) {
            return current;
        } else {
            if (this.currentQuestionId >= this.questions.length) {
                throw new Error("Game is over. No more questions.");
            }
            //console.log(this.currentQuestionId, this.questions.length);
        }
    }
    question() {
        return {
            pause: () => {
                this.paused = true;
                this.questions.map((q) => q.setStarted(false));
            },
            resume: () => {
                this.paused = false;
                let curr = this.question().current();
                //if (curr) curr.setStarted(false)
            },

            current: (): Question | undefined => {
                let idx = this.getCurrentQuestionIndex();
                if (idx >= 0) {
                    //this.questions[idx].setStarted(true);
                    return this.questions[idx];
                }
            },
            reset: () => {
                this.questions.map((q) => {
                    q.setStarted(false);
                    q.timeLeft = -1;
                });
                this.currentQuestionId = 0;
                this.update(true);
            },
            next: () => {
                let curr = this.question().current();
                if (curr) curr.setStarted(false);
                let idx = this.getCurrentQuestionIndex();
                if (idx + 1 < this.questions.length) {
                    // -- Next question is valid
                    this.currentQuestionId++;
                    return this.question().current();
                } else this.currentQuestionId = -100;
            },
        };
    }

    nextQuestion() {
        this.currentQuestionId++;
        this.update(true);
    }

    reset(removeTeams?: boolean) {
        this.question().reset();

        if (removeTeams) this.teams = [];
    }

    // -- >> End Question Functions

    update(bool?: boolean) {
        // -- todo trigger check
        if (typeof bool !== "undefined") {
            if (bool === false) {
                this.updatesQueued = -1;
            }
            this.updatesQueued++;
            this.needsUpdate = bool;
        } else {
            console.debug(
                `${this.updatesQueued} Total Updates Queued for Game: '${
                    this.name
                }.'`,
            );
            return this.updatesQueued >= MAX_QUEUE;
        }
    }

    compare(comparable: Game) {
        return undefined;
    }
}

export interface GameOptions {
    _id?: ObjectId | string;
    name: string;
    token: string;

    paused?: boolean;
    startTime?: string;
    description?: string;
    image?: string;
    currentQuestionId?: number;
    started?: boolean;
    teams?: Team[] | any;
    questions?: Question[] | any;
    updatesQueued?: number;
    needsUpdate?: boolean;
}

export default Game;
