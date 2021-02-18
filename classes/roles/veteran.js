const Role = require("../Role");
const f = require("../../functions");

class Veteran extends Role
{
    constructor()
    {
        super
        ({
			name: 'Veteran',
			description: 'As general or major, always draw a success card (if possible)',
			influence: 10,
            team: 'innocent'
		})
    }

    BeforeLeaderDraw()
    {
        if (general != this.owner && major != this.owner) return;
        let hand = cards.general;
        if (this.owner == major) hand = cards.major;
        let i=0;
        for (let card of hand){
            if (card == 'Success') return; //if a success is already in the hand, we don't need to add another.
        }
        for (let card of drawPile){
            if (cards.length < shouldDraw){
                if (card == 'Success'){
                    hand.push(card);
                    drawPile.splice(i,1);
                    break;
                }
            }
            i++;
        }
        drawPile = f.ArrRandomise(drawPile); //Shuffle the draw pile since we just picked the first success out of it.
    } 
}

module.exports = Veteran;