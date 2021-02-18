const Role = require("../Role");
const f = require("../../functions");

class TwoBees extends Role
{
    constructor()
    {
        super
        ({
			name: 'Two Bees in a Trench-Coat',
			description: 'You get two rejected roles. Always lose influence ties.',
			influence: 4,
            team: 'innocent'
		})
    }

    AfterRolesPicked()
    {
        rejectedRoles = f.ArrRandomise(rejectedRoles);
        let x=0;
        let rlMsg = '**Your roles are:**';
        for (let role of rejectedRoles){
            if (x<2 && role.allowTwoBees && role.team == 'innocent'){
                role.owner = this.owner;
                role.canBeTarget = false;
                roles.push(role);
                x++;
                rlMsg += `\n${role.name}: ${role.description}`;
                roleMsg = roleMsg.replace("rejected roles.", `rejected roles.\n   - ${role.name}: ${role.description}`);
            } 
        }
        this.owner.member.user.send(rlMsg);
    } 
}

module.exports = TwoBees;