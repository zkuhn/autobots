
 /*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('harvester'); // -> 'a thing'
 */

var creepsByRole = require('creepsByRole');
 module.exports = function (creep) {

//console.log("harvest Tender");
    function siteIsSafe(buildSite) {
	    if(!buildSite) {
	        return false;
	    }
	    var nearestEnemy = buildSite.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
		if(!nearestEnemy) {
			
			return true;
		}
		if(buildSite.pos.inRangeTo(nearestEnemy, 4) ) {
			return false; // return TOO dangerous
		}
		
		return true;
	}
	
	if( (creep.carry.energy <  creep.carryCapacity)  & !creep.memory.offloading) {
		
		//var energy = creep.room.find(FIND_DROPPED_ENERGY);
		//only do this if its safe
		var energySpot = creep.pos.findClosestByPath(FIND_DROPPED_ENERGY);
		//if(energy.length > 0) {
		if(energySpot) {
		    if(siteIsSafe(energySpot) ) {
    			creep.moveTo(energySpot);//(energy[0]);
    			creep.pickup(energySpot);//(energy[0]);
    			return;
		    }
		}
		
		var creepsByRoleList = creepsByRole();
		var targetCreep;
		//creep.memory.target = null;
		if(creep.memory.target == null) {
			
			
			/*
			if(Object.keys(creepsByRoleList['harvester']).length == 0) {
			    console.log("no harvesters found");
			} else {
			    console.log("harvesters found:" + Object.keys(creepsByRoleList['harvester']).length);
			}*/
			creep.memory.target = getTargetServiceCreep(creep, creepsByRoleList);
			//let the other harvesters know not to go after this one.
			targetCreep = creepsByRoleList['harvester'][creep.memory.target];
			//console.log("target creep is"  + targetCreep);
			//console.log("memory target is" + creep.memory.target);
			if( targetCreep ) {
			    creepsByRoleList['harvester'][creep.memory.target].memory.inService = true;
			    creepsByRoleList['harvester'][creep.memory.target].memory.servicedBy = creep.name;
			} else {
			  //  console.log("couldn't find" + creep.memory.target + "in creepsByRoleList");
			    return;
			}
				
		}
		//console.log("got to here");
		targetCreep = creepsByRoleList['harvester'][creep.memory.target];
		//targetCreep = Game.creeps[creep.memory.target];
		creep.say("E-Harv");
		creep.moveTo(targetCreep);
		if(!targetCreep) {
			creep.memory.target = null;
			return;
		}
		//this only happens if we are next to the creep
		
		var transferSucess = targetCreep.transfer(creep, RESOURCE_ENERGY);
		
		// even though it says transfer energy, maybewe weren't clsoe, and didn't transfer.. so check that  
		// the transfer happened.
		if(transferSucess == OK) {
			creep.memory.target = null;
			targetCreep.memory.inService = false;
			
		}
		
	} else {
		creep.say("tanker");
		creep.memory.offloading = true;
		
		var transferToSpawn = getTargetDeliverTo(creep);
		
		//console.log(creep.name + " transferring to " + transferToSpawn);
		

		
		creep.moveTo(transferToSpawn);
		creep.transfer(transferToSpawn, RESOURCE_ENERGY);
		if(creep.carry.energy == 0) {
		    creep.memory.offloading = false;
		}
		creep.memory.target = null;
		
	}
	
	// look through the harvesters and find the one with the highest energy store. Target that one to grab energy from.
	// however look to see, and skip harvesters already serviced by another tender
	function getTargetServiceCreep(creep, creepsByRoleList) {
	    var targetCreep;
	    var highestEnergy = 0;
	    var returnCreep;
	    for (var j in creepsByRoleList['harvester'] ) {
			targetCreep = creepsByRoleList['harvester'][j];
			
			//console.log("Pulled from role list" + targetCreep);
			if(targetCreep.room != creep.room) {
			    continue;
			}
			if(targetCreep.memory.inService == true) {
				continue;
			}
			if(targetCreep.carry.energy > highestEnergy) {
			//if(targetCreep.energy / targetCreep.energyCapacity  > .4){
				returnCreep = j; //the target will be the one with the highest energy, that is not in service by another harvester
				//console.log("highest energy creep was "+ j);
				highestEnergy = targetCreep.carry.energy;
			}
		}
		return returnCreep;
	}
	
	//get a storage target to deliver energy to 
	
	function getTargetDeliverTo(creep){
	    var transferToSpawn = null;
		for (var spawnIndex in Game.spawns) {
		    if( creep.room == Game.spawns[spawnIndex].room) {
		        transferToSpawn = Game.spawns[spawnIndex];
		        console.log("found spawn: "+ spawnIndex)
		        if (transferToSpawn.energy < 300) {
		            console.log("spawn energy: "+ transferToSpawn.energy)
		            return transferToSpawn;
		        }
		        //break;
		    }
		}
		
		
		let containers = creep.room.find(FIND_STRUCTURES,{filter: (i)=> {return i.structureType==STRUCTURE_CONTAINER}});
		for (var structureIndex in containers) {
		    //console.log(creep.name + " looking at containers - " + structureIndex);
		    let container = containers[structureIndex];
		    if(container.store.energy < 2000){
		        transferToSpawn = container;
		        break;
		    }
		}
		
		//look in the same room for the storage containter if it exists and make that the transferToTarget
		for (var structureIndex in Game.structures) {
		    if( creep.room == Game.structures[structureIndex].room) {
		        if (Game.structures[structureIndex].structureType == STRUCTURE_STORAGE) {
		            transferToSpawn = Game.structures[structureIndex];
		            break;
		        }
		    }
		}
		return transferToSpawn;
	}
};