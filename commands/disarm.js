const { Command } = require("discord-akairo");

class inquisiteCommand extends Command {
	constructor() {
		super("Disarm", {
            aliases: ["Disarm"]
		});
    }
    async *args(message){
        if (PeaceKeeper){
            if (PeaceKeeper.player.role.used) return;
            var name = yield{
                type: "playername",
                prompt: {
                    start: message => `${message.author} Type the display name of the player you wish to disarm.`,
                    retry: message => `${message.author} That is not a valid player.`,
                    prompt: true
                }
            }
            var target = '';
            var peacekeeper;
            for (let ply of players){
                if (ply.member.user == message.author){
                    peacekeeper = ply;
                }
                if (ply.member.displayName.toLowerCase() == name.toLowerCase()){
                    target = ply;
                }
            }

            return {target, peacekeeper}
        }
    }
	async exec(message, args) {
        for (let role of roles){
            if (role.name == 'Peace Keeper' && args.peacekeeper == role.owner && !role.used){
                role.used = true;
                if (args.target.player.team == 'traitor'){
                    return args.target.member.user.send(`**The Peace Keeper has guessed you correctly. You may no longer sting.**`)
                }
                else{
                    return PeaceKeeper.send(`**You guessed incorrectly.**`);
                }
            }
        }
	}	
}

module.exports = inquisiteCommand;