const Role = require("../Role");

class Spy extends Role
{
    constructor()
    {
        super
        ({
			name: 'Spy',
			description: 'When the general draws cards, you are shown the first card they drew. Also learn the result of interrogations.',
			influence: 8,
            team: 'innocent'
		})
    }

    BeforeCardsDisplayedToLeader()
    {
        this.owner.member.user.send(`**The general drew a ${cards[0]} card**`); //Spy sees one of the cards drawn by the general.
    } 

    AfterInvestigation()
    {
        this.owner.member.user.send(interrogateResult);
    }
}

module.exports = Spy;