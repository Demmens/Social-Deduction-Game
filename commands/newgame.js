const { Command } = require("discord-akairo");
const missiontree = require('../gameRunning/missiontree.js')
const Discord = require('discord.js')

const StartingInfluence = 10;
const StartingInfluenceMax = 20;
const SuccessCards = 6;
const FailCards = 12;

class newGameCommand extends Command {
	constructor() {
		super("newgame", {
			aliases: ["newgame"],
			args: [],
		});
	}
	async exec(message, args) {
		const filter = m => m.author.id === message.author.id;
		const messageController = new Discord.MessageCollector(message.channel, filter);
		let players = [];
		for (let [_,chnl] of message.guild.channels.cache){
			if (chnl.name == 'Game Chat'){
				for (let [_,ply] of chnl.members){ //Everyone in the voice chat is a player of the game.
					players.push({"member": ply});
				} 
			}
		}
		let rdmPlayers = [];
		while (players.length > 0){
			let k = Math.floor(Math.random()*players.length);
			let v = players[k];
			players.splice(k,1)
			rdmPlayers.push(v);
		}
		players = rdmPlayers;
		let x = 0;
		for (let ply of players){
			if (x % 2 == 0 && x != 0){
				ply.member.send(`You are a Traitor`);
				ply.player = {
					"team": "traitor",
					"influence": StartingInfluence,
					"maxinfluence": StartingInfluenceMax
				};
			}
			else {
				ply.member.send(`You are Innocent`);
				ply.player = {
					"team": "innocent",
					"influence": StartingInfluence,
					"maxinfluence": StartingInfluenceMax
				};
			}
			x++
		}
		message.channel.send(`Starting a new game with ${players.length} players.`);
		const missions = missiontree.findTree(players.length);

		var drawPile = []; //Create the deck of cards to use for succeeding/failing the mission.
		var discardPile = [];
		for (let i=0;i<SuccessCards;i++){
			drawPile.push("Success");
		}
		for (let i=0;i<FailCards;i++){
			drawPile.push("Fail");
		}

		let tempArr = [];
		while (drawPile.length > 0){ //Shuffle the deck
			let k = Math.floor(Math.random()*drawPile.length);
			let v = drawPile[k];
			drawPile.splice(k,1)
			tempArr.push(v);
		}
		drawPile = tempArr;
		var leader;
		var partner;
		let missionNum = 1;
		for (let mission of missions){
			let failedvote = true;
			while (failedvote){
				message.channel.send(`**Mission ${missionNum}: ${mission.name}**\n\`\`\`Success Effect: ${mission.successtext}\nFail Effect: ${mission.failtext}\`\`\``);
				message.channel.send(`Direct message The Hive with the number of influence you wish to spend, and then ${message.author} must type \`!done\` in this channel once you're finished.`)
				
				for (let ply of players){
					ply.member.user.send(`You currently have ${ply.player.influence}/${ply.player.maxinfluence} influence. How much would you like to spend?`)
				}

				let msg = {content: ''};
				while (msg.content.toLowerCase() != '!done'){
					msg = await messageController.next;
				}
				let highestInf = 0;
				let votes = [];
				for (let ply of players){
					let msg = ply.member.user.dmChannel.lastMessage;
					let num = msg.content;
					if (isNaN(num)) num = 0; //If they didn't type a number, they are assumed to not spend any influence.
					else num = parseInt(num);
					if (num > ply.player.influence) num = ply.player.influence; //If they spend more than they have, they are assumed to spend all their influence.
					if (num > highestInf){
						highestInf = num;
						leader = ply;
					}
					votes.push({player: ply, influence: num});
				}
				votes.sort(function(a,b){return b.influence - a.influence})
				msg = '';
				let x = 0;
				for (let vote of votes){
					if (x == 0) leader.player.influence -= vote.influence;
					msg += `${vote.influence} - ${vote.player.member.user}\n`;
					x++;
				}

				message.channel.send(`**Influence Used**\n${msg}`);
				message.channel.send(`The Team Leader is ${leader.member.user}, please pick your partner.`)

				const filter = m => m.author.id === leader.member.user.id;
				const selectPartnerMessage = new Discord.MessageCollector(message.channel, filter);

				msg = message;
				while (msg.mentions.members.array().length != 1){
					msg = await selectPartnerMessage.next;
					console.log(msg.content);
				}

				partner = msg.mentions.members.array()[0];
				message.channel.send(`Team Leader: ${leader.member.user}\nPartner: ${partner.user}\nEveryone may now direct message the bot with \`yes\` or \`no\` to vote, and then ${message.author} must type \`!done\` in this channel once you're finished.`)

				msg = {content: ''};
				while (msg.content.toLowerCase() != '!done'){
					msg = await messageController.next;
				}

				let voteTotal = 0;
				votes = [];
				for (let ply of players){
					let msg = ply.member.user.dmChannel.lastMessage.content.toLowerCase();
					if (msg == 'yes') voteTotal++;
					else if (msg == 'no') voteTotal--;
					else {
						msg = 'yes';
						voteTotal++;
					}
					votes.push({player: ply, vote: msg});
				}
				msg = '';
				for (let vote of votes){
					msg += `${vote.vote} - ${vote.player.member.user}\n`;
				}
				message.channel.send(`**Votes**\n${msg}`)

				if (voteTotal > 0) failedvote = false;
				else message.channel.send(`The vote did not pass.`)
			}
			message.channel.send(`The vote passed. The mission is now underway.`);

			//Mission Start

			//Draw 3 cards from the draw pile.
			var shouldDraw = 3;
			let cards = [];
			if (drawPile.length >= shouldDraw){
				let i = 0;
				for (let card of drawPile){
					if (i < shouldDraw){
						cards.push(card);
						drawPile.splice(0,1);
					}
					i++
				}
			}

			let msg = '**You have drawn:**'
			let x = 0;
			for (let card of cards){
				x++;
				msg += `\n${x} - ${card}`;
			}
			msg += `\nType the number of the card you wish to discard.`
			leader.member.user.send(msg)

			var leaderDiscardMessage = new Discord.MessageCollector(leader.member.user.dmChannel);

			msg = '';
			while (msg < shouldDraw){
				msg = await leaderDiscardMessage.next;
				msg = parseInt(msg) - 1;
			}

			discardPile.push(cards[msg]); // Discard the card specified
			cards.splice(msg,1); //Remove the card from the hand

			shouldDraw = cards.length; //Partner should draw the remaining cards.

			msg = '**You have drawn:**'
			x = 0;
			for (let card of cards){
				x++;
				msg += `\n${x} - ${card}`;
			}
			msg += `\nType the number of the card you wish to **PLAY**.`
			partner.member.user.send(msg)

			var leaderDiscardMessage = new Discord.MessageCollector(partner.member.user.dmChannel);

			msg = '';
			while (msg < shouldDraw){
				msg = await leaderDiscardMessage.next;
				msg = parseInt(msg) - 1;
			}

			if (cards[msg] == 'Success'){
				message.channel.send(`The mission was successful!`);
				mission.success(leader,partner);
			} else {
				message.channel.send(`The mission failed!`);
				mission.fail(leader,partner);
			}

			for (let card of cards) discardPile.push(card); //Discard the hand.

			missionNum++; //Proceed to the next mission.
		}	
	}
}

module.exports = newGameCommand;