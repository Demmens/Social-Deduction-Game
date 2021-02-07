const { Command } = require("discord-akairo");
const Discord = require("discord.js");
var roles = require('../classes/roles');

class prodigyCommand extends Command {
	constructor() {
		super("prodigy", {
            aliases: ["prodigy"]
		});
    }
    async *args(message){
        let traitors = [];
        let accusedMembers = [];
        let accused = [];
        let prodigy;

        for (let ply of players){
            if (ply.member.user == message.author) prodigy = ply;
            if (ply.player.team == 'traitor') traitors.push(ply);
        }
        
        if (prodigy.player.hasBuzzed) return message.channel.send(`${message.author} You may only buzz once per game.`)
        prodigy.player.hasBuzzed = true;

        for (let _ of traitors){
            var target = yield{
                type: "playername",
                prompt: {
                    start: message => `${message.author} Type the display name of a player you wish to accuse.`,
                    retry: message => `${message.author} That's not a valid player.`,
                    prompt: true
                }
            }
            accusedMembers.push(target);
        }
        
        for (let ply of players){
            for (let tgt of accusedMembers){
                if (ply.member.displayName.toLowerCase() == tgt.toLowerCase()){
                    accused.push(ply);
                }
            }
        }

        return {accused, prodigy}
    }
	async exec(message, args) {
        if (args.prodigy != Prodigy) return;
        var shouldWin = true; //Default is that innocents should win
        let accusedMsg = '';
        for (let tgt of args.accused){
            accusedMsg += `\n${tgt.member.user}`;
            if (tgt.player.team == 'innocent') shouldWin = false; //If any of the players accused is an innocent then traitors win.
        }

        let emb = new Discord.MessageEmbed()
        .setTitle(`**Accused Players**`)
        .setDescription(accusedMsg);

        await gameChannel.send(emb);
        await gameChannel.send(`**THE PRODIGY HAS SPOKEN!**. If all accused players are traitors, the innocents win.`);
        return await setTimeout(function(){
            if (shouldWin) return gameChannel.send(`The prodigy was correct. **THE INNOCENTS WIN**`);
            return gameChannel.send(`The disgraced prodigy was incorrect.`);
        }, 10000);   
	}	
}

module.exports = prodigyCommand;