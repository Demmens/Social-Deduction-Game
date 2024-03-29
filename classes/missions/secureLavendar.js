const Mission = require('../Mission');

class PollenateLavender extends Mission{
	constructor(){
		super({
			name: 'Secure Lavender Field',
			successtext: 'Securing 3 fields results in an innocent victory.',
			failtext: 'Cancel next mission success effect'
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
		successEffect = false;
		return;
	}
}

module.exports = PollenateLavender;