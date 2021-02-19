const Role = require("../Role");
const Discord = require("discord.js");

class Salvager extends Role
{
    constructor()
    {
        super
        ({
			name: 'Salvager',
			description: 'As general or major, draws an additional card from the discard pile. Discards two cards.',
			influence: 7,
            team: 'innocent'
		})
    }

    DisplayCardsToLeaders(){}

    async AfterCardsDisplayedToLeader()
    {
        if ((general != this.owner && major != this.owner)) return;
        let hand = cards.general;
        if (major == this.owner) hand = cards.major;
        if (discardPile.length > 0){
            hand.push(discardPile[discardPile.length-1]); //Take top card of discard pile.
            discardPile.splice(discardPile.length-1,1);
            let msg = '**You have drawn:**';
            let x = 0;
            for (let card of hand){
                x++;
                msg += `\n${x} - ${card}`;
            }
            msg += ` (salvaged)`; //Let them know which card is from the discard pile.
            msg += `\nType the number of the card you wish to discard.`;
            general.member.user.send(msg);

            let tempGen = general;
            var leaderDiscardFilter = m => m.author.id === tempGen.member.user.id;
            var leaderDiscardMessage = new Discord.MessageCollector(general.member.user.dmChannel, leaderDiscardFilter);

            msg = shouldDraw+1;
            while (msg > shouldDraw || isNaN(msg)){
                msg = await leaderDiscardMessage.next;
                if (parseInt(msg.content) != NaN){
                    msg = parseInt(msg.content) - 1;
                }
            }
            discardPile.push(hand[msg]); // Discard specified card
            hand.splice(msg,1); //Remove the card from the hand
        }
        
        let msg = '**You have drawn:**';
        let x = 0;
        for (let card of hand){
            x++;
            msg += `\n${x} - ${card}`;
        }
        if (players.length < playersFor3PlayerMissions) msg += `\nType the number of the card you wish to discard.`;
        else msg += `\nType the number of the card you wish to pass to the captain.`;
        this.owner.member.user.send(msg);
    }
}

module.exports = Salvager;