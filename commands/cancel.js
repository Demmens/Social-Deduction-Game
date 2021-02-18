const { Command } = require("discord-akairo");
const DefenderCost = 10;

class cancelCommand extends Command {
	constructor() {
		super("cancel", {
			aliases: ["cancel"],
			args: [],
		});
	}
	async exec(message) {
		for (let role of roles)
        {
            if (role.owner.member.user == message.author)
            {
                if (role.name == "Saboteur"){
					successEffect = false;
					role.used = true;
					message.channel.send(`The next mission success effect will be cancelled.`);
				}
                if (role.name == "Defender"){
					if (role.owner.player.influence < DefenderCost) return;
					failEffect = false;
					role.owner.player.influence -= DefenderCost;
					message.channel.send(`The next mission fail effect will be cancelled.`);
				}
            }
        }
	}	
}

module.exports = cancelCommand;