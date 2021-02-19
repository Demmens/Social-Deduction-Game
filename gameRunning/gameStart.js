const Discord = require('discord.js');
const f = require("../functions.js");
const events = require("./events");
const fs = require('fs');
const path = require('path');
const dir = fs.readdirSync('./classes/roles');

const allPlayersTraitors = false;

module.exports = {
    initialSetup: async function(){
		players = f.ArrRandomise(players);
		let x = 0;
		for (let ply of players){
			if (allPlayersTraitors || x % 2 == 0 && x != 0){
				ply.member.user.send(`You are a **Traitor**`);
				ply.player = {
					"team": "traitor",
					"roleChoices": []
				};
				traitorCount++;
			}
			else {
				ply.member.user.send(`You are **Innocent**`);
				ply.player = {
					"team": "innocent",
					"roleChoices": []
				};
				innocentCount++;
			}
			x++
		}
		gameChannel.send(`Starting a new game with ${players.length} players.`);

	//===========================================================================
	//		Create the deck of cards to use for succeeding/failing the mission.
		globalThis.drawPile = [];
		globalThis.discardPile = [];
		if (players.length >= playersFor3PlayerMissions) FailCards += 3;
		for (let i=0;i<SuccessCards;i++){
			drawPile.push("Success");
		}
		for (let i=0;i<FailCards;i++){
			drawPile.push("Fail");
		}

		drawPile = f.ArrRandomise(drawPile);
    },

    giveRoles: async function(){
		globalThis.roleMsg = '';
		let innocentRoles = [];
		let traitorRoles = [];

		for (let file of dir){
			let filepath = path.join('../classes/roles',file);
			filepath = filepath.replace(path.extname(filepath), '');
			let role = require(filepath);
			role = new role;
			if (role.playersRequired <= players.length){
				if (role.team == 'innocent'){
					innocentRoles.push(role);
				}
				else if (role.team == 'traitor') {
					traitorRoles.push(role);
				}
			}
		}

		innocentRoles = f.ArrRandomise(innocentRoles);
		traitorRoles = f.ArrRandomise(traitorRoles);

		let innocentChoices = [];
		let traitorChoices = [];
		let x = 0;
		for (let role of innocentRoles){
			if (x < innocentCount*innoRoleChoices){
				innocentChoices.push(role);
			}
			x++;
		}
		x=0;
		for (let role of traitorRoles){
			if (x < traitorCount*traitorRoleChoices){
				traitorChoices.push(role);
			}
			x++;
		}

		function giveRoleChoices(arr, team){
			let i = 0;
			for (let role of arr){
				let roleGiven = false;
				while (!roleGiven){
					if (i >= players.length) i=0;
					let ply = players[i];
					if (ply.player.team == team){
						ply.player.roleChoices.push(role);
						roleGiven = true;
					}
					i++
				}
			}
		}
		
		giveRoleChoices(innocentChoices, 'innocent');
		giveRoleChoices(traitorChoices, 'traitor');

		for (let ply of players){
			await ply.member.user.send(`**Choose a Role**`);
			let x = 0;
			for (let role of ply.player.roleChoices){
				x++;
				let emb = new Discord.MessageEmbed()
				.setTitle(`${x} - **${role.name}** (${role.influence} influence)`)
				.setDescription(role.description);
				ply.member.user.send(emb);
			}
		}

		//Wait until everyone has chosen their role
		let waitingFor = await gameChannel.send(`Waiting for ${players[0].member.displayName} to pick their role.`)
		let allPicked = false;
		while (!allPicked){
			let chosen = 0;
			for (let ply of players){
				let choices;
				ply.player.team == 'innocent' ? choices = innoRoleChoices : choices = traitorRoleChoices;
				let msg = ply.member.user.dmChannel.lastMessage;
				if (msg == null) msg = waitingFor;
				if (!isNaN(msg.content) && parseInt(msg.content) <= choices){
					chosen++;
				} else {
					let fl = m => m.author.id === ply.member.id;
					let pickRoleControler = new Discord.MessageCollector(ply.member.user.dmChannel, fl);
					await waitingFor.edit(`Waiting for ${ply.member.displayName} to pick their role.`)
					msg = await pickRoleControler.next;
				}
			}
			if (players.length == chosen) allPicked = true;
		}

		for (let ply of players){
			let msg = parseInt(ply.member.user.dmChannel.lastMessage.content)-1;
			let i = 0;
			for (let role of ply.player.roleChoices){
				if (msg == i){
					role.owner = ply;
					ply.player.role = role;
					roles.push(role);
				} else rejectedRoles.push(role);
				i++;
			}
		}

		await waitingFor.edit(`All players have chosen their roles.`);
		roleMsg += `\n**INNOCENT ROLES**\n`;
		for (let role of roles){
			if (role.team == 'innocent'){
				role.owner.player.influence = role.influence;
				roleMsg += `\n**${role.name}** (${role.influence} infl.) - ${role.description}`;
			}
		}
		roleMsg += `\n\n**TRAITOR ROLES**\n`;
		for (let role of roles){
			if (role.team == 'traitor'){
				role.owner.player.influence = role.influence;
				roleMsg += `\n**${role.name}** (${role.influence} infl.) - ${role.description}`;
			}
		}
		await events.AfterRolesPicked();
		let emb = new Discord.MessageEmbed()
		.setTitle(`**Roles in the Game**`)
		.setDescription(roleMsg);
        await gameChannel.send(emb);
    },

    traitorsPickTargets: async function()
    {
		let targetTbl = [];
//=========================================
//	Traitors get targets

		
		for (let role of roles){
			if (role.team == 'traitor' && role.hasTarget){
				let tgt = roles[Math.floor(Math.random()*roles.length)];
				while ((tgt == role || tgt.team == 'traitor' || tgt.name == "Omniscient" || !tgt.canBeTarget) && players.length > 2){
					tgt = roles[Math.floor(Math.random()*roles.length)];
				}
				role.owner.player.target = tgt;
				role.owner.member.user.send(`Your target is the **${tgt.name}**`);
				targetTbl.push(role.owner.player.target);
			}
		}

		await events.AfterTargetsChosen();
    }
}