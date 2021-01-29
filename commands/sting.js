const { Command } = require("discord-akairo");
var roles = require('../classes/roles');

class stingCommand extends Command {
	constructor() {
		super("sting", {
            aliases: ["sting"]
		});
    }
    async *args(message){
        var player = yield{
            type: "memberMention",
            prompt: {
                start: message => `${message.author} Mention the user you wish to sting.`,
                retry: message => `${message.author} Mention a valid member.`,
                prompt: true
            }
        }
        var stinger;
        var plynum = 0;
        let x = 0;
        for (let ply of players){
            if (ply.member == message.member){
                stinger = ply;
                plynum = x;
            }
            if (ply.member == player){
                player = ply;
            }
            x++;
        }


        return {player, stinger, plynum}
    }
	async exec(message, args) {
        if (args.player == args.stinger.player.target || args.player == Omniscient){
            return message.channel.send(`**Traitors Win**`);
        }
        else{
            players.splice(args.plynum, 1);
            return message.channel.send(`The traitor stung incorrectly. The game may resume.`)
        }
	}	
}

module.exports = stingCommand;