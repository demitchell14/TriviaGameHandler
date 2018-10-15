//import Question, {Types} from "./bin/game/Question";

const MongoClient   = require("mongodb").MongoClient;
const assert         = require("assert");

const mongo_url = "mongodb://localhost:27017";
const db_name = "trivia";

const Game = require("./bin/game/Game").default;
const Team = require("./bin/game/Team").default;
const {default:Question, Types} = require("./bin/game/Question");


MongoClient.connect(mongo_url, {

}).then(async (client) => {
    const GAME_ID = "game123";
    const db = client.db(db_name);

    const collection = db.collection("games");


    //collection.countDocuments({ token : "game123"}).then(res => console.log(res));

    let document = await collection.findOne({token: GAME_ID});

    if (document) {

        let game = new Game(document);

        try {
            let current = game.getCurrentQuestion();
            //game.addTeam(generateTeam("Team 1", "Devin", "John"))

            game.answer(game.getTeam("Team 1"), "We live");




            //game.removeTeam("Team 1");
            //current.answer(game.getTeam())

            //console.log(current);

            //game.setStarted(!game.started);

            //game.answer(game.getTeam("Team 1"), "Whatever, it is what it is.");
           // game.getTeam("Team 1").answer("haha");


            game.nextQuestion();
        } catch(err) {
            console.error(err);
            game.reset();
        }
        collection.findOneAndUpdate({token: game.token}, {$set: game}).then(doc => {
            console.log(doc);
        });
    }





    //collection.findOneAndUpdate({token: GAME_ID}, {$set:game}).then(res => {
     //   console.log(res);
    //}).catch(err => console.log(res));

    //})
//    collection.removeOne( { name: "Game Test!" });

    return client;
}).then(client => client.close())
    .catch(err => console.error(err));

let addQuestion = async function(collection, game, q) {

    let question = new Question({
        question: "Well.. that happened?",
        //answer: "We live",
        choices: [
            {answer: "We live", correct: true},
        ]
        //id: 0,
    });

    question.addChoice({ answer: "We die" });
    question.addChoices("We Die!!", "Hello World!");

    question.setAnswer("Hello World!");
    question.setAnswer(2);

    question.addChoice({answer: "Whatever, it is what it is.", correct: true});

    return await question;
};

let generateTeam = function(name, ...players) {
    let team = new Team(name);
    players.map(p => team.addMember(p));

    return team;
}