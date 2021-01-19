const { Command } = require("discord-akairo");
const missiontree = require('../gameRunning/missiontree.js');
var roles = require('../classes/roles.js');
const Discord = require('discord.js');

//Config
const StartingInfluence = 15;
const StartingInfluenceMax = 15;
const SuccessCards = 6;
const FailCards = 12;
const InfluenceRegen = 2;
//

class newGameCommand extends Command {
	constructor() {
		super("newgame", {
			aliases: ["newgame","startgame"],
			args: [],
		});
	}
	async exec(message, args) {
		globalThis.successEffect = true;
		globalThis.failEffect = true;
		const filter = m => m.author.id === message.author.id;
		const messageController = new Discord.MessageCollector(message.channel, filter);
		globalThis.players = [];
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
				ply.member.send(`You are a **Traitor**`);
				ply.player = {
					"team": "traitor",
					"influence": StartingInfluence,
					"maxinfluence": StartingInfluenceMax
				};
			}
			else {
				ply.member.send(`You are **Innocent**`);
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

	//===========================================================================
	//		Create the deck of cards to use for succeeding/failing the mission.
		globalThis.drawPile = [];
		globalThis.discardPile = [];
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
			drawPile.splice(k,1);
			tempArr.push(v);
		}
		drawPile = [...tempArr];
	//===========================================================================
	//		Give everyone roles
		let newTempArr = [];
		while (roles.length > 0){ //Randomise order of roles
			let k = Math.floor(Math.random()*roles.length);
			let v = roles[k];
			roles.splice(k,1);
			newTempArr.push(v);
		}
		roles = [...newTempArr];
		let roleMsg = '**Roles in the game**';
		for (let ply of players){ //Dish out roles
			let hasRole = 0;
			let i = 0;
			for (let role of roles){
				if (role.team == ply.player.team && hasRole == 0){ 
					roleMsg += `\n${role.name} - ${role.description}`;
					ply.player.role = role; //Give them a role
					ply.member.user.send(`Your role is the **${role.name}**: ${role.description}`)
					roles.splice(i,1); //Make sure nobody else can get that role.
					hasRole = 1;
					i++;
				}
			}
		}
	//===========================================================================
	//		Tell traitors which roles are in the game
		message.channel.send(`Traitors are deciding their targets.`);
		for (let ply of players){
			if (ply.player.team == 'traitor'){
				ply.member.user.send(roleMsg + `\n**Type the name of the role you wish to make your target.**`);
				let sentMessage = false;
				let trFilter = m => m.author.id === ply.member.id;
				let trMessageController = new Discord.MessageCollector(message.channel, trFilter);
				while (sentMessage == false){
					msg = messageController.next;
					for (let ply2 of players){
						if (ply2.player.role.name.toLowerCase() == msg.content.toLowerCase()){
							sentMessage = true;
							ply.player.target = ply2;
							ply.member.user.send(`Your target has been set as the ${ply2.player.role.name}`);
						}
					}
				}
			}
		}

