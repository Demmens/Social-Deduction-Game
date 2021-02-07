const Mission = require('../Mission');

class spreadPropoganda extends Mission{
	constructor(){
		super({
			name: 'Spread Propoganda',
			successtext: 'All innocents gain 5 influence.',
			failtext: 'All traitors gain 5 influence.'
		})
	}

	success(channel){
		for (let ply of players){
			if (ply.player.team == 'innocent') ply.player.influence += 5;
		}
	}

	fail(channel){
		for (let ply of players){
			if (ply.player.team == 'traitor') ply.player.influence += 5;
		}
	}
}

module.exports = spreadPropoganda;