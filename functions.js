const Discord = require("discord.js");

module.exports = {
    ArrRandomise: function(arr){
        let tempArr = [];
		while (arr.length > 0){ //Shuffle the array
			let k = Math.floor(Math.random()*arr.length);
			let v = arr[k];
			arr.splice(k,1);
			tempArr.push(v);
		}
		return tempArr; //Return shuffled array
	},

	createRoleEmbed: function(role, num){
		let emb = new Discord.MessageEmbed()
		.setTitle(`${num} - **${role.name}**`)
		.setDescription(`**Influence:** ${role.startingInfluence}\n**Effect**\n${role.description}`)

		return emb;
	},
	
	isRole(player, role, roleStr){
		if ((player.role.name == roleStr || player.role.name == 'Two Bees in a Trenchcoat') && player == role){
			return true;
		}
		return false;
	},

	createRoleOrder: function(){
		var roleOrder = [];
		roleOrder.push(Auctioneer);
		roleOrder.push(Dictator);
		roleOrder.push(CapitalBee);
		roleOrder.push(Salvager);
		roleOrder.push(Veteran);
		roleOrder.push(Strategist);
		roleOrder.push(Defender);
		roleOrder.push(Saboteur);
		roleOrder.push(Insider);
		roleOrder.push(Hypnotist);
		roleOrder.push(Psychic);
		roleOrder.push(Spy);
		roleOrder.push(Suppressor);
		roleOrder.push(Prodigy);
		roleOrder.push(Gambler);
		roleOrder.push(Omniscient);
		roleOrder.push(SpellingBee);
		roleOrder.push(Inquisitor);
		roleOrder.push(PlanBee);
		roleOrder.push(Detective);
		roleOrder.push(Sleuth);
		roleOrder.push(DoubleAgent);
		roleOrder.push(FumbleBee);
		roleOrder.push(Professional);
		roleOrder.push(Researcher);
		roleOrder.push(TwoBees);
		return roleOrder;
	}
}