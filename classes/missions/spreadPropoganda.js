const Mission = require('../Mission');

class spreadPropoganda extends Mission{
	constructor(){
		super({
			name: 'Spread Propoganda',
			successtext: 'All players gain 5 influence.',
			failtext: 'All players lose 5 influence.'
		})
	}

	success(channel){
		for (let ply of players){
			ply.player.influence += 5;
		}
	}

	fail(channel){
		for (let ply of players){
			ply.player.influence -= 5;
			if (ply.player.influence < 0) ply.player.influence = 0;
		}
	}
}

module.exports = spreadPropoganda;