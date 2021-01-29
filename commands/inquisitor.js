const { Command } = require("discord-akairo");
var roles = require('../classes/roles');

class inquisiteCommand extends Command {
	constructor() {
		super("Inquisite", {
            aliases: ["Inquisite"]
		});
    }
    async *args(message){
        if (Inquisitor.player.role.used) return;
        var name = yield{
            type: "playername",
            prompt: {
                start: message => `${message.author} Type the display name of the player you wish to instigate.`,
                retry: message => `${message.author} That is not a valid player.`,
                prompt: true
            }
        }
        var target = '';
        var inquisitor;
        for (let ply of players){
            if (ply.member.user == message.author){
                inquisitor = ply;
            }
            if (ply.member.displayName.toLowerCase() == name.toLowerCase()){
                target = ply;
            }
        }

        return {target, inquisitor}
    }
	async exec(message, args) {
        if (Inquisitor.player.role.used) return;
        if (args.inquisitor == Inquisitor){
            Inquisitor.player.role.used = true;
            if (args.target == Inquisitor.player.target){
                return gameChannel.send(`**The Inquisitor has guessed ${args.target.member.user} correctly. They must now use their sting.**`);
            }
            else{
                return gameChannel.send(`**The Inquisitor has guessed incorrectly.**`);
            }
        }
	}	
}

module.exports = inquisiteCommand;