//MLBStats, a JavaScript wrapper for fetching Major League Baseball Stats
//Created By Jacob Hall
//https://github.com/jakeehall/MLBStats/

"use strict";


require('es6-promise/auto');
require('isomorphic-fetch');
let DOMParser = require('xmldom').DOMParser;

(() => {
    const MLBStats = new function() {

        const Version = {main: 1, sub: 3, patch: 0};
        //If you contributed to this project in some way, feel free to include
        //your real name and personal website as an element in the authors array
        const authors = [{name: "Jake Hall", website: "http://jakehall.me"},];



        //Alert manual, a quick reference guide for this library
        this.manual = () => {
            let manual =
                `MLBStats v${Version.main}.${Version.sub}.${Version.patch}\n\n`+
                `Created By ${authors[0].name}\t\t${authors[0].website}\n\n` +
                `For more information on how to use the MLBStats library ` +
                `check out the "readme.md" on GitHub:\n` +
                `https://github.com/jakeehall/MLBStats\n\n` +
                `If any issues related to this library occur, please report` +
                `all available issue-related information to our GitHub page!`;
            if (authors.length > 1) {
                manual += `\n\nContributors:\n`;
                for(let i = 1, len = authors.length; i < len; i++) {
                    manual += `${authors[i].name}\t\t${authors[i].website}\n`;
                }
            }
            console.log(manual);
            return manual;
        }



        /*
        Check the users library version for compatibility and troubleshooting
        CALLBACK broken down into each sub-version
        */
        this.version = (callback) => {
            return callback(Version.main, Version.sub, Version.patch);
        }



        //PASS valid date formats (listed in errorMsg below)
        //CALLBACK Formatted Date Object: {year: 2017, month: 9, day: 1, game: 1}
        this.formatDate = (date, callback) => {
            const errorMsg =
                `Invalid Date Format!\n` +
                `Use one of the lookup formats listed below:\n` +
                `1. Formatted Date Object: {year: 2017, month: 9, day: 1}\n` +
                `2. JavaScript Date Object\n` +
                `3. Shortcut Date: -1=Yesterday, 0=Today, 1=Tomorrow, ...`;

            //If no date is given, default to today
            if (typeof(date) === 'undefined') {
                date = 0;
            }

            //If shortcut is used, create JavaScript Date Object with new date
            //by converting to a JS Date object we can support. Ex: -365
            if (typeof(date) === 'number') {
                const newDate = new Date();
                newDate.setDate(newDate.getDate() + date);
                date = newDate;
            }

            //If date is object (JavaScript Date Object or Formatted Date)
            if (typeof(date) === 'object') {
                let yyyy, mm, dd, g = 1;

                //JavaScript Date Object
                if (date instanceof Date) {
                    yyyy = date.getFullYear();
                    //January is month 0, so add 1 to month
                    mm = date.getMonth()+1;
                    dd = date.getDate();

                //Formatted Date Object
                } else if ((typeof(date.year) !== 'undefined')
                        && (typeof(date.month) !== 'undefined')
                        && (typeof(date.day) !== 'undefined')) {
                    //Convert new values into numbers in case they were strings
                    yyyy = Number(date.year);
                    mm = Number(date.month);
                    dd = Number(date.day);
                    if (typeof(date.game) !== 'undefined') {
                        g = Number(date.game);
                    } else {
                        g = 1;
                    }

                //Unknown Format
                } else {
                    console.error(`${errorMsg}\nUnknown Date Object!`);
                    return callback(null);
                }

                //Add leading zero if day or month is a single digit
                if (mm < 10) mm = "0"+mm;
                if (dd < 10) dd = "0"+dd;
                //Return Formatted Date
                return callback({year: yyyy, month: mm, day: dd, game: g});
            }

            console.error(errorMsg);
            return callback(null);
        }



        //PASS gameID path or gameday
        //CALLBACK formattedGameID
        this.formatGameID = (gameID, callback) => {
            let len = gameID.length;
            if (len === 26) {
                //2017/09/23/colmlb-sdnmlb-1
                //replace '/' and '-' with '_'
                return callback('gid_'+gameID.replace(/\/|-/g, '_'));
            }
        }



        //PASS gameID or Search Object
        //RETURN Formated Date Object
        this.gameIDToDate = (search, callback) => {
            this.searchForGameID(search, (gameID) => {
                //If the gameID is found and that it is a string
                if (gameID !== null && typeof(gameID) === 'string') {

                    //Validate gameID, and extract date and game number
                    if (gameID.search('gid') === 0 && gameID.length === 30) {
                        //EXAMPLE gameID: gid_2017_09_16_sdnmlb_colmlb_1
                        let yyyy = gameID.slice(4, 8);
                        let mm = gameID.slice(9, 11);
                        let dd = gameID.slice(12, 14);
                        let g = gameID.slice(-1);
                        return callback({year: yyyy, month: mm, day: dd, game: g});
                    }

                    //Invalid gameID
                    console.error(`Cannot return Formatted Date from this gameID:\n${gameID}`);
                    return callback(null);

                //Invalid Search Object
                } else {
                    console.error(`Cannot find a gameID with this Search Object:\n${search}`);
                    return callback(null);
                }
            });
        }



        //PASS gameID as String or Search Object
        //CALLBACK gameID
        this.searchForGameID = (search, callback) => {
            const errorMsg =
                `Invalid Search Object!\n` +
                `Pass either a gameID as a String, or a Search Object:\n`+
                `{date: {year: 2017, month: 9, day: 1, game: 1}, playerID: 453568}\n` +
                `Note: Must include either a playerID or teamID member!\n`;

            //If gameID is passed in return
            if (typeof(search) === 'string') {
                return callback(search);

            //Else if search object is passed in
            } else if (typeof(search) === 'object') {
                if (typeof(search.gameID) === 'string') {
                    return callback(search.gameID);
                }

                //Format the date passed in, if no date passed set day to today
                this.formatDate(search.date, (formattedDate) => {
                    search.date = formattedDate;

                    //playerID
                    if (typeof(search.playerID) === 'number' || typeof(search.playerID) === 'string') {
                        request({
                            leauge: 'mlb',
                            date: search.date,
                            endpoint: `/batters/${search.playerID}_${search.date.game}.xml`,
                        }, (data) => {
                            this.formatGameID(data.batting.game_id, (gameID) => {
                                let gameStats = {}, seriesStats = {};

                                //search for series and game stats, set their values if available
                                for (let key in data.batting) {
                                    if (!key.startsWith('s_')) {
                                        //players series stats
                                        if (key.startsWith('ser_')) {
                                            //rename key without 'ser_'
                                            let keyName = key.slice(4);
                                            seriesStats[keyName] = data.batting[key];
                                        //players game stats
                                        } else {
                                            gameStats[key] = data.batting[key];
                                        }
                                    }
                                }

                                return callback(gameID, gameStats, seriesStats);
                            });
                        });

                    //teamID as String or Number
                    } else if (typeof(search.teamID) === 'string' || typeof(search.teamID) === 'number') {
                        //If teamID passed in is a number, then change it to a string
                        if (typeof(search.teamID) === 'number') {
                            search.teamID = (search.teamID).toString();
                        }
                        this.gamesOnDate([{
                            search: {
                                date: search.date,
                            }
                        }], (games) => {
                            if (typeof(games[0]) === 'undefined') {
                                console.warn(games);
                                return callback(null);
                            }

                            for (let i = 0, len = games[0].length; i < len; i++) {
                                let item = games[0][i];
                                if (item.away_team_id === search.teamID
                                    || item.home_team_id === search.teamID
                                    || item.away_code === search.teamID
                                    || item.away_name_abbrev === search.teamID
                                    || item.home_code === search.teamID
                                    || item.home_name_abbrev === search.teamID) {

                                    //if the search is for game one on a date
                                    if (search.date.game === 1) {
                                        this.formatGameID(item.id, (gameID) => {
                                            return callback(gameID);
                                        });
                                    } else {
                                        if (item.game_nbr === 2 || item.double_header_sw === 'Y') {
                                            this.formatGameID(item.id, (gameID) => {
                                                return callback(gameID);
                                            });
                                        } else {
                                            continue;
                                        }
                                    }
                                }
                            }
                        });

                    //Either playerID or teamID is required to return a gameID
                    } else {
                        console.error(errorMsg);
                        return callback(null);
                    }
                });

            //Unrecognized format
            } else {
                console.error(errorMsg);
                return callback(null);
            }
        }



        /*
        PASS RQ or an array of RQ (Request Query) with search
        {
            search: {
                gameID: formattGameID,
                playerID: playerID,
                teamID: teamID,
                date: date,
            }
        }
        CALLBACK players batting, pitching, and fielding stats
        */
        this.player = (RQ, callback) => {
            //If RQ (Request Query) isn't an array make it a single element array
            if (!Array.isArray(RQ)) {
                RQ = [RQ];
            }


            let players = [];
            let itemsProcessed = 0;
            let length = RQ.length;


            //Get Batting Stats for a Player
            const getBattingStats = (date, gameID, playerID, gameStats, seriesStats, callback) => {
                //Search for batter
                request({
                    leauge: 'mlb',
                    date: date,
                    endpoint: `/${gameID}/batters/${playerID}.xml`,
                }, (batterStats) => {
                    //If batter request was unsuccessful, skip this Player
                    if (batterStats === null) {
                        addPlayer(null);
                    }

                    let Player = {};

                    //General Player Stats
                    //Batting Hand
                    Player.bats = batterStats.Player.bats;
                    //current pos
                    if (typeof(batterStats.Player.current_position) !== 'undefined') {
                        Player.cpos = batterStats.Player.current_position;
                    } else {
                        //if this player doesn't have a current position
                        //on a date, then they are on the bench
                        Player.cpos = "Bench";
                    }
                    //date of birth
                    Player.dob = {};
                    let dobSplit = (batterStats.Player.dob).split('/');
                    Player.dob.month = dobSplit[0];
                    Player.dob.day = dobSplit[1];
                    Player.dob.year = dobSplit[2];
                    //Face Image URL
                    Player.faceImage = `http://gd2.mlb.com/images/gameday/mugshots/mlb/${playerID}.jpg`;
                    //First Name
                    Player.firstName = batterStats.Player.first_name;
                    //Full Name
                    Player.fullName = batterStats.Player.first_name + " " + batterStats.Player.last_name;
                    //height
                    Player.height = {};
                    let heightSplit = (batterStats.Player.height).split('-');
                    Player.height.ft = heightSplit[0];
                    Player.height.in = heightSplit[1];
                    //Last Name
                    Player.lastName = batterStats.Player.last_name;
                    //number
                    Player.number = batterStats.Player.jersey_number;
                    //playerId
                    Player.playerID = batterStats.Player.id;
                    //pos
                    Player.pos = batterStats.Player.pos;
                    //team
                    Player.teamID = batterStats.Player.team;
                    //Throwing Hand
                    Player.throws = batterStats.Player.throws;
                    //weight
                    Player.weight = batterStats.Player.weight;

                    //Batting Stats
                    Player.Batting = {};
                    //Career
                    Player.Batting.Career = batterStats.Player.career;
                    //Empty
                    Player.Batting.Empty = batterStats.Player.Empty;
                    //Game Batting Stats
                    Player.Batting.Game = gameStats;
                    //Game avg (hits / at bats)
                    let gameAvg = (Player.Batting.Game.h / Player.Batting.Game.ab);
                    //keep thousandths place in decimal, and trim leading zeros
                    Player.Batting.Game.avg = gameAvg.toFixed(3).replace(/^[0]+/g,"");
                    //abID
                    Player.Batting.Game.abID = gameStats.update_AB;
                    delete Player.Batting.Game.update_AB;
                    //gamePK
                    Player.Batting.Game.gamePK = gameStats.game_pk;
                    delete Player.Batting.Game.game_pk;
                    //lastab
                    Player.Batting.Game.lastAB = gameStats.last_at_bat;
                    delete Player.Batting.Game.last_at_bat;
                    //vs Left Handed Pitchers
                    Player.Batting.LHP = batterStats.Player.vs_LHP;
                    //Bases Loaded
                    Player.Batting.Loaded = batterStats.Player.Loaded;
                    //Men on Base
                    Player.Batting.MenOn = batterStats.Player.Men_On;
                    //Month
                    Player.Batting.Month = batterStats.Player.month;
                    //vs Pitcher
                    Player.Batting.P = batterStats.Player.vs_P;
                    //P5
                    Player.Batting.P5 = batterStats.Player.vs_P5;
                    //Pitch
                    Player.Batting.Pitch = batterStats.Player.Pitch;
                    //vs Right Handed Pitchers
                    Player.Batting.RHP = batterStats.Player.vs_RHP;
                    //RISP
                    Player.Batting.RISP = batterStats.Player.RISP;
                    //Season
                    Player.Batting.Season = batterStats.Player.season;
                    //Series Batting Stats
                    Player.Batting.Series = seriesStats;
                    //Teams Batting Stats
                    Player.Batting.Team = batterStats.Player.Team;
                    //Check if this player had at bats on date provided
                    if (batterStats.Player.atbats !== null) {
                        //abs
                        Player.Batting.abs = batterStats.Player.atbats.ab;
                        //faced pitches
                        Player.Batting.faced = batterStats.Player.faced.pitch;
                    } else {
                        //if no faced pitches, dont include faced in Player
                        delete Player.Batting.faced;
                    }
                    //ASYNC, so call LAST
                    //gameID (formats to usable)
                    this.formatGameID(gameStats.game_id, (gameID) => {
                        Player.Batting.Game.gameID = gameID;
                        delete Player.Batting.Game.game_id;
                        return callback(Player);
                    });
                });
            }


            //Get Pitching Stats for a Player
            const getPitchingStats = (date, gameID, playerID, callback) => {
                request({
                    leauge: 'mlb',
                    date: date,
                    endpoint: `/pitchers/${playerID}_${date.game}.xml`,
                }, (pitcherStats) => {
                    //Check if pitcher request was successful
                    if (pitcherStats === null) {
                        return callback(null);
                    }

                    //Set returned data as batter template
                    let Pitching = {};

                    if (Number(pitcherStats.pitching.ip) !== 0) {
                        //ip split
                        let ipSplit = (pitcherStats.pitching.ip).split('.');
                        let ipFull = ipSplit[0];
                        let ipFraction = ipSplit[1];

                        //Game
                        Pitching.Game = {};
                        //bb
                        Pitching.Game.bb = pitcherStats.pitching.bb;
                        //er
                        Pitching.Game.er = pitcherStats.pitching.er;
                        //era (9 * (er/ip))
                        let gameEra;
                        //whole inning
                        if (ipFraction === 0) {
                            gameEra = 9 * (Number(pitcherStats.pitching.er) / Number(pitcherStats.pitching.ip));
                        //fraction of an inning
                        } else {
                            gameEra = 9 * (Number(pitcherStats.pitching.er) / (parseFloat(ipFull) + (ipFraction / 3)));
                        }
                        //keep hundreds place in decimal
                        Pitching.Game.era = gameEra.toFixed(2);
                        //h
                        Pitching.Game.h = pitcherStats.pitching.h;
                        //hbp
                        Pitching.Game.hbp = pitcherStats.pitching.hbp;
                        //hra
                        Pitching.Game.hra = pitcherStats.pitching.hra;
                        //ip
                        Pitching.Game.ip = pitcherStats.pitching.ip;
                        //k
                        Pitching.Game.k = pitcherStats.pitching.k;
                        //np (Number of Pitches)
                        Pitching.Game.np = pitcherStats.pitching.np;
                        //r
                        Pitching.Game.r = pitcherStats.pitching.r;
                        //s (Strikes?)
                        Pitching.Game.s = pitcherStats.pitching.s;
                        //whip ((h + bb) / ip)
                        let gameWhip;
                        //whole inning
                        if (ipFraction === 0) {
                            gameWhip = (Number(pitcherStats.pitching.h) + Number(pitcherStats.pitching.bb)) / pitcherStats.pitching.ip;
                        //fraction of an inning
                        } else {
                            gameWhip = (Number(pitcherStats.pitching.h) + Number(pitcherStats.pitching.bb)) / (parseFloat(ipFull) + (ipFraction / 3));
                        }
                        //keep hundreds place in decimal
                        Pitching.Game.whip = gameWhip.toFixed(2);
                    }

                    //Non-basic additonal pitching stats
                    request({
                        leauge: 'mlb',
                        date: date,
                        endpoint: `/${gameID}/pitchers/${playerID}.xml`,
                    }, (extraPitchingStats) => {
                        //Check if pitcher request was successful
                        if (extraPitchingStats === null) {
                            return callback(null);
                        }

                        //B
                        Pitching.B = extraPitchingStats.Player.vs_B;
                        //B5
                        Pitching.B5 = extraPitchingStats.Player.vs_B5;
                        //Career
                        Pitching.Career = extraPitchingStats.Player.career;
                        //Empty
                        Pitching.Empty = extraPitchingStats.Player.Empty;
                        //LHP
                        Pitching.LHB = extraPitchingStats.Player.vs_LHB;
                        //Loaded
                        Pitching.Loaded = extraPitchingStats.Player.Loaded;
                        //MenOn
                        Pitching.MenOn = extraPitchingStats.Player.Men_On;
                        //Month
                        Pitching.Month = extraPitchingStats.Player.Month;
                        //Pitch
                        Pitching.Pitch = extraPitchingStats.Player.Pitch;
                        //RHP
                        Pitching.RHB = extraPitchingStats.Player.vs_RHB;
                        //RISP
                        Pitching.RISP = extraPitchingStats.Player.RISP;
                        //Season
                        Pitching.Season = extraPitchingStats.Player.season;
                            //er
                            Pitching.Season.er = pitcherStats.pitching.s_er;
                            //hbp
                            Pitching.Season.hbp = pitcherStats.pitching.s_hbp;
                            //hra
                            Pitching.Season.hra = pitcherStats.pitching.s_hra;
                            //k
                            Pitching.Season.k = pitcherStats.pitching.s_k;
                            //r
                            Pitching.Season.r = pitcherStats.pitching.s_r;
                        //Team
                        Pitching.Team = extraPitchingStats.Player.Team;

                        return callback(Pitching);
                    });
                });
            }


            let addPlayer = (Player) => {
                itemsProcessed++;
                //If player request didn't return null then add to array
                if (Player !== null) {
                    players.push(Player);
                }
                //Only callback after all players info is returned
                if(itemsProcessed === length) {
                    return callback(players);
                }
            }


            //Loop through each player passed
            RQ.forEach((item, index, array) => {
                //Find the date for this RQ item
                this.formatDate(item.search.date, (formattedDate) => {
                    this.searchForGameID(item.search, (gameID, gameStats, seriesStats) => {
                        //If no gameID is returned, stop executing function
                        if (gameID === null) {
                            return;
                        }

                        //Get Batting Stats
                        getBattingStats(formattedDate, gameID, item.search.playerID, gameStats, seriesStats, (Player) => {
                            //Set Formatted Date
                            Player.Date = formattedDate;
                            //Return RQ for current Player
                            Player.RQ = item;
                            //Check if player is a pitcher, if not return now
                            if (Player.pos === 'P' || Player.cpos === 'P') {
                                getPitchingStats(formattedDate, gameID, item.search.playerID, (Pitching) => {
                                    if (typeof(Pitching) !== null) {
                                        Player.Pitching = Pitching;
                                    }
                                    return addPlayer(Player);
                                });
                            } else {
                                return addPlayer(Player);
                            }
                        });
                    });
                });
            });
        }



        /*
        PASS RQ (Request Query) with search
        REQUIRES date, if no date passed in RQ. search then default to today
        {
            search: {
                date: date,
            }
        }
        CALLBACK todays games
        */
        this.gamesOnDate = (RQ, callback) => {
            //If RQ (Request Query) isn't an Array make it single element array
            if (!Array.isArray(RQ)) {
                RQ = [RQ];
            }

            let dates = [];
            let itemsProcessed = 0;

            //Loop through each game passed
            RQ.forEach((item, index, array) => {
                this.formatDate(item.search.date, (formattedDate) => {
                    request({
                        leauge: 'mlb',
                        date: formattedDate,
                        endpoint: `/master_scoreboard.json`,
                    }, (games) => {
                        games = games.data.games.game;
                        if (typeof(games) !== 'undefined') {
                            for (let game in games) {
                                games[game].RQ = item;
                            }
                            dates.push(games);
                        }
                        itemsProcessed++;
                        if (itemsProcessed === array.length) {
                            return callback(dates);
                        }
                    });
                });
            });
        }



        /*
        PASS gameID or RQ (Request Query) with search
        {
            search: {
                gameID: formattGameID,
                playerID: playerID,
                teamID: teamID,
                date: date,
            }
        }
        CALLBACK game info
        */
        this.game = (RQ, callback) => {
            //If RQ (Request Query) isn't an Array make it single element array
            if (!Array.isArray(RQ)) {
                RQ = [RQ];
            }

            let games = [];
            let itemsProcessed = 0;

            //Loop through each game passed
            RQ.forEach((item, index, array) => {
                this.searchForGameID(item.search, (gameID) => {
                    this.gameIDToDate(gameID, (date) => {
                        request({
                            leauge: 'mlb',
                            date: date,
                            endpoint: `/${gameID}/linescore.json`,
                        }, (game) => {
                            game.data.game.RQ = item;
                            games.push(game.data.game);
                            itemsProcessed++;
                            if (itemsProcessed === array.length) {
                                return callback(games);
                            }
                        });
                    });
                });
            });
        }



        /*
        PASS RQ (Request Query) with search
        {
            search: {
                gameID: formattGameID,
                playerID: playerID,
                teamID: teamID,
                date: date,
            }
        }
        CALLBACK bench
        */
        this.bench = (RQ, callback) => {
            //If RQ (Request Query) isn't an Array make it single element array
            if (!Array.isArray(RQ)) {
                RQ = [RQ];
            }

            let games = [];
            let itemsProcessed = 0;

            //Loop through each game passed
            RQ.forEach((item, index, array) => {
                this.searchForGameID(item.search, (gameID) => {
                    this.gameIDToDate(gameID, (date) => {
                        request({
                            leauge: 'mlb',
                            date: date,
                            endpoint: `/${gameID}/benchO.xml`,
                        }, (bench) => {
                            bench.bench.RQ = item;
                            games.push(bench.bench);
                            itemsProcessed++;
                            if (itemsProcessed === array.length) {
                                return callback(games);
                            }
                        });
                    });
                });
            });
        }
    }


    //if running in browser, Create window namespace
    if (typeof(window) !== 'undefined') {
        window.MLBStats = MLBStats;

    //Define library as CommonJS module
    } else if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
        module.exports = MLBStats;

    //Define library as AMD module
    } else if (typeof(define) === 'function' && define.amd) {
        define([], function() {
            return MLBStats;
        });
    }


})();



