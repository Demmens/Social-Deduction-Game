const Role = require("../Role");

class Spy extends Role
{
    constructor()
    {
        super
        ({
			name: 'Spy',
			description: 'When the general, major and captain draw cards, you are shown the first card they drew.',
			influence: 8,
            team: 'innocent'
		})
    }

    AfterCardsDisplayedToLeader()
    {
        this.owner.member.user.send(`**The general drew a ${cards.general[0]} card**`);
        if (cards.major.length != 0) this.owner.member.user.send(`**The major drew a ${cards.major[0]} card**`);
    } 

    AfterLeaderPass()
    {
        this.owner.member.user.send(`**The captain drew a ${cards.captain[0]} card**`);
    }
}

module.exports = Spy;