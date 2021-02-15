class Role {
	constructor(options = {}){
		const {
			name = "",
			description = "",
			used = false,
            startingInfluence = 0,
            team = "",
            owner = null,
		} = options;
		this.name = name;
		this.description = description;
		this.used = used;
        this.startingInfluence = startingInfluence;
        this.team = team;
        this.owner = owner;
	}

	AfterRolesChosen()
    {

    }

    AfterTargetsSelected()
    {

    }

    BeforeInfluenceVotes()
    {

    }

    BeforeInfluenceCount()
    {

    }

    AfterInfluenceCount()
    {

    }

    BeforeVote()
    {

    }

    BeforeVoteCount()
    {

    }

    AfterVoteCount()
    {

    }

    BeforeCardsDrawn()
    {

    }

    AfterLeaderCardsDrawn()
    {

    }

    BeforeMissionResult()
    {

    }

    AfterMissionResult()
    {

    }
}

module.exports = Role;