/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('upgrader2'); // -> 'a thing'
 */
 /*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('upgrader'); // -> 'a thing'
 */
 /*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('harvester'); // -> 'a thing'
 */
 var harvester = require('harvester');
 module.exports = function (creep) {
    
	if(creep.energy > 0 && ! creep.memory.harvesting) {
		
		if(!creep.memory.waypointReached){
		    creep.moveTo(Game.flags.safeWaypoint);
		    if(creep.pos.isNearTo(Game.flags.safeWaypoint)) {
		        creep.memory.waypointReached = true;    
		    }
		} else {
		  creep.say('UP');
    		creep.moveTo(creep.room.controller);
    		var result = creep.upgradeController(creep.room.controller);
    		//console.log("upgrade result" +result);
		}
		
	}
	else {
	    if(creep.energy == creep.energyCapacity) {
	        creep.memory.harvesting = false;;
	    } else {
	        creep.memory.harvesting = true;
	    }
	    //check the reverse condition on the way back.. toggle it back and forth
	    if(creep.memory.waypointReached){
		    creep.moveTo(Game.flags.safeWaypoint);
		    if(creep.pos.isNearTo(Game.flags.safeWaypoint)) {
		        creep.memory.waypointReached = false;    
		    }
		} else {
		    
		    harvester(creep);
		    return;
    		spawn = Game.spawns.Spawn2;
		    creep.moveTo(spawn);
		    spawn.transferEnergy(creep);
		}
	    
	}
}