
import Team from "./Team";
import Player from "./Player";
import Question, {QuestionOptions, Type} from "./Question";

const MAX_QUEUE = 1;

class Game {
    name: string;
    token: string;
    started: boolean;
    currentQuestionId: number;
    teams: Team[];
    questions: Question[];
    needsUpdate:boolean;
    private updatesQueued:number;


    constructor(options: GameOptions) {
        this.name = options.name;
        this.currentQuestionId = options.currentQuestionId || 0;

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

    answer(team:Team|number|string, choice:any) {
        if (team instanceof Team) {
            team = team.name;
        } else {
            if (typeof team === "number")
                team = this.teams[team];
        }
        team = this.getTeam(team);
        //console.log(team);
        if (team) {
            let question = this.getCurrentQuestion();
            //console.log(question);
            switch (question.type) {
                case Type.MULTIPLE_CHOICE:
                    choice = question.getChoice(choice);
                    return team.answer(question, choice)
                case Type.OPEN_ENDED:
                    return team.answer(question, choice)
            }
        }
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

    getCurrentQuestion() {
        let current = this.questions[this.currentQuestionId];
        if (current) {
            return current;
        } else {
            if (this.currentQuestionId >=this.questions.length) {
                throw new Error("Game is over. No more questions.");
            }
            console.log(this.currentQuestionId, this.questions.length);
        }
    }

    nextQuestion() {
        this.currentQuestionId ++;
        this.update(true);
    }

    reset() {
        this.currentQuestionId = 0;
        this.update(true);
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
    name: string;
    currentQuestionId?: number;
    started?: boolean;
    token: string;
    teams?: Team[];
    questions?: Question[];
    updatesQueued?: number;
    needsUpdate?: boolean
}

export default Game;