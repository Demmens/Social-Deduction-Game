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
		globalThis.SecurePrivateMeeting = null;
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
			if (mission.name == 'Secure Private Meeting') SecurePrivateMeeting = mission;
		}
		if (playerCount){
			if (playerCount == 7 || playerCount == 8){
				missionTree = [
					GatherArmaments,
					SecureDaffodilField,
					HiveInterrogation,
					SecureDandelionField,
					SecurePrivateMeeting,
					SuspendAgents,
					SecureDaffodilField,
					HiveInterrogation,
					SecureLavenderField,
					CreateBackupPlan,
					LaunchAssaultOnOpposingHive,
					LaunchAssaultOnOpposingHive,
					LaunchAssaultOnOpposingHive,
					LaunchAssaultOnOpposingHive	
				];
			}
			if (playerCount == 5 || playerCount == 6){
				missionTree = [
					GatherArmaments,
					SecureDaisyField,
					GatherArmaments,
					HiveInterrogation,
					SpreadPropoganda,
					SecureDaffodilField,
					GatherArmaments,
					SecureDandelionField,
					HiveInterrogation,
					SecureLavenderField,
					LaunchAssaultOnOpposingHive,
					LaunchAssaultOnOpposingHive,
					LaunchAssaultOnOpposingHive,
					LaunchAssaultOnOpposingHive	
				];	
			}
			if (playerCount == 4){
				missionTree = [
					GatherArmaments,
					SpreadPropoganda,
					GatherArmaments,
					SecureDandelionField,
					SecureDaisyField,
					SecureDaffodilField,
					SecureLavenderField,
					LaunchAssaultOnOpposingHive,
					LaunchAssaultOnOpposingHive,
					LaunchAssaultOnOpposingHive,
					LaunchAssaultOnOpposingHive
				];
			}
			if (playerCount < 4){
				missionTree = [
					GatherArmaments,
					GatherArmaments,
					GatherArmaments,
					GatherArmaments,
					GatherArmaments
				]
			}
		}

		return missionTree;
	}
}