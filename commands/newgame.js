const { Command } = require("discord-akairo");
const missiontree = require('../gameRunning/missiontree.js');
var roles = require('../classes/roles');
const Discord = require('discord.js');
const f = require("../functions.js");

//General Config
const StartingInfluence = 8;
const SuccessCards = 6;
const FailCards = 12;
const InfluenceRegen = 1;
const innoRoleChoices = 12;
const traitorRoleChoices = 2;
const influenceCost = 2;
//Role Config
const CapitalBeeStrength = 4;
const SleuthTimer = 3;
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
		globalThis.players = [];
		var traitorCount = 0;
		var innocentCount = 0;

		let CapitalBeeTarget;
		let SuppressorTarget;
		for (let [_,chnl] of message.guild.channels.cache){
			if (chnl.name == 'Game Chat'){
				for (let [_,ply] of chnl.members){ //Everyone in the voice chat is a player of the game.
					players.push({"member": ply});
				} 
			}
		}

		players = f.ArrRandomise(players);
		let x = 0;
		for (let ply of players){
			if (x % 2 == 0 && x != 0){
				ply.member.user.send(`You are a **Traitor**`);
				ply.player = {
					"team": "traitor",
					"influence": StartingInfluence
				};
				traitorCount++;
			}
			else {
				ply.member.user.send(`You are **Innocent**`);
				ply.player = {
					"team": "innocent",
					"influence": StartingInfluence
				};
				innocentCount++;
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

		drawPile = f.ArrRandomise(drawPile);
	//===========================================================================
	//		Give everyone roles

		roles.innocent = f.ArrRandomise(roles.innocent);
		roles.traitor = f.ArrRandomise(roles.traitor);
		let roleMsg = '**Roles in the game**';
		let roleChoices = [];

		//Allow players to choose the role they want
		for (let ply of players){
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
				if (tbl.length > 0){
					x++
					let rand = Math.floor(Math.random()*tbl.length);
					let role = tbl[rand];
					tbl.splice(rand,1);
					if (traitorCount >= role.traitors){
						obj.choices.push(role); //Assign that role choice to the player.
						msg += `\n${x} - ${role.name}: ${role.description}`
					} else i--;
				}
			}
			roleChoices.push(obj);
			await ply.member.user.send(msg);
		}
		//Wait until everyone has chosen their role
		let allPicked = false;
		while (!allPicked){
			let x = 0;
			let chosen = 0;
			for (let ply of players){
				let choices = 0;
				if (ply.player.team == 'innocent') choices = innoRoleChoices;
				if (ply.player.team == 'traitor') choices = traitorRoleChoices;
				let msg = ply.member.user.dmChannel.lastMessage;
				if (!isNaN(msg.content) && parseInt(msg.content) <= choices && msg.author == ply.member.user){
					let rl;
					for (let role of roleChoices){
						if (role.player == ply) rl = role;
					}
					ply.player.role = rl.choices[parseInt(msg.content)-1];
					chosen++;
				} else {
					let fl = m => m.author.id === ply.member.id;
					let pickRoleControler = new Discord.MessageCollector(ply.member.user.dmChannel, fl);
					msg = await pickRoleControler.next;
				}
				x++;
			}
			if (x == chosen) allPicked = true;
		}
		{
			for (let ply of players){
				roleMsg += `\n${ply.player.role.name} - ${ply.player.role.description}`;
			}
		}
//======================================================================
//		Assign Variables
		globalThis.Researcher = null;
		globalThis.Spy = null;
		globalThis.Defender = null;
		globalThis.CapitalBee = null;
		globalThis.Veteran = null;
		globalThis.Detective = null;
		globalThis.Professional = null;
		globalThis.TwoBees = null;
		globalThis.DoubleAgent = null;
		globalThis.Omniscient = null;
		globalThis.Insider = null;
		globalThis.Strategist = null;
		globalThis.Salvager = null;
		globalThis.Sleuth = null;

		globalThis.Gambler = null;
		globalThis.Suppressor = null;
		globalThis.Saboteur = null;
		globalThis.FumbleBee = null;
		globalThis.SpellingBee = null;
		globalThis.Hypnotist = null;
		globalThis.Psychic = null;
		globalThis.Dictator = null;

		let rejected = [];
		for (let role of roles.innocent){
			let roleExists = false;
			for (let ply of playeres){
				if (ply.player.role.name == role.name) roleExists = true;
			}
			if (!roleExists){
				rejected.push(role);
			}
		}
	

		for (let ply of players){
			let rl = ply.player.role.name;
			let subRoles = [];
			if (rl == 'Two Bees in a Trenchcoat'){
				TwoBees = ply;
				TwoBees.subroles = []
				let i = 0;
				let hasUsedRole = false;
				for (let role of rejected){
					if (i < 2){
						if (hasUsedRole && role.used === false){
							i--;
						} else TwoBees.subroles.push(role.name);
					}
					i++;
				}
				subRoles = TwoBees.subroles;
			}

			if (rl == 'Spy' || subRoles.includes('Spy')) Spy = ply;
			if (rl == 'Researcher' || subRoles.includes('Researcher')) Researcher = ply;
			if (rl == 'Defender' || subRoles.includes('Defender')) Defender = ply;
			if (rl == 'Capital Bee' || subRoles.includes('Capital Bee')) CapitalBee = ply;
			if (rl == 'Veteran' || subRoles.includes('Veteran')) Veteran = ply;
			if (rl == 'Detective' || subRoles.includes('Detective')) Detective = ply;
			if (rl == 'Professional' || subRoles.includes('Professional')) Professional = ply;
			if (rl == 'Double-Agent' || subRoles.includes('Double-Agent')) DoubleAgent = ply;
			if (rl == 'Omniscient' || subRoles.includes('Omniscient')) Omniscient = ply;
			if (rl == 'Insider' || subRoles.includes('Insider')) Insider = ply;
			if (rl == 'Strategist' || subRoles.includes('Strategist')) Strategist = ply;
			if (rl == 'Salvager' || subRoles.includes('Salvager')) Salvager = ply;
			if (rl == 'Sleuth' || subRoles.includes('Sleuth')) Sleuth = ply;
			
			if (rl == 'Gambler') Gambler = ply;
			if (rl == 'Suppressor') Suppressor = ply;
			if (rl == 'Saboteur') Saboteur = ply;
			if (rl == 'Fumble Bee') FumbleBee = ply;
			if (rl == 'Spelling Bee') SpellingBee = ply;
			if (rl == 'Hypnotist') Hypnotist = ply;
			if (rl == 'Psychic') Psychic = ply;
			if (rl == 'Dictator') Dictator = ply;
		}
//===========================================================================
//		Tell traitors which roles are in the game
		message.channel.send(`Traitors are deciding their targets.`);
		let targetTbl = [];
		if (Researcher) Researcher.member.user.send(roleMsg);

		if (DoubleAgent){
			let hasTraitor = false;
			let hasInnocent = false;
			let plyTbl = [];
			let tgt = players[Math.floor(Math.random()*players.length)];
			while (tgt == DoubleAgent || hasInnocent && tgt.player.team == 'innocent' || hasTraitor && tgt.player.team == 'traitor'){
				tgt = players[Math.floor(Math.random()*players.length)];
				if (tgt.player.team == 'innocent' && !hasInnocent){
					hasInnocent = true;
					plyTbl.push(tgt);
				}
				else if(tgt.player.team == 'traitor' && !hasTraitor){
					hasTraitor = true;
					plyTbl.push(tgt);
				} 
			}
			
			let x = Math.floor(Math.random()*2); //x is either 1 or 0
			DoubleAgent.member.user.send(`**${plyTbl[x].member.displayName}** and **${plyTbl[1-x].member.displayName}** are on different teams.`)
		}

		if (Omniscient){ //Omniscient knows all traitors, but at a price.
			let traitorMsg = `**The traitors are:**`
			for (let ply of players) if (ply.player.team == 'traitor') traitorMsg += `\n${ply.member.displayName}`;
			Omniscient.member.user.send(traitorMsg);
		}

		if (SpellingBee){ //Spelling Bee knows all traitor allies.
			let traitorMsg = `**Your allies are:**`
			for (let ply of players){
				if (ply.player.team == 'traitor' && ply != SpellingBee){
					traitorMsg += `\n${ply.member.displayName}`;
				}
			}
			SpellingBee.member.user.send(traitorMsg);
		}

		if (Detective){
			let tgt = players[Math.floor(Math.random()*players.length)];
			while ((tgt.player.team == 'traitor' || tgt == Detective) && players.length > 1) tgt = players[Math.floor(Math.random()*players.length)];
			Detective.member.user.send(`${tgt.member.displayName} is a ${tgt.player.role.name}`);
		}

		for (let ply of players){
			if (ply.player.team == 'traitor'){ //Traitors set Targets
				ply.member.user.send(roleMsg + `\n**Type the name of the role you wish to make your target.**`); 
			}
		}
//=========================================
//	Traitors choose targets
		let traitorsChoseTargets = false;
		while (!traitorsChoseTargets){
			let i = 0;
			for (let ply of players){
				if (ply.player.team == 'traitor' && ply.player.role.name != 'Gambler'){
					i++;
					let msg = ply.member.user.dmChannel.lastMessage;
					let tgtChosen = false;
					for (let ply2 of players){
						if (ply2.player.role.name.toLowerCase() == msg.content.toLowerCase()){
							sentMessage++;
							ply.player.target = ply2;
							tgtChosen = true;
						}
					}
					if (!tgtChosen){
						var trTargetFilter = m => m.author.id === ply.member.user.id;
						var trMessageController = new Discord.MessageCollector(ply.member.user.dmChannel, trTargetFilter);
						msg = await trMessageController.next;
					}	
				}
			}
			if (sentMessage == i) traitorsChoseTargets = true;
		}	

		if (Gambler){
			let tgt = players[Math.floor(Math.random()*players.length)];
			while ((tgt == Gambler || tgt.player.team == 'traitor' || tgt == Omniscient) && players.length != 1){
				tgt = players[Math.floor(Math.random()*players.length)];
			}
			Gambler.player.target = tgt;
		}

		for (let ply of players){
			if (ply.player.team == 'traitor'){
				ply.member.user.send(`Your target has been set as the ${ply.player.target.player.role.name}`);
				targetTbl.push(ply.player.target);
			}
		}
		if (Insider){
			let tgt = targetTbl[Math.floor(Math.random()*targetTbl.length)];
			Insider.member.user.send(`One of the targets is the ${tgt.player.role.name}`);
		}

//===========================================================================
//	Setup Mission
		globalThis.leader = 0;
		globalThis.partner = 0;
		globalThis.pollenated = 0;
		let missionNum = 1;
		for (let mission of missions){
			let failedvote = true;
			while (failedvote){
				let inflTotal = 0;
				for (let ply of players){
					inflTotal += ply.player.influence;
				}
				if (inflTotal == 0) return message.channel.send('All players have 0 influence.\n**TRAITORS WIN**');
				//Once per mission effects
				if (Hypnotist) ply.player.role.used = true;
				if (Psychic){
					let msg = '**Top two cards of the draw pile:**';
					for (let i = 0; i<2; i++){
						if (drawPile[i]) msg += `\n${drawPile[i]}`;
					}
					Psychic.member.user.send(msg);
				}

				message.channel.send(`**Mission ${missionNum}: ${mission.name}**\n\`\`\`Success Effect: ${mission.successtext}\nFail Effect: ${mission.failtext}\`\`\``);
				let infMessage = '**Current influence totals**';
				for (let ply of players){
					infMessage += `\n${ply.member.user}: ${ply.player.influence}`
				}
				message.channel.send(infMessage);
				message.channel.send(`Draw Pile: ${drawPile.length}\nDiscard Pile: ${discardPile.length}`);
				message.channel.send(`Direct message The Hive with the number of influence you wish to spend.`);

//=================================================================================================================
//	Influence vote start
//=================================================================================================================			
				
				if (missionNum % SleuthTimer == 0 && missionNum != 0 && Sleuth){
					Sleuth.member.user.send(`Type the display name of a player in a separate message **before** you type your influence number. You will learn the allegience of this player.`);
				}
				if (CapitalBee){
					CapitalBee.member.user.send(`Type the display name of a player in a separate message **before** you type your influence number, then that player will have ${CapitalBeeStrength} added to their influence this round.`);
				}
				if (Suppressor){
					let msg = `Type the display name of a player in a separate message **before** you type your influence number, then that player will have their influence set to 1 this round.`;
					if (SuppressorTarget) msg += ` Your last target was **${SuppressorTarget.member.displayName}**`;
					Suppressor.member.user.send(msg);
				}
				if (Gambler){
					Gambler.member.user.send(`Type \`Randomise\` in a separate message **before** you type in your influence number if you wish to randomise your target.`);
				}

				for (let ply of players){
					await ply.member.user.send(`You currently have ${ply.player.influence} influence. How much would you like to spend?`)
				}

				let influenceDone = false;
				while (!influenceDone){
					let done = 0;
					for (let ply of players){
						let msg = ply.member.user.dmChannel.lastMessage;
						if (!isNaN(msg.content) && msg.author == ply.member.user){
							done++;
						} else{
							let fl = m => m.author.id === ply.member.id;
							let inflController = new Discord.MessageCollector(ply.member.user.dmChannel, fl);
							msg = await inflController.next;
						}
					}
					if (done == players.length) influenceDone = true;
				}
				if (Sleuth){
					let arr = Defender.member.user.dmChannel.messages.cache.array();
					for (let i = arr.length-1; i > 0; i--){
						let msg = arr[i];
						if (msg.content.startsWith('Type the display name of a player') && msg.author != Defender.member.user) break;
						for (let ply of players){
							if (ply.member.displayName.toLowerCase() == msg.content.toLowerCase()){
								Sleuth = null;
								let tmName = 'innocent'
								if (ply.player.team == 'traitor') tmName = 'a traitor'
								Sleuth.member.user.send(`${ply.member.displayName} is ${tmName}`);
							}
						}
						if (!Sleuth) break;
					}
				}
				if (CapitalBee){
					let msgArr = CapitalBee.member.user.dmChannel.messages.cache.array();
					for (let i = msgArr.length-1; i> 0; i--){
						if (msgArr[i].content.startsWith('Type the display') && msgArr[i].author != CapitalBee.member.user) break;
						for (let ply of players){
							if (ply.member.displayName.toLowerCase() == msgArr[i].content.toLowerCase()){
								CapitalBeeTarget = ply;
								break;
							}
						}
					}
				}
				if (Gambler){
					if (!Gambler.player.role.used){
						let msgArr = Gambler.member.user.dmChannel.messages.cache.array();
						for (let i = msgArr.length-1; i>0;i--){
							if (msgArr[i].content.toLowerCase() == 'randomise'){
								let tgt = players[Math.floor(Math.random()*players.length)];
								while ((tgt == ply || tgt.player.team == 'traitor' || tgt == Omniscient || tgt == Gambler.player.target) && players.length != 1){
									tgt = players[Math.floor(Math.random()*players.length)];
								}
								ply.player.target = tgt;
								Gambler.player.role.used = true;
								break;
							}
						}
					}
				}
				if (Suppressor){
					let msgArr = Suppressor.member.user.dmChannel.messages.cache.array();
					for (let i = msgArr.length-1;i>0;i--){
						let msg = msgArr[i].content.toLowerCase();
						if (msg.startsWith ('type the display') && msgArr[i].author != Suppressor.member.user) break;
						for (let ply of players){
							if (ply.member.displayName.toLowerCase() == msg){
								if (SuppressorTarget){
									if (msg != SuppressorTarget.member.displayName.toLowerCase()) SuppressorTarget = ply;
									else SuppressorTarget = null;
								} else SuppressorTarget = ply;
								break;
							}
						}
					}
				}

				let votes = [];
				let totalInfluence = 0;
				for (let ply of players){
					let msg = ply.member.user.dmChannel.lastMessage;
					let num = msg.content;
					if (msg.author != ply.member.user) num = 0 //If the last message was from the bot, assumemd to not spend any influence.
					if (isNaN(num)) num = 0; //If they didn't type a number, they are assumed to not spend any influence.
					else num = parseInt(num);
					if (num > ply.player.influence) num = ply.player.influence; //If they spend more than they have, they are assumed to spend all their influence.
					if (num < 0) num = 0;
					let influenceSpent = num;
					totalInfluence += num;
					if (ply == CapitalBeeTarget) num += CapitalBeeStrength; //Account for role shenanigans
					if (ply == SuppressorTarget) num = 1;
					votes.push({player: ply, influence: num, influenceSpent: influenceSpent});
				}
				votes.sort(function(a,b){return b.influence - a.influence})
				let msg = '';
				let hasLeader = false;
				let notEnoughInfluence = false;
				for (let vote of votes){
					let isTied = false;
					for (let vote2 of votes){ //Leader is the person with the highest unique influence vote.
						if (vote.influence == vote2.influence && vote != vote2){
							isTied = true;
							break;
						}
					}
					if (!isTied && !hasLeader){
						hasLeader = true;
						leader = vote.player;
						leader.player.influence -= vote.influenceSpent;
					}
					msg += `${vote.influence} - ${vote.player.member.user}\n`;
				}
				if (totalInfluence < Math.floor(players.length*influenceCost)){
					hasLeader = false;
					notEnoughInfluence = true;
				}
				if (hasLeader) {
//=============================================================================================================
//  Influence vote has been decided
//=============================================================================================================
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

//===============================
// Vote Start
					await message.channel.send(`Team Leader: ${leader.member.user}\nPartner: ${partner.member.user}\nEveryone must now direct message the bot with \`yes\` or \`no\` to vote.`)
					let voteDone = false;
					while (!voteDone){
						let done = 0;
						for (let ply of players){
							let msg = ply.member.user.dmChannel.lastMessage;
							if ((msg.content.toLowerCase() == 'yes' || msg.content.toLowerCase() == 'no') && msg.author == ply.member.user){
								done++;
							} else {
								let fl = m => m.author.id === ply.member.id;
								let voteController = new Discord.MessageCollector(ply.member.user.dmChannel, fl);
								msg = await voteController.next;
							}
						}
						if (done == players.length) voteDone = true;
					}

					failedvote = true;
					let yesVotes = [];
					let noVotes = [];
					let yesTotal = 0;
					let noTotal = 0;
					let votemsg = ''
					for (let ply of players){
						let msg = ply.member.user.dmChannel.lastMessage.content.toLowerCase();
						if (msg == 'yes'){
							yesTotal++;
							yesVotes.push(ply)
							votemsg += `\n${ply.member.user} - Yes`;
						}
						if (msg == 'no'){
							noTotal++;
							noVotes.push(ply);
							votemsg += `\n${ply.member.user} - No`;
						}
						if (msg == 'autofail' && ply == Hypnotist && !ply.player.role.used){
							noTotal += 100;
							noVotes.push(ply);
							votemsg += `\n${ply.member.user} - No`;
							ply.player.role.used = true;
						}
					}
					let emb = new Discord.MessageEmbed()
						.setTitle('**Votes**')
						.setDescription(votemsg);
					if (yesTotal >= noTotal) failedvote = false;
					if (yesTotal < noTotal) failedvote = true;
					if (partner == Dictator) failedvote = false;
					if (failedvote){
						message.channel.send(emb);
						message.channel.send(`The vote failed. A new leader will be determined. Everyone loses 1 influence`);
						for (let ply of players){
							ply.player.influence -= 1;
							if (ply.player.influence < 0) ply.player.influence = 0;
						}
					}
					else{
						message.channel.send(emb);
						message.channel.send(`The vote passed. Everyone who voted \`yes\` gains 1 influence. The mission is now underway.`);
						for (let ply of yesVotes){
							ply.player.influence += 1;
						}
					}
				} else if (!notEnoughInfluence){
					message.channel.send('All votes are tied. All players lose 5 influence.');
					for (let ply of players){
						ply.player.influence -= 5;
						if (ply.player.influence < 0) ply.player.influence = 0;
					}
				} else{
					message.channel.send('Not enough influence was spent. The mission has failed.');
					message.channel.send(`The mission failed!`);
					if (Defender){
						let arr = Defender.member.user.dmChannel.messages.cache.array();
						for (let i = arr.length-1; i > 0; i--){
							let msg = arr[i];
							if (msg.content.startsWith('If you type') && msg.author != Defender.member.user) break;
							if (msg.content.toLowerCase() == 'cancel'){
								failEffect = false;
								Defender.player.role.used = true;
								Defender = null;
							}
						}
					}
					if (failEffect){
						leader = null;
						partner = null;
						let shouldEnd = await mission.fail(message.channel);
						if (shouldEnd) return;
					}
					else message.channel.send('The fail effect was cancelled.');
				}
			}
//=================================
//	Mission Start

			if (Saboteur){
				if (!Saboteur.player.role.used) Saboteur.member.user.send('If you type \'cancel\' in this channel before the outcome of the mission is determined, then if the mission is a success, the effect will be cancelled, and you lose the effect of your power.');
			}
			if (Defender){
				if (!Defender.player.role.used){
					Defender.member.user.send('If you type \'cancel\' in this channel before the outcome of the mission is determined, then if the mission is a failure, the effect will be cancelled, and you lose the effect of your power.');
				}
			}

			//Draw 3 cards from the draw pile.
			var shouldDraw = 3;
			let cards = [];
			if (drawPile.length < shouldDraw){
				for (let card of discardPile){ //put discards back into the deck
					drawPile.push(card);
				}
				drawPile = f.ArrRandomise(drawPile); //Shuffle the deck
				discardPile = []; //Empty discard pile
			}
			if (leader == Strategist && drawPile.length != 3) shouldDraw = 4;
			if (leader == Veteran && partner != FumbleBee){
				let i=0; //Veteran always draws 2S 1F unless Fumble Bee is on the mission.
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
			} else if (leader == FumbleBee || partner == FumbleBee){
				let i = 0; //When Fumble Bee is in power, success cards are not drawn where possible.
				for (let card of drawPile){
					if (cards.length < shouldDraw){
						if (card == 'Fail'){
							cards.push(card);
							drawPile.splice(i,1);
						}
					}
					i++;
				}
			} else if (partner == Professional){
				let i = 0;
				for (let card of drawPile){
					if (card == 'Success' && cards.length < 1){
						cards.push(card);
						drawPile.splice(i,1);
					}
					i++;
				}
			}

			for (let i = 0; i < shouldDraw; i++){ //Draw up randomly to 3 cards if at less.
				if (cards.length < shouldDraw){ //Make sure hand size stays where it should be.
					cards.push(drawPile[0]); //Add top card of the drawpile to the hand.
					drawPile.splice(0,1); //Remove top card of the drawpile.
				}
			}
			
			if (Spy) Spy.member.user.send(`**The leader drew a ${cards[0]} card**`); //Spy sees one of the cards drawn by the leader.

			if (leader == Salvager && discardPile.length != 0){
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

			if (leader == Strategist && cards.length > 3){
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
//==========================================
//	Determine Result

			if (cards[msg] == 'Success'){
				message.channel.send(`The mission was successful!`);
				if (Saboteur){
					let arr = Saboteur.member.user.dmChannel.messages.cache.array();
					for (let i = arr.length-1; i > 0; i--){
						let msg = arr[i];
						if (msg.content.startsWith('If you type') && msg.author != Saboteur.member.user) break;
						if (msg.content.toLowerCase() == 'cancel'){
							successEffect = false;
							Saboteur.player.role.used = true;
							Saboteur = null;
						}
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
					let arr = Defender.member.user.dmChannel.messages.cache.array();
					for (let i = arr.length-1; i > 0; i--){
						let msg = arr[i];
						if (msg.content.startsWith('If you type') && msg.author != Defender.member.user) break;
						if (msg.content.toLowerCase() == 'cancel'){
							failEffect = false;
							Defender.player.role.used = true;
							Defender = null;
						}
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