
 /*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('harvester'); // -> 'a thing'
 */
"use strict";
var creepsByRole = require('creepsByRole');
 module.exports = function (creep) {
	 
	 var creepsByRoleList = creepsByRole();
	 
	 function getTarget(creepsByRoleList){
		 
		 var returnArray = {};
		 var target;
		 
		 for (var j in creepsByRoleList['upgrader'] ) {
			//console.log("Looking at upgrader" + j);
			target = creepsByRoleList['upgrader'][j];
			if(!target) {
			    continue;
			}
			if(target.room != creep.room) {
			    continue;
			}
			if(target.memory.inService) {
				continue;
			}
			if(target.carry.energy / target.carryCapacity  < .5){
				returnArray['role'] = 'upgrader';
				returnArray['index'] = j;
				return returnArray;
			}
		 }
		 for (var j in creepsByRoleList['fortifier'] ) {
			//console.log("Looking at fortifier" + j);
			if(!target) {
			    continue;
			}
			if(target.room != creep.room) {
			    continue;
			}
			target = creepsByRoleList['fortifier'][j];
			if(!target) {
			    continue;
			}
			//just for a while to clear service memories
			//target.memory.inService = false;
			if(target.memory.inService) {
			    //target.say('pd' + target.memory.inService);
			    //console.log('creep' + j +"was passed over" + target.memory.inService + "evaluated to true: serviced by" + target.memory.servicedBy );
			    //somehow, a creep target inService is being set to true, but then is never being serviced.. 
			    //maybe if the servicer dies?
			    if(target.memory.servicedBy) {
				    continue;
			    } else {
			        target.memory.inService = false;
			    }
			}
			if(target.carry.energy / target.carryCapacity  < .5){
				returnArray['role'] = 'fortifier';
				returnArray['index'] = j;
				return returnArray;
			}
		 }
		 for (var k in creepsByRoleList['builder'] ) {
			
			target = creepsByRoleList['builder'][k];
			if(!target) {
			    continue;
			}
			if(target.room != creep.room) {
			    continue;
			}
			if(target.memory.inService ) { //what if it is in service by US!?! (but we forgot about it??)
				//continue;
			}
			if(target.carry.energy / target.carryCapacity  < .5){
				returnArray['role'] = 'builder';
				returnArray['index'] = k;
				return returnArray;
			}
		}
			
			
			
			
			return null;
	 }
	 
	 
	function getEnergyStorage(creep){
	    let energyStorage = null;
	     //look in the same room for the storage containter if it exists and make that the transferToTarget
        for (let structureIndex in Game.structures) {
		    if( creep.room == Game.structures[structureIndex].room) {
		        if (Game.structures[structureIndex].structureType == STRUCTURE_STORAGE) {
		            energyStorage = Game.structures[structureIndex];
		            //don't give back empty storage.. lame
		            if(energyStorage.store.energy < 50 ) {
		                return null;
		            }
		            return energyStorage;
		            break;
		        }
		    }
		}
		return energyStorage;
	}
	
	

	if(creep.carry.energy > 0) {
	    
    	if(creep.memory.targetData == null) {
			var extensions = creep.room.find(FIND_MY_STRUCTURES,
				{ filter: { structureType: STRUCTURE_EXTENSION } }
			);
			var extensionsEmpty = false;
			for (var i in extensions){
				if(extensions[i].energy < 50) {
					extensionsEmpty = true;
					//creep.say("T->E");
				    //creep.moveTo(extensions[i]);
				    //creep.transferEnergy(extensions[i]);
					break;
				}
			}
			if(extensionsEmpty) {
			    var closestEmpty = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
			       filter: function(object){
			           //console.log(object);
			           if(object.structureType != STRUCTURE_EXTENSION ) {
			          //     console.log("filtering non-extention");
			               return false;
			           }
			           if(object.energy == object.energyCapacity) {
			      //         console.log("filtering filled");
			               return false;
			           }
			        //   console.log("found empty");
			           return true;
			       } 
			    });
			    creep.say("T->E");
			    //console.log('about to move and transfer energy to empty extension');
			    //console.log(closestEmpty);
				creep.moveTo(closestEmpty);
				creep.transfer(closestEmpty, RESOURCE_ENERGY);
				return;
			}
			//if the room has storage, it will be filled first instead of the spawn, so we need to transfer energy to the spawn also.
			if(creep.room.hasStorage()) {
			    let roomSpawn = creep.room.getFirstSpawn()
			    creep.moveTo(roomSpawn);
				creep.transfer(roomSpawn, RESOURCE_ENERGY);
			}
		}
		
		
		
		var target;
		
		if (creep.memory.targetData == null) {
			
			var targetData = getTarget(creepsByRoleList);
			if(!targetData){
				
				if(creep.ticksToLive % 10 == 0) {
				    creep.say("idle");
				}
				
			} else {
    			
    			
    			target = creepsByRoleList[targetData['role']][targetData['index']];
    			if(target.room == creep.room) {
        			creep.memory.targetData = targetData;
        			target.memory.inService = true;
        			target.memory.servicedBy = creep.name;
    			} else {
    			    creep.memory.targetData = null;
    			}
			}
		} 
	
		
		try {
    		var targetRole  = creep.memory.targetData['role'];
    		var targetIndex = creep.memory.targetData['index'];
    		target = creepsByRoleList[targetRole][targetIndex];
		
    		if(target.room == creep.room) {
        		creep.say("T->B");
        		console.log("trying to transfer to " + target.name);
        		creep.moveTo(target);
        		
        		var transferStatus = creep.transfer(target, RESOURCE_ENERGY);
        		//if the transfer was sucessful, unset the target data
        		if (transferStatus == OK) {
        		    creep.memory.targetData = null;  
        		    target.memory.inService = false;
        		}
    		}
        		
		} catch(err) {
		    creep.memory.targetData = null;  
		}
		//if the target is full, or no longer exists, lets pick a new target
		if(!target ) {
			//creep.memory.targetData = {role : '', index : ''};
			creep.memory.targetData = null;
			return;
		}
		if(target.carry.energy == target.carryCapacity) {
		    target.memory.inService = false;
			target.memory.servicedBy = null;
			creep.memory.targetData = null;
		}

		
	}
	else {
		//var energy = creep.pos.findClosest(FIND_DROPPED_ENERGY);
		//if(energy.length > 0) {
//		if(energy) {
//			creep.moveTo(energy);//(energy[0]);
//			creep.pickup(energy);//(energy[0]);
//		} else {
			
			creep.say("fill up");
			
			var roomSpawn;
	        //loop through the spawns, and find one in the current room. Otherwise, just use the last spawn looked at
	        for(var spawnName in Game.spawns){
	            roomSpawn = Game.spawns[spawnName];
	            if (creep.room == roomSpawn.room) {
	                break;
	            }    
	        }
	        
	        let spawnLink = creep.room.getSpawnLink();
	        
	        if(spawnLink &&spawnLink.energy > 0){
	            creep.moveTo(spawnLink);
	            creep.withdraw(spawnLink, RESOURCE_ENERGY);
			    //spawnLink.transfer(creep, RESOURCE_ENERGY);
	            //console.log(creep.room + "spawn link is " + spawnLink);
	        }else if(roomSpawn.energy > 50) {
			    creep.moveTo(roomSpawn);
			    creep.withdraw(roomSpawn, RESOURCE_ENERGY);
			    //roomSpawn.transfer(creep, RESOURCE_ENERGY);
			} else {
			    
			    let energyStorage = getEnergyStorage(creep);
			    
			    let energyTarget = null;
			    if(energyStorage ) {
			        
			        energyTarget = energyStorage;
			    } else {

    			    //console.log('try alt energy source');
    			    //this was found/declared at the top of the func...
    			    let targets = creepsByRoleList['harvestTender'];
    			    
    			    for(let targetID in targets) {
    			        let target = targets[targetID];
    			        if(target.room != creep.room)  {
    			            continue;
    			        }
    			        //console.log(target);
    			        
    			        if(target.carry.energy > 0 ) {
    			            console.log('found harvestTender with energy');
    			            energyTarget = target;
    			            break;
    			        }
    			    }
			    }
			    if(energyTarget != null) {
			        creep.moveTo(energyTarget);
			        energyTarget.transfer(creep, RESOURCE_ENERGY);
			    }
			}
//		}
	}
};