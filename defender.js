/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('defender'); // -> 'a thing'
 */
 "use strict";
 module.exports = function (creep) {
	
	
	/*var notKeepers = creep.room.findClosest(FIND_HOSTILE_CREEPS, { 
		filter: function(i) { 
			return i.owner.username != 'Source Keeper' ;
		}
	});*/
	var enemy = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
	//console.log("testaaa");
	//console.log(notKeepers);
	//if(notKeepers || notKeepers.length > 0) {
    if(enemy) {
        
        if (enemy.owner == "Source Keeper") {
            return;
        }
	    creep.mysay("D1");

	    //console.log("test");
	    //var firstAttacker = notKeepers[0];
	    var nearbyRamparts = enemy.pos.findInRange(FIND_MY_STRUCTURES, 3, {
            filter: { structureType: STRUCTURE_RAMPART }
        });
        var moveToTarget = enemy;
        if(nearbyRamparts && nearbyRamparts.length > 0) {
            moveToTarget = nearbyRamparts[0];
        }
        console.log("moving to defend " + moveToTarget);
        creep.moveTo(moveToTarget);
        creep.rangedAttack(enemy);
        creep.attack(enemy);
	} else {
	    //move somewhere "safe"?
	    
	    
	}
 };