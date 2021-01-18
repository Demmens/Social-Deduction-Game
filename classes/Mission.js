class Mission {
	constructor(options = {}){
		const {
			name = '',
			successtext = '',
			failtext = '',
		} = options;
		this.name = name;
		this.successtext = successtext;
		this.failtext = failtext;
	}

	success(leader, partner){

	}

	fail(leader, partner){

	}
}

module.exports = Mission;