	//===========================================================================
		await setTimeout(function(){},1000);
		globalThis.leader = 0;
		globalThis.partner = 0;
		globalThis.pollenated = 0;
		let missionNum = 1;
		for (let mission of missions){
			for (let ply of players){ //Reset all 'once per mission' role effects.
				if (ply.player.role.name == 'Fixer'){ 
					ply.player.role.used = false;
				}
			}
			let failedvote = true;
			while (failedvote){
				message.channel.send(`**Mission ${missionNum}: ${mission.name}**\n\`\`\`Success Effect: ${mission.successtext}\nFail Effect: ${mission.failtext}\`\`\``);
				let infMessage = '**Current influence totals**';
				for (let ply of players){
					infMessage += `\n${ply.member.user}: ${ply.player.influence}/${ply.player.maxinfluence}`
				}
				message.channel.send(infMessage);
				message.channel.send(`Direct message The Hive with the number of influence you wish to spend, and then ${message.author} must type \`!done\` in this channel once you're finished.`)
				let Marketeer;
				let Misinformant;
				let MarketeerTarget;
				let MisinformantTarget;
				for (let ply of players){
					if (ply.player.role.name == 'Marketeer'){
						Marketeer = ply;
						ply.member.user.send(`Type the display name of a player in a separate message **before** you type your influence number, then that player will have 2 added to their influence this round.`)
					}
					if (ply.player.role.name == 'Misinformant'){
						Misinformant = ply;
						ply.member.user.send(`Type the display name of a player in a separate message **before** you type your influence number, then that player will have 2 deducted from their influence this round.`)
					}
					ply.member.user.send(`You currently have ${ply.player.influence}/${ply.player.maxinfluence} influence. How much would you like to spend?`)
				}

				let msg = {content: ''};
				while (msg.content.toLowerCase() != '!done'){
					msg = await messageController.next;
				}

				if (Marketeer){
					let msgArr = Marketeer.member.user.dmChannel.messages.cache.array();
					let msg = msgArr[msgArr.length-2];
					for (let ply of players){
						if (ply.member.displayName.toLowerCase() == msg.content.toLowerCase()){
							MarketeerTarget = ply;
						}
					}
				}
				if (Misinformant){
					let msgArr = Misinformant.member.user.dmChannel.messages.cache.array();
					let msg = msgArr[msgArr.length-2];
					for (let ply of players){
						if (ply.member.displayName.toLowerCase() == msg.content.toLowerCase()){
							MisinformantTarget = ply;
						}
					}
				}

				let highestInf = 0;
				let votes = [];
				let influenceSpent = 0;
				for (let ply of players){
					let msg = ply.member.user.dmChannel.lastMessage;
					let num = msg.content;
					if (isNaN(num)) num = 0; //If they didn't type a number, they are assumed to not spend any influence.
					else num = parseInt(num);
					if (num > ply.player.influence) num = ply.player.influence; //If they spend more than they have, they are assumed to spend all their influence.
					let ogNum = num;
					if (ply == MarketeerTarget) num += 2; //Account for role shenanigans
					if (ply == MisinformantTarget) num -=2;
					if (num > highestInf){
						highestInf = num;
						leader = ply;
						influenceSpent = ogNum;
					}
					votes.push({player: ply, influence: num});
				}
				votes.sort(function(a,b){return b.influence - a.influence})
				msg = '';
				let x = 0;
				for (let vote of votes){
					if (x == 0) leader.player.influence -= influenceSpent;
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
				}

				partner = msg.mentions.members.array()[0];
				for (let ply of players){
					if (ply.member == partner) partner = ply;
				}
				message.channel.send(`Team Leader: ${leader.member.user}\nPartner: ${partner.member.user}\nEveryone may now direct message the bot with \`yes\` or \`no\` to vote, and then ${message.author} must type \`!done\` in this channel once you're finished.`)

				msg = {content: ''};
				while (msg.content.toLowerCase() != '!done'){
					msg = await messageController.next;
				}

				failedvote = true;
				votes = [];
				for (let ply of players){
					let msg = ply.member.user.dmChannel.lastMessage.content.toLowerCase();
					if (msg = 'yes' && ply.player.team == 'innocent' && ply != leader && ply != partner && leader.player.role != 'Dictator' && partner.player.role != 'Dictator'){
						failedvote = false;
					}
				}

				if (failedvote) message.channel.send(`Every innocent that wasn't on the mission voted no. The leadership will now change hands.`)
			}
			message.channel.send(`The vote passed. The mission is now underway.`);

			//Mission Start
			let Saboteur;
			let Defender;
			for (let ply of players){
				if (ply.player.role.name == 'Saboteur' && !ply.player.role.used){
					Saboteur = ply;
					ply.member.user.send('If you type \'cancel\' in this channel before the outcome of the mission is determined, then if the mission is a success, the effect will be cancelled, and you lose the effect of your power.')
				}
				if (ply.player.role.name == 'Defender' && !ply.player.role.used){
					Defender = ply;
					ply.member.user.send('If you type \'cancel\' in this channel before the outcome of the mission is determined, then if the mission is a failure, the effect will be cancelled, and you lose the effect of your power.')
				}
			}

			//Draw 3 cards from the draw pile.
			var shouldDraw = 3;
			let cards = [];
			if (drawPile.length < shouldDraw){
				for (let card of discardPile){ //put discards back into the deck
					drawPile.push(card);
				}

				let tempArr = [];
				while (drawPile.length > 0){ //Shuffle the deck
					let k = Math.floor(Math.random()*drawPile.length);
					let v = drawPile[k];
					drawPile.splice(k,1);
					tempArr.push(v);
				}
				drawPile = [...tempArr];
			}

			if (leader.player.role.name == 'Veteran'){ //Veteran always draws 2S 1F
				let i=0;
				let hasFail = false;
				let hasSucceed = 0;
				for (let card of drawPile){
					if (cards.length < shouldDraw){
						if (card == 'Fail' && !hasFail){ //If they don't have a fail card yet, add the fail to the hand
							cards.push(card);
							drawPile.splice(i,1);
							hasFail = true;
						}
						if (card == 'Success' && hasSucceed < 2){ //If they have less than 2 success cards, add the succeed card to the hand
							hasSucceed++;
							cards.push(card);
							drawPile.splice(i,1);
						}
					}
					i++;
				}

				if (cards.length < shouldDraw){ //If they can't draw 2S 1F, just draw from the top of the deck.
					for (let card of drawPile){
						if (cards.length < shouldDraw){
							cards.push(card);
							drawPile.splice(0,1);
						}
					}
				}
			} else{
				let i = 0;
				for (let card of drawPile){
					if (i < shouldDraw){
						cards.push(card);
						drawPile.splice(0,1);
					}
					i++
				}
			}

			for (let ply of players){
				if (ply.player.role.name == 'Spy'){ //Spy sees one of the cards drawn by the leader.
					ply.member.user.send(`**The leader drew a ${cards[0]} card**`);
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

			var leaderDiscardFilter = m => m.author.id === leader.member.user.id;
			var leaderDiscardMessage = new Discord.MessageCollector(leader.member.user.dmChannel, leaderDiscardFilter);

			msg = 5;
			while (msg > shouldDraw){
				msg = await leaderDiscardMessage.next;
				msg = parseInt(msg.content) - 1;
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
			var partnerDiscardFilter = m => m.author.id === partner.member.user.id;
			var partnerDiscardMessage = new Discord.MessageCollector(partner.member.user.dmChannel, partnerDiscardFilter);

			msg = 5;
			while (msg > shouldDraw){
				msg = await partnerDiscardMessage.next;
				msg = parseInt(msg.content) - 1;
			}

			//Determine Result

			if (cards[msg] == 'Success'){
				message.channel.send(`The mission was successful!`);
				if (Saboteur){
					if (Saboteur.member.user.dmChannel.lastMessage.content.toLowerCase() == 'cancel'){
						successEffect = false;
						Saboteur.player.role.used = true;
					}
				}
				if (effect){
					let shouldEnd = await mission.success(leader, partner, message.channel, players);
					if (shouldEnd) return;
				}
				else message.channel.send('The success effect was cancelled.')
			} else {
				message.channel.send(`The mission failed!`);
				if (Defender){
					if (Defender.member.user.dmChannel.lastMessage.content.toLowerCase() == 'cancel'){
						failEffect = false;
						Defender.player.role.used = true;
					}
				}
				if (effect){
					let shouldEnd = await mission.fail(leader, partner, message.channel, players);
					if (shouldEnd) return;
				}
				else message.channel.send('The fail effect was cancelled.');
			}

			for (let card of cards) discardPile.push(card); //Discard the hand.

			for (let ply of players){
				ply.player.influence += InfluenceRegen;
				if (InfluenceRegen > 0) message.channel.send(`Everyone recovers ${InfluenceRegen} influence.`)
				if (ply.player.influence > ply.player.maxinfluence) ply.player.influence = ply.player.maxinfluence;
			}

			missionNum++; //Proceed to the next mission.
		}

	}
}

module.exports = newGameCommand;