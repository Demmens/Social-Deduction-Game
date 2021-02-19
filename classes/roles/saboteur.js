const Role = require("../Role");

class Saboteur extends Role
{
    constructor()
    {
        super
        ({
			name: 'Saboteur',
			description: 'Cancels one mission success effect.',
			influence: 12,
            team: 'traitor'
		})
    }

    BeforeResultDetermined(success)
    {
        let usedCommand = false;
        let msgArr = this.owner.member.user.dmChannel.messages.cache.Array();

        for (let i = msgArr.length-1; i > 0; i--){
            let msg = msgArr[i];
            if (msg.content.toLowerCase().startsWith("!cancel")) usedCommand = true;
            if (msg.content.startsWith("You currently have") && msg.author != this.owner.member.user) break; 
        }

        if (success && !successEffect){
            if (this.used) return;
            this.used = true;
            successEffect = false;
        }
    }
}

module.exports = Saboteur;