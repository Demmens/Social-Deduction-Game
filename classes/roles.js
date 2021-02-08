module.exports = {
	innocent: [
		{
			name: 'Spy',
			description: 'When the leader draws cards, you are shown the first card they drew.',
			startingInfluence: 12
		},
		{
			name: 'Defender',
			description: 'You may cancel one mission fail effect.',
			startingInfluence: 10,
			used: false
		},
		{
			name: 'Capital Bee',
			description: 'Starts the game with 5000 influence.',
			startingInfluence: 5000
		},
		{
			name: 'Veteran',
			description: 'Always draws two Succeed cards and one Fail card as the team leader (if possible).',
			startingInfluence: 10
		},
		{
			name: 'Detective',
			description: 'Knows one innocents role.',
			startingInfluence: 10
		},
		{
			name: 'Researcher',
			description: 'Know all roles that are in the game.',
			startingInfluence: 7
		},
		{
			name: 'Professional',
			description: 'Leader always draws at least one success card while you\'re the partner (if possible).',
			startingInfluence: 8
		},
		{
			name: 'Two Bees in a Trenchcoat',
			description: 'You get two rejected roles.',
			startingInfluence: 4,
			used: false
		},
		{
			name: 'Double-Agent',
			description: 'Knows one innocent and one traitor, but not which way round.',
			startingInfluence: 7,
			traitors: 2
		},
		{
			name: 'Omniscient',
			description: 'Knows all traitors, but the traitors also win if they sting you.',
			startingInfluence: 10
		},
		{
			name: 'Insider',
			description: 'Knows one of the traitors targets.',
			startingInfluence: 12,
			traitors: 2
		},
		{
			name: 'Strategist',
			description: 'As leader, draw an extra card, choose one to discard and one to place on top of the draw pile.',
			startingInfluence: 8
		},
		{
			name: 'Salvager',
			description: 'As leader, draw an extra card from the discard pile, then discard two cards.',
			startingInfluence: 7
		},
		{
			name: 'Sleuth',
			description: 'Every third mission you may learn a chosen players allegience.',
			startingInfluence: 6,
			traitors: 2
		},
		{
			name: 'Prodigy',
			description: 'Empowered Buzz (!prodigy command in DM channel): Buzz in secret, nobody votes, don\'t lose the game if wrong.',
			startingInfluence: 8,
			traitors: 2
		},
		{
			name: 'Peace Keeper',
			description: 'Once per game may disarm a player. If that player is a traitor, their sting is removed.',
			startingInfluence: 8
		},
		{
			name: 'Auctioneer',
			description: 'Instead of putting forth influence, outbid a chosen player by a selected number of influence (if you have enough)',
			startingInfluence: 15
		}
	],
	traitor: [
		{
			name: 'Saboteur',
			description: 'You may cancel one mission success effect.',
			startingInfluence: 12,
			used: false
		},
		{
			name: 'Suppressor',
			description: 'Set influence to 1 for any players total when determining team leader. May not pick the same player twice in a row.',
			startingInfluence: 8
		},
		{
			name: 'Fumble Bee',
			description: 'While you are on a mission, success cards cannot be drawn (if possible).',
			startingInfluence: 12
		},
		{
			name: 'Spelling Bee',
			description: 'Knows all traitor allies.',
			startingInfluence: 8,
			traitors: 2
		},
		{
			name: 'Hypnotist',
			description: 'Once per game may force the partner to play the wrong card (if they have a choice).',
			startingInfluence: 8,
			used: false
		},
		{
			name: 'Psychic',
			description: 'At the start of the round, can see the top two cards of the draw pile.',
			startingInfluence: 8
		},
		{
			name: 'Dictator',
			description: 'Votes cannot fail if you are either the leader or partner.',
			startingInfluence: 10,
			traitors: 2
		},
		{
			name: 'Gambler',
			description: 'Your target is randomised. You may re-randomise your target once per game.',
			startingInfluence: 12
		},
		{
			name: 'Plan Bee',
			description: 'Chooses target after seeing other traitors targets',
			startingInfluence: 8,
			traitors: 3
		}
	]
};