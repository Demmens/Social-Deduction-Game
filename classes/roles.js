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
			name: 'Capital Bee',
			description: 'Add four influence to any players total when determining team leader.'
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
			name: 'Researcher',
			description: 'Know all roles that are in the game.'
		},
		{
			name: 'Professional',
			description: 'Leader always draws at least one success card while you\'re the partner (if possible).'
		},
		{
			name: 'Two Bees in a Trenchcoat',
			description: 'Your votes count twice.'
		},
		{
			name: 'Double-Agent',
			description: 'Knows one innocent and one traitor, but not which way round.',
			traitors: 2
		},
		{
			name: 'Omniscient',
			description: 'Knows all traitors, but the traitors also win if they sting you.'
		},
		{
			name: 'Insider',
			description: 'Knows one of the traitors targets.',
			traitors: 2
		},
		{
			name: 'Strategist',
			description: 'As leader, draw 4 cards, choose one to discard and one to place on top of the draw pile.'
		},
		{
			name: 'Salvager',
			description: 'As leader, draw an extra card from the discard pile, then discard two cards.'
		},
		{
			name: 'Sleuth',
			description: 'Every third mission you may learn a chosen players allegience.',
			traitors: 2
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
			description: 'Set influence to 1 for any players total when determining team leader. May not pick the same player twice.'
		},
		{
			name: 'Fumble Bee',
			description: 'While you are on a mission, success cards cannot be drawn (if possible).'
		},
		{
			name: 'Spelling Bee',
			description: 'Knows all traitor allies.',
			traitors: 2
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
			description: 'Votes cannot fail if you are chosen as the partner.',
			traitors: 2
		},
		{
			name: 'Gambler',
			description: 'Your target is randomised. You may re-randomise your target once per game.'
		}
	]
};