/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('builder'); // -> 'a thing'
 */
 module.exports = function (creep) {

	if(creep.energy > 0) {
		
		//try, but it might be too dangerous if an enemy is near
		creep.say("B-R")
		var buildSites = creep.room.find(FIND_CONSTRUCTION_SITES, {
            //filter: { structureType: STRUCTURE_CONTROLLER }
        });
        for (var i in buildSites) {
            
            //console.log("heking site:" + i);
            var site = buildSites[i];
            if(siteIsSafe(site)) {
                //console.log("safety good of site" + i);
            	//if(!creep.pos.isNearTo(site)) {
            		creep.moveTo(site);
            	//}
            	creep.say("B-"+site.pos.x +"," + site.pos.y);
        		creep.build(site);
        		return;
            }
        }
		
	} 
		
	
	function siteIsSafe(buildSite) {
	    if(!buildSite) {
	        return false;
	    }
	    var nearestEnemy = buildSite.pos.findClosest(FIND_HOSTILE_CREEPS);
		if(!nearestEnemy) {
			
			return true;
		}
		if(buildSite.pos.inRangeTo(nearestEnemy, 4) ) {
			return false; // return TOO dangerous
		}
		
		return true;
	}
};