## v1.1.1 [20171026]
* ADDED: v1.1.1 min file (Sorry!)

## v1.1.0 [20171026]
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
