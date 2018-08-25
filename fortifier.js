/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('builder'); // -> 'a thing'
 */
 var harvester = require('harvester');
 //var builder = require('builder');
 module.exports = function (creep) {
     
     var extensions = creep.room.find(FIND_MY_STRUCTURES, {
    		filter: { structureType: STRUCTURE_EXTENSION }
    	});
       
        var creepLevel = Math.floor( extensions.length / 5 );
        if(creepLevel == 0) {
            //creep.memory.role = 'builder';
            //return;
            
        }

	if(creep.carry.energy > 0 && !creep.memory.harvesting) {
		var startCpu = Game.cpu.getUsed();
		
		//var status = fortifySourceRamparts(3);
		var status = -1;
		
		var elapsed = Game.cpu.getUsed() - startCpu;
       //console.log("source rampart fortify took" + elapsed);
		if(status == -3) {
			//creep.say("Wait E");
			//creep.moveTo(Game.flags.Flag2);
		}
		//return; //for some reason everything after here chews CPU, especially when the fortify location is not safe.
		if(status == 0) {
			return;
		}
		
		   
		/*var buildSites = Game.spawns.Spawn1.room.find(FIND_MY_STRUCTURES, {
            //filter: { structureType: STRUCTURE_CONTROLLER }
			filter: function(object) {
		        return object.hits < 2000 && (object.hits < (object.hitsMax * .6));
		    }
        });
        if(!buildSites || buildSites.length == 0) {
            buildSites = Game.spawns.Spawn1.room.find(FIND_MY_STRUCTURES, {
            //filter: { structureType: STRUCTURE_CONTROLLER }
        	    filter: function(object) {
        		    return object.hits < 25000 && (object.hits < object.hitsMax * .6);
        		}
            }); 
        }*/
        
        var lowestSite = getLowestEnergySite(creep);
        
        //this will onlky happen while energy > 0
        
        if(creep.memory.fortifySiteId ) {
            
            //if we already have a site ID, build it, as long as we don't have any new sites, or the site we are working on is new    
            creep.memory.fortifySiteId = confirmFortifySite(creep.memory.fortifySiteId, lowestSite.id);
            
            var structure = Game.getObjectById(creep.memory.fortifySiteId );
            creep.moveTo(structure);
            creep.repair(structure);
            if(structure.hits == structure.hitsMax){
                creep.memory.fortifySiteId = null;
            }
            return;
        }
        
		if(!lowestSite) {
		    creep.memory.fortifySiteId = null;
		    creep.say("idle");
		    return;
		}
		creep.say("f-B");
		creep.memory.fortifySiteId = lowestSite.id;
		creep.moveTo(lowestSite);
		creep.repair(lowestSite);
		if(lowestSite.hits == lowestSite.hitsMax){
			creep.memory.fortifySiteId = null;
		}
		return;
		
	}
	else {
	    //once we run out of energy, clear the site we are looking at so the new lowest site can be found and worked on
	    creep.memory.fortifySiteId = null;
		//creep.moveTo(Game.spawns.Spawn1);
		//Game.spawns.Spawn1.transferEnergy(creep);
		 if(!creep.memory.inService) {
		     creep.memory.harvesting = true;
		     harvester(creep);
		     if(creep.carry.energy == creep.carryCapacity){
		         creep.memory.harvesting = false;    
		     }
		     
	    } else {
	        if(Game.creeps[creep.memory.servicedBy]) {
	            creep.say("wait srv");
	        } else {
	            console.log("waiting on dead:"+ creep.memory.servicedBy);    
	            creep.memory.inService = false;
	            creep.memory.servicedBy = null;
	        }
	    }
	}
	
	function confirmFortifySite(currentSiteId, lowestSiteId){
	    //easy case
	    if(currentSiteId == lowestSiteId) {
	        return currentSiteId;
	    }
	    var currentStructure = Game.getObjectById(currentSiteId );
	    //make sure what we're looking for hasn't gone away...
	    if(currentStructure == null) {
	        return lowestSiteId;
	    }
	    var lowestStructure  = Game.getObjectById(lowestSiteId );
	    
	    //The current thing we are working on is in dire need.. don't interrupt
	    if(currentStructure.hits < 2000) {
	        return currentSiteId;
	    }
	    
	    // Only pre-empt a current target for new stuff or truly dying stuff
	    // otherwise the tick timeout for ramparts might take it away
	    // as a site that can be helped at all..
	    if(lowestStructure.hits < 1000) {
	        return lowestSiteId;
	    }
	    
	    return currentSiteId;
	}
	
	function getLowestEnergySite(creep){
	    var    buildSites = creep.room.find(FIND_STRUCTURES, {
            
        	    filter: function(object) {
        		    return (object.hits < object.hitsMax * .6);
        		    //return object.hits < 50000 && (object.hits < object.hitsMax * .6);
        		}
            }); 
        
		
        var lowestSite;
		for(var i in buildSites) {
			var site = buildSites[i];
			if(!lowestSite) {
				lowestSite = site;
				continue;
			}
			//taken out..only sites with under 60% are here from the find.
			//ignore stuff above 80% health so that every time a road tick drops we dont fous on that
			if(site.hits > site.hitsMax*.8){
		        continue;
		    }
			
			//roads will always take precedent?	
			if (lowestSite.pos.x == creep.pos.x && lowestSite.pos.y == creep.pos.y){
			    
				if(lowestSite.hits  > site.hits + 5000 ) {
				    console.log('took one 500 lower');
					lowestSite = site;
				}
			} else {
			    if(lowestSite.hits > site.hits){
					lowestSite = site;
				}
			}
		}
		return lowestSite;
		
	}
	
	function fortifySourceRamparts(source) {
		
		var sources = creep.room.find(FIND_SOURCES);
	    
	    //used FIND_MY_STRUTURES here, but it wasn't getting the walls. maybe walls are not "my" structures?
		//same with roads?
		var buildSite = sources[source].pos.findClosestByPath(FIND_STRUCTURES, {
            //filter: { structureType: STRUCTURE_CONTROLLER }
			filter: function(object) {
		        return object.hits < 150000;
		    }
        });
		if(!buildSite) {
			return -3; // no nearby buildsites.
		}
		var nearestEnemy = buildSite.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
		if(!nearestEnemy) {
			creep.say('FS');
			creep.moveTo(buildSite);
			creep.repair(buildSite);
			return 0;
		}
		if(buildSite.pos.inRangeTo(nearestEnemy, 5) ) {
			return -2; // return TOO dangerous
		}
		creep.say('FS');
		console.log("fs buildsite" + buildSite);
		if(!creep.pos.isNearTo(buildSite)) {
			creep.moveTo(buildSite);
		}
		creep.repair(buildSite);
		return 0;
	}
};