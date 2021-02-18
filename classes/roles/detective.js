const Role = require("../Role");

class Detective extends Role
{
    constructor()
    {
        super
        ({
			name: 'Detective',
			description: 'Knows one innocents role.',
			influence: 10,
            team: 'innocent',
            playersRequired: 5
		})
    }

    AfterRolesPicked()
    {
        let tgt = players[Math.floor(Math.random()*players.length)];
        while ((tgt.player.team == 'traitor' || tgt == this.owner) && players.length > 1) tgt = players[Math.floor(Math.random()*players.length)];
        this.owner.member.user.send(`${tgt.member.displayName} is a ${tgt.player.role.name}`);
    }
}

module.exports = Detective;