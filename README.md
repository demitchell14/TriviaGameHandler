# NoTrivia
### A Trivia game runner for iTrivia, a web based, multiplayer trivia game.
The soul purpose of this package is to run the game instances based on set data received as parameters.
It consists of 5 core classes that break down a trivia game.

*This is designed to be ran server-side by something such as express.*


## Scripts

    build    - Creates both javascript and types from the typescript source.
               It also implements more strict typescript settings.
    prettier - self explanitory but applies Prettier to source
    watch    - Watches for typescript changes (development script)
    test     - Executes the entire test suite
    test-*   - Executes a test on a specified file (* = file)


#### Game.ts
The core instance. Generally, you won't be directly interacting with the other classes
involved in this. You'll generally create a game instance like this
    
    
    const game = new Game({ <Game Properties> }); 

#### Team.ts
This class consists of all data that each Team will need to play each game.
It consists of the team name, the team ID, and the history of questions answered 
by the team.

*Currently, the team also has a list of Players, but this aspect I dont' actually have 
implemented completely because I'm not actually using it right now. However, the idea is,
that each Team can have multiple players, and each player submits their intended answer,
and once each player has submitted their answer, the highest voted answer is the Team's answer.
This would add another layer to a Trivia game possibly, considering it could potentially be played
with players that are across the world.*

#### Player.ts
As explained above, this is currently unused

#### Question.ts
consists of actually 2 classes currently. `Question` and `Choice`.

`Question` holds all the information that is needed to answer questions. This includes information
like the question itself, the answer (or choices depending on question type), a point value, time limit,
as well as other stuff like a description and image if needed. This class is also responsible for 
running a question for a specified time limit and then autonomously stopping the game until the
moderator starts the next question. *In the future, you will be able to set this to automatically
start the next question, but currently requires user input*


## TODO Finish README