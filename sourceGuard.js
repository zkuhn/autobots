
var creepsByRole = require('creepsByRole');
module.exports = function (creep) {
	
	var spawn = creep.pos.findInRange(FIND_MY_STRUCTURES, 2, {
		    filter: { structureType: STRUCTURE_SPAWN }
		});
		
		//move right until away from spawn
		if(spawn) {
		    //var moveOk = creep.move(BOTTOM_RIGHT);
		    //if(moveOK != OK) {
		      //  creep.move(TOP_RIGHT);
		    //}
		}
	//
	//return;
	
	var keepers = creep.room.find(FIND_HOSTILE_CREEPS, { 
		filter: function(i) { 
			return i.owner.username == 'Source Keeper' ;
		}
	});
	
	var keeper;
	var bestRampart;
	// find a rampart in range to a keeper
	for(var index in keepers) {
		keeper = keepers[index];
		var ramparts = keeper.pos.findInRange(FIND_MY_STRUCTURES, 3, {
		    filter: { structureType: STRUCTURE_RAMPART }
		});
		for (var rampIndex in ramparts){
			if(ramparts[rampIndex].hits < 3000) {
				continue;
			}
			var creepOnRampart = creep.room.lookForAt('creep', ramparts[rampIndex].pos);
			//since we are looking every tick, make sure we don't go dark because we see ourselves on the rampart
			//but skip picking that best rampart if something else is on it
			if(creepOnRampart && creepOnRampart.id != creep.id) {
			    continue;
			}
			
			if (!bestRampart) {
				//except the really shitty ports
				bestRampart = ramparts[rampIndex];
				continue;
			}
			//pick the rampart with the highest hit points
			// put a buffer to keep from moving around if two are close in hp
			//otherwise each hit, the guy will jump back and forth instead of attacking
			
			if(bestRampart.hits  < ramparts[rampIndex].hits ) {
				//in the special case the best rampart found is where we are, require it
				// to be at least 1500 lower than the other ramparts to initiate a move
				if (bestRampart.pos.x == creep.pos.x && bestRampart.pos.y == creep.pos.y){
					if(bestRampart.hits + 1500  < ramparts[rampIndex].hits ) {
						bestRampart = ramparts[rampIndex];
					}
				} else {
					bestRampart = ramparts[rampIndex];
				}
			}
		}
		// if we found a rampart to attack the keeper from, we can stop looking, otherwise, 
		// look at the next keeper and see if we can attack him from a rampart.
		if(bestRampart){
			break;
		}
	}
	
	
	//if we have a keeper and a best rampart to fight from
	if(keeper && bestRampart) {
		creep.say("D-E");
		creep.moveTo(bestRampart);
		creep.rangedAttack(keeper);
		creep.attack(keeper);
	} else {
	    var creepCounts = creepsByRole();
	    if(creepCounts['sourceGuard'].length >= 6){
	        creep.rangedAttack(keeper);
	        creep.moveTo(keeper);
        	return;
	    }
		creep.say("High Grnd");
		//creep.moveTo(Game.flags.Flag1);
	}
};