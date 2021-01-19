const Mission = require('../Mission');

class PollenateDandelion extends Mission{
	constructor(){
		super({
			name: 'Pollenate Dandelions',
			successtext: 'Pollenating 3 times results in a victory',
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