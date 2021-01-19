const Mission = require('../Mission');

class Investigate extends Mission{
	constructor(){
		super({
			name: 'Usurp Queen Bee',
			successtext: 'Innocents win the game',
			failtext: 'Traitors win the game'
		})
	}

	async success(channel){
		channel.send('**INNOCENTS WIN**');
		return true;
	}

	fail(channel){
		channel.send('**TRAITORS WIN**');
		return true;
	}
}

module.exports = Investigate;