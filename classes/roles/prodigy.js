const Role = require("../Role");

class Prodigy extends Role
{
    constructor()
    {
        super
        ({
			name: 'Prodigy',
			description: 'Empowered Buzz (!prodigy command in DM channel): Buzz in secret, nobody votes, don\'t lose the game if wrong.',
			influence: 8,
            playersRequired: 1000,
            team: 'innocent'
		})
    }
}

module.exports = Prodigy;