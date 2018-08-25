"use strict";
var creepsByRole = require('creepsByRole');
module.exports = function (creep) {
	
	
	/*creep.room.find(FIND_HOSTILE_CREEPS, { filter: function(i) { 
	    if(i.owner.username != 'Source Keeper') {
	        hostilesCount[i.owner.username] = hostilesCount[i.owner.username] || 0;
	        hostilesCount[i.owner.username]++;
	    }
	}});*/
	
	
	//var creepsByRoleList = creepsByRole();
	//var hostileCreeps = creep.room.find(FIND_HOSTILE_CREEPS);
	
	//Memory.armyPatrol = 4;
	var armyFlags = ['armyFlag','armyFlag2','armyFlag3','armyFlag4'];
	
	creep.mysay('archer');
if (!creep.memory.armyPatrol) {
    creep.memory.armyPatrol = "";
}
	
	//console.log('archertest');
	var enemy = creep.pos.findClosest(FIND_HOSTILE_CREEPS);
	
	//step 1 kill the bad guys
	if(enemy) {
	    //we have a ranged attack so a few steps back is ok
	    if(creep.pos.getRangeTo(enemy) > 3 ){
	        creep.moveTo(enemy);
	    }
	    //TODO: lure non-ranged attackers off of ramparts
	    creep.rangedAttack(enemy);
	    return;
	} 
	let hostileStrucure = creep.pos.findClosest(FIND_HOSTILE_STRUCTURES, {
            filter: { structureType: STRUCTURE_RAMPART }
        });
	if(hostileStrucure) {
	    let success = creep.moveTo(hostileStrucure);
	    creep.rangedAttack(hostileStrucure);
	    return;
	}
	
	let spawn = creep.pos.findClosest(FIND_HOSTILE_SPAWNS);
	if(spawn) {
	    let success = creep.moveTo(spawn);
	    if(success != OK) {
	        //something got in our way, but there is no enemy.
	        //pick a new target
	    }
	    creep.rangedAttack(spawn);
	    return;
	}
	
	let moveToFlag = "armyFlag";// + creep.memory.armyPatrol;
	creep.moveTo(Game.flags[moveToFlag]);
	
	if( creep.pos.isNearTo( Game.flags[moveToFlag] ) )
	{
		//if the room is empty of enemies, or if the only enemies are source keepers, continue on the patrol
		if(!enemy || (enemy.owner.username == 'Source Keeper')) {
		//if(!enemy) {
			creep.memory.armyPatrol++;
			if(creep.memory.armyPatrol >= armyFlags.length) {
				creep.memory.armyPatrol = 0;
			}
		}
	}
	
	
	//creep.attack(keeper);
	creep.rangedAttack(enemy);
	return;
	
	if(creep.memory.target == null) {

		
	    var meanCreep;
	    
	    for (var i in hostileCreeps) {
	    	meanCreep = hostileCreeps[i];
	    	if (meanCreep.owner.username == 'Source Keeper') {
	    		// find a nearby rampart and blast that fuxor!
	    		//get a gang,
	    		if(creepsByRoleList['archer'] > 6) {
	    			creep.memory.target = i;
	    			break;
	    		}
	    	}
	    }
	}
	if(creep.memory.target != null) {
		//make it try to stay on rampart
		var target = hostileCreeps[creep.memory.target];
		
		// if the target is dead, reset to target hunting mode.
		if(!target) {
			creep.memory.target = null;
			return;
		}
		creep.moveTo(target);
		creep.rangedAttack(target);
	} else {
		creep.say("Massing");
		creep.moveTo(Game.flags.Flag3);
	}   
	
	 
};