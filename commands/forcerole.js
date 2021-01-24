const { Command } = require("discord-akairo");
var roles = require('../classes/roles');

class forceRoleCommand extends Command {
	constructor() {
		super("forcerole", {
			aliases: ["forcerole"],
			args: [{id: "role", type: "string"}],
		});
	}
	async exec(message, args) {
		for (let ply of players){
			if (ply.member == message.member){
				for (let role of roles.innocent){
					if (role.name.toLowerCase() == args.role.toLowerCase()){
						ply.player.role = role;
						if (ply.player.team == 'traitor') ply.player.team = 'innocent';
						return message.channel.send(`Changed ${message.author}'s role to ${role.name}`)
					}
				}
				for (let role of roles.traitor){
					if (role.name.toLowerCase() == args.role.toLowerCase()){
						ply.player.role = role;
						if (ply.player.team == 'innocent') ply.player.team = 'traitor';
						return message.channel.send(`Changed ${message.author}'s role to ${role.name}`)
					}
				}
				return message.channel.send(`Could not find role ${args.role}`)
			}
		}
		return message.channel.send(`You are not a player of the game.`)
	}	
}

module.exports = forceRoleCommand;