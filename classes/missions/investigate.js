const Mission = require('../Mission');
const Discord = require('discord.js');
const events = require('../../gameRunning/events');

class Investigate extends Mission{
	constructor(){
		super({
			name: 'Hive Interrogation',
			successtext: 'Determine a players loyalty',
			failtext: 'Traitors learn the identity of a non-target player'
		})
	}

	async success(channel){
		channel.send(`${general.member.user} Mention a user to learn their team.`);
		const filter = m => m.author.id === general.member.id;
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

		globalThis.interrogateResult = `${target.member.displayName} is ${tm}.`;

		await events.OnInterrogation();

		general.member.user.send(interrogateResult);

		await events.AfterInterrogation();
		return;
	}

	fail(channel){
		for (let ply of players){
			if (ply.player.team == 'traitor'){
				let info = players[Math.floor(Math.random()*players.length)];
				while ((info == ply.player.target || info == ply) && players.length != 1){
					info = players[Math.floor(Math.random()*players.length)];
				}
				ply.member.user.send(`${info.member.displayName} is not your target.`);
			}
		}
	}
}

module.exports = Investigate;