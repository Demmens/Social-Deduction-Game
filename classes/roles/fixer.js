const Role = require("../Role");
const maxFixerUses = 2;
var fixerUses = 0;

class Fixer extends Role
{
    constructor()
    {
        super
        ({
			name: 'Fixer',
			description: `${maxFixerUses} times per game, choose the winner of the influence vote.`,
			influence: 10,
            playersRequired: 1000,
            team: 'traitor'
		})
    }

    AfterRolesPicked()
    {
        fixerUses = 0;
    }

    BeforeInfluenceVote()
    {
        if (!this.used){
            this.owner.member.user.send(`Type the display name of a player in a separate message before your influence vote. That player will win the influence vote.`);
        }
    }

    BeforeVoteResult()
    {
        if (!this.used){
            let arr = this.owner.member.user.dmChannel.messages.cache.array();
            for (let i = arr.length-1; i > 0; i--){
                let msg = arr[i];
                if (msg.content.startsWith('Type the display name of a player') && msg.author != this.owner.member.user) break;
                for (let vote of votes){
                    if (vote.player.member.displayName.toLowerCase() == msg.content.toLowerCase()){
                        fixerUses++;
                        if (fixerUses >= maxFixerUses) this.used = true;
                        vote.overwriteInfluence = 1000000;
                    }
                }
            }
        }
    }
}

module.exports = Fixer;