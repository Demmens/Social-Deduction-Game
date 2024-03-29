const Mission = require('../Mission');

class PollenateDaffodil extends Mission{
	constructor(){
		super({
			name: 'Secure Daffodil Field',
			successtext: 'Securing 3 fields results in an innocent victory.',
			failtext: 'Add two Fail cards to the discard pile'
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

	fail(channel){
		discardPile.push('Fail');
		discardPile.push('Fail');
		return;
	}
}

module.exports = PollenateDaffodil;