const Role = require("../Role");

class Whisperer extends Role
{
    constructor()
    {
        super
        ({
			name: 'Whisperer',
			description: 'You can secretly tell other players your role (through discord DMs).',
			influence: 10,
            team: 'innocent'
		})
    }
}

module.exports = Whisperer;