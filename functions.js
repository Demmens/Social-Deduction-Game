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
		let roleOrder = [];
		let twoBeesPlayer;
		let AuctioneerPlayer;
		for (let role of roles){
			if (role.name == "Two Bees in a Trench-Coat") twoBeesPlayer = role.owner;
			if (role.name == "Auctioneer") AuctioneerPlayer = role.owner;
		}
		roles.sort(function(a,b){
			if (a.name < b.name) return -1;
			if (a.name > b.name) return 1;
			return 0;
		});
		if (AuctioneerPlayer && AuctioneerPlayer != twoBeesPlayer) roleOrder.push(AuctioneerPlayer);
		for (let role of roles){
			if (role.owner != twoBeesPlayer) roleOrder.push(role.owner);
		}
		if (twoBeesPlayer) roleOrder.push(twoBeesPlayer);

		return roleOrder;
	}
}