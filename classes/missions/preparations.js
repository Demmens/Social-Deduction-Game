const Mission = require('../Mission');

class Investigate extends Mission{
	constructor(){
		super({
			name: 'Create Backup Plan',
			successtext: 'Ignore the next mission fail effect',
			failtext: 'Ignore the next mission success effect'
		})
	}

	async success(channel){
		failEffect = false;
		return
	}

	fail(channel){
		successEffect = false;
		return;
	}
}

module.exports = Investigate;