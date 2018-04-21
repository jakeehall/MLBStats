//Require the MLBStats Library
const MLBStats = require('../src/MLBStats');


//Print Manual
MLBStats.manual();


//Return VERSION version
MLBStats.version((main, sub, patch) => {
    console.log(`v${main}.${sub}.${patch}`);
});


MLBStats.gamesOnDate([
{
    search: {
        date: 0,//Shortcut for today
    },
},
{
    search: {
        date: -1,//Shortcut for yesterday
    },
},
], (dates) => {
    for (let date in dates) {
        let day = dates[date];
        //console.log(`\n${day}`);
        for (let game in day) {
            //console.log(JSON.stringify(day[game], null, 4));
            let score = '';
            //When creating your own functions it's helpful to rember that you
            //can log item to the console to view what stats you have access to
            //console.log(item);

            if (typeof(day[game].linescore) !== 'undefined') {
                score = `${day[game].linescore.r.away} - ${day[game].linescore.r.home}\n`;

                //If game is in progress print inning and inning state with outs
                if (day[game].status.status === "In Progress") {
                    score += `${day[game].status.inning_state} ${day[game].status.inning}\n`;
                    score += `${day[game].status.o} out(s)`;

                //Else if the game is over mark the score as final
                } else {
                    score += day[game].status.status;
                }

            //If the game hasn't started, then print the time that the game begins
            } else {
                score = `${day[game].time}${day[game].ampm} ${day[game].time_zone}`;
            }

            //Print out the away teams city and name and the home teams city and name
            console.log(
                `${day[game].away_team_city} ${day[game].away_team_name} @ ` +
                `${day[game].home_team_city} ${day[game].home_team_name}\n${score}\n`
            );
        }
    }
});


//PITCHER "608566" (German Marquez)
MLBStats.player({
    search: {
        playerID: 608566,
        date: {
            year: 2017,
            month: 9,
            day: 14,
            game: 1,
        },
    },
}, (players) => {
    for (let p in players) {
        if (players[p].Batting.Game.h === 1) {
            console.log(`${players[p].fullName} had ${players[p].Batting.Game.h} hit.`);
        } else {
            console.log(`${players[p].fullName} had ${players[p].Batting.Game.h} hits.`);
        }
    }
});


MLBStats.bench({search: 'gid_2017_09_17_sdnmlb_colmlb_1'}, (benches) => {
    //When creating your own functions it's helpful to rember that you
    //can log item to the console to view what stats you have access to
    //console.log(b);
    for (let b in benches) {
        let output =`Bench\n` +
                    `${benches[b].away.name} (Away)\n`;
        for (let item in benches[b].away.pitchers.pitcher) {
            let player = benches[b].away.pitchers.pitcher[item];
            output+=`${player.last}\tThrows ${player.t}\n` +
                    `Record ${player.w} - ${player.l}\n`;
        }
        output +=   `\n${benches[b].home.name} (Home)\n`;
        for (let item in benches[b].home.pitchers.pitcher) {
            let player = benches[b].home.pitchers.pitcher[item];
            output+=`${player.last}\tThrows ${player.t}\n` +
                    `Record ${player.w} - ${player.l}\n`;
        }
        console.log(output);
    }
});
