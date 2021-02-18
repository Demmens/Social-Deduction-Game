const Role = require("../Role");
const f = require('../../functions');

class Gambler extends Role
{
    constructor()
    {
        super
        ({
			name: 'Gambler',
			description: 'You may type !reroll in the DM channel to reroll your target once per game.',
			influence: 8,
            team: 'traitor',
            hasTarget: false
		})
    }
}

module.exports = Gambler;