const Role = require("../Role");

class CapitalBee extends Role
{
    constructor()
    {
        super
        ({
			name: 'Capital Bee',
			description: 'Starts with 5000 influence.',
			influence: 5000,
            team: 'innocent',
            allowTwoBees: false
		})
    }
}

module.exports = CapitalBee;