const Mission = require('../Mission');

class PollenateLavender extends Mission{
	constructor(){
		super({
			name: 'Pollenate Lavender',
			successtext: 'Pollenating 3 times results in a victory',
			failtext: 'Add two Fail cards to the discard pile'
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
		discardPile.push('Fail');
		discardPile.push('Fail');
		return;
	}
}

module.exports = PollenateLavender;