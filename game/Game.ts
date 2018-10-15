
import Team from "./Team";
import Player from "./Player";
import Question, {QuestionOptions, Type} from "./Question";

class Game {
    name: string;
    token: string;
    started: boolean;
    currentQuestionId: number;
    teams: Team[];
    questions: Question[];


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


        this.teams = options.teams || [];

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
    }

    setName(str:string) {
        this.name = str;
    }

    setToken(str: string) {
        this.token = str;
    }

    setStarted(bool: boolean) {
        this.started = bool;
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
    }

    // -- >> Team Functions

    hasTeam(team: string|Team): boolean {

        if (typeof team !== "string") {
            //console.log("WTF ", team.name);
            team = team.name;
        }

        return this.teams.find(t => t.name === team) !== undefined;
    }

    getTeam(name: string|Team):Team {

        if (typeof name !== "string")
            name = name.name;

        //console.log(name);

        let x= this.teams.find(t => t.name === name);
        //console.log(x);



        return x;
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

    }

    reset() {
        this.currentQuestionId = 0;
    }

    // -- >> End Question Functions

}


export interface GameOptions {
    name: string;
    currentQuestionId?: number;
    started?: boolean;
    token: string;
    teams?: Team[];
    questions?: Question[];
}

export default Game;