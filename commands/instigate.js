const { Command } = require("discord-akairo");
var roles = require('../classes/roles');

class instigateCommand extends Command {
	constructor() {
		super("instigate", {
            aliases: ["instigate"]
		});
    }
    async *args(message){
        var target = yield{
            type: "playername",
            prompt: {
                start: message => `${message.author} Type the display name of the player you wish to instigate.`,
                retry: message => `${message.author} That is not a valid player.`,
                prompt: true
            }
        }
        var instigator;
        for (let ply of players){
            console.log(`player = ${ply.member.displayName}`);
            if (ply.member == message.member){
                instigator = ply;
            }
            if (ply.member.displayName.toLowerCase() == target.toLowerCase()){
                target = ply;
            }
        }

        return {target, instigator}
    }
	async exec(message, args) {
        if (args.target == args.instigator.player.target){
            return gameChannel.send(`**The Instigator has guessed ${args.target.member.user} correctly. They must now use their sting.**`);
        }
        else{
            return gameChannel.send(`**The Instigator has guessed incorrectly.**`);
        }
	}	
}

module.exports = instigateCommand;