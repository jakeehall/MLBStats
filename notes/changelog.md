## v1.2.0 [20171111]
#### Player Update (Continuing through v1.2.X)
* ADDED: Pretty Responses to the player() function:
    ``` javascript
    //For a full list for return attributes, view the readme
    Batting: {Team: Object, Empty: Object, RISP: Object, Loaded: Object, Pitch: {loves: "FT", hates: "FC"}, …}
    Date: {year: 2017, month: "09", day: 24, game: 1}
    Pitching: {Month: Object, Team: Object, Empty: Object, RISP: Object, Loaded: Object, …}
    RQ: {search: Object}
    bats: "R"
    cpos: "P"
    dob: {year: 1995, month: 02, day: 22}
    firstName: "German"
    fullName: "German Marquez"
    height: "6-1"
    lastName: "Marquez"
    number: "48"
    playerID: "608566"
    pos: "P"
    teamID: "col"
    throws: "R"
    weight: "185"
    ```
* ADDED: Returned player() variable names are now easer to use and remember
    * All objects now correctly begin with a capital character
    * Underscores removed from all player() responses, in favor of camelCase
    * gameID's are now pre-formatted in data responses
* ADDED: Extra variables are computed by MLBStats
    * fullName key added to Player
    * Player.Batting.Game.avg is now calculated to be that single games avg
    * Player.dob is now returned as a Formatted Date Object
* CHANGED: The player() function is now much cleaner and more maintainable
* CHANGED: tests/index.html now supports v1.2.0
* FIXED: General Player info is now stored under in the Player key
    * Duplicate data is no longer returned, speeding up return time
* FIXED: Player will now return Pitching stats if pos or current pos (cpos) is a 'P'
* FIXED: More descriptive code comments (Work in progress)

## v1.1.2 [20171029]
* ADDED: When searching for a game with a teamID you can now use the teamID number (Ex. coloradoRockies = 115)
* CHANGED: min files now properly include version in their name

## v1.1.1 [20171026.2]
* ADDED: v1.1.1 min file (Sorry!)

## v1.1.0 [20171026.1]
* ADDED: Searching for game with teamID and Date
* ADDED: Each object in rq (Request Query), now returned through callback
    * FIXED: Each item is also paired with its correct rq
* ADDED: GitHub documentation link to Manual
* CHANGED: /tests/test.html to support v1.1.0
* CHANGED: the gameIDtoDate function is now named gameToDate
* FIXED: Bench look up function, now allows for rq (Request Queries)
* FIXED: gamesOnDate look up function, now allows for rq (Request Queries)
* FIXED: src workflow, archive version branched will be used instead of version files
* FIXED: Miscellaneous Bugs and Optimizations

## v1.0.0 (Initial Release) [20171019]
* Look up player(s) stats (batters and pitchers)
* Look up game(s) stats
* Look up all games played on a given date
* Look up bullpens and benched players
* Search for games by player or team and date
* (rq) Request Query introduced
* Helpful console output for errors
* Forward Compatibility (Your rq code won't break with new versions!)
* Full Documentation (readme.md)
