//MLBStats, a Major League Baseball Stats library written in JavaScript
//Created By Jacob Hall

((window) => {
    'use strict';
    function define_library() {
        const version = {main: 1, sub: 1, patch: 0};
        //If you contributed to this project in some way, feel free to include
        //your real name and personal website as an element in the authors array
        const authors = [{name: "Jake Hall", website: "http://jakehall.me"},];

        let MLBStats = {};



        //Alert manual, a quick reference guide for this library
        MLBStats.manual = () => {
            let manual =
                `MLBStats\n` +
                `v${version.main}.${version.sub}.${version.patch}\n\n` +
                `Created By:\n` +
                `${authors[0].name}\t${authors[0].website}\n\n` +
                `For more information on how to use the MLBStats library ` +
                `check out the "readme.md" on GitHub here (Copy & Paste):\n\n` +
                `https://github.com/jakeehall/MLBStats/blob/master/readme.md\n\n` +
                `If any issues related to this library occur, please report` +
                `all available issue-related information to our GitHub page!`;
            if (authors.length > 1) {
                manual += `\n\nContributors:\n`;
                for(let i = 1, len = authors.length; i < len; i++) {
                    manual += `${authors[i].name}\t${authors[i].website}\n`;
                }
            }
            alert(manual);
        }



        /*
        Check the users library version for compatibility and troubleshooting
        PASS true, to output log the formatted version string to the console
        RETURN the version object:
        {
            main: 1,
            sub: 0,
            patch: 0,
        }
        */
        MLBStats.version = (log = false) => {
            if(log) {
                console.log(`v${version.main}.${version.sub}.${version.patch}`);
            }
            return version;
        }



        //TRY CATCH THROW
        //PASS valid date formats (listed in errorMsg below)
        //RETURN Formatted Date Object: {year: 2017, month: 9, day: 1, game: 1}
        MLBStats.formatDate = (date) => {
            let errorMsg =
                `Invalid Date Format!\n` +
                `Use one of the lookup formats listed below:\n` +
                `1. Shortcut Date: -1=Yesterday, 0=Today, 1=Tomorrow...\n` +
                `2. Formatted Date Object: {year: 2017, month: 9, day: 1}\n` +
                `3. JavaScript Date Object`;

            //If no date is given, default to today
            if (typeof(date) === 'undefined')
                date = 0;

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
                    mm = date.getMonth()+1;//January is month 0
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
                    }

                //Unknown Format
                } else {
                    console.error(`${errorMsg}\nUnknown Date Object!`);
                    return null;
                }

                //Add leading zero if day or month is a single digit
                if (mm < 10) mm = "0"+mm;
                if (dd < 10) dd = "0"+dd;

                //Return Formatted Date
                return {year: yyyy, month: mm, day: dd, game: g};
            }
            console.error(errorMsg);
            return null;
        }



        //PASS gameID path or gameday
        //RETURN gameID
        MLBStats.formatGameID = (unformattedGameID) => {
            let len = unformattedGameID.length;
            if (len === 26) {
                //2017/09/23/colmlb-sdnmlb-1
                //replace '/' and '-' with '_'
                return 'gid_'+unformattedGameID.replace(/\/|-/g, '_');
            }
        }



        //PASS gameID or Search Object
        //RETURN Formated Date Object
        MLBStats.gameToDate = (search, callback) => {
            MLBStats.searchForGameID(search, (gameID) => {
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



        //TRY CATCH THROW
        //PASS gameID as String or Search Object
        //CALLBACK gameID
        MLBStats.searchForGameID = (search, callback) => {
            let errorMsg =
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
                search.date = MLBStats.formatDate(search.date);

                //playerID
                if (typeof(search.playerID) === 'number' || typeof(search.playerID) === 'string') {
                    request({
                        leauge: 'mlb',
                        date: search.date,
                        endpoint: `/batters/${search.playerID}_${search.date.game}.xml`,
                    }, (data) => {
                        let gameID = MLBStats.formatGameID(data.batting.game_id);

                        let gameStats = {}, seriesStats = {};

                        //search for series and game stats, set their values if available
                        for (let key in data.batting) {
                            if (!key.startsWith('s_')) {
                                if (key.startsWith('ser_')) {
                                    let keyName = key.slice(4);
                                    seriesStats[keyName] = data.batting[key];
                                } else {
                                    gameStats[key] = data.batting[key];
                                }
                            }
                        }

                        return callback(gameID, gameStats, seriesStats);
                    });

            //teamID as String or Number
            } else if (typeof(search.teamID) === 'string' || typeof(search.teamID) === 'number') {
                //If teamID passed in is a number, then change it to a string
                if (typeof(search.teamID) === 'number') {
                    search.teamID = (search.teamID).toString();
                }
                MLBStats.gamesOnDate([{
                    search: {
                        date: search.date,
                    }
                }], (games) => {
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
                                let gid = MLBStats.formatGameID(item.id);
                                return callback(gid);
                            } else {
                                if (item.game_nbr === 2 || item.double_header_sw === 'Y') {
                                    let gid = MLBStats.formatGameID(item.id);
                                    return callback(gid);
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

            //Unrecognized format
            } else {
                console.error(errorMsg);
                return callback(null);
            }
        }



        /*
        PASS rq or an array of rq (Request Query) with search
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
        MLBStats.player = (rq, callback) => {
            //If rq (Request Query) isn't an array make it a single element array
            if (!Array.isArray(rq)) {
                rq = [rq];
            }

            let players = {};
            let itemsProcessed = 0;
            let length = rq.length;

            let addPlayer = (player) => {
                itemsProcessed++;
                //If player request didn't return null then add to array
                if (player !== null) {
                    players[player.batter.id] = player;
                }
                //Only callback after all players info is returned
                if(itemsProcessed === length) {
                    return callback(players);
                }
            }

            //Loop through each player passed
            rq.forEach((item, index, array) => {
                let date = MLBStats.formatDate(item.search.date);

                MLBStats.searchForGameID(item.search, (gameID, gameStats, seriesStats) => {
                    //If no gameID is returned, don't continue executing function
                    if (gameID === null) {
                        addPlayer(null);
                    } else {
                        //Search for batter
                        request({
                            leauge: 'mlb',
                            date: date,
                            endpoint: `/${gameID}/batters/${item.search.playerID}.xml`,
                        }, (batterStats) => {
                            //Create player object, batter and pitcher stored in same player
                            let player = {};

                            //Check if batter request was successful
                            if (batterStats === null) {
                                addPlayer(null);
                            }

                            player.batter = batterStats.Player;
                            player.batter.game = gameStats;
                            player.batter.series = seriesStats;
                            player.date = date;
                            player.rq = item;

                            //Check if player is a pitcher, if not return now
                            if (batterStats.Player.pos !== 'P') {
                                addPlayer(player);
                            } else {
                                //Search for pitcher
                                request({
                                    leauge: 'mlb',
                                    date: date,
                                    endpoint: `/${gameID}/pitchers/${item.search.playerID}.xml`,
                                }, (pitcherStats) => {
                                    //Check if pitcher request was successful
                                    if (pitcherStats !== null) {
                                        player.pitcher = pitcherStats.Player;
                                    }
                                    addPlayer(player);
                                });
                            }
                        });
                    }
                });
            });
        }



        /*
        PASS rq (Request Query) with search
        REQUIRES date, if no date passed in rq. search then default to today
        {
            search: {
                date: date,
            }
        }
        CALLBACK todays games
        */
        MLBStats.gamesOnDate = (rq, callback) => {
            //If rq (Request Query) isn't an Array make it single element array
            if (!Array.isArray(rq)) {
                rq = [rq];
            }

            let dates = [];
            let itemsProcessed = 0;

            //Loop through each game passed
            rq.forEach((item, index, array) => {
                let date = MLBStats.formatDate(item.search.date);
                request({
                    leauge: 'mlb',
                    date: date,
                    endpoint: `/master_scoreboard.json`,
                }, (games) => {
                    if (typeof(games.data.games.game) !== 'undefined') {
                        games.data.games.game.rq = item;
                        dates.push(games.data.games.game);
                    }
                    itemsProcessed++;
                    if(itemsProcessed === array.length)
                        return callback(dates);
                });
            });
        }



        //fix pass gameID
        /*
        PASS gameID or rq (Request Query) with search
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
        MLBStats.game = (rq, callback) => {
            //If rq (Request Query) isn't an Array make it single element array
            if (!Array.isArray(rq)) {
                rq = [rq];
            }

            let games = [];
            let itemsProcessed = 0;

            //Loop through each game passed
            rq.forEach((item, index, array) => {
                MLBStats.searchForGameID(item.search, (gameID) => {
                    MLBStats.gameToDate(gameID, (date) => {
                        request({
                            leauge: 'mlb',
                            date: date,
                            endpoint: `/${gameID}/linescore.json`,
                        }, (game) => {
                            game.data.game.rq = item;
                            games.push(game.data.game);
                            itemsProcessed++;
                            if(itemsProcessed === array.length)
                                return callback(games);
                        });
                    });
                });
            });
        }



        /*
        PASS gameID or rq (Request Query) with search
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
        MLBStats.bench = (rq, callback) => {
            //If rq (Request Query) isn't an Array make it single element array
            if (!Array.isArray(rq)) {
                rq = [rq];
            }

            let games = [];
            let itemsProcessed = 0;

            //Loop through each game passed
            rq.forEach((item, index, array) => {
                MLBStats.searchForGameID(item.search, (gameID) => {
                    MLBStats.gameToDate(gameID, (date) => {
                        request({
                            leauge: 'mlb',
                            date: date,
                            endpoint: `/${gameID}/benchO.xml`,
                        }, (bench) => {
                            bench.bench.rq = item;
                            games.push(bench.bench);
                            itemsProcessed++;
                            if(itemsProcessed === array.length)
                                return callback(games);
                        });
                    });
                });
            });
        }


        return MLBStats;
    }

    //Define library when the page is loaded
    if (typeof(MLBStats) === 'undefined') {
        window.MLBStats = define_library();//create namespace
    }

})(window);


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
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = false;
    xhr.addEventListener('readystatechange', function() {
        if (this.readyState === 4) {
            if (this.status === 200) {
                //Check for XML, if XML convert to JSON
                if (e.endpoint.endsWith('xml')) {
                    let xml = new DOMParser().parseFromString(this.responseText, "text/xml");
                    let json = xml2json(xml);
                    //console.warn(json);//DEBUG
                    return callback(JSON.parse(json));
                } else if (e.endpoint.endsWith('json')) {
                    //console.warn(this.responseText);//DEBUG
                    return callback(JSON.parse(this.responseText));
                }
                return callback(null);
            }
        }
    });
    xhr.open('GET', `http://gd2.mlb.com/components/game/` +
                    `${e.leauge}/` +
                    `year_${e.date.year}/` +
                    `month_${e.date.month}/` +
                    `day_${e.date.day}` +
                    `${e.endpoint}`,
                    true);
    xhr.send(null);
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
