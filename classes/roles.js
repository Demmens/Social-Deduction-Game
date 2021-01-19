module.exports = [
	{
		name: 'Spy',
		team: 'innocenty',
		description: 'When the leader draws cards, you are shown the first card they drew.'
	},
	{
		name: 'Gemini',
		team: 'innocenty',
		description: 'Your votes count twice'
	},
	{
		name: 'Fixer',
		team: 'traitor',
		description: 'May type `autofail` once per mission when voting to automatically fail the vote. Your vote is displayed as \'no\'.',
		used: false
	},
	{
		name: 'Saboteur',
		team: 'traitor',
		description: 'You may cancel one mission success effect.',
		used: false
	},
	{
		name: 'Defender',
		team: 'innocent',
		description: 'You may cancel one mission fail effect.',
		used: false
	},
	{
		name: 'Marketeer',
		team: 'innocenty',
		description: 'Add two influence to any players total when determining team leader'
	},
	{
		name: 'Misinformant',
		team: 'traitor',
		description: 'Remove two influence from any players total when determining team leader'
	},
	{
		name: 'Veteran',
		team: 'innocenty',
		description: 'Always draws two Succeed cards and one Fail card as the team leader (if possible)'
	}
];