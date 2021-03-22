const Role = require("../Role");
const f = require("../../functions");

class Zombee extends Role
{
    constructor()
    {
        super
        ({
			name: 'Zombee',
			description: 'When you are on a mission, choose another player on the mission to infect. When this player is general or major, they draw 1 less success card than usual.',
			influence: 6,
            team: 'traitor',
            playersRequired: 1000,
		})
    }

    BeforeLeaderDraw(){
        if (this.owner != general && this.owner != major && this.owner != captain) return;

        this.owner.member.user.send(`Type the name of the player your wish to infect in a separate message before discarding or playing cards.`)
    }

    AfterLeaderDraw(){ //Make sure infected players draw 1 less success than usual.
        let drawPileFails = 0;
        let i = 0;
        for (let card of drawPile){
            if (card == 'Fail'){
                drawPileFails++;
                drawPile.splice(i,1); //Splice them now since it is easier
            }
            i++;
        }
        if (general.infected && drawPileFails > 0){
            let i = 0;
            console.log(cards.general);
            for (let card of cards.general){
                if (card == 'Success'){
                    cards.general[i] = 'Fail';
                    drawPile.push('Success');
                    drawPileFails--;
                    break;
                }
                i++
            }
        }
        if (major){
            if (major.infected && drawPileFails > 0){
                console.log(cards.major);
                for (let card of cards.major){
                    if (card == 'Success'){
                        card = 'Fail';
                        drawPile.push('Success');
                        drawPileFails--;
                    }
                }
            }
        }
        for (let i = 0; i < drawPileFails; i++){
            drawPile.push('Fail');
        }

        drawPile = f.ArrRandomise(drawPile);
    }

    BeforeResultDetermined(){
        let msgArr = this.owner.member.user.dmChannel.messages.cache.array();
        for (let i = msgArr.length-1; i > 0; i--){
            let msg = msgArr[i];
            if (msg.author != this.owner && msg.content.startsWith(`Type the name of the player`)) return;
            for (let ply of players){
                if (ply.member.displayName.toLowerCase() == msg.content.toLowerCase() && (ply == general || ply == major || ply == captain) && ply != this.owner){
                    ply.infected = true;
                    this.owner.member.user.send(`You have infected ${ply.member.displayName}`);
                    return;
                }
            }
        }
    }
}

module.exports = Zombee;