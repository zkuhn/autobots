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

    //upgrader(creep);
    //return;
    
	if(creep.carry.energy < creep.carryCapacity) {
    	//creep.moveTo(sourcesGame.sources.Source1 );
		//creep.harvest(sourcesGame.sources.Source1 );
		//return;
		
		
	
	    //Memory.creeps['upgrader1'].role = 'upgrader';
		
		var sources = creep.room.find(FIND_SOURCES);

		if(creep.memory.mineSource == null) {
		    
			creep.memory.mineSource  = findClosestSafeSourceID(creep, sources);
			//creep.memory.mineSource  = 0;
			//if(creep.memory.mineSource == 3) {
			//	creep.memory.mineSource = 0;
			//}  
		    /*
		    var closestSource = creep.pos.findClosest(FIND_SOURCES);
		    creep.memory.mineSource = 0;
		    for( var i in sources ){
		    	
		        if(sources[i] == closestSource){
		        	//HACK.. don't go near sourcekeepers at start.
		        	if(! (i == 4 ||i==0)) {
		        		i = 0;
		        	}
		            creep.memory.mineSource = i;
		        }
		    }
		    */
		}
		//creep.say("M " + creep.memory.mineSource );
		var moveStatus = creep.moveTo(sources[creep.memory.mineSource ] );
		
		if(moveStatus != OK) {//somethings blocking the way.
		//console.log('harvester path blocked');
		    //if it's not the mine source, refind the closeest mine source..
		    if(!creep.pos.isNearTo(sources[creep.memory.mineSource ])) {
		        //console.log('blocked.. recheking nearest source');
		        let newSource = findClosestSafeSourceID(creep, sources);
		        if (creep.memory.mineSource != newSource ) {
		            creep.memory.mineSource = newSource;
		        } else {
		            //go into remote mode
		            if(!creep.memory.blocked) {
		                creep.memory.blocked = 1;
		            } else {
		                creep.memory.blocked = creep.memory.blocked + 1;
		            }
		            
		            /*
		            if(creep.memory.blocked && creep.memory.blocked > 8) {
		                creep.memory.oldRole = creep.memory.role;
		                creep.memory.role = 'remoteHarvester';   
		                creep.memory.blocked = 0;
		                return;
		            } */
		            
		            //try to move a random direction;
		            let direction = Math.floor((Math.random() * 8));
		            creep.move(direction);
		        }
		    }
		}
		creep.harvest(sources[creep.memory.mineSource ] );
		//creep.moveTo(sources[0] );
		//creep.harvest(sources[0] );
		
	}
	else {
	    //if we are being serviced, then wait here to avoid trekking that will take longer to return.
	    //will this cause a traffic jam to the next miner waiting to mine? check and see
	    if(!creep.memory.inService) {
	        var roomSpawn;
	        //loop through the spawns, and find one in the current room. Otherwise, just use the last spawn looked at
	        for(var spawnName in Game.spawns){
	            roomSpawn = Game.spawns[spawnName];
	            if (creep.room == roomSpawn.room) {
	                break;
	            }    
	        }
	        
	        
	        var creepRoles = creepsByRole();
	        try {
	            if(creepRoles['harvestTender'].length > 0) {
	                console.log('A harvest tender is here but not servicing us. Just drop energy and keep mining');
	                creep.dropEnergy(creep.carry.energy);
	                return;
	            }
	        } catch(e ) {
	            console.log(e);
	        }
	        creep.say("H-R");
    		let status = creep.moveTo(roomSpawn);
    		//if we get blocked
    		if(status != OK) {
    		    //console.log("attempting blocked move undo");
    		    let direction = Math.floor((Math.random() * 8));
	            creep.move(direction);
    		}
    		creep.transfer(roomSpawn, RESOURCE_ENERGY);
    	    creep.memory.mineSource = null;
	    } else {
	        if(Game.creeps[creep.memory.servicedBy]) {
	            if( Game.creeps[creep.memory.servicedBy].memory.target != creep.name) {
	                console.log("waiting on harvester " + creep.memory.servicedBy + "who is servicing" + Game.creeps[creep.memory.servicedBy].memory.target);
	                creep.memory.inService = false;
	                creep.memory.servicedBy = null;    
	                
	                return;
	            } else {
	                creep.say("W-h" + creep.memory.servicedBy);
	                //once the creep is serviced, the inservice tag should be set to false by the harvest Tender..
	                creep.dropOffAtNearbyLink();
	                
	            }
	        } else {
	            console.log("waiting on dead:"+ creep.memory.servicedBy);    
	            creep.memory.inService = false;
	            creep.memory.servicedBy = null;
	        }
	    }
	}
	
	
	/**
	 * return either the name of the closest safe source to the creep, or a random other safe source name, or null 
	 */
	function findClosestSafeSourceID (creep, sources) {
		
		var closestSource = creep.pos.findClosestByPath(FIND_SOURCES);
	    
	    for( var i in sources ){
	    	if(sources[i] == closestSource){
	    		if(sourceIsDangerous(closestSource) ) {
	    			break;
	    		} else {
	    			return  i;
	    		}
	    	}
	    }
	    for( var i in sources ){
	    	if(!sourceIsDangerous(sources[i]) ) {
    			return i;
    		}
	    }
	    return null;
	}
	
	function sourceIsDangerous(source) {
		var nearestEnemy = source.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
		if(!nearestEnemy){
			return false;
		}
		if(source.pos.inRangeTo(nearestEnemy, 5) ) {
			return true; // return TOO dangerous
		}
		return false;
	}
};