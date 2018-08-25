/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('builder'); // -> 'a thing'
 */
 var harvester = require('harvester');
 //if(!fortifier) {
    // var fortifier = require('fortifier');
 //}
 module.exports = function (creep) {

	if(creep.carry.energy > 0 && creep.memory.harvesting != true) {
		
		//try, but it might be too dangerous if an enemy is near
		//var status = buildSourceRamparts(3);
		//if(status == 0) {
		//	return;
		//}
	    //var sources = creep.room.find(FIND_SOURCES);
		//    creep.memory.source = sources[3];
		    
		
		//creep.say("B-R")
		var buildSites = creep.room.find(FIND_CONSTRUCTION_SITES, {
            //filter: { structureType: STRUCTURE_CONTROLLER }
        });
        if(buildSites.length == 0) {
            //fortifier(creep);
            return;
        }
        for (var i in buildSites) {
            
            console.log("heking site:" + i);
            var site = buildSites[i];
            if(siteIsSafe(site)) {
                console.log("safety good of site" + i);
            	if(!creep.pos.isNearTo(site)) {
            		creep.moveTo(site);
            	}
            	creep.say("B-"+site.pos.x +"," + site.pos.y);
        		creep.build(site);
        		return;
            }
        }
		
	} 
	    if(!creep.memory.inService) {
	        
            creep.memory.harvesting = true;
            harvester(creep);
            if(creep.carry.energy == creep.carryCapacity){
                creep.memory.harvesting = false;
                return;
            }
	        
	    } else {
	        
	        //things are getting stuck in service.. this is reaking them free... need to look better at serviing
	        //if(creep.energy > 0) {
	        //    creep.memory.harvesting = false;
	         //   creep.memory.inService = false;
	        //    creep.memory.servicedBy = null;
	        //    return;
	        //}
	        if(Game.creeps[creep.memory.servicedBy]) {
	        	if(siteIsSafe(creep)) {
	        		creep.say("wait srv");
	        		console.log(creep.name + " waiting for service by - " + creep.memory.servicedBy)
	        		return;
	        	} else {
	        		//get out of there if danger shows up
	        		creep.memory.inService = false;
		            creep.memory.servicedBy = null;
		            creep.moveTo(Game.flags.Flag1);
	        	}
	        	
	        } else {
	            console.log("waiting on dead:"+ creep.memory.servicedBy);    
	            creep.memory.inService = false;
	            creep.memory.servicedBy = null;
	        }
	        
	        
	    }
		//creep.moveTo(Game.spawns.Spawn1);
		//Game.spawns.Spawn1.transferEnergy(creep);
	
	
	function buildSourceRamparts(source) {
		
		var sources = creep.room.find(FIND_SOURCES);
	    
	    
		var buildSite = sources[source].pos.findClosestByPath(FIND_CONSTRUCTION_SITES, {
            //filter: { structureType: STRUCTURE_CONTROLLER }
        });
        
        if(siteIsSafe(buildSite) ) {
        	//don't go ON to the build site, just outside of it.
        	if(!creep.pos.isNearTo(buildSite)) {
        		creep.moveTo(buildSite);
        	}
		    creep.build(buildSite);
		    return 0;
        } else {
            return -2;
        }
		
	}
	
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
};