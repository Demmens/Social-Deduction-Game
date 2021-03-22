const Role = require("../Role");
const SleuthTimer = 3;

class Sleuth extends Role
{
    constructor()
    {
        super
        ({
			name: 'Sleuth',
			description: `Every ${SleuthTimer} missions you get to learn the loyalty of a player of your choice.`,
			influence: 6,
            team: 'innocent',
            used: true
		})
    }
    BeforeInfluenceVote()
    {
        if (missionNum % SleuthTimer == 0 && missionNum != 0){
            this.used = false;
            this.owner.member.user.send(`Type the display name of a player in a separate message before your influence vote. You will learn the allegience of this player.`);
        }
    }

    BeforeInfluenceTotal()
    {
        if (!this.used){
            let arr = this.owner.member.user.dmChannel.messages.cache.array();
            for (let i = arr.length-1; i > 0; i--){
                let msg = arr[i];
                if (msg.content.startsWith('Type the display name of a player') && msg.author != this.owner.member.user) break;
                for (let ply of players){
                    if (ply.member.displayName.toLowerCase() == msg.content.toLowerCase()){
                        this.used = true;
                        let tmName = 'innocent'
                        if (ply.player.team == 'traitor') tmName = 'a traitor'
                        this.owner.member.user.send(`${ply.member.displayName} is ${tmName}`);
                        gameChannel.send(`**The Sleuth has investigated ${ply.member.displayName}**`);
                    }
                }
                if (this.used) break;
            }
        }
    }
}

module.exports = Sleuth;