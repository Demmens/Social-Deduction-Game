const Mission = require('../Mission');

class Investigate extends Mission{
	constructor(){
		super({
			name: 'Collect Honey',
			successtext: 'Add a Success card to the discard pile',
			failtext: 'Add two Fail cards to the discard pile'
		})
	}

	async success(channel){
		discardPile.push('Success');
		return
	}

	fail(channel){
		discardPile.push('Fail');
		discardPile.push('Fail');
		return;
	}
}

module.exports = Investigate;