const Mission = require('../Mission');

class barPlayer extends Mission{
	constructor(){
		super({
			name: 'Suspend Agents',
			successtext: 'The traitor with the highest influence total cannot put forth influence next round.',
			failtext: 'The innocent with the highest influence total cannot put forth influence next round.'
		})
	}

	async success(){
        let infl = -1;
        let bar;
		for (let ply of players){
            if (ply.player.influence > infl && ply.player.team == 'traitor'){
                bar = ply;
                infl = ply.player.influence
            }
        }
        barredPlys.push(bar);
		return;
	}

	fail(){
        let infl = -1;
        let bar;
		for (let ply of players){
            if (ply.player.influence > infl && ply.player.team == 'innocent'){
                bar = ply;
                infl = ply.player.influence
            }
        }
        barredPlys.push(bar);
		return;
	}
}

module.exports = barPlayer;