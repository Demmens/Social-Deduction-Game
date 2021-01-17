const { Command } = require("discord-akairo");

class newGameCommand extends Command {
	constructor() {
		super("newgame", {
			aliases: ["newgame"],
			args: [],
		});
	}
	exec(message, args) {
		//VoiceChannel.members to get all members in a voice chat.
		return message.channel.send(`Starting a new game with the players in the Game Chat.`)
	}
}

module.exports = newGameCommand;