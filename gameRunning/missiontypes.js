const Discord = require("discord.js");
const events = require('./events');

module.exports = {
    twoPlayerMission: async function()
    {
        await events.BeforeLeaderDraw();
        //Team Leader draw.
        for (let i = 0; i < shouldDraw; i++){ //Draw up randomly to max hand size if at less.
            if (cards.general.length < shouldDraw){ //Make sure hand size stays where it should be.
                cards.general.push(drawPile[0]); //Add top card of the drawpile to the hand.
                drawPile.splice(0,1); //Remove top card of the drawpile.
            }
        }
        await events.AfterLeaderDraw();
        await events.OverwriteLeaderDraw();
        await events.DisplayCardsToLeaders();
        await events.AfterCardsDisplayedToLeader();

        let tempGen = general;
        var leaderDiscardFilter = m => m.author.id === tempGen.member.user.id;
        var leaderDiscardMessage = new Discord.MessageCollector(general.member.user.dmChannel, leaderDiscardFilter);

        msg = shouldDraw+1;
        while (msg > shouldDraw || isNaN(msg)){
            msg = await leaderDiscardMessage.next;
            if (!isNaN(msg.content)){
                msg = parseInt(msg.content) - 1;
            }
        }

        await events.BeforeLeaderPass();

        discardPile.push(cards.general[msg]); // Discard the card specified

        let i = 0;
        for (let card of cards.general){ //Pass all cards to captain
            if (i != msg) cards.captain.push(card);
            i++;
        }
        cards.general = [];
        await events.AfterLeaderPass();
        //Captain Draw.
        shouldDraw = cards.captain.length; //Captain should draw the remaining cards.

        msg = '**You have drawn:**'
        x = 0;
        for (let card of cards.captain){
            x++;
            msg += `\n${x} - ${card}`;
        }
        msg += `\nType the number of the card you wish to **PLAY**.`
        captain.member.user.send(msg)
        let tempCapt = captain;
        var partnerDiscardFilter = m => m.author.id === tempCapt.member.user.id;
        var partnerDiscardMessage = new Discord.MessageCollector(captain.member.user.dmChannel, partnerDiscardFilter);

        globalThis.cardPlayed = shouldDraw+1;
        while (cardPlayed > shouldDraw || msg == NaN){
            cardPlayed = parseInt((await partnerDiscardMessage.next).content);
        }
        cardPlayed--;
        
        await events.BeforePartnerCardPlayed();

        if (cards.captain[cardPlayed] == 'Success') return true;
        return false;
    },

    threePlayerMission: async function()
    {
        await events.BeforeLeaderDraw();
        //General and Major draw.
        for (let i = 0; i < shouldDraw; i++){ //Draw up randomly to max hand size if at less.
            if (cards.general.length < shouldDraw){ //Make sure hand size stays where it should be.
                cards.general.push(drawPile[0]); //Add top card of the drawpile to the hand.
                drawPile.splice(0,1); //Remove top card of the drawpile.
            }
        }
        for (let i = 0; i < shouldDraw; i++){
            if (cards.major.length < shouldDraw){
                cards.major.push(drawPile[0]);
                drawPile.splice(0,1);
            }
        }

        await events.AfterLeaderDraw();
        await events.OverwriteLeaderDraw();
        await events.DisplayCardsToLeaders();
        await events.AfterCardsDisplayedToLeader();

        var leaderDiscardFilter = m => m.author.id === general.member.user.id;
        var leaderDiscardMessage = new Discord.MessageCollector(general.member.user.dmChannel, leaderDiscardFilter);

        msg = shouldDraw+1;
        while (msg > shouldDraw || isNaN(msg)){
            msg = await leaderDiscardMessage.next;
            if (!isNaN(msg.content)){
                msg = parseInt(msg.content);
                msg--;
            }
        }

        cards.captain.push(cards.general[msg]);
        for (let card of cards.general) discardPile.push(card);
        cards.general = [];

        var leaderDiscardFilter = m => m.author.id === major.member.user.id;
        var leaderDiscardMessage = new Discord.MessageCollector(major.member.user.dmChannel, leaderDiscardFilter);

        msg = parseInt(major.member.user.dmChannel.lastMessage);
        while (msg > shouldDraw || isNaN(msg)){
            msg = await leaderDiscardMessage.next;
            if (!isNaN(msg.content)){
                msg = parseInt(msg.content);
                msg--;
            }
        }

        await events.BeforeLeaderPass();

        //Captain Draw
        cards.captain.push(cards.major[msg]);
        for (let card of cards.major) discardPile.push(card);
        cards.major = [];

        await events.AfterLeaderPass();
        shouldDraw = cards.captain.length; //Captain should draw the remaining cards.

        msg = '**You have drawn:**'
        x = 0;
        for (let card of cards.captain){
            x++;
            msg += `\n${x} - ${card}`;
        }
        msg += `\nType the number of the card you wish to **PLAY**.`
        captain.member.user.send(msg)
        var partnerDiscardFilter = m => m.author.id === captain.member.user.id;
        var partnerDiscardMessage = new Discord.MessageCollector(captain.member.user.dmChannel, partnerDiscardFilter);

        globalThis.cardPlayed = shouldDraw+1;
        while (cardPlayed > shouldDraw || msg == NaN){
            cardPlayed = parseInt((await partnerDiscardMessage.next).content);
        }
        cardPlayed--;
        
        await events.BeforePartnerCardPlayed();

        if (cards.captain[cardPlayed] == 'Success') return true;
        return false;
    }
}