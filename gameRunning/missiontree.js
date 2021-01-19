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
				if (mission.name == 'Pollenate Flowers') missionTree[0] = mission;
				if (mission.name == 'Hive Investigation') missionTree[1] = mission;
				if (mission.name == 'Collect Honey') missionTree[2] = mission;
				if (mission.name == 'Hive Investigation') missionTree[3] = mission;
				if (mission.name == 'Pollenate Flowers') missionTree[4] = mission;
				if (mission.name == 'Collect Honey') missionTree[5] = mission;
				if (mission.name == 'Collect Honey') missionTree[6] = mission;
				if (mission.name == 'Create Backup Plan') missionTree[7] = mission;
				if (mission.name == 'Crackdown on Traitors') missionTree[8] = mission;
			}
		}

		return missionTree;
	}
}