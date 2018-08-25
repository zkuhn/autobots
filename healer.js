

module.exports = function (creep) {
 
	var friendlies = creep.room.find(FIND_MY_CREEPS);
	for (var i in friendlies) {
		var target = friendlies[i];
		if(target.hits < target.hitsMax) {
			creep.say("H +");
			creep.moveTo(target);
			creep.heal(target);
			return;
		}
		else{
			//creep.moveTo(Game.flags.Flag5);
		}
	}
	
	
	
};