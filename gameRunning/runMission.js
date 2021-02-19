const Discord = require('discord.js');
const f = require("../functions.js");
const missiontypes = require('./missiontypes.js');
const events = require('./events');

module.exports = {
    displayMission: function(mission)
    {
        if (mission.name.startsWith(`Secure `)){
            if (mission.name.endsWith(`/3)`)){
                mission.name = mission.name.replace(/[\(]\d/, `(${pollenated}`)
            } else mission.name += ` (${pollenated}/3)`;
        }
        let missionEmbed = new Discord.MessageEmbed()
        .setTitle(`**Mission ${missionNum}: ${mission.name}**`)
        .setDescription(`**Success Effect**\n${mission.successtext}\n**Fail Effect**\n${mission.failtext}`)
        gameChannel.send(missionEmbed);
        let msg = '';
        msg += `Draw Pile: ${drawPile.length}\nDiscard Pile: ${discardPile.length}`;
        msg += `\nThis mission requires ${Math.floor(influenceCost*players.length)} influence to start.`
        msg += `\nDirect message The Hive with the number of influence you wish to spend.`
        gameChannel.send(msg);
    },

    influenceVote: async function()
    {
        await events.BeforeInfluenceVote();
        for (let ply of canInfluenceVote){
            await ply.member.user.send(`You currently have ${ply.player.influence} influence. How much would you like to spend?`)
        }
        for (let ply of barredPlys){
            await ply.member.user.send(`You are barred from putting forth influence this round.`)
        }
        let influenceDone = false;
        let waitingFor = await gameChannel.send(`Waiting for ${players[0].member.displayName} to put forth influence.`);
        while (!influenceDone){
            let done = 0;
            for (let ply of canInfluenceVote){
                let msg = ply.member.user.dmChannel.lastMessage;
                if (!isNaN(msg.content) && msg.author == ply.member.user){
                    done++;
                } else{
                    let fl = m => m.author.id === ply.member.id;
                    let inflController = new Discord.MessageCollector(ply.member.user.dmChannel, fl);
                    await waitingFor.edit(`Waiting for ${ply.member.displayName} to put forth influence.`)
                    msg = await inflController.next;
                }
            }
            if (done == canInfluenceVote.length) influenceDone = true;
        }
        await waitingFor.edit(`All players have put forth influence.`)
    },

    collectInfluence: async function()
    {
        for (let ply of canInfluenceVote){
            let msg = ply.member.user.dmChannel.lastMessage;
            let num = msg.content;
            if (msg.author != ply.member.user) num = 0 //If the last message was from the bot, assumemd to not spend any influence.
            if (isNaN(num)) num = 0; //If they didn't type a number, they are assumed to not spend any influence.
            else num = parseInt(num);
            if (num > ply.player.influence) num = ply.player.influence; //If they spend more than they have, they are assumed to spend all their influence.
            if (num < 0) num = 0;
            let influenceSpent = num;
            totalInfluence += num;
            votes.push({player: ply, influence: num, influenceSpent: influenceSpent, overwriteInfluence: null});
        }
    },

    orderVoteArray: async function()
    {
        await events.BeforeInfluenceTotal();
        for (let vote of votes){
            if (vote.overwriteInfluence !== null){
                if (vote.influence < 10000) vote.influence = vote.overwriteInfluence; //Just make sure effects that force team general aren't fucked up by suppressor
            }
        }
        let roleOrder = f.createRoleOrder();
        votes.sort(function(a,b){ // return negative to place a earler in the array
            if (a.influence > b.influence) return -1;
            if (b.influence > a.influence) return 1;
            if (b.influence == a.influence){
                let aOrder = roleOrder.findIndex((element) => element == a);
                let bOrder = roleOrder.findIndex((element) => element == b);
                return aOrder - bOrder;
            }
        });

        if (totalInfluence < Math.floor(players.length*influenceCost)){
            enoughInfluence = false;
        }
    },

    determineMissionGoers: async function()
    {
        general = votes[0].player;
        general.player.influence -= votes[0].influenceSpent;

        if (players.length >= playersFor3PlayerMissions){
            major = votes[1].player;
            major.player.influence -= votes[1].influenceSpent;
        }

        for (let vote of votes){ // If there is a base influence spent, calculate that now.
            if (vote.player != general && vote.influenceSpent != 0){
                vote.player.player.influence -= baseInfluenceSpent;
                if (vote.player.player.influence < 0) vote.player.player.influence = 0;
            }
        }
        if (baseInfluenceSpent != 0) message.channel.send(`All players who put forth influence lose ${baseInfluenceSpent} influence.`);
    },

    leaderPickPartner: async function()
    {
        await events.BeforeLeaderPickPartner();
        if (players.length < playersFor3PlayerMissions){
            gameChannel.send(`The General is ${general.member.user}. Please pick your captain.`);
        } else gameChannel.send(`General: ${general.member.user}\nMajor: ${major.member.user}\nThe general must pick the captain for the mission.`);
        
        if (general == lastGeneral || (general == lastMajor && players.length >= playersFor3PlayerMissions)){
            let power = '';
            general == lastGeneral ? power = 'general': power = 'major';
            general.influence -= teamLeaderInfluenceLost;
            gameChannel.send(`${general.member.displayName} lost ${teamLeaderInfluenceLost} influence as they were the previous ${power}.`)
            if (general.influence < 0) general.influence = 0;
        }
        let tempGen = general;
        const filter = m => m.author.id === tempGen.member.user.id;
        const selectPartnerMessage = new Discord.MessageCollector(gameChannel, filter);

        let msg = null;
        let isValidPartner = false;
        while (!isValidPartner){
            msg = await selectPartnerMessage.next;
            captain = msg.mentions.members.array()[0];
            for (let ply of players){
                if (ply.member == captain) captain = ply;
            }
            if (!captain.player){
                gameChannel.send(`That is not a valid player.`);
            } else if (captain == lastCaptain && players.length > 1) {
                gameChannel.send(`You cannot pick the captain from the previous mission.`);
            } else isValidPartner = true;
        }
        if (players.length < playersFor3PlayerMissions){
            await gameChannel.send(`General: ${general.member.user}\nCaptain: ${captain.member.user}\nEveryone must now direct message the bot with \`yes\` or \`no\` to vote.`);
        } else {
            await gameChannel.send(`General: ${general.member.user}\nMajor: ${major.member.user}\nCaptain: ${captain.member.user}\nEveryone must now direct message the bot with \`yes\` or \`no\` to vote.`);
        }
        
    },

    waitForVotes: async function()
    {
        await events.BeforeVoting();
        let voteDone = false;
        let waitingFor = await gameChannel.send(`Waiting for ${players[0].member.displayName} to vote.`);
        while (!voteDone){
            let done = 0;
            for (let ply of players){
                let msg = ply.member.user.dmChannel.lastMessage;
                if ((msg.content.toLowerCase() == 'yes' || msg.content.toLowerCase() == 'no') && msg.author == ply.member.user){
                    done++;
                } else {
                    let fl = m => m.author.id === ply.member.id;
                    let voteController = new Discord.MessageCollector(ply.member.user.dmChannel, fl);
                    await waitingFor.edit(`Waiting for ${ply.member.displayName} to vote.`);
                    msg = await voteController.next;
                }
            }
            if (done == players.length) voteDone = true;
        }
        await waitingFor.edit(`All players have voted.`);
    },

    collectVotes: async function()
    {
        failedvote = true;
        globalThis.yesVotes = [];
        globalThis.noVotes = [];
        globalThis.yesTotal = 0;
        globalThis.noTotal = 0;
        let votemsg = '';
        await events.BeforeVoteResult();

        for (let ply of players){
            let msg = ply.member.user.dmChannel.lastMessage.content.toLowerCase();
            if (msg == 'yes'){
                yesTotal++;
                yesVotes.push(ply)
                votemsg += `\n${ply.member.user} - Yes`;
            }
            if (msg == 'no'){
                noTotal++;
                noVotes.push(ply);
                votemsg += `\n${ply.member.user} - No`;
            }
        }

        let emb = new Discord.MessageEmbed()
            .setTitle('**Votes**')
            .setDescription(votemsg);
        await gameChannel.send(emb);
        globalThis.shouldDraw = 2;
        if (players.length < playersFor3PlayerMissions) shouldDraw = 3;
        
        await events.AfterVoteResult();
    },

    determineVoteResult: async function()
    {
        if (yesTotal > noTotal) failedvote = false;
        if (yesTotal <= noTotal) failedvote = true;
        if (failedvote){	
            gameChannel.send(`The vote failed. A new general will be determined. Everyone loses 1 influence`);
            for (let ply of players){
                ply.player.influence -= 1;
                if (ply.player.influence < 0) ply.player.influence = 0;
            }
        }
        else{
            gameChannel.send(`The vote passed. Everyone who voted \`yes\` gains 1 influence. The mission is now underway.`);
            for (let ply of yesVotes){
                ply.player.influence += 1;
            }
        }
    },

    missionStart: async function()
    {

        globalThis.cards = {
            general: [],
            major: [],
            captain: []
        };

        if (players.length < playersFor3PlayerMissions){
            return missiontypes.twoPlayerMission();
        } else {
            return missiontypes.threePlayerMission();
        }
    },

    determineMissionResult: async function(success, mission)
    {
        await events.BeforeResultDetermined(success);
        for (let card of cards.captain) discardPile.push(card); //Discard the hand.
        barredPlys = []; //Anyone who was barred from the mission this round is now able to influence vote again
        if (success){
            gameChannel.send(`**The mission was successful!**`);
            if (successEffect){
                let shouldEnd = await mission.success(gameChannel);
                if (shouldEnd) return;
            }
            else{
                gameChannel.send('The success effect was cancelled.');
                successEffect = true;
                failEffect = true;
            }
        } else {
            gameChannel.send(`**The mission failed!**`);
            if (failEffect){
                let shouldEnd = await mission.fail(gameChannel);
                if (shouldEnd) return;
            }
            else{
                gameChannel.send('The fail effect was cancelled.');
                successEffect = true;
                failEffect = true;
            }
        }

        await events.AfterResultDetermined();

        for (let ply of players){
            ply.player.influence += InfluenceRegen;
        }

        if (InfluenceRegen > 0) gameChannel.send(`Everyone gains ${InfluenceRegen} influence.`);

        shouldDraw = 2;
        if (players.length < playersFor3PlayerMissions) shouldDraw = 3;

        //Reshuffle pile if it needs it
        let cardsDrawn = shouldDraw;
        if (players.length >= playersFor3PlayerMissions) cardsDrawn = shouldDraw*2
        if (drawPile.length < cardsDrawn){
            await gameChannel.send('Shuffling Draw Pile...');
            events.BeforeShuffleDrawPile();
            for (let card of discardPile){ //put discards back into the deck
                drawPile.push(card);
            }
            drawPile = f.ArrRandomise(drawPile); //Shuffle the deck
            discardPile = []; //Empty discard pile
        }
    }
}