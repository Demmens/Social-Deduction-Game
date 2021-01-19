const Mission = require('../Mission');

class Pollenate extends Mission{
	constructor(){
		super({
			name: 'Pollenate Flowers',
			successtext: 'Leader gains 5 max influence',
			failtext: 'No Effect'
		})
	}

	async success(channel){
		leader.player.maxinfluence += 5;
		leader.player.influence += 5;
		return;
	}

	fail(channel){
		return;
	}
}

module.exports = Pollenate;