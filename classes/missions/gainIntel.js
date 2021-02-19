const Mission = require('../Mission');

class GainIntel extends Mission{
	constructor(){
		super({
			name: 'Source Intelligence',
			successtext: 'The next mission is a Secure Daisy Field mission.',
			failtext: 'The next mission is a Rescue Operatives mission'
		})
	}

	async success(){
        missionOrder[missionNum] = SecureDaisyField;
		return;
	}

	fail(){
        missionOrder[missionNum] = RescueOperatives;
		return;
	}
}

module.exports = GainIntel;