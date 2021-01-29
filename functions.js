module.exports = {
    ArrRandomise: function(arr){
        let tempArr = [];
		while (arr.length > 0){ //Shuffle the array
			let k = Math.floor(Math.random()*arr.length);
			let v = arr[k];
			arr.splice(k,1);
			tempArr.push(v);
		}
		return tempArr; //Return shuffled array
	},
	
	isRole(player, role, roleStr){
		if ((player.role.name == 'roleStr' || player.role.name == 'Two Bees in a Trenchcoat') && player == role){
			return true;
		}
		return false;
	}
}