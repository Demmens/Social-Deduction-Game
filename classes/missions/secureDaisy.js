const Mission = require('../Mission');

class PollenateDaisy extends Mission{
	constructor(){
		super({
			name: 'Secure Daisy Field',
			successtext: 'Securing 3 fields results in an innocent victory.',
			failtext: 'No Effect'
		})
	}

	async success(){
		pollenated++;
		if (pollenated == 3){
			gameChannel.send('**INNOCENTS WIN**');
			return true;
		}
		return;
	}

	fail(){
		return;
	}
}

module.exports = PollenateDaisy;