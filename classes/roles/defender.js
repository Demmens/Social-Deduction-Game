const Role = require("../Role");
const f = require('../../functions');
const defenderCost = 10;

class Defender extends Role
{
    constructor()
    {
        super
        ({
			name: 'Defender',
			description: 'You can spend 10 influence to cancel a mission fail effect.',
			influence: 14,
            team: 'innocent'
		})
    }

    BeforeResultDetermined(success)
    {
        let usedCommand = false;
        let msgArr = this.owner.member.user.dmChannel.messages.cache.array();

        for (let i = msgArr.length-1; i > 0; i--){
            let msg = msgArr[i];
            if (msg.content.toLowerCase().startsWith("!cancel")) usedCommand = true;
            if (msg.content.startsWith("You currently have") && msg.author != this.owner.member.user) break; 
        }

        if (!success && !failEffect && usedCommand){
            if (this.owner.influence < defenderCost) return this.owner.member.user.send(`You do not have enough influence to cancel the effect.`);
            this.owner.influence -= defenderCost;
            failEffect = false;
        }
    }
}

module.exports = Defender;