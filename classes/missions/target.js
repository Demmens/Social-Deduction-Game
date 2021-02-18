const Discord  = require('discord.js');
const Mission = require('../Mission');

class Target extends Mission{
	constructor(){
		super({
			name: 'Investigate Possible Targets',
			successtext: 'One role is revealed to not be a target.',
			failtext: 'Traitors may choose to randomise their target.'
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

        channel.send(`${rdmPlayer.player.role.name} is not a target.`);
		return 
	}

	async fail(channel){
        channel.send(`Waiting on traitors to choose their targets.`);
        let traitorCount = 0;
        let roleRandomise = [];
		for (let ply of players){
            if (ply.player.team == 'traitor'){
                traitorCount++;
                for (let ply of players){
                    if (ply.player.team == 'innocent'){
                        roleRandomise.push(ply);
                    }
                }
                await ply.member.user.send(`Would you like to randomise your target? (\`yes\`/\`no\`)`);
            }
        }
        let hasSetTarget = false;
        while (!hasSetTarget){
            let setTarget = 0;
            for (let ply of players){
                if (ply.player.team == 'traitor'){
                    let msg = ply.member.user.dmChannel.lastMessage;
                    let yesno = msg.content.toLowerCase();
                    if (yesno == 'yes' || yesno == 'no' && msg.author == ply.member.user){
                        setTarget++;
                    } else {
                        var trTargetFilter = m => m.author.id === ply.member.user.id;
                        var trMessageController = new Discord.MessageCollector(ply.member.user.dmChannel, trTargetFilter);
                        msg = await trMessageController.next;
                    }
                }
            }

            if (setTarget == traitorCount) hasSetTarget = true;
        }
        for (let ply of players){
            if (ply.player.team == 'traitor'){
                let msg = ply.member.user.dmChannel.lastMessage.content.toLowerCase();
                if (msg == 'yes'){
                    let tgt = roleRandomise[Math.floor(Math.random()*roleRandomise.length)];
                    ply.player.target = tgt;
                    ply.member.user.send(`Your new target is the ${tgt.player.role.name}`);
                } else{
                    ply.member.user.send(`Your target has not changed.`)
                }
            }
        }
        await channel.send('Traitors have chosen their new targets. The game will continue.');
        return
	}
}

module.exports = Target;