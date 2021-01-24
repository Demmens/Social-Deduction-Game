const Mission = require('../Mission');

class PollenateDandelion extends Mission{
	constructor(){
		super({
			name: 'Secure Dandelion Field',
			successtext: 'Securing 3 fields results in an innocent victory.',
			failtext: 'Leader loses 5 influence'
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
		leader.player.influence -= 5;
		if (leader.player.influence < 0) leader.player.influence = 0;
		return;
	}
}

module.exports = PollenateDandelion;