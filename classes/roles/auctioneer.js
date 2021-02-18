const Role = require("../Role");
const f = require('../../functions');

class Auctioneer extends Role
{
    constructor()
    {
        super
        ({
			name: 'Auctioneer',
			description: ' Instead of putting forth influence, outbid a chosen player by a selected number of influence (if you have enough). Wins influence ties.',
			influence: 15,
            team: 'innocent'
		})
    }

    BeforeInfluenceVote()
    {
        if (barredPlys.includes(this.owner)) return;
        this.owner.member.user.send(`In a separate message to your influence, type \`outbid X\` where X is the display name of the player you wish to outbid.\nYou will outbid this player by a number equal to the influence you put forth (if possible).`)
    }

    BeforeInfluenceTotal()
    {
        let AuctioneerTarget = null;
        let msgArr = this.owner.member.user.dmChannel.messages.cache.array();
        for (let i = msgArr.length-1; i> 0; i--){
            if (msgArr[i].content.startsWith('In a separate message') && msgArr[i].author != this.owner.member.user) break;
            for (let ply of players){
                if ("outbid " + ply.member.displayName.toLowerCase() == msgArr[i].content.toLowerCase()){
                    AuctioneerTarget = ply;
                    break;
                }
            }
        }

        for (let vote of votes){
            if (vote.player == this.owner){ //Find the player the auctioneer is trying to outbid
                for (let vote2 of votes){
                    if (vote2.player == AuctioneerTarget){
                        let influence = vote2.influence + vote.influenceSpent; //add the influence they put forth to the influence of their target
                        totalInfluence -= vote.influenceSpent;
                        if (influence > this.owner.player.influence) influence = this.owner.player.influence; //Can't spend more influence than they have
                        if (influence < 0) influence = 0; //Can't spend less than 0 influence
                        vote.influenceSpent = influence; //They spend that much influence
                        vote.influence = influence;
                        totalInfluence += influence;
                    }
                }
            }
        }
    }
}

module.exports = Auctioneer;