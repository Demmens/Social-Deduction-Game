module.exports = {
	innocent: [
		{
			name: 'Spy',
			description: 'When the leader draws cards, you are shown the first card they drew.'
		},
		{
			name: 'Defender',
			description: 'You may cancel one mission fail effect.',
			used: false
		},
		{
			name: 'Marketeer',
			description: 'Add two influence to any players total when determining team leader.'
		},
		{
			name: 'Veteran',
			description: 'Always draws two Succeed cards and one Fail card as the team leader (if possible).'
		},
		{
			name: 'Detective',
			description: 'Knows one innocents role.'
		},
		{
			name: 'Strategist',
			description: 'As leader, draw 4 cards, choose one to discard and one to place on top of the draw pile.'
		},
		{
			name: 'Researcher',
			description: 'Know all roles that are in the game.'
		},
		{
			name: 'Professional',
			description: 'Leader always draws at least one success card while you\'re the partner (if possible).'
		},
		{
			name: 'Salvager',
			description: 'As leader, draw an extra card from the discard pile, then discard two cards.'
		},
		{
			name: 'Two Bees in a Trenchcoat',
			description: 'Your votes count twice.'
		}
	],
	traitor: [
		{
			name: 'Saboteur',
			description: 'You may cancel one mission success effect.',
			used: false
		},
		{
			name: 'Suppressor',
			description: 'Set influence to 1 for any players total when determining team leader.'
		},
		{
			name: 'Fixer',
			description: 'While you are on a mission, success cards cannot be drawn (if possible).'
		},
		{
			name: 'Spelling Bee',
			description: 'Knows all traitor allies.'
		},
		{
			name: 'Hypnotist',
			description: 'Once per mission may type `autofail` when voting to automatically fail the vote. Your vote displays as `no`.',
			used: false
		},
		{
			name: 'Psychic',
			description: 'At the start of the round, can see the top two cards of the draw pile.'
		},
		{
			name: 'Dictator',
			description: 'Votes cannot fail if you are chosen as the partner.'
		}
	]
};