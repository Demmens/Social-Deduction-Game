const Role = require("../Role");

class Insider extends Role
{
    constructor()
    {
        super
        ({
			name: 'Insider',
			description: 'Knows one of the traitors targets.',
			influence: 12,
            team: 'innocent',
            playersRequired: 5
		})
    }

    AfterTargetsChosen()
    {
        let ply = players[Math.floor(Math.random()*players.length)];
        let hasTgt = false;
        while (!hasTgt){
            if (targetTbl.includes(ply)){
                ply = players[Math.floor(Math.random()*players.length)];
            } else hasTgt = true;
        }
        this.owner.member.user.send(`The ${ply.player.role.name} is not a target.`);
    }
}

module.exports = Insider;