# MLBStats
### The 2018 season is here!
By Jacob Hall

MLBStats is an easy-to-use and powerful JavaScript wrapper for fetching official Major League Baseball stats, scores, and information. MLBStats is in its initial release stages, features and support are continuously being developed.

## Highlighted Features - [Changelog](./changelog.md) / [Upcoming](https://github.com/jakeehall/MLBStats/projects)
* Easy to Use
    * Search functionality
        * Find a game by searching for a team on a date
        * Find all games on a date by searching a date
    * Shortcut to find a date relative to today
    * Flexible Functions, allow for multiple or single searches to be requested using the same function
    * Full documentation and examples
    * Helpful console error messages to resolve bugs
* Full of Functions
    * Look up player(s) stats (batting, and pitching)
    * Look up game(s) stats (linescore, plays, and more...)
    * Look up all games played on a given date
    * Look up bullpens and benched players
    * Support for minor leagues (Coming Soon*)
    * Support for double headers
    * MORE COMING SOON!
* Powerful
    * Written using functional asynchronous code.
        * IT'S FAST!!!
    * Functions are compatible with each other, allowing for the chaining of MLBStats functions.
    * It only takes one request to find every piece of information.
        * Functions return all available data for a given search subject. This saves users from bandwidth lag times when looking up stats of a similar and previous searches.

### Disclaimer
#### PLEASE USE MLBSTATS RESPONSIBLY!
This library and projects using this library, must be used for individual purposes ONLY. To use this library for bulk or commercial purposes you MUST have permission from Major League Baseball (more information below).

