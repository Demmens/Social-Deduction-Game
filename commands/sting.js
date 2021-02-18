const { Command } = require("discord-akairo");

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
        for (let role of roles){
            if (role.owner.member == message.member){
                stinger = role.owner;
                plynum = x;
            }
            if (role.owner.member == player){
                player = role;
            }
            x++;
        }


        return {player, stinger, plynum}
    }
	async exec(message, args) {
        if (args.player.owner == args.stinger.player.target){
            return message.channel.send(`The traitor stung the ${args.player.name}. **Traitors Win**`);
        }
        else{
            players.splice(args.plynum, 1);
            return message.channel.send(`The traitor stung incorrectly. The game may resume.`)
        }
	}	
}

module.exports = stingCommand;