/*
PASS e (endpoint Object)
{
    leauge: 'mlb',
    date: formattedDate,
    endpoint: `/${gameID}/game.xml`,
}
CALLBACK requested object in JSON format
*/
function request(e, callback) {
    fetch(`http://gd2.mlb.com/components/game/` +
        `${e.leauge}/` +
        `year_${e.date.year}/` +
        `month_${e.date.month}/` +
        `day_${e.date.day}` +
        `${e.endpoint}`)
    .then((response) => {
        //If the request is successful
        if(response.status === 200) {
            response.text().then((data) => {
                //Check for XML
                if (e.endpoint.endsWith('xml')) {
                    let xml = new DOMParser().parseFromString(data, "text/xml");
                    let json = xml2json(xml);
                    return callback(JSON.parse(json));
                //Check for JSON
                } else if (e.endpoint.endsWith('json')) {
                    return callback(JSON.parse(data));
                }
                return callback(null);
            });
        //If the server gives a non-success responce status then quit
        } else {
            console.error('Status Code: ' + response.status);
            return callback(null);
        }
    })
    //Error fetching data
    .catch(function(err) {
        console.error('Fetch Error: ' + err);
        return callback(null);
    });
}



/*	This work is licensed under Creative Commons GNU LGPL License.
	License: http://creativecommons.org/licenses/LGPL/2.1/
    Version: 0.9
	Author:  Stefan Goessner/2006
	Web:     http://goessner.net/
*/
function xml2json(xml) {
   var X = {
      toObj: function(xml) {
         var o = {};
         if (xml.nodeType==1) {   // element node ..
            if (xml.attributes.length)   // element with attributes  ..
               for (var i=0; i<xml.attributes.length; i++)
                  o[xml.attributes[i].nodeName] = (xml.attributes[i].nodeValue||"").toString();
            if (xml.firstChild) { // element has child nodes ..
               var textChild=0, cdataChild=0, hasElementChild=false;
               for (var n=xml.firstChild; n; n=n.nextSibling) {
                  if (n.nodeType==1) hasElementChild = true;
                  else if (n.nodeType==3 && n.nodeValue.match(/[^ \f\n\r\t\v]/)) textChild++; // non-whitespace text
                  else if (n.nodeType==4) cdataChild++; // cdata section node
               }
               if (hasElementChild) {
                  if (textChild < 2 && cdataChild < 2) { // structured element with evtl. a single text or/and cdata node ..
                     X.removeWhite(xml);
                     for (var n=xml.firstChild; n; n=n.nextSibling) {
                        if (n.nodeType == 3)  // text node
                           o["#text"] = X.escape(n.nodeValue);
                        else if (n.nodeType == 4)  // cdata node
                           o["#cdata"] = X.escape(n.nodeValue);
                        else if (o[n.nodeName]) {  // multiple occurence of element ..
                           if (o[n.nodeName] instanceof Array)
                              o[n.nodeName][o[n.nodeName].length] = X.toObj(n);
                           else
                              o[n.nodeName] = [o[n.nodeName], X.toObj(n)];
                        }
                        else  // first occurence of element..
                           o[n.nodeName] = X.toObj(n);
                     }
                  }
                  else { // mixed content
                     if (!xml.attributes.length)
                        o = X.escape(X.innerXml(xml));
                     else
                        o["#text"] = X.escape(X.innerXml(xml));
                  }
               }
               else if (textChild) { // pure text
                  if (!xml.attributes.length)
                     o = X.escape(X.innerXml(xml));
                  else
                     o["#text"] = X.escape(X.innerXml(xml));
               }
               else if (cdataChild) { // cdata
                  if (cdataChild > 1)
                     o = X.escape(X.innerXml(xml));
                  else
                     for (var n=xml.firstChild; n; n=n.nextSibling)
                        o["#cdata"] = X.escape(n.nodeValue);
               }
            }
            if (!xml.attributes.length && !xml.firstChild) o = null;
         }
         else if (xml.nodeType==9) { // document.node
            o = X.toObj(xml.documentElement);
         }
         else
            console.error("Unhandled node type: " + xml.nodeType);
         return o;
      },
      toJson: function(o, name, ind) {
         var json = name ? ("\""+name+"\"") : "";
         if (o instanceof Array) {
            for (var i=0,n=o.length; i<n; i++)
               o[i] = X.toJson(o[i], "", ind+"\t");
            json += (name?":[":"[") + (o.length > 1 ? ("\n"+ind+"\t"+o.join(",\n"+ind+"\t")+"\n"+ind) : o.join("")) + "]";
         }
         else if (o == null)
            json += (name&&":") + "null";
         else if (typeof(o) == "object") {
            var arr = [];
            for (var m in o)
               arr[arr.length] = X.toJson(o[m], m, ind+"\t");
            json += (name?":{":"{") + (arr.length > 1 ? ("\n"+ind+"\t"+arr.join(",\n"+ind+"\t")+"\n"+ind) : arr.join("")) + "}";
         }
         else if (typeof(o) == "string")
            json += (name&&":") + "\"" + o.toString() + "\"";
         else
            json += (name&&":") + o.toString();
         return json;
      },
      innerXml: function(node) {
         var s = ""
         if ("innerHTML" in node)
            s = node.innerHTML;
         else {
            var asXml = function(n) {
               var s = "";
               if (n.nodeType == 1) {
                  s += "<" + n.nodeName;
                  for (var i=0; i<n.attributes.length;i++)
                     s += " " + n.attributes[i].nodeName + "=\"" + (n.attributes[i].nodeValue||"").toString() + "\"";
                  if (n.firstChild) {
                     s += ">";
                     for (var c=n.firstChild; c; c=c.nextSibling)
                        s += asXml(c);
                     s += "</"+n.nodeName+">";
                  }
                  else
                     s += "/>";
               }
               else if (n.nodeType == 3)
                  s += n.nodeValue;
               else if (n.nodeType == 4)
                  s += "<![CDATA[" + n.nodeValue + "]]>";
               return s;
            };
            for (var c=node.firstChild; c; c=c.nextSibling)
               s += asXml(c);
         }
         return s;
      },
      escape: function(txt) {
         return txt.replace(/[\\]/g, "\\\\")
                   .replace(/[\"]/g, '\\"')
                   .replace(/[\n]/g, '\\n')
                   .replace(/[\r]/g, '\\r');
      },
      removeWhite: function(e) {
         e.normalize();
         for (var n = e.firstChild; n; ) {
            if (n.nodeType == 3) {  // text node
               if (!n.nodeValue.match(/[^ \f\n\r\t\v]/)) { // pure whitespace text node
                  var nxt = n.nextSibling;
                  e.removeChild(n);
                  n = nxt;
               }
               else
                  n = n.nextSibling;
            }
            else if (n.nodeType == 1) {  // element node
               X.removeWhite(n);
               n = n.nextSibling;
            }
            else                      // any other node
               n = n.nextSibling;
         }
         return e;
      }
   };
   if (xml.nodeType == 9) // document node
      xml = xml.documentElement;
   var json = X.toJson(X.toObj(X.removeWhite(xml)), xml.nodeName, "\t");
   return "{\n\t" + ('\t' ? json.replace(/\t/g, '\t') : json.replace(/\t|\n/g, '')) + "\n}";
}
