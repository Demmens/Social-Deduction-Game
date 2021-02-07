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
		globalThis.SecureDaisyField = null;
		globalThis.SecureDaffodilField = null;
		globalThis.SecureDandelionField = null;
		globalThis.SecureLavenderField = null;
		globalThis.GatherArmaments = null;
		globalThis.SpreadPropoganda = null;
		globalThis.HiveInterrogation = null;
		globalThis.CreateBackupPlan = null;
		globalThis.SourceIntelligence = null;
		globalThis.RescueOperatives = null;
		globalThis.LaunchAssaultOnOpposingHive = null;
		globalThis.SuspendAgents = null;
		for (let mission of missions){
			if (mission.name == 'Secure Daisy Field') SecureDaisyField = mission;
			if (mission.name == 'Secure Daffodil Field') SecureDaffodilField = mission;
			if (mission.name == `Secure Dandelion Field`) SecureDandelionField = mission;
			if (mission.name == 'Secure Lavender Field') SecureLavenderField = mission;
			if (mission.name == 'Gather Armaments') GatherArmaments = mission;
			if (mission.name == 'Spread Propoganda') SpreadPropoganda = mission;
			if (mission.name == 'Hive Interrogation') HiveInterrogation = mission;
			if (mission.name == 'Create Backup Plan') CreateBackupPlan = mission;
			if (mission.name == 'Source Intelligence') SourceIntelligence = mission;
			if (mission.name == 'Rescue Operatives') RescueOperatives = mission;
			if (mission.name == 'Suspend Agents') SuspendAgents = mission;
			if (mission.name == 'Launch Assault on Opposing Hive') LaunchAssaultOnOpposingHive = mission;
		}
		if (playerCount){
			if (playerCount == 7 || playerCount == 8){
				missionTree[0] = GatherArmaments;
				missionTree[1] = SecureDandelionField;
				missionTree[2] = GatherArmaments;
				missionTree[3] = HiveInterrogation;
				missionTree[4] = SecureDaffodilField;
				missionTree[5] = GatherArmaments;
				missionTree[6]= HiveInterrogation;
				missionTree[7] = SecureDandelionField;
				missionTree[8] = SpreadPropoganda;
				missionTree[9] = SecureDaffodilField;
				missionTree[10] = HiveInterrogation;
				missionTree[11] = SecureLavenderField;
				missionTree[12] = CreateBackupPlan;
				missionTree[13] = LaunchAssaultOnOpposingHive;
				missionTree[14] = LaunchAssaultOnOpposingHive;
				missionTree[15] = LaunchAssaultOnOpposingHive;
				missionTree[16] = LaunchAssaultOnOpposingHive;	
			}
			if (playerCount == 5 || playerCount == 6){
				missionTree[0] = GatherArmaments;
				missionTree[1] = SecureDaisyField;
				missionTree[2] = GatherArmaments;
				missionTree[3] = HiveInterrogation;
				missionTree[4] = SpreadPropoganda;
				missionTree[5] = SecureDaffodilField;
				missionTree[6] = GatherArmaments;
				missionTree[7] = SecureDandelionField;
				missionTree[8] = HiveInterrogation;
				missionTree[9] = SecureLavenderField;
				missionTree[10] = LaunchAssaultOnOpposingHive;
				missionTree[11] = LaunchAssaultOnOpposingHive;
				missionTree[12] = LaunchAssaultOnOpposingHive;
				missionTree[13] = LaunchAssaultOnOpposingHive;				
			}
			if (playerCount == 4){
				missionTree[0] = GatherArmaments;
				missionTree[1] = SpreadPropoganda;
				missionTree[2] = GatherArmaments;	
				missionTree[3] = SecureDandelionField;
				missionTree[4] = SecureDaisyField;
				missionTree[5] = SecureDaffodilField;
				missionTree[6] = SecureLavenderField;
				missionTree[7] = LaunchAssaultOnOpposingHive;
				missionTree[8] = LaunchAssaultOnOpposingHive;
				missionTree[9] = LaunchAssaultOnOpposingHive;
				missionTree[10] = LaunchAssaultOnOpposingHive;
			}
			if (playerCount < 4){
				missionTree[0] = SuspendAgents;
				missionTree[1] = SuspendAgents;
			}
		}

		return missionTree;
	}
}