//Require the MLBStats Library
let MLBStats = require('../src/MLBStats');

//Return VERSION version
MLBStats.version((main, sub, patch) => {
    console.log(`v${main}.${sub}.${patch}`);
    //OUTPUT: v1.3.0
});

/*
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
        if (p.Batting.Game.h === 1) {
            console.log(`${p.fullName} has ${p.Batting.Game.h} hit.`);
        } else {
            console.log(`${p.fullName} has ${p.Batting.Game.h} hits.`);
        }
    }
});
*/
