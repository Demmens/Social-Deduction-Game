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
				if (mission.name == 'Secure Daisy Field'){
					missionTree[0] = mission;
				}
				if (mission.name == 'Secure Dandelion Field'){
					missionTree[2] = mission;
					missionTree[6] = mission;
				}
				if (mission.name == 'Secure Daffodil field'){
					missionTree[4] = mission;
					missionTree[8] = mission;
				}
				if (mission.name == 'Gather Armaments'){
					missionTree[3] = mission;
					missionTree[9] = mission;
				}
				if (mission.name == 'Hive Interrogation'){
					missionTree[1] = mission;
					missionTree[7]= mission;
					missionTree[12] = mission;
				}
				if (mission.name == 'Create Backup Plan'){
					missionTree[10] = mission;
					missionTree[13] = mission;
				}
				if (mission.name == 'Usurp Queen Bee'){
					missionTree[14] = mission;
					missionTree[15] = mission;
					missionTree[16] = mission;
					missionTree[17] = mission;
				}
				if (mission.name == 'Investigate Possible Targets'){
					missionTree[5] = mission;
					missionTree[11] = mission;
				}
			}
		}

		return missionTree;
	}
}