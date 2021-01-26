module.exports = {
    ArrRandomise: function(arr){
        let arrCopy = JSON.parse(JSON.stringify(arr)); //Clone array

        let tempArr = [];
		while (arrCopy.length > 0){ //Shuffle the array
			let k = Math.floor(Math.random()*arrCopy.length);
			let v = arrCopy[k];
			arrCopy.splice(k,1);
			tempArr.push(v);
		}
		return tempArr; //Return shuffled array
    }
}