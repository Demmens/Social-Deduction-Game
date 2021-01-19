const Mission = require('../Mission');

class Armaments extends Mission{
	constructor(){
		super({
			name: 'Gather Armaments',
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

module.exports = Armaments;