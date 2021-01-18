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
				if (mission.name == 'Pollenate Flowers'){
					missionTree[0] = mission;
				}
			}
		}

		return missionTree;
	}
}