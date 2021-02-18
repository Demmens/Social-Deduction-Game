const Role = require("../Role");
const Discord = require("discord.js");

class Strategist extends Role
{
    constructor()
    {
        super
        ({
			name: 'Strategist',
			description: 'As general or major, draw an extra card, place one on top of the deck and discard another.',
			influence: 8,
            team: 'innocent'
		})
    }

    DisplayCardsToLeaders(){}

    async AfterCardsDisplayedToLeader()
    {
        if ((general != this.owner && major != this.owner) || drawPile.length == 0) return;
        let hand = cards.general;
        if (major == this.owner) hand = cards.major;

        hand.push(drawPile[0]);
        drawPile.splice(0,1);

        let msg = '**You have drawn:**';
        let x = 0;
        for (let card of hand){
            x++;
            msg += `\n${x} - ${card}`;
        }
        msg += ` (extra draw)\nType the number of the card you wish to put on top of the draw pile.`;
        general.member.user.send(msg);

        var leaderDiscardFilter = m => m.author.id === general.member.user.id;
        var leaderDiscardMessage = new Discord.MessageCollector(general.member.user.dmChannel, leaderDiscardFilter);

        msg = shouldDraw+1;
        while (msg > shouldDraw || isNaN(msg)){
            msg = await leaderDiscardMessage.next;
            if (parseInt(msg.content) != NaN){
                msg = parseInt(msg.content) - 1;
            }
        }

        drawPile.unshift(hand[msg]); // Place specified card on top of draw pile
        hand.splice(msg,1); //Remove the card from the hand

        msg = '**You have drawn:**';
        x = 0;
        for (let card of hand){
            x++;
            msg += `\n${x} - ${card}`;
        }
        if (players.length < playersFor3PlayerMissions) msg += `\nType the number of the card you wish to discard.`;
        else msg += `\nType the number of the card you wish to pass to the captain.`;
        this.owner.member.user.send(msg);
    }
}

module.exports = Strategist;