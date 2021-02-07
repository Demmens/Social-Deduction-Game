const Mission = require('../Mission');

class GainIntel extends Mission{
	constructor(){
		super({
			name: 'Source Intelligence',
			successtext: 'The next mission is a Secure Daisy Field mission.',
			failtext: 'The next mission is a Rescue Operatives mission'
		})
	}

	async success(channel){
        missionOrder[missionNum] = SecureDaisyField;
        console.log(missionOrder);
		return;
	}

	fail(channel){
        missionOrder[missionNum] = RescueOperatives;
        console.log(missionOrder);
		return;
	}
}

module.exports = GainIntel;