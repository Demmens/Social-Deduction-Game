const Role = require("../Role");

class Hypnotist extends Role
{
    constructor()
    {
        super
        ({
			name: 'Hypnotist',
			description: 'Once per game may force the captain to play the wrong card (if they have a choice)',
			influence: 8,
            team: 'traitor'
		})
    }
    BeforeVoting()
    {
        if (!this.used) this.owner.member.user.send(`Type \`discard\` in a separate message before your vote to force the captain to discard the wrong card.`);
    }

    BeforeResultDetermined()
    {
        if (!this.used){
            let msgs = this.owner.member.user.dmChannel.messages.cache.array();
            for (let i = msgs.length-1; i>0;i--){
                if (msgs[i].content.toLowerCase() == 'discard'){
                    if (cards[0] != cards[1]){
                        cardPlayed = 1-cardPlayed;
                        this.used = true;
                    }
                }
                if (msgs[i].content.startsWith(`Type \`discard\``) && msgs[i].author != this.owner) break;
            }
        }
    }
}

module.exports = Hypnotist;