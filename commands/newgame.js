const { Command } = require("discord-akairo");

const missiontree = require('../gameRunning/missiontree.js');
const gameStart = require('../gameRunning/gameStart');
const runMission = require("../gameRunning/runMission.js");
//=========================================
//	Config

// Setup
globalThis.SuccessCards = 3; //Number of Succeed cards in the base deck
globalThis.FailCards = 7; //Number of Fail cards in the base deck
globalThis.innoRoleChoices = 30; //Amount of role choices innocents get
globalThis.traitorRoleChoices = 3; //Amount of role choices traitors get
// Influence
globalThis.InfluenceRegen = 1; //How much influence you gain per turn
globalThis.influenceCost = 0; //How much influence per player is required for a mission to go through
globalThis.baseInfluenceSpent = 0; //How much influence you lose if you put forth any amount of influence
globalThis.teamLeaderInfluenceLost = 5; //How much influence you lose if you end up as team general twice

//
//=========================================

class newGameCommand extends Command {
	constructor() {
		super("newgame", {
			aliases: ["newgame","startgame"],
			args: [],
		});
	}
	async exec(message, args) {
		globalThis.gameChannel = message.channel;
		globalThis.successEffect = true;
		globalThis.failEffect = true;
		globalThis.players = [];
		globalThis.rejectedRoles = [];
		globalThis.roles = [];
		globalThis.barredPlys = [];
		globalThis.lastGeneral = null;
		globalThis.lastMajor = null;
		globalThis.lastCaptain = null;
		globalThis.traitorCount = 0;
		globalThis.innocentCount = 0;
		
		globalThis.SuppressorTarget = null;

		for (let [_,chnl] of message.guild.channels.cache){
			if (chnl.name == 'Game Chat'){
				for (let [_,ply] of chnl.members){ //Everyone in the voice chat is a player of the game.
					players.push({"member": ply});
				} 
			}
		}
		/*for (let [_,mems] of message.guild.members.cache){
			if (mems.displayName == 'Dem' || mems.displayName == 'Stoatly'){
				players.push({"member":mems});
			}
		}*/

		await gameStart.initialSetup();

		await gameStart.giveRoles();

		await gameStart.traitorsPickTargets();
//===========================================================================
//	Setup Mission
		globalThis.general = null;
		globalThis.major = null;
		globalThis.captain = null;
		globalThis.pollenated = 0;
		globalThis.missionNum = 1;
		globalThis.missionOrder = missiontree.findTree(players.length);

		for (let mission of missionOrder){
			globalThis.failedvote = true;
			let inflTotal = 0;
			for (let ply of players){
				inflTotal += ply.player.influence;
			}
			if (inflTotal == 0) return message.channel.send('All players have 0 influence.\n**TRAITORS WIN**');

			await runMission.displayMission(mission);

//=================================================================================================================
//	Influence vote start
//=================================================================================================================			
			
			globalThis.canInfluenceVote = [];
			for (let ply of players){
				if (!barredPlys.includes(ply)) canInfluenceVote.push(ply);
			}

			await runMission.influenceVote();

			globalThis.votes = [];
			globalThis.totalInfluence = 0;

			await runMission.collectInfluence();

			globalThis.enoughInfluence = true;				
			await runMission.orderVoteArray();
			
			await runMission.determineMissionGoers();

			if (enoughInfluence) { //Influence vote result decided

				await runMission.leaderPickPartner();

				await runMission.waitForVotes();
				
				await runMission.collectVotes();

				await runMission.determineVoteResult();

				if (!failedvote){
					//Do the mission
					let success = await runMission.missionStart();
					await runMission.determineMissionResult(success, mission);
					missionNum++; //Proceed to the next mission.
					lastGeneral = general;
					lastMajor = major;
					lastCaptain = captain;
				}

			} else{					
				message.channel.send('Not enough influence was spent. The mission has failed.');
				failedvote = true;
				missionNum++;
				if (failEffect){
					general = null;
					captain = null;
					lastGeneral = null;
					lastMajor = null;
					lastCaptain = null;
					let shouldEnd = await mission.fail(message.channel);
					if (shouldEnd) return;
				}
				else message.channel.send('The fail effect was cancelled.');
			}
		}
	}
}
module.exports = newGameCommand;