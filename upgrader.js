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
 "use strict";
 module.exports = function (creep) {

	if(creep.carry.energy > 0) {
		
		var status = creep.moveTo(creep.room.controller);
		creep.upgradeController(creep.room.controller);
		
	}
	else {
		var roomSpawn;
		let storage = creep.room.getStorage();
		//if(storage && (storage.store.energy > creep.carryCapacity)) {
	    if(storage && (storage.store.energy > 10000)) {
		    creep.moveTo(storage);
		    storage.transferEnergy(creep);
		    return;
		} else {
		    //console.log("storage problem for upgrader " + storage + " energy :" + storage.store.energy);
		}
        //loop through the spawns, and find one in the current room. Otherwise, just use the last spawn looked at
        for(var spawnName in Game.spawns){
            roomSpawn = Game.spawns[spawnName];
            if (creep.room == roomSpawn.room) {
                break;
            }    
        }
		
		creep.moveTo(roomSpawn);
	    roomSpawn.transferEnergy(creep);
	}
};