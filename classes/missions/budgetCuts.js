const Mission = require('../Mission');

class budgetCuts extends Mission{
	constructor(){
		super({
			name: 'Budget Cuts',
			successtext: 'All traitors have 4 deducted from their influence vote next round.',
			failtext: 'All innocents have 4 deducted from their influence vote next round.'
		})
	}

	async success(){

		return;
	}

	fail(){

		return;
	}
}

module.exports = budgetCuts;