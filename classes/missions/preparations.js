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
		setTimeout(function(){
			failEffect = false;
		}, 5000);
		return
	}

	fail(channel){
		setTimeout(function(){
			successEffect = false;
		}, 5000);
		return;
	}
}

module.exports = Investigate;