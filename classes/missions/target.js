const Discord  = require('discord.js');
const Mission = require('../Mission');
const { traitor } = require('../roles');

class Target extends Mission{
	constructor(){
		super({
			name: 'Investigate Possible Targets',
			successtext: 'One player is revealed to not be a target.',
			failtext: 'Traitors may change their target.'
		})
	}

	async success(channel){
        let done = false;
        let rdmPlayer;
        while (!done){
            done = true;
            rdmPlayer = players[Math.floor(Math.random()*players.length)]; //Find a random player
            for (let ply of players){
                if (ply.team == 'traitor'){
                    if (ply.target = rdmPlayer) done = false; //If that random player is not a target of any traitors
                }
            }
        }

        channel.send(`${rdmPlayer.member.user} is not a target.`);
		return 
	}

	async fail(channel){
        channel.send(`Waiting on traitors to choose their targets.`);
        let traitorCount = 0;
		for (let ply of players){
            if (ply.player.team == 'traitor'){
                traitorCount++;
                let rlMsg = '**Roles**';
                for (let ply of players){
                    if (ply.player.team == 'innocent') rlMsg += `\n${ply.player.role.name}`
                }
                await ply.member.user.send(`${rlMsg}\nType the name of the role you wish to be your new target.`);
            }
        }
        let hasSetTarget = false;
        while (!hasSetTarget){
            let setTarget = 0;
            for (let ply of players){
                if (ply.player.team == 'traitor'){
                    let msg = ply.member.user.dmChannel.lastMessage;
                    let msgIsRole = false
                    let tgt;
                    for (let inno of players){
                        if (inno.player.role.name.toLowerCase() == msg.content.toLowerCase()){
                            msgIsRole = true;
                            tgt = inno;
                        }
                    }
                    if (msgIsRole && msg.author == ply.member.user){
                        setTarget++;
                        ply.player.target = tgt;
                    } else {
                        var trTargetFilter = m => m.author.id === ply.member.user.id;
                        var trMessageController = new Discord.MessageCollector(ply.member.user.dmChannel, trTargetFilter);
                        msg = await trMessageController.next;
                    }
                }
            }

            if (setTarget == traitorCount) hasSetTarget = true;
        }
        await channel.send('Traitors have chosen their new targets. The game will continue.');
        return
	}
}

module.exports = Target;