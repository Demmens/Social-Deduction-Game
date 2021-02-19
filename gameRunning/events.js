module.exports = {
    async AfterRolesPicked()
    {
        for (let role of roles){
            await role.AfterRolesPicked();
        }
    },

    async AfterTargetsChosen()
    {
        for (let role of roles){
            await role.AfterTargetsChosen();
        }
    },

    async BeforeInfluenceVote()
    {
        for (let role of roles){
            await role.BeforeInfluenceVote();
        }
    },

    async BeforeInfluenceTotal()
    {
        for (let role of roles){
            await role.BeforeInfluenceTotal();
        }
    },

    async BeforeLeaderPickPartner()
    {
        for (let role of roles){
            await role.BeforeLeaderPickPartner();
        }
    },

    async BeforeVoting()
    {
        for (let role of roles){
            await role.BeforeVoting();
        }
    },

    async BeforeVoteResult()
    {
        for (let role of roles){
            await role.BeforeVoteResult();
        }
    },

    async AfterVoteResult()
    {
        for (let role of roles){
            await role.AfterVoteResult();
        }
    },

    async BeforeLeaderDraw()
    {
        for (let role of roles){
            await role.BeforeLeaderDraw();
        }
    },

    async AfterLeaderDraw()
    {
        for (let role of roles){
            await role.AfterLeaderDraw();
        }
    },

    async OverwriteLeaderDraw()
    {
        for (let role of roles){
            await role.OverwriteLeaderDraw();
        }
    },

    async DisplayCardsToLeaders()
    {
        for (let role of roles){
            await role.DisplayCardsToLeaders();
        }
    },

    async AfterCardsDisplayedToLeader()
    {
        for (let role of roles){
            await role.AfterCardsDisplayedToLeader();
        }
    },

    async BeforeLeaderPass()
    {
        for (let role of roles){
            await role.BeforeLeaderPass();
        }
    },

    async AfterLeaderPass()
    {
        for (let role of roles){
            await role.AfterLeaderPass();
        }
    },

    async BeforePartnerCardPlayed()
    {
        for (let role of roles){
            await role.BeforePartnerCardPlayed();
        }
    },

    async BeforeResultDetermined(success)
    {
        for (let role of roles){
            await role.BeforeResultDetermined(success);
        }
    },

    async AfterResultDetermined()
    {
        for (let role of roles){
            await role.AfterResultDetermined();
        }
    },

    async OnInterrogation()
    {
        for (let role of roles){
            await role.OnInterrogation();
        }
    },

    async AfterInterrogation()
    {
        for (let role of roles){
            await role.AfterInterrogation();
        }
    },

    async AfterPrivateMessage()
    {
        for (let role of roles){
            await role.AfterPrivateMessage();
        }
    },

    async BeforeShuffleDrawPile()
    {
        for (let role of roles){
            await role.BeforeShuffleDrawPile();
        }
    }
}