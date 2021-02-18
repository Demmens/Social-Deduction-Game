const Role = require("../Role");

class Psychic extends Role
{
    constructor()
    {
        super
        ({
			name: 'Psychic',
			description: 'At the start of each mission, can see the top two cards of the deck.',
			influence: 8,
            team: 'traitor'
		})
    }

    BeforeInfluenceVote()
    {
        let msg = '**Top two cards of the draw pile:**';
        for (let i = 0; i<2; i++){
            if (drawPile[i]) msg += `\n${drawPile[i]}`;
        }
        this.owner.member.user.send(msg);
    }
}

module.exports = Psychic;