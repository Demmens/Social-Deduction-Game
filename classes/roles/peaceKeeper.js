const Role = require("../Role");

class PeaceKeeper extends Role
{
    constructor()
    {
        super
        ({
			name: 'Peace Keeper',
			description: 'Once per game may disarm a player. If that player is a traitor, their sting is removed.',
			influence: 8,
            team: 'innocent',
            playersRequired: 5
		})
    }

    AfterRolesPicked()
    {
        this.owner.member.user.send(`Type !disarm in the DM channel when you think you know the identity of a traitor. Their sting will be disabled.`);
    }
}

module.exports = PeaceKeeper;