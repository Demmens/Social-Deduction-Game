const Mission = require('../Mission');

class Pollenate extends Mission{
	constructor(){
		super({
			name: 'Pollenate Flowers',
			successtext: 'Leader gains 5 max influence',
			failtext: 'No Effect'
		})
	}

	success(leader, partner){
		leader.influence = leader.maxInfluence;
	}

	fail(leader, partner){
		return;
	}
}

module.exports = Pollenate;