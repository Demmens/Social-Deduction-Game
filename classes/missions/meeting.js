const Mission = require('../Mission');
const Discord = require('discord.js');
const events = require('../../gameRunning/events');

class PrivateMeeting extends Mission{
	constructor(){
		super({
			name: 'Secure Private Meeting',
			successtext: 'Send any player a private message. They cannot respond.',
			failtext: 'You have a 10 character limit for the message.'
		})
	}

	async sendPrivateMessage(charLimit){
		gameChannel.send(`${general.member.user} Mention a user to send them a private message.`);
		var filter = m => m.author.id === general.member.id;
		var messageController = new Discord.MessageCollector(gameChannel, filter);
		let msg = await messageController.next;
		while (msg.mentions.members.array().length != 1){
			msg = await messageController.next;
		}
		let target = msg.mentions.members.array()[0];

		for (let ply of players){
			if (ply.member == target) target = ply;
		}
		
		general.member.user.send('Type your private message here');
		var messageController = new Discord.MessageCollector(general.member.user.dmChannel, filter);
		msg = await messageController.next;
		while (msg.content.length > charLimit && charLimit != 0){
			general.member.user.send('That message is too long.');
			msg = await messageController.next;
		}

		globalThis.privateMessage = `**Message from ${general.member.displayName}:** ${msg.content}`;

		target.member.user.send(privateMessage);

		await events.AfterPrivateMessage();
		return;
	}

	async success(){
		await this.sendPrivateMessage(0);
		return
	}

	async fail(){
		if (!general) return;
		await this.sendPrivateMessage(10);
		return;
	}
}

module.exports = PrivateMeeting;