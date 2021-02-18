const Role = require("../Role");

class SpellingBee extends Role
{
    constructor()
    {
        super
        ({
			name: 'Spelling Bee',
			description: 'Knows all traitor allies.',
			influence: 6,
            team: 'traitor',
            playersRequired: 6
		})
    }

    AfterRolesPicked()
    {
        let traitorMsg = `**Your allies are:**`
        for (let ply of players){
            if (ply.player.team == 'traitor' && ply != SpellingBee){
                traitorMsg += `\n${ply.member.displayName}`;
            }
        }
        this.owner.member.user.send(traitorMsg);
    }
}

module.exports = SpellingBee;