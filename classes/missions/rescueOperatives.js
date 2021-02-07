const Mission = require('../Mission');
const f = require('../../functions.js')

class RescueOperatives extends Mission{
	constructor(){
		super({
			name: 'Rescue Operatives',
			successtext: 'No Effect',
			failtext: 'Shuffle two Fail cards into the draw pile'
		})
	}

	async success(channel){
		return;
	}

	fail(channel){
        for (let i = 0; i < 2; i++) drawPile.push('Fail');
        drawPile = f.ArrRandomise(drawPile);
		return;
	}
}

module.exports = RescueOperatives;