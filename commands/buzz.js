const { Command } = require("discord-akairo");
const Discord = require("discord.js");

class buzzCommand extends Command {
	constructor() {
		super("buzz", {
            aliases: ["buzz"]
		});
    }
    async *args(message){
        let traitors = [];
        let accusedMembers = [];
        let accused = [];
        let accusee;

        for (let ply of players){
            if (ply.member == message.member) accusee = ply;
            if (ply.player.team == 'traitor') traitors.push(ply);
        }
        
        if (accusee.player.hasBuzzed) return message.channel.send(`${message.author} You may only buzz once per game.`)
        accusee.player.hasBuzzed = true;

        for (let traitor of traitors){
            var target = yield{
                type: "memberMention",
                prompt: {
                    start: message => `${message.author} Mention the a user you wish to accuse.`,
                    retry: message => `${message.author} Mention a valid member.`,
                    prompt: true
                }
            }
            accusedMembers.push(target);
        }
        
        var buzzer;
        for (let ply of players){
            if (ply.member == message.member){
                buzzer = ply;
            }
            for (let tgt of accusedMembers){
                if (ply.member == tgt){
                    accused.push(ply);
                }
            }
        }

        return {accused, buzzer, traitors}
    }
	async exec(message, args) {
        var shouldWin = true; //Default is that innocents should win
        let accusedMsg = '';
        for (let tgt of args.accused){
            accusedMsg += `\n${tgt.member.user}`;
            if (tgt.player.team == 'innocent') shouldWin = false; //If any of the players accused is an innocent then traitors win.
        }

        let emb = new Discord.MessageEmbed()
        .setTitle(`**Accused Players**`)
        .setDescription(accusedMsg);

        await message.channel.send(emb);
        await message.channel.send(`Everyone who is not accused must now direct message the bot with \`yes\` or \`no\`.`);

        let voteDone = false;
        let finalVotes;
        while (!voteDone){
            finalVotes = [];
            let done = 0;
            for (let ply of players){
                let isAccused = false;
                for (let tgt of args.accused) if (tgt == ply) isAccused = true;
                if (!isAccused){ //If they're not being voted for, they have a vote.
                    let msg = ply.member.user.dmChannel.lastMessage;
                    if ((msg.content.toLowerCase() == 'yes' || msg.content.toLowerCase() == 'no') && msg.author == ply.member.user){
                        done++;
                        finalVotes.push({player: ply,vote: msg.content.toLowerCase()});
                    } else {
                        let f = m => m.author.id === ply.member.id;
                        let voteController = new Discord.MessageCollector(ply.member.user.dmChannel, f);
                        msg = await voteController.next;
                    }
                }
            }
            if (done == players.length - args.traitors.length) voteDone = true;
        }
        let votePassed = true;
        let voteMsg = '';
        for (let vote of finalVotes){
            voteMsg += `\n${vote.player.member.user} -  ${vote.vote}`;
            if (vote.vote == 'no') votePassed = false;//If anyone at all votes no, the vote fails.
        } 

        emb = new Discord.MessageEmbed()
        .setTitle(`**Votes**`)
        .setDescription(voteMsg);
        await message.channel.send(emb);
        if (!votePassed) return message.channel.send('The vote did not succeed.')
        await message.channel.send(`The vote passed. If all accused players are traitors, the innocents win. Otherwise the traitors win.`)
        return await setTimeout(function(){
            if (shouldWin) return message.channel.send(`The vote was correct. **INNOCENTS WIN**`);
            return message.channel.send(`The vote was incorrect. **TRAITORS WIN**`);
        }, 5000);   
	}	
}

module.exports = buzzCommand;