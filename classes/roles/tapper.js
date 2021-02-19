const Role = require("../Role");

class Tapper extends Role
{
    constructor()
    {
        super
        ({
			name: 'Tapper',
			description: 'Learn the result of interrogations and secret messages.',
			influence: 8,
            team: 'innocent'
		})
    }

    AfterInvestigation()
    {
        this.owner.member.user.send(interrogateResult);
    }

    AfterPrivateMessage()
    {
        this.owner.member.user.send(privateMessage);
    }
}

module.exports = Tapper;