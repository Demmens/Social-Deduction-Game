const Role = require("../Role");
const Discord = require("discord.js");

class PlanBee extends Role
{
    constructor()
    {
        super
        ({
			name: 'Plan Bee',
			description: 'Choose your target.',
			influence: 8,
            team: 'traitor',
            hasTarget: false,
            playersRequired: 1000
		})
    }

    async AfterTargetsChosen()
    {
        this.owner.member.user.send(`**Type the name of the role you wish to make your target.**`); 
        let PlanBeeChoseTarget = false;
        while (!PlanBeeChoseTarget){
            var trTargetFilter = m => m.author.id === this.owner.member.user.id;
            var trMessageController = new Discord.MessageCollector(this.owner.member.user.dmChannel, trTargetFilter);
            let msg = await trMessageController.next;
            for (let role of roles){
                if (role.name.toLowerCase() == msg.content.toLowerCase()){
                    this.owner.player.target = role.owner;
                    PlanBeeChoseTarget = true;
                }
            }
        }
    }
}

module.exports = PlanBee;