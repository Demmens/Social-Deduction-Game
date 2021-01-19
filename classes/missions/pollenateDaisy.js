const Mission = require('../Mission');

class PollenateDaisy extends Mission{
	constructor(){
		super({
			name: 'Pollenate Daisies',
			successtext: 'Pollenating 3 times results in a victory.',
			failtext: 'No Effect'
		})
	}

	async success(channel){
		pollenated++;
		if (pollenated == 3){
			channel.send('**INNOCENTS WIN**');
			return true;
		}
		return;
	}

	fail(channel){
		return;
	}
}

module.exports = PollenateDaisy;