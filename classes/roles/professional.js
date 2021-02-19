const Role = require("../Role");
const f = require("../../functions");

class Professional extends Role
{
    constructor()
    {
        super
        ({
			name: 'Professional',
			description: 'As Captain, exactly one success will be drawn between the General and Major (if possible)',
			influence: 8,
            team: 'innocent'
		})
    }

    BeforeLeaderDraw()
    {
        if (captain != this.owner) return;
        let totalCards = 3;
        if (major != null) totalCards = 4;
        let i = 0;
        let hasSuccess = false;
        let hasFail = 0;
        let cardPool = [];
        for (let card of drawPile){
            if (card == 'Success' && !hasSuccess){
                cardPool.push(card);
                drawPile.splice(i,1);
                hasSuccess = true;
            }
            if (card == 'Fail' && hasFail+1 < totalCards){
                cardPool.push(card);
                drawPile.splice(i,1);
                hasFail++;
            }
            i++;
        }

        cardPool = f.ArrRandomise(cardPool);

        if (major != null){
            for (let i = 0;i<totalCards;i++){
                if (i<2) cards.general.push(card);
                else cards.major.push(card);
            }
        } else {
            for (let card of cardPool) cards.general.push(card);
        }
    } 
}

module.exports = Professional;