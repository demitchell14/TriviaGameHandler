import Game from "./game/Game";
import Team from "./game/Team";
import Player from "./game/Player";
import Question, {Type} from "./game/Question";
import Answer from "./game/Answer";

let games:Game[] = [];



let player1 = new Player({name: "Devin"});
let player2 = new Player({name: "Salt"});
let player3 = new Player({name: "Joe"});
let player4 = new Player({name: "John"});


let team1 = new Team({
    name:"Team 1",
    members: [player1, player2]
});
let team2 = new Team({
    name:"Team 2",
    members: [player3, player4]
});


let question1 = new Question({
    question: "Who is the president?",
});
let question2 = new Question({
    question: "Who is the Vice President?",
});
