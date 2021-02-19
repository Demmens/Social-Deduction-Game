const Mission = require('../Mission');

class PollenateDandelion extends Mission{
	constructor(){
		super({
			name: 'Secure Dandelion Field',
			successtext: 'Securing 3 fields results in an innocent victory.',
			failtext: 'All innocents lose 5 influence'
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
		for (let ply of players){
			if (ply.player.team == 'innocent'){
				ply.player.influence -= 5;
				if (ply.player.influence < 0) ply.player.influence = 0;
			}
		}
		return;
	}
}

module.exports = PollenateDandelion;