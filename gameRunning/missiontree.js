const fs = require('fs');
const path = require('path');
const dir = fs.readdirSync('./classes/missions'); //retrieve all monsters
var missions = [];
for (let file of dir){
	let filepath = path.join('../classes/missions',file);
	filepath = filepath.replace(path.extname(filepath), '');
	let mission = require(filepath);
	missions.push(new mission);
}

module.exports = {
	findTree: function(playerCount){
		var missionTree = [];

		if (playerCount){
			for (let mission of missions){
				if (playerCount != 4){
					if (mission.name == 'Secure Dandelion Field'){
						missionTree[1] = mission;
						missionTree[6] = mission;
					}
					if (mission.name == 'Secure Daffodil field'){
						missionTree[5] = mission;
						missionTree[8] = mission;
					}
					if (mission.name == 'Gather Armaments'){
						missionTree[0] = mission;
						missionTree[2] = mission;
						missionTree[4] = mission;
					}
					if (mission.name == 'Hive Interrogation'){
						missionTree[3] = mission;
						missionTree[7]= mission;
					}
					if (mission.name == 'Create Backup Plan'){
						missionTree[12] = mission;
					}
					if (mission.name == 'Launch Assault on Opposing Hive'){
						missionTree[13] = mission;
						missionTree[14] = mission;
						missionTree[15] = mission;
						missionTree[16] = mission;
					}
				}
				if (playerCount <= 4){
					if (mission.name == 'Gather Armaments'){
						missionTree[0] = mission;
						missionTree[2] = mission;
					}
					if (mission.name == 'Spread Propoganda'){
						missionTree[1] = mission;
					}
					if (mission.name == 'Secure Dandelion Field'){
						missionTree[3] = mission;
					}
					if (mission.name == 'Secure Daisy Field'){
						missionTree[4] = mission;
					}
					if (mission.name == 'Secure Daffodil Field'){
						missionTree[5] = mission;
					}
					if (mission.name == 'Secure Lavender Field'){
						missionTree[6] = mission;
					}
					if (mission.name == 'Launch Assault on Opposing Hive'){
						missionTree[7] = mission;
						missionTree[8] = mission;
						missionTree[9] = mission;
						missionTree[10] = mission;
					}
				}
			}
		}

		return missionTree;
	}
}