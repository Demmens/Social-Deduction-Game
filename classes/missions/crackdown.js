const Mission = require('../Mission');

class Investigate extends Mission{
	constructor(){
		super({
			name: 'Crackdown on Traitors',
			successtext: 'Innocents win the game',
			failtext: 'Traitors win the game'
		})
	}

	async success(channel){
		channel.send('**INNOCENTS WIN**');
		return
	}

	fail(channel){
		channel.send('**TRAITORS WIN**');
		return;
	}
}

module.exports = Investigate;