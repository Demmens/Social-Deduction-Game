const Role = require("../Role");

class DoubleAgent extends Role
{
    constructor()
    {
        super
        ({
			name: 'Double-Agent',
			description: 'Knows one innocent and one traitor, but not which way round.',
			influence: 7,
            team: 'innocent',
            playersRequired: 5
		})
    }

    AfterRolesPicked()
    {
        let hasTraitor = false;
        let hasInnocent = false;
        let plyTbl = [];
        let tgt = players[Math.floor(Math.random()*players.length)];
        while (plyTbl.length < 2){
            tgt = players[Math.floor(Math.random()*players.length)];
            if (tgt.player.team == 'innocent' && !hasInnocent && tgt != this.owner){
                hasInnocent = true;
                plyTbl.push(tgt);
            }
            else if (tgt.player.team == 'traitor' && !hasTraitor){
                hasTraitor = true;
                plyTbl.push(tgt);
            } 
        }
        
        let x = Math.floor(Math.random()*2); //x is either 1 or 0
        this.owner.member.user.send(`**${plyTbl[x].member.displayName}** and **${plyTbl[1-x].member.displayName}** are on different teams.`)
    }
}

module.exports = DoubleAgent;