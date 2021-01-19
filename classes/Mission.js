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

	success(channel){

	}

	fail(channel){

	}
}

module.exports = Mission;