const Role = require("../Role");
const f = require('../../functions');

class FumbleBee extends Role
{
    constructor()
    {
        super
        ({
			name: 'Fumble Bee',
			description: 'While on a mission, success cards will not be drawn (if possible)',
			influence: 12,
            team: 'traitor'
		})
    }

    OverwriteLeaderDraw()
    {
        if (general != this.owner && captain != this.owner && major != this.owner) return;

        function replaceHandWithFails(hand){
            let handSize = hand.length;
            for (let card of hand) drawPile.push(card); //Fumble bee overwrites all other card manipulation roles. Make sure all cards are put back.
            hand = [];

            let i = 0;
            for (let card of drawPile){
                if (hand.length < handSize){ //Make sure they get the correct number of cards back
                    if (card == 'Fail'){
                        hand.push(card);
                        drawPile.splice(i,1);
                    }
                }
                i++;
            }
        }

        replaceHandWithFails(cards.general);
        if (players.length >= playersFor3PlayerMissions) replaceHandWithFails(cards.major);
        
        drawPile = f.ArrRandomise(drawPile);
    } 
}

module.exports = FumbleBee;