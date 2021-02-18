const Role = require("../Role");
let SuppressorTarget = null;
const SuppressorNumber = 1;

class Suppressor extends Role
{
    constructor()
    {
        super
        ({
			name: 'Suppressor',
			description: 'Sets one players influence to 1 when determining team leaders.',
			influence: 8,
            team: 'traitor'
		})
    }

    BeforeInfluenceVote()
    {
        let msg = `Type the display name of a player in a separate message to your influence number, then that player will have their influence set to ${SuppressorNumber} this round.`;
        if (SuppressorTarget) msg += ` Your last target was **${SuppressorTarget.member.displayName}**`;
        this.owner.member.user.send(msg);
    }

    BeforeInfluenceTotal()
    {
        let msgArr = this.owner.member.user.dmChannel.messages.cache.array();
        for (let i = msgArr.length-1;i>0;i--){
            let msg = msgArr[i].content.toLowerCase();
            if (msg.startsWith ('type the display') && msgArr[i].author != this.owner.member.user) break;
            for (let ply of players){
                if (ply.member.displayName.toLowerCase() == msg){
                    if (SuppressorTarget){
                        if (msg != SuppressorTarget.member.displayName.toLowerCase()) SuppressorTarget = ply;
                        else SuppressorTarget = null;
                    } else SuppressorTarget = ply;
                    break;
                }
            }
        }
        
        for (let vote of votes){
            if (vote.player == SuppressorTarget){
                vote.overwriteInfluence = SuppressorNumber;
            }
        }
    }
}

module.exports = Suppressor;