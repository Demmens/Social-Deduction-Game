const { Command } = require("discord-akairo");
const missiontree = require('../gameRunning/missiontree.js');
var roles = require('../classes/roles');
const Discord = require('discord.js');

//Config
const StartingInfluence = 15;
const SuccessCards = 6;
const FailCards = 12;
const InfluenceRegen = 2;
const innoRoleChoices = 2;
const traitorRoleChoices = 3;
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
			if (true || (x % 2 == 0 && x != 0)){
				ply.member.send(`You are a **Traitor**`);
				ply.player = {
					"team": "traitor",
					"influence": StartingInfluence
				};
			}
			else {
				ply.member.send(`You are **Innocent**`);
				ply.player = {
					"team": "innocent",
					"influence": StartingInfluence
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

		let tempRoles = JSON.parse(JSON.stringify(roles));
		let newInnoArr = [];
		let newTraitorArr = [];
		while (tempRoles.innocent.length > 0){ //Randomise order of roles
			let k = Math.floor(Math.random()*tempRoles.innocent.length);
			let v = tempRoles.innocent[k];
			tempRoles.innocent.splice(k,1);
			newInnoArr.push(v);
		}
		while (tempRoles.traitor.length > 0){ //Randomise order of roles
			let k = Math.floor(Math.random()*tempRoles.traitor.length);
			let v = tempRoles.traitor[k];
			tempRoles.traitor.splice(k,1);
			newTraitorArr.push(v);
		}
		roles.innocent = JSON.parse(JSON.stringify(newInnoArr));
		roles.traitor = JSON.parse(JSON.stringify(newTraitorArr));
		let roleMsg = '**Innocent Roles in the game**';
		let roleChoices = [];
		for (let ply of players){ //Dish out roles
			let i = 0;
			let tbl;
			let loops;
			if (ply.player.team == 'innocent'){
				tbl = roles.innocent;
				loops = innoRoleChoices;
			} else {
				tbl = roles.traitor;
				loops = traitorRoleChoices;
			}
			let obj = {
				player: ply,
				choices: []
			}
			let msg = '**Choose a Role**';
			let x = 0;
			for (let i = 0; i < loops; i++){
				x++
				let rand = Math.floor(Math.random()*tbl.length);
				let role = tbl[rand];
				tbl.splice(rand,1);
				obj.choices.push(role); //Assign that role choice to the player.
				msg += `\n${x} - ${role.name}: ${role.description}`
			}
			roleChoices.push(obj);
			ply.member.user.send(msg);
		}

		let allPicked = false
		while (!allPicked){
			let x = 0;
			let chosen = 0;
			for (let ply of players){
				let choices = 0;
				if (ply.player.team == 'innocent') choices = innoRoleChoices;
				if (ply.player.team == 'traitor') choices = traitorRoleChoices;

				let msg = ply.member.user.dmChannel.lastMessage;
				if (typeof msg.content == "number" && msg.content <= choices){
					chosen++;
				}
				x++;
			}
			if (x == chosen) allPicked = true;
		}
	//===========================================================================
	//		Tell traitors which roles are in the game
		message.channel.send(`Traitors are deciding their targets.`);
		let targetTbl = [];
		for (let ply of players){
			if (ply.player.role.name == 'Researcher') ply.member.user.send(roleMsg);
			if (ply.player.team == 'traitor'){
				if (ply.player.role.name == 'Spelling Bee'){ //Extrovert knows all traitor allies.
					let traitorMsg = `**Your allies are:**`
					for (let ply2 of players){
						if (ply2.player.team == 'traitor' && ply2 != ply){
							traitorMsg += `\n${ply.member.displayName}`;
						}
					}
					ply.member.user.send(traitorMsg);
				}
				ply.member.user.send(roleMsg + `\n**Type the name of the role you wish to make your target.**`); //Traitors set Targets
				let sentMessage = false;
				var trTargetFilter = m => m.author.id === ply.member.user.id;
				var trMessageController = new Discord.MessageCollector(ply.member.user.dmChannel, trTargetFilter);
				while (sentMessage == false){
					let msg = await trMessageController.next;
					for (let ply2 of players){
						if (ply2.player.role.name.toLowerCase() == msg.content.toLowerCase()){
							sentMessage = true;
							ply.player.target = ply2;
							targetTbl.push(ply2);
							ply.member.user.send(`Your target has been set as the ${ply2.player.role.name}`);
						}
					}
				}

			} else if (ply.player.role.name == 'Detective'){
				let tgt = players[Math.floor(Math.random()*players.length)];
				while (tgt.player.team != 'innocent' && tgt != ply) tgt = players[Math.floor(Math.random()*players.length)];
				ply.member.user.send(`${tgt.member.displayName} is a ${tgt.player.role.name}`);
			}
		}

		for (let ply of players){
			if (ply.player.role.name == 'Insider'){
				let tgt = targetTbl[Math.floor(Math.random()*targetTbl.length)];
				//ply.member.user.send(`One of the targets is the ${tgt.player.role.name}`);
			}
		}

	//===========================================================================
		globalThis.leader = 0;
		globalThis.partner = 0;
		globalThis.pollenated = 0;
		let missionNum = 1;
		for (let mission of missions){
			let failedvote = true;
			while (failedvote){

				//Reset all once per mission effects
				for (let ply of players){
					if (ply.player.role.name == 'Hypnotist') ply.player.role.used = false;
					if (ply.player.role.name == 'Psychic'){
						let msg = '**Top two cards of the draw pile:**';
						for (let i = 0; i<2; i++){
							msg += `\n${drawPile[i]}`;
						}
						ply.member.user.send(msg);
					}
				}

				message.channel.send(`**Mission ${missionNum}: ${mission.name}**\n\`\`\`Success Effect: ${mission.successtext}\nFail Effect: ${mission.failtext}\`\`\``);
				let infMessage = '**Current influence totals**';
				for (let ply of players){
					infMessage += `\n${ply.member.user}: ${ply.player.influence}`
				}
				message.channel.send(infMessage);
				message.channel.send(`Draw Pile: ${drawPile.length}\nDiscard Pile: ${discardPile.length}`);
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
					if (ply.player.role.name == 'Supressor'){
						Misinformant = ply;
						ply.member.user.send(`Type the display name of a player in a separate message **before** you type your influence number, then that player will have 2 deducted from their influence this round.`)
					}
					ply.member.user.send(`You currently have ${ply.player.influence} influence. How much would you like to spend?`)
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

				let highestInf = -1;
				let votes = [];
				let influenceSpent = 0;
				for (let ply of players){
					let msg = ply.member.user.dmChannel.lastMessage;
					let num = msg.content;
					if (msg.author != ply.member.user) num = 0 //If the last message was from the bot, assumemd to not spend any influence.
					if (isNaN(num)) num = 0; //If they didn't type a number, they are assumed to not spend any influence.
					else num = parseInt(num);
					if (num > ply.player.influence) num = ply.player.influence; //If they spend more than they have, they are assumed to spend all their influence.
					if (num < 0) num = 0;
					let ogNum = num;
					if (ply == MarketeerTarget) num += 2; //Account for role shenanigans
					if (ply == MisinformantTarget) num = 1;
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
				message.channel.send(`Team Leader: ${leader.member.user}\nPartner: ${partner.member.user}\nEveryone that isn't on the mission may now direct message the bot with \`yes\` or \`no\` to vote, and then ${message.author} must type \`!done\` in this channel once you're finished.`)

				msg = {content: ''};
				while (msg.content.toLowerCase() != '!done'){
					msg = await messageController.next;
				}

				failedvote = true;
				votes = [];
				let voteTotal = 0;
				let yesTotal = 0;
				let noTotal = 0;
				let votemsg = '**Votes**'
				for (let ply of players){
					let msg = ply.member.user.dmChannel.lastMessage.content.toLowerCase();
					if (msg == 'yes'){
						if (ply.player.role.name == 'Two Bees in a Trenchcoat') yesTotal++;
						yesTotal++;
						votemsg += `\n${ply.member.user} - Yes`;
					}
					if (msg == 'no'){
						if (ply.player.role.name == 'Two Bees in a Trenchcoat') noTotal++;
						noTotal++;
						votemsg += `\n${ply.member.user} - No`;
					}
					if (msg == 'autofail' && ply.player.role.name == 'Hypnotist' && !ply.player.role.used){
						voteTotal += 100;
						votemsg += `\n${ply.member.user} - No`;
						ply.player.role.used = true;
					}
				}
				if (yesTotal >= noTotal) failedvote = false;
				if (yesTotal < noTotal) failedvote = true;
				if (partner.player.role.name == 'Dictator') failedvote = false;
				if (voteTotal == 0) failedvote = false;
				if (failedvote) message.channel.send(`Every innocent that wasn't on the mission voted no. The leadership will now change hands.`)
			}
			message.channel.send(`The vote passed. Everyone who voted \`yes\` gains 2 influence. The mission is now underway.`);

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
			if (leader.player.role.name == 'Strategist' && drawPile.length != 3) shouldDraw = 4;
			if (leader.player.role.name == 'Veteran' && partner.player.role.name != 'Fixer'){ //Veteran always draws 2S 1F unless fixer is in the game.
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
			} else if (leader.player.role.name == 'Fixer' || partner.player.role.name == 'Fixer'){
				let i = 0; //When fixer is in power, success cards are not drawn where possible.
				for (let card of drawPile){
					if (cards.length < shouldDraw){
						if (card == 'Fail'){
							cards.push(card);
							drawPile.splice(i,1);
						}
					}
					i++;
				}
			} else if (partner.player.role.name == 'Professional'){
				let i = 0;
				for (let card of drawPile){
					if (card == 'Success'){
						cards.push(card);
						drawPile.splice(i,1);
					}
					i++;
				}
			}

			for (let card of drawPile){ //Draw up randomly to 3 cards if at less.
				if (cards.length < shouldDraw){
					cards.push(card);
					drawPile.splice(0,1);
				}
			}

			for (let ply of players){
				if (ply.player.role.name == 'Spy'){ //Spy sees one of the cards drawn by the leader.
					ply.member.user.send(`**The leader drew a ${cards[0]} card**`);
				}
			}

			if (leader.player.role.name == 'Strategist' && cards.length > 3){
				let msg = '**You have drawn:**';
				let x = 0;
				for (let card of cards){
					x++;
					msg += `\n${x} - ${card}`;
				}
				msg += `\nType the number of the card you wish to put on top of the draw pile.`;
				leader.member.user.send(msg);

				var leaderDiscardFilter = m => m.author.id === leader.member.user.id;
				var leaderDiscardMessage = new Discord.MessageCollector(leader.member.user.dmChannel, leaderDiscardFilter);

				msg = shouldDraw+1;
				while (msg > shouldDraw || isNaN(msg)){
					msg = await leaderDiscardMessage.next;
					if (parseInt(msg.content) != NaN){
						msg = parseInt(msg.content) - 1;
					}
				}

				drawPile.unshift(cards[msg]); // Place specified card on top of draw pile
				cards.splice(msg,1); //Remove the card from the hand
			}

			if (leader.player.role.name == 'Salvager' && discardPile.length != 0){
				cards.push(discardPile[discardPile.length-1]); //Take top card of discard pile.
				discardPile.splice(discardPile.length-1,1);
				let msg = '**You have drawn:**';
				let x = 0;
				for (let card of cards){
					x++;
					msg += `\n${x} - ${card}`;
				}
				msg += ` (salvaged)`; //Let them know which card is from the discard pile.
				msg += `\nType the number of the card you wish to discard.`;
				leader.member.user.send(msg);

				var leaderDiscardFilter = m => m.author.id === leader.member.user.id;
				var leaderDiscardMessage = new Discord.MessageCollector(leader.member.user.dmChannel, leaderDiscardFilter);

				msg = shouldDraw+1;
				while (msg > shouldDraw || isNaN(msg)){
					msg = await leaderDiscardMessage.next;
					if (parseInt(msg.content) != NaN){
						msg = parseInt(msg.content) - 1;
					}
				}

				discardPile.push(cards[msg]); // Discard specified card
				cards.splice(msg,1); //Remove the card from the hand
			}

			shouldDraw = cards.length;
			let msg = '**You have drawn:**';
			let x = 0;
			for (let card of cards){
				x++;
				msg += `\n${x} - ${card}`;
			}
			msg += `\nType the number of the card you wish to discard.`;
			leader.member.user.send(msg);

			var leaderDiscardFilter = m => m.author.id === leader.member.user.id;
			var leaderDiscardMessage = new Discord.MessageCollector(leader.member.user.dmChannel, leaderDiscardFilter);

			msg = shouldDraw+1;
			while (msg > shouldDraw || isNaN(msg)){
				msg = await leaderDiscardMessage.next;
				if (!isNaN(msg.content)){
					msg = parseInt(msg.content) - 1;
				}
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

			msg = shouldDraw+1;
			while (msg > shouldDraw || isNaN(msg)){
				msg = await partnerDiscardMessage.next;
				if (!isNaN(msg.content)){
					msg = parseInt(msg.content) - 1;
				}
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
				if (successEffect){
					let shouldEnd = await mission.success(message.channel);
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
				if (failEffect){
					let shouldEnd = await mission.fail(message.channel);
					if (shouldEnd) return;
				}
				else message.channel.send('The fail effect was cancelled.');
			}

			for (let card of cards) discardPile.push(card); //Discard the hand.

			for (let ply of players){
				ply.player.influence += InfluenceRegen;
			}

			if (InfluenceRegen > 0) message.channel.send(`Everyone gains ${InfluenceRegen} influence.`)

			missionNum++; //Proceed to the next mission.
		}

	}
}

module.exports = newGameCommand;