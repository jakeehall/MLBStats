## v1.3.0 [20180421]
#### Ease-of-Use, Wider Browser/Node Support, Callback/General Speed, and Fixes Update
* ADDED: More pitching stats!
    * Game: bb, er, era, h, hbp, hra, ip, k, np, r, s, whip
    * Season: er, hbp, hra, k, r
* ADDED: A players face image URL is now returned under the 'faceImage' key, when looking up Players.
* ADDED: Support for CommonJS and AMD, while keeping Browser Support.
    * Testing for Node can be found at /examples/nodeapp.js
* ADDED: Browserify + Babel Transpilers
    * All dependencies are now included in one minimized bundle JavaScript file. This allows for dependency support in browsers.
    * There's now a map for the bundle, for easier debugging.
* ADDED: Polyfills for JavaScript fetch and promises.
    * Older browsers are now supported, and Node can now make HTTP requests using the fetch polyfill.
* CHANGED: XMLHttpRequest to fetch
* CHANGED: All functions now return data through callback functions.
    * This change was made to benefit the future of this library. By making all functions have callbacks the API becomes consistent and easier to remember. Also if more async functions are added the library will also immediately become faster.
* CHANGED: Signature of
    * formatDate(date) to formatDate(date, callback)
    * formatGameID(gameID) to formatGameID(gameID, callback)
    * version(log = true) to version(callback)
        * The version function no longer prints the current libraries version to the JavaScript console log. To check your library version, please use the manual() function, or use the version(callback) function to log the version yourself (See example below).
        * The version function now returns the sub-versions through the callback:
            ``` javascript
            //Return VERSION version
            MLBStats.version((main, sub, patch) => {
                console.log(`v${main}.${sub}.${patch}`);
                //OUTPUT: v1.3.0
            });
            ```
* CHANGED: gameToDate function name to gameIDToDate, for consistency.
* CHANGED: A Players date of birth is now returned as a formatted date object.
* CHANGED: A Players height is now returned as a height object.
    ``` javascript
    //A 6 foot, 1 inch player:
    {ft: "6", in: "1"}
    ```
* CHANGED: examples/index.html and readme.md to reflect the changes made in v1.3.0.
* FIXED: Nasty anti-pattern on users side when returning players and fixes issue #1 (Can't lookup the same player multiple times using a single player lookup RQ).
    * Players are no longer returned by their playerID. Instead they are pushed to array in the order that their data is returned from the server.
* FIXED: Player lookup function is now cleaner and faster.
    * cleanPlayerResponse function was removed from the Player lookup function.
    * A new Player object is created rather than modifying the existing one.
* FIXED: RQ would be its own separate item of the returned array of games when using the gamesOnDate lookup.
    * The RQ for gamesOnDate is now stored in each individual game.
* FIXED: Player no longer returns pitching game stats if that player isn't pitching.
* FIXED: test/index.html gamesOnDate example to work with RQ
* FIXED: MLBStats.manual() now logs rather than alerting, this way it can support the Browser and Node.
    * The manual string data is now returned, allowing for the manual to be displayed in different ways, E.g.:
    ``` javascript
        alert(MLBStats.manual()); //Only in browsers
    ```
* FIXED: A warning message will no longer appear in the JavaScript console when a player is looked up.

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
* FIXED: Bench lookup function, now allows for rq (Request Queries)
* FIXED: gamesOnDate lookup function, now allows for rq (Request Queries)
* FIXED: src workflow, archive version branched will be used instead of version files
* FIXED: Miscellaneous Bugs and Optimizations

## v1.0.0 (Initial Release) [20171019]
* lookup player(s) stats (batters and pitchers)
* lookup game(s) stats
* lookup all games played on a given date
* lookup bullpens and benched players
* Search for games by player or team and date
* (rq) Request Query introduced
* Helpful console output for errors
* Forward Compatibility (Your rq code won't break with new versions!)
* Full Documentation (readme.md)
