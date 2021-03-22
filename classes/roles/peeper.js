const Role = require("../Role");

class Peeper extends Role
{
    constructor()
    {
        super
        ({
			name: 'Peeper',
			description: 'Before the draw pile is shuffled, view all the remaining cards.',
			influence: 12,
            team: 'innocent',
            playersRequired: 1000
		})
    }

    BeforeShuffleDrawPile()
    {
        if (drawPile.length == 0) return;

        let msg = '**Last card in the draw pile**';
        if (drawPile.length > 1) msg = '**Last cards in the draw pile**'
        for (let card of drawPile){
            msg += `\n${card}`;
        }
        this.owner.member.user.send(msg);
    }
}

module.exports = Peeper;