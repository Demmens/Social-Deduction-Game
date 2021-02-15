const Mission = require('../Mission');

class PollenateLavender extends Mission{
	constructor(){
		super({
			name: 'Secure Lavender Field',
			successtext: 'Securing 3 fields results in an innocent victory.',
			failtext: 'Cancel next mission success effect'
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

	fail(){
		setTimeout(function(){
			successEffect = false;
		}, 5000);
		return;
	}
}

module.exports = PollenateLavender;