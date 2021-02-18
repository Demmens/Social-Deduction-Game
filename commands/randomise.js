const { Command } = require("discord-akairo");

class randomiseCommand extends Command {
	constructor() {
		super("randomise", {
			aliases: ["randomise", "reroll"],
			args: [],
		});
	}
	async exec(message) {
        let tgt;
        let gambler;
		for (let role of roles)
        {
            if (role.owner.member.user == message.author && role.name == "Gambler" && !role.used)
            {
                gambler = role;
                tgt = roles[Math.floor(Math.random()*roles.length)];
                while ((tgt == role.owner || tgt.team == 'traitor' || tgt.name == "Omniscient" || tgt == role.owner.player.target || !tgt.canBeTarget) && roles.length > 2){
                    tgt = roles[Math.floor(Math.random()*roles.length)];
                }
                role.owner.player.target = tgt.owner;
            }
        }
        gambler.owner.member.user.send(`Your new target is the ${tgt.name}`);
	}	
}

module.exports = randomiseCommand;