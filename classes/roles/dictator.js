const Role = require("../Role");

class Dictator extends Role
{
    constructor()
    {
        super
        ({
			name: 'Dictator',
			description: 'Votes cannot fail if you are on the mission.',
			influence: 10,
            playersRequired: 5,
            team: 'traitor'
		})
    }

    BeforeVoteResult()
    {
        if (captain == this.owner || general == this.owner){
            yesTotal += 1000;
        }
    }
}

module.exports = Dictator;