>[The accounts, descriptions, data and presentation in the referring page (the "Materials") are proprietary content of MLB Advanced Media, L.P ("MLBAM"). Only individual, non-commercial, non-bulk use of the Materials is permitted and any other use of the Materials is prohibited without prior written authorization from MLBAM. Authorized users of the Materials are prohibited from using the Materials in any commercial manner other than as expressly authorized by MLBAM.](http://gdx.mlb.com/components/copyright.txt)

### Dependency Credits
* #### [fetch (Polyfill)](https://github.com/github/fetch) - GitHub
* #### [whatwg-fetch](https://github.com/matthew-andrews/fetch) - Matt Andrews
* #### [xml2json](http://goessner.net/download/prj/jsonxml/) - Stefan Goessner

## Getting Started
#### Clone or Download the ZIP of _MLBStats.min.js_ from GitHub

The newest version of this file can be found in this directory on GitHub:
```
/min/MLBStats.js
```
**_NOTE: The X's are the version number._**

After downloading the library, place it in your project directory. The only file necessary to include in your project is _MLBStats.min.js_ as the rest of the files are for development of this library only.
#### Include the MLBStats Library in your HTML
```html
<script type="text/javascript" src="MLBStats.X.X.X.min.js"></script>
<!-- Change the X's to match the version number of the library! -->
```
Include this line at the end of your HTML body.

**_NOTE 1: If the MLBStats.min.js file isn't stored in the root directory of the project, change the path in the "src" attribute to where the MLBStats.min.js file is located._**

**_NOTE 2: The MLBStats library MUST be included in the projects HTML above any custom JavaScript or any JavaScript file that uses of the MLBStats library!_**

After the MLBStats library is included in the project, test that it is working by calling **MLBStats.manual()** from the JavaScript console. An alert will popup if the library is working, if there's no popup make sure there's nothing blocking alert popups in your browser, and read the notes above.

#### Alert MLBStats Manual
The MLBStats manual alerts valuable, quick-reference information on how to use the MLBStats library, as well as a links to this readme on GitHub, and other useful references. The manual also displays basic information about the library, such as, contributors and version number in the alert message.

If a problem ever occurs while working with the MLBStats library, call the MLBStats manual function below from the JavaScript console to find help.
``` javascript
MLBStats.manual();
//You should NEVER use this function in production
//This function is ONLY for quick usage help and library info
```

#### Print and Return MLBStats Version
``` javascript
//Return VERSION version
MLBStats.version((main, sub, patch) => {
    console.log(`v${main}.${sub}.${patch}`);
    //OUTPUT: v1.3.0
});
```
This function can be used to check the users library version for compatibility and troubleshooting. For example, if another library used MLBStats as a way of fetching data, that library, could also check to see if the version of MLBStats is compatible with itself.

## Important Objects and Ideas in MLBStats
### Formatted Date Object
> ``` javascript
> let date = {
>     year: 2017,
>     month: 09,
>     day: 16,
>     game: 1, //Used for double-headers
> };
> ```
> **_NOTE: If a single digit month or day is not lead with a zero, a lead zero will be added automatically._**

### Search Object
> ``` javascript
> //EXAMPLE:
> let Search = {
>     gameID: "gid_2017_09_16_sdnmlb_colmlb_1",
>     playerID: 453568,
>     teamID: 115,
>     date: {
>         year: 2017,
>         month: 09,
>         day: 16,
>         game: 1,
>     },
> };
> ```
> ``` javascript
> //Shortcut Day Number or JavaScript Date Object also work in Search
> //Search a players stats for today (Shortcut)
> let Search = {
>     gameID: "gid_2017_09_16_sdnmlb_colmlb_1",
>     playerID: 453568,
>     teamID: 115,
>     date: 0, //SHORTCUT:  -1=Yesterday  0=Today  1=Tomorrow
> };
>
>
> //ADVANCED: Search a players stats for today (JavaScript Date Object)
> let Search = {
>     gameID: "gid_2017_09_16_sdnmlb_colmlb_1",
>     playerID: 453568,
>     teamID: 115,
>     date: new Date(1503980931904), //JS Date Object: 2017-08-28
> };
> ```
> **_NOTE: playerID or teamID, and date, are required to return a gameID using a Search Object. If date is undefined in the Search Object the date will automatically be set to today._**

### rq (Request Query)
> Although rq, the Request Query feature, doesn't seem powerful at first, it allows complicated stat look ups in one step. rq is universal throughout the look up functions in MLBStats, meaning that if a rq Array is created it can be used in all of the look up functions as long as it provides the necessary data in its search for each specific lookup function. rq doesn't only have the ability to pass multiple items at once in a look up function, it also allows for flexibility to provide different types of Search Objects in each element of the rq Array, and the ability to build up a look up queue over time.
>
> Filter and Sort are planned to be added into rq in v2.0.0, but don't worry, rq is forward compatible so code written now will not break as features are added.
>
> ``` javascript
> let rq =
> [{
>     search: {
>         //What were Charlie Blackmon's stats on 2017-09-01?
>         playerID: 453568, //Charlie Blackmon
>         date: {
>             year: 2017,
>             month: 9,
>             day: 1,
>         },
>     },
> },
> {
>     search: {
>         //How did Mark Renyolds do Yesterday?
>         playerID: 448602, //Mark Renyolds
>         date: -1, //SHORTCUT: Yesterday
>     },
> },
> {
>     search: {
>         //Who's playing left field for the Rockies today?
>         teamID: 115,
>         pos: "LF",
>         date: 0, //Today
>     },
> },];
> ```
> **_NOTE: rq (Request Query) can be used to request single or multiple searches at once, in any of the MLBStats look up functions (player, game, bench, gamesOnDate, etc...)._**

### "The Shortcut"
> The shortcut is used to quickly look-up, or automate, days in relation to today. Simply pass an integer value in as a date, and a formatted date will be constructed and used.
> ##### Visualization Key:
> ``` javascript
> date: 1, //Tomorrow
> date: 0, //Today
> date: -1, //Yesterday
> date: -2, //The day before Yesterday
> date: -7, //Last Week on this day
> date: -30, //Last Month
> date: -365, //A Year Ago
> ...
>```

### Formatting a date
> ##### From Shortcut Date, JavaScript Date Object, Formatted Date Object:
> ``` javascript
> //Shortcut:
> MLBStats.formatDate(0, (formattedDate) => {
>   let today = formattedDate;
> });
>
>
> //JavaScript Date Object:
> MLBStats.formatDate(new Date(1503980931904), (formattedDate) => {
>   let date = formattedDate;
> });
>
>
> //Formatted Date Object
> //This shouldn't be used, but this will check and fix errors
> MLBStats.formatDate(
> {
>   year: 2017,
>   month: 10,
>   day: 1,
> }, (formattedDate) => {
>   let date = formattedDate;
> });
> //If there's no game key found inside date, game will default to 1
> ```
> ``` javascript
> //From gameID:
> MLBStats.gameIDToDate('gid_2017_09_16_sdnmlb_colmlb_1', (formattedDate) => {
>   let date = formattedDate;
> });
> ```

### Searching for a gameID
> ##### Requirements for gameID Search (One of the following):
> * gameID
> * playerID and date
> * teamID and date
> ##### Examples:
> ``` javascript
> //Only using gameID
> //This should only be used when necessary, as gameID can be passed
> //directly rather than using a Search Object.
> let Search =
> {
>   gameID: 'gid_2017_09_16_sdnmlb_colmlb_1', //Known GameID
> };
>
>
> //playerID and date
> let Search =
> {
>   playerID: 453568, //Charlie Blackmon
>   date: {
>       year: 2017,
>       month: 9,
>       day: 16,
>       game: 1,
>   },
> };
>
>
> //teamID and date
> let Search =
> {
>   teamID: 115, //Rockies
>   date: -1, //SHORTCUT: Yesterday
> };
> ```

### Searching for a Player
> ##### Requirements for Searching for a Player:
> * playerID (date will be default date)
> * playerID and date
> * teamID and player position
> ``` javascript
> //Only using playerID
> //For efficiency, it is good practice to use playerID and date instead!
> let Search =
> {
>   playerID: 453568, //Charlie Blackmon
> };
> //Date will default to Today.
>
>
> //playerID and date
> let Search =
> {
>   playerID: 453568, //Charlie Blackmon
>   date: -1, //SHORTCUT: Yesterday
> };
>
>
> //teamID and player position
> let Search =
> {
>   teamID: "col", //Rockies
>   pos: "CF", //Centerfield
> };
> ```

## Fetching Game(s)
#### gamesOnDate(date, callback)
#### game(gameID, callback)
### All Games on a Date
``` javascript
//Search for games today and on 09/04/2017
MLBStats.gamesOnDate([
{
    search: {
        date: 0, //Shortcut for today
    },
},
{
    search: {
        date: {year: 2017, month: 9, day: 4},
    },
},], (results) => {
    if (results !== null && Array.isArray(results)) {
        results.forEach((item) => {
            item.forEach((game) => {
                let score = '';
                //When creating your own functions it's helpful to rember that you
                //can log item to the console to view what stats you have access to
                //console.log(item);

                if (typeof(game.linescore) !== 'undefined') {
                    score = `${game.linescore.r.away} - ${game.linescore.r.home}\t`;

                    //If game is in progress print inning and inning state with outs
                    if (game.status.status === "In Progress") {
                        score += `${game.status.inning_state} ${game.status.inning}\t`;
                        score += `${game.status.o} out(s)`;

                    //Else if the game is over mark the score as final
                    } else {
                        score += game.status.status;
                    }

                //If the game hasn't started, then print the time that the game begins
                } else {
                    score = `${game.time}${game.ampm} ${game.time_zone}`;
                }

                //Print out the away teams city and name and the home teams city and name
                console.log(`${game.away_team_city} ${game.away_team_name} @ ${game.home_team_city} ${game.home_team_name}\n${score}`);
            });
        });
    }
});
```
### Games on a Dates
``` javascript
//Find a single game for each search in rq
let rq =
[{
    search: {
        playerID: 453568, //Using playerID
        date: {
            year: 2017,
            month: 9,
            day: 1,
            game: 1
        },
    },
},
{
    search: {
        teamID: 'col', //Using teamID
        date: {
            year: 2017,
            month: 9,
            day: 4,
            game: 1,
        },
    },
}];


MLBStats.game(rq, (g) => {
    if (Array.isArray(g)) {
        //When creating your own functions it's helpful to remember that you
        //can log item to the console to view what stats you have access to
        //console.log(g);

        for (let i = 0, len = g.length; i < len; i++) {
            //Print out the away teams city and name and the home teams city and name
            console.log(`${g[i].away_team_city} ${g[i].away_team_name} @ ${g[i].home_team_city} ${g[i].home_team_name}`);
        }
    }
});
```

## Fetching Player(s) Stats
#### player(search, callback)
``` javascript
//PITCHER "608566" (German Marquez)
MLBStats.player({
    search: {
        playerID: 608566,
        date: {
            year: 2017,
            month: 9,
            day: 24,
            game: 1,
        },
    },
}, (p) => {
    if (p !== null) {
        p = p[608566];
        let batterName = p.batter.first_name + " " + p.batter.last_name;
        if (p.batter.game.h === 1) {
            console.log(`${batterName} has ${p.batter.game.h} hit.`);
        } else {
            console.log(`${batterName} has ${p.batter.game.h} hits.`);
        }
    }
});
```

## Fetching Bullpen and Benched Players
#### bench(gameID, callback)
``` javascript
//Print the bench and bullpen for a given game
let rq =
[{
    search = {
        playerID = 453568,
        date = {
            year = 2017,
            month = 9,
            day = 4,
            game = 1,
        },
    },
},];


MLBStats.bench(rq, (b) => {
    //When creating your own functions it's helpful to remember that you
    //can log item to the console to view what stats you have access to
    //console.log(b);
    let output =`Bench\n` +
                `${b.away.name} (Away)\n`;
    for (let item in b.away.pitchers.pitcher) {
        let player = b.away.pitchers.pitcher[item];
        output+=`${player.last}\tThrows ${player.t}\n` +
                `Record ${player.w} - ${player.l}\n`;
    }
    output +=   `\n${b.home.name} (Home)\n`;
    for (let item in b.home.pitchers.pitcher) {
        let player = b.home.pitchers.pitcher[item];
        output+=`${player.last}\tThrows ${player.t}\n` +
                `Record ${player.w} - ${player.l}\n`;
    }
    console.log(output);
});
//Although it's not shown in this demo, remember that you can chain functions
//allows returned benched playerID's to then searched with the player function
```

## How to Contribute
1. Clone from the master branch.
2. Create a working branch for yourself.
3. Create and test your work.
4. Add and Commit your changes (Don't forget to add commit messages).
5. Create Pull Request.

Feel free to add your name and website (optional) to our authors list!
