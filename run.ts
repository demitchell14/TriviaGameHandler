import Game from "./game/Game";
import Team from "./game/Team";
import Player from "./game/Player";
import Question, {Type} from "./game/Question";
import Answer from "./game/Answer";

let games:Game[] = [];



let player1 = new Player(1, "Devin");
let player2 = new Player(2, "Salt");
let player3 = new Player(3, "Door");
let player4 = new Player(4, "John");


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

let game = new Game({
    name: "Game",
    teams: [team1, team2],
    questions: [question1, question2]
})

game.addQuestion({
    question: "Who made this?",
});



let toAnswerTeam = game.getTeam("Team 1");
let toAnswer = game.getQuestion(1);



//te.answer(1, "");
//console.log(question1, question2);
//console.log(team1, team2);
//console.log(game.getTeam("Team 1"));
//console.log(game.getTeam("Team 2"));

game.addQuestion({
    question: "What happens?",
});

game.addQuestion({
    question: "What is the answer to the universe?",
    answer: "42",
    type: Type.OPEN_ENDED
});

console.log(game);