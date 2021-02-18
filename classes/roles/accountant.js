const { DiscordAPIError } = require("discord.js");
const Role = require("../Role");
const AccountantNumber = 5;
const Discord = require("discord.js");

class Accountant extends Role
{
    constructor()
    {
        super
        ({
			name: 'Accountant',
			description: `View the ${AccountantNumber} players who put forth the most influence.`,
			influence: 10,
            team: 'traitor'
		})
    }

    BeforeLeaderPickPartner()
    {
        let x = 0;
        let msg = '';
        for (let vote of votes){
            if (x < AccountantNumber){
                msg += `${x+1} - ${vote.player.member.displayName}\n`
            }
            x++;
        }
        let emb = new Discord.MessageEmbed()
        .setTitle(`**Influence Rankings**`)
        .setDescription(msg);

        this.owner.member.user.send(emb);
    }
}

module.exports = Accountant;