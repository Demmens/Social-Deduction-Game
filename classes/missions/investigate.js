const Mission = require('../Mission');
const Discord = require('discord.js');

class Investigate extends Mission{
	constructor(){
		super({
			name: 'Hive Investigation',
			successtext: 'Determine a players loyalty',
			failtext: 'No Effect'
		})
	}

	async success(channel){
		channel.send(`${leader.member.user} Mention a user to learn their team.`);
		const filter = m => m.author.id === leader.member.id;
		const messageController = new Discord.MessageCollector(channel, filter);
		let msg = await messageController.next;
		while (msg.mentions.members.array().length != 1){
			msg = await messageController.next;
		}

		let target = msg.mentions.members.array()[0];

		for (let ply of players){
			if (ply.member == target) target = ply;
		}
		let tm = '';
		if (target.player.team == 'traitor') tm = 'a traitor';
		else tm = 'innocent';
		leader.member.user.send(`${target.member.displayName} is ${tm}.`);
		return;
	}

	fail(channel){
		return;
	}
}

module.exports = Investigate;