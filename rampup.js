
 /*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('rampup'); // -> 'a thing'
 */
 
 module.exports = function () {
     
     //MOVE - 50
     //CARRY - 50
     //WORK-100
     
    var workerBody        = [WORK, CARRY,  MOVE]; //worker sits and fills up waiting for tender 
    var guardBody         = [TOUGH, ATTACK, ATTACK, MOVE];
    var builderBody       = [WORK, WORK, CARRY, MOVE];
    var archerBody        = [TOUGH,  RANGED_ATTACK, MOVE];
    var transfercreepBody = [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
    var healerBody        = [HEAL, MOVE];
    
    //depending on how many extension tanks we have, we can build better bodies..
    
    var workerBody1        = [WORK, WORK,  CARRY, CARRY, CARRY, CARRY, MOVE]; //can work hard, and haul more back to base..
    var builderBody1       = [WORK, WORK,  WORK, CARRY, CARRY, MOVE]; // Can do a lot of work, but needs to be kept supplied
    var transferCreepBody1 = [CARRY, MOVE, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]; // Can move a lot quickly
    var archerBody1        = [TOUGH, TOUGH, MOVE, RANGED_ATTACK, RANGED_ATTACK,  MOVE, MOVE]; // Can quickly move in and attack
    var healerBody1        = [TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, HEAL, MOVE];
    
    //10 extensions.. lvl 3
    var workerBody2        = [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, CARRY, CARRY, CARRY, MOVE]; //can work hard, and haul more back to base..
    var builderBody2       = [WORK, WORK, WORK,  WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]; // Can do a lot of work, but needs to be kept supplied
    var transferCreepBody2 = [CARRY, MOVE, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]; // Can move a lot quickly
    var archerBody2        = [TOUGH, TOUGH, MOVE, RANGED_ATTACK, RANGED_ATTACK,  MOVE, MOVE]; // Can quickly move in and attack
    var healerBody2        = [TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, HEAL, MOVE];
    var sourceGuard        = [TOUGH, TOUGH, TOUGH,TOUGH, TOUGH, TOUGH,TOUGH, TOUGH, TOUGH,RANGED_ATTACK, RANGED_ATTACK,  RANGED_ATTACK, RANGED_ATTACK,  RANGED_ATTACK, RANGED_ATTACK,  MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
     
    var initialBuildOrder = [
      'harvester',
      'harvester',
      'harvester',
      'harvester',
      'harvester',
      'harvester',
      'harvester',
      'upgrader',
      ];

    function bodyForBodyType(bodyType, creepCount, extensionCount) {
    	
    	//todo, determine the leel up code here
    	//if(Game.creeps.length < 8) {
		if(creepCount < 13) {
		   switch(bodyType){
		    case 'harvester':
		        return workerBody;
		   case 'guard':
		     return guardBody;
		   case 'fortifier':
		   case 'upgrader':
		   case 'builder':
		     return builderBody;
		   case 'archer': 
		     return archerBody;
		   case 'transferCreep':
		   case 'harvestTender':
		       return transferCreepBody;
		   case 'healer':
			   return healerBody;
		    case 'sourceGuard':
		       return archerBody;
		   }
    	} else {
    		switch(bodyType){
            case 'harvester':
    	        return workerBody1;
    	   case 'guard':
    	     return guardBody;
    	   case 'fortifier':
    	   case 'upgrader':
    	   case 'builder':
    	     return builderBody1;
    	   case 'archer': 
    	     return archerBody1;
    	   case 'transferCreep':
    	   case 'harvestTender':
    		   return transferCreepBody1;
    	   case 'healer':
			   return healerBody1;
			   case 'sourceGuard':
		       return sourceGuard;
          }
    	}
    }
    
    var creepCount = 0;
    if(Memory.buildOrder == undefined) {
      Memory.buildOrder = 0;
    }
    var currentlyBuilding = Memory.buildOrder;
    var bodyType = null;
    //bodyType = 'upgrader';
    //console.log("running rampup");
    var bodyToBuild = null;//determine the next body to build
    //if(Memory.buildOrder <  initialBuildOrder.length) {
	if(false) {
        console.log('still within length');
        bodyType = initialBuildOrder[currentlyBuilding];
        
    } else {
    	
    	var myRoom = Game.rooms.W5N9;
    	if(!myRoom){
    		console.log('Room not found');
    		return;
    	}
    	var extensions = myRoom.find(FIND_MY_STRUCTURES, {
    		filter: { structureType: STRUCTURE_EXTENSION }
    	});
    	//console.log("found extensions:" + extensions.length);
    	
    	
    	//console.log("finding body type");
    	//
    	var creepsByRole = { };
    	creepsByRole['harvester']     = 0;
    	creepsByRole['upgrader']      = 0;
    	creepsByRole['builder']       = 0;
    	creepsByRole['transferCreep'] = 0;
    	creepsByRole['fortifier']     = 0;
    	creepsByRole['harvestTender'] = 0;
    	creepsByRole['archer']        = 0;
    	creepsByRole['healer']        = 0;
    	
    	var creepLevel = {};
    	creepLevel[0] = {};
    	creepLevel[0]['harvester']     = 3;
    	creepLevel[0]['upgrader']      = 1;
    	creepLevel[0]['builder']       = 1;
    	creepLevel[0]['transferCreep'] = 2;
    	creepLevel[0]['fortifier']     = 0;
    	creepLevel[0]['harvestTender'] = 2;
    	creepLevel[0]['archer']        = 0;
    	creepLevel[0]['healer']        = 0;
    	creepLevel[1] = {};
    	creepLevel[1]['harvester']     = 6;
    	creepLevel[1]['upgrader']      = 1;
    	creepLevel[1]['builder']       = 3;
    	creepLevel[1]['transferCreep'] = 4;
    	creepLevel[1]['fortifier']     = 2;
    	creepLevel[1]['harvestTender'] = 3;
    	creepLevel[1]['archer']        = 2;
    	creepLevel[1]['healer']        = 2;
    	creepLevel[2] = {};
    	creepLevel[2]['harvester']     = 9;
    	creepLevel[2]['upgrader']      = 1;
    	creepLevel[2]['builder']       = 2;
    	creepLevel[2]['transferCreep'] = 6;
    	creepLevel[2]['fortifier']     = 5;
    	creepLevel[2]['harvestTender'] = 6;
    	creepLevel[2]['archer']        = 5;
    	creepLevel[2]['healer']        = 3;
    	
    	
    	function getBodyForBodyType(bodyType, level) {
	    	var creepBody = {};
	    	creepBody[0] = {};
	    	creepBody[0]['harvester']     = [WORK, CARRY, CARRY,  CARRY, MOVE];
	    	creepBody[0]['upgrader']      = [WORK, WORK, CARRY, MOVE];
	    	creepBody[0]['builder']       = [WORK, WORK, CARRY, MOVE];
	    	creepBody[0]['transferCreep'] = [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
	    	creepBody[0]['fortifier']     = creepBody[0]['builder'];
	    	creepBody[0]['harvestTender'] = creepBody[0]['transferCreep'];
	    	creepBody[0]['archer']        = [TOUGH,  RANGED_ATTACK, MOVE];
	    	creepBody[0]['healer']        = [HEAL, MOVE];
	    	creepBody[0]['sourceGuard']   = [RANGED_ATTACK, MOVE];
	    	
	    	creepBody[1] = {};
	    	creepBody[1]['harvester']     = [WORK, WORK,  CARRY, CARRY, CARRY, CARRY, MOVE]; 
	    	creepBody[1]['upgrader']      = [WORK, WORK,  WORK, CARRY, CARRY, MOVE];
	    	creepBody[1]['builder']       = [WORK, WORK,  WORK, CARRY, CARRY, MOVE];
	    	creepBody[1]['transferCreep'] = [CARRY, MOVE, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
	    	creepBody[1]['fortifier']     = creepBody[1]['builder'];
	    	creepBody[1]['harvestTender'] = creepBody[1]['transferCreep'];
	    	creepBody[1]['archer']        = [TOUGH, TOUGH, MOVE, RANGED_ATTACK, RANGED_ATTACK,  MOVE, MOVE];
	    	creepBody[1]['healer']        = [TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, HEAL, MOVE];
	    	creepBody[1]['sourceGuard']   = [RANGED_ATTACK, MOVE,RANGED_ATTACK, MOVE];
	    	
	    	creepBody[2] = {};
	    	creepBody[2]['harvester']     = [WORK, WORK, WORK, WORK,  WORK, CARRY, CARRY, CARRY, MOVE]; 
	    	creepBody[2]['upgrader']      = [WORK, WORK, WORK, WORK,  WORK, CARRY, CARRY, CARRY, MOVE]; 
	    	creepBody[2]['builder']       = [WORK, WORK,  WORK, WORK, MOVE, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE,MOVE];
	    	creepBody[2]['transferCreep'] = [MOVE, MOVE, CARRY, MOVE,CARRY, MOVE,CARRY, MOVE,CARRY, MOVE,CARRY, MOVE, CARRY, MOVE, MOVE, MOVE];
	    	creepBody[2]['fortifier']     = creepBody[2]['builder'];
	    	creepBody[2]['harvestTender'] = creepBody[2]['transferCreep'];
	    	creepBody[2]['archer']        = [TOUGH, TOUGH, TOUGH, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, RANGED_ATTACK,  MOVE, MOVE];
	    	creepBody[2]['healer']        = [TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, HEAL, MOVE, HEAL, MOVE];
	    	creepBody[2]['roomClaimer']   = creepBody[2]['builder'];
	    	creepBody[2]['sourceGuard']   = [RANGED_ATTACK, MOVE,RANGED_ATTACK, MOVE,RANGED_ATTACK, MOVE];
	    	
	    	creepBody[3] = {};
	    	creepBody[3]['harvester']     = [WORK, WORK, WORK, WORK, WORK,  WORK, CARRY, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE]; 
	    	creepBody[3]['upgrader']      = [WORK, WORK, WORK, WORK,  WORK, CARRY, WORK,  WORK, CARRY, CARRY, CARRY, MOVE]; 
	    	creepBody[3]['builder']       = [WORK, WORK,  WORK, WORK, WORK, WORK, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE,MOVE];
	    	creepBody[3]['transferCreep'] = [MOVE, MOVE, CARRY, MOVE,CARRY, MOVE,CARRY, MOVE,CARRY, MOVE,CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, MOVE, MOVE];
	    	creepBody[3]['fortifier']     = creepBody[3]['builder'];
	    	creepBody[3]['harvestTender'] = creepBody[3]['transferCreep'];
	    	creepBody[3]['archer']        = [TOUGH, TOUGH, TOUGH, TOUGH, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, RANGED_ATTACK,  MOVE, MOVE];
	    	creepBody[3]['healer']        = [TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, HEAL, MOVE, HEAL, MOVE];
	    	//creepBody[3]['sourceGuard']   = creepBody[3]['archer'];
	    	creepBody[3]['roomClaimer']   = [WORK, WORK,  WORK, WORK, WORK, MOVE, MOVE , MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
	    	creepBody[3]['sourceGuard']   = [RANGED_ATTACK, MOVE,RANGED_ATTACK, MOVE,RANGED_ATTACK, MOVE,RANGED_ATTACK, MOVE];
	    	
	    	creepBody[4] = {};
	    	creepBody[4]['harvester']     = [WORK, WORK, WORK, WORK, WORK,  WORK, CARRY, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE]; 
	    	creepBody[4]['upgrader']      = [WORK, WORK, WORK, WORK,  WORK, CARRY, WORK,  WORK, CARRY, CARRY, CARRY, MOVE]; 
	    	creepBody[4]['builder']       = [WORK, WORK,  WORK, WORK, WORK, WORK, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE,MOVE];
	    	creepBody[4]['transferCreep'] = [MOVE, MOVE, CARRY, MOVE,CARRY, MOVE,CARRY, MOVE,CARRY, MOVE,CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, MOVE, MOVE];
	    	creepBody[4]['fortifier']     = creepBody[3]['builder'];
	    	creepBody[4]['harvestTender'] = creepBody[3]['transferCreep'];
	    	creepBody[4]['archer']        = [TOUGH, TOUGH, TOUGH, TOUGH, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, RANGED_ATTACK,  MOVE, MOVE];
	    	creepBody[4]['healer']        = [TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, HEAL, MOVE, HEAL, MOVE];
	    	creepBody[4]['sourceGuard']   = [RANGED_ATTACK, MOVE,RANGED_ATTACK, MOVE,RANGED_ATTACK, MOVE,RANGED_ATTACK, MOVE,RANGED_ATTACK, MOVE];
	    	creepBody[4]['roomClaimer']   = [WORK, WORK,  WORK, WORK, WORK, MOVE, MOVE , MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];;
	    	
	    	if(creepBody[level]) {
	    		if( creepBody[level][bodyType ]) {
	    			return creepBody[level][bodyType];
	    		};
	    	}
	    	return null;
    	}
    	
    	
    	
    	var creep = null;
    	
    	//index the creeps by role
    	for(var name in Game.creeps) {
    		creep = Game.creeps[name];
    		if(creep.room != Game.spawns.Spawn1.room){
			    continue;
			}
    		
    		//console.log("saw creep " + creep.memory.role);
    		creepsByRole[creep.memory.role]++;
    		
    		creepCount++;
    	}
    	
    	//limit to 15 creeps for now
    	if(creepCount > 50) {
    		return;
    	}
    	//console.log("getting body time for size" + creepCount);
    	
    	//this block seemed to work out well for uilding out level 1 storage
    	//double check and make sure that we have transfer creeps to make the bigger size bodies though
    	//bodyType = 'harvester';
    	
    	if(creepCount  < 9 || creepsByRole['transferCreep'] < 2) {
		//if(true) {
	    	if(creepsByRole['harvester'] < 3) {
	    		bodyType = 'harvester';
	    	} else if (creepsByRole['harvestTender'] < 2) {
        		bodyType = 'harvestTender';
        	}  else if (creepsByRole['upgrader'] < 1) {
	    		bodyType = 'upgrader';
	    	} else if (creepsByRole['builder'] < 1) {
	    		bodyType = 'builder';
	    	} else if (creepsByRole['transferCreep'] < 2) {
	    		bodyType = 'transferCreep';
	    	} else  {
        		bodyType = 'sourceGuard';
        	}
    	} else if(creepCount  < 25 || creepsByRole['transferCreep'] < 4){
    		if(creepsByRole['sourceGuard'] < 1) {
        		bodyType = 'sourceGuard';
        	}if(creepsByRole['harvester'] < 6) {
        		bodyType = 'harvester';
        	} else if (creepsByRole['harvestTender'] < 4) {
        		bodyType = 'harvestTender';
        	} else if (creepsByRole['upgrader'] < 1) {
        		bodyType = 'upgrader';
        	} else if (creepsByRole['builder'] < 1) {
        		bodyType = 'builder';
        	} else if (creepsByRole['transferCreep'] < 5) {
        		bodyType = 'transferCreep';
        	} else if (creepsByRole['fortifier'] < 1) {
        		bodyType = 'fortifier';
        	} else if (creepsByRole['healer'] < 2) {
        		bodyType = 'healer';
        	} else if (creepsByRole['roomClaimer'] < 2) {
        		bodyType = 'roomClaimer';
        	}else {
        		bodyType = 'sourceGuard';
        	}
    	} else if(creepCount  < 59 || creepsByRole['transferCreep'] < 6){
    		if (creepsByRole['healer'] < 2) {
        		bodyType = 'healer';
        	} if(creepsByRole['sourceGuard'] < 3) {
        		bodyType = 'sourceGuard';
        	}  else if(creepsByRole['harvester'] < 9) {
        		bodyType = 'harvester';
        	} else if (creepsByRole['harvestTender'] < 6) {
        		bodyType = 'harvestTender';
        	} else if (creepsByRole['upgrader'] < 1) {
        		bodyType = 'upgrader';
        	} else if (creepsByRole['builder'] < 2) {
        		bodyType = 'builder';
        	} else if (creepsByRole['transferCreep'] < 6) {
        		bodyType = 'transferCreep';
        	} else if (creepsByRole['fortifier'] < 2) {
        		bodyType = 'fortifier';
        	}else if (creepsByRole['roomClaimer'] < 4) {
        		bodyType = 'roomClaimer';
        	}else  {
        		bodyType = 'sourceGuard';
        	}
    	} else {
    		bodyType = 'sourceGuard';
    	}
    	
	
    }
    
    if(!bodyType) {
        console.log("Couldn't find a body type to build" + creepCount);
    	return;
    }
    //console.log("building a" + bodyType);
    var creepLevel = Math.floor( extensions.length / 5 );
    if(creepLevel > 4) {
        creepLevel = 4;
        
    }
    
    //make sure we aren't trying to create big haresters if we are potentially low on energy. 
    if (creepsByRole['harvester'] <= 2 || (creepsByRole['transferCreep'] <= 1 )) {
    	creepLevel = 0;
    }
    //creepLevel = 2; bodyType = 'transferCreep';
    //creepLevel = 2; 
    //bodyType = 'harvestTender';
    //bodyType = 'transferCreep';
    //bodyType = 'healer';
    //bodyType = 'roomClaimer';
    createDefinedBody(bodyType, creepCount, creepLevel);
    
    function createDefinedBody( bodyType, creepCount, creepLevel ) {
    	
    	//if we're already creating something don't waste any more CPU thinking.
    	if(Game.spawns.Spawn1.spawning) {
	    	  return;
	    }
    	//bodyToBuild = bodyForBodyType(bodyType, creepCount);
    	bodyToBuild = getBodyForBodyType(bodyType, creepLevel);
    	//console.log("level = " + level);
        var canCreate = Game.spawns.Spawn1.canCreateCreep(bodyToBuild) ;
     
        if( canCreate != OK ) {
            //console.log("can't create " +bodyType + "at level" + creepLevel +  canCreate);
        } else{
	      
		  console.log("currently going to build item: " + bodyType + Memory.buildOrder + "count" + creepCount);
		  Memory.buildOrder++;
		  var workerName = bodyType + "" + Memory.buildOrder;
		  console.log(workerName);
          var success = Game.spawns.Spawn1.createCreep(bodyToBuild, workerName );
          Memory.creeps[workerName].role =  bodyType;
	  
        }
    }
 };
 
