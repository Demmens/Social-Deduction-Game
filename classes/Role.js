class Role {
	constructor(options = {}){
		const {
			name = '',
			description = '',
			influence = 0,
            owner = null,
            team = '',
            hasTarget = true,
            playersRequired = 0,
            used = false,
            allowTwoBees = true,
            canBeTarget = true,
            isTwoBeesRole = false
		} = options;
		this.name = name;
		this.description = description;
		this.influence = influence;
        this.owner = owner;
        this.team = team;
        this.hasTarget = hasTarget;
        this.playersRequired = playersRequired;
        this.used = used;
        this.allowTwoBees = allowTwoBees;
        this.canBeTarget = canBeTarget;
        this.isTwoBeesRole = isTwoBeesRole;
	}

	AfterRolesPicked(){}

    AfterTargetsChosen(){}

    BeforeInfluenceVote(){}

    BeforeInfluenceTotal(){}

    BeforeLeaderPickPartner(){}

    BeforeVoting(){}

    BeforeVoteResult(){}

    AfterVoteResult(){}

    BeforeLeaderDraw(){}

    AfterLeaderDraw(){}

    OverwriteLeaderDraw(){}

    DisplayCardsToLeaders(){
        if ((this.owner != general && this.owner != major) || this.isTwoBeesRole) return;
        let hand = cards.general;
        if (this.owner == major) hand = cards.major;
        let msg = '**You have drawn:**';
        let x = 0;
        for (let card of hand){
            x++;
            msg += `\n${x} - ${card}`;
        }
        if (players.length < playersFor3PlayerMissions) msg += `\nType the number of the card you wish to discard.`;
        else msg += `\nType the number of the card you wish to pass to the captain.`;
        this.owner.member.user.send(msg);
    }

    AfterCardsDisplayedToLeader(){}

    BeforeLeaderPass(){}

    AfterLeaderPass(){}

    BeforePartnerCardPlayed(){}

    BeforeResultDetermined(){}

    AfterResultDetermined(){}

    OnInterrogation(){}

    AfterInterrogation(){}

    AfterPrivateMessage(){}

    BeforeShuffleDrawPile(){}
}

module.exports = Role;