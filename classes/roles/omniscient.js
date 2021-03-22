const Role = require("../Role");

class Omniscient extends Role
{
    constructor()
    {
        super
        ({
			name: 'Omniscient',
			description: 'Knows all traitors, but the traitors also win if they sting you.',
			influence: 10,
            team: 'innocent',
            playersRequired: 7,
            allowTwoBees: false
		})
    }

    AfterRolesPicked()
    {
        let traitorMsg = `**The traitors are:**`
        for (let ply of players) if (ply.player.team == 'traitor') traitorMsg += `\n${ply.member.displayName}`;
        this.owner.member.user.send(traitorMsg);
    }
}

module.exports = Omniscient;