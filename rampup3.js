/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('rampup2'); // -> 'a thing'
 */
 "use strict";
    module.exports = function (roomSpawn, roomPrefix) {
        
        //var roomSpawn = Game.spawns.Spawn3;
        //var roomPrefix = 'R3';
        //return;
        var myRoom = roomSpawn.room;
    	if(!myRoom){
    		console.log('Room not found in rampup3 for ' + roomPrefix);
    		return;
    	}
        var extensions = myRoom.find(FIND_MY_STRUCTURES, {
    		filter: { structureType: STRUCTURE_EXTENSION }
    	});
       
        var creepLevel = myRoom.getCreepLevel();
        console.log("room creep level is " + creepLevel);
        if(creepLevel > 4) {
            creepLevel = 4;
        }
         var builderArray = [CARRY, MOVE];
        for (var i = 0; i <= creepLevel ; i++){
            builderArray.push(WORK, CARRY, MOVE); //made the base close, so add more work, less move
            //builderArray.push(WORK, CARRY, WORK);
        }
        
        let upgraderArray = [CARRY, MOVE];
        for (var i = 0; i <=  myRoom.getCreepLevel() ; i++){
            upgraderArray.push(WORK, CARRY, MOVE);
        }
        var transferArray = [ CARRY, MOVE];
        for (var i = 0; i <= creepLevel ; i++){
            transferArray.push( CARRY, MOVE,  CARRY, MOVE);
        }
        var defenderArray = [ TOUGH, MOVE, RANGED_ATTACK];
        for (var i = 1; i <= myRoom.getCreepLevel() ; i++){
            defenderArray.push( TOUGH,RANGED_ATTACK, MOVE);
        }
        var attackerArray = [ TOUGH,ATTACK, MOVE];
        for (var i = 1; i <= myRoom.getCreepLevel() ; i++){
            attackerArray.push( ATTACK, MOVE);
        }
        for (var i = 1; i <= myRoom.getCreepLevel() ; i++){
            attackerArray.push( TOUGH, TOUGH);
        }
        
        var claimerArray = [CARRY, MOVE, CLAIM, WORK];
        
        
        var creepName;
        
        
        let hostilesPresent = myRoom.checkForHostiles();
        let buildSitesPresent = myRoom.hasConstructionSites();
        
        //if(buildSitesPresent) {
        //    console.log('construction sites found');
        //}
        
        //tested.... this format works - 9/24/2017 -- refactor this this.
        //roomSpawn.buildRoleCreep(roomPrefix, 'defender', 1, defenderArray);
        
        if(!Game.creeps[roomPrefix + 'harvester1']) { //harvester 1 can always reboot us
            console.log("can't find harvester 1");
            roomSpawn.buildRoleCreep(roomPrefix, 'harvester', 1, [WORK,CARRY,MOVE,CARRY,MOVE]);
            /*creepName =  roomPrefix + 'harvester1';
            roomSpawn.createCreep([WORK,CARRY,MOVE,CARRY,MOVE], creepName);
                Memory.creeps[creepName] = {};
                Memory.creeps[creepName].role = 'harvester';   
            */
            
        } else if(!Game.creeps[roomPrefix +'defender1'] && hostilesPresent) {
            
            roomSpawn.buildRoleCreep(roomPrefix, 'defender', 1, defenderArray);
            /*
            roomSpawn.createCreep(defenderArray, roomPrefix +'defender1');
                Memory.creeps[roomPrefix +'defender1'] = {};
                Memory.creeps[roomPrefix +'defender1'].role = 'defender';   
                */
            
        } else if(!Game.creeps[roomPrefix +'defender2'] && hostilesPresent) {
            roomSpawn.buildRoleCreep(roomPrefix, 'defender', 2, defenderArray);
            /*roomSpawn.createCreep(defenderArray, roomPrefix +'defender2');
                Memory.creeps[roomPrefix +'defender2'] = {};
                Memory.creeps[roomPrefix +'defender2'].role = 'defender';   
                */
            
        } else if(!Game.creeps[roomPrefix +'defender3'] && hostilesPresent) {
            roomSpawn.buildRoleCreep(roomPrefix, 'defender', 3, defenderArray);
            
        } 
        else if(!Game.creeps[roomPrefix + 'transferCreep1'] ) {
     
            
            roomSpawn.buildRoleCreep(roomPrefix, 'transferCreep', 1, [CARRY,MOVE,CARRY,MOVE,CARRY,MOVE]);
            //creepName =  roomPrefix + 'transferCreep1';
            //roomSpawn.createCreep([CARRY,MOVE,CARRY,MOVE,CARRY,MOVE], creepName);
            //Memory.creeps[creepName] = {};
            //Memory.creeps[creepName].role = '';   
            
        }else if(!Game.creeps[roomPrefix + 'harvester2']) { //harvester 2 is more buff for heavier mining
            roomSpawn.buildRoleCreep(roomPrefix, 'harvester', 2, builderArray);  
            
        } else if(!Game.creeps[roomPrefix + 'upgrader1'] ) {
            creepName =  roomPrefix + 'upgrader1';
            roomSpawn.createCreep(upgraderArray, creepName);
            Memory.creeps[creepName] = {};
            Memory.creeps[creepName].role = 'upgrader';   
            //Memory.creeps['roomClaimer1'].mineSource = 3;
            
        }  else if(!Game.creeps[roomPrefix + 'harvester3']) { //harvester 2 is more buff for heavier mining
            roomSpawn.buildRoleCreep(roomPrefix, 'harvester', 3, builderArray);  
            
        }  else if(!Game.creeps[roomPrefix + 'harvestTender1']) { //harvester tender is more buff for heavier mining transfer
            creepName =  roomPrefix + 'harvestTender1';
            roomSpawn.createCreep(transferArray, creepName);
            Memory.creeps[creepName] = {};
            Memory.creeps[creepName].role = 'harvestTender';   
            
        } else if(!Game.creeps[roomPrefix + 'transferCreep1a']) {
            creepName =  roomPrefix + 'transferCreep1a';
            roomSpawn.createCreep([CARRY,MOVE,CARRY,MOVE,CARRY,MOVE], creepName);
                Memory.creeps[creepName] = {};
                Memory.creeps[creepName].role = 'transferCreep';   
            
        }else if(!Game.creeps[roomPrefix + 'healer1']) { //harvester tender is more buff for heavier mining transfer
            creepName =  roomPrefix + 'healer1';
            roomSpawn.createCreep([HEAL,MOVE], creepName);
            Memory.creeps[creepName] = {};
            Memory.creeps[creepName].role = 'healer';   
            
        } else if(!Game.creeps[roomPrefix + 'roomClaimer1'] && creepLevel >= 2 && Game.flags.claimRoom) {
            creepName =  roomPrefix + 'roomClaimer1';
            
            //create a creep with the claim ody part when the room need controller capture.
            //After that just make a regular builder to not waste the 600
            let claimRoom = Game.flags['claimRoom'].room;
            if(claimRoom) {
                if(claimRoom.controller.owner == ""){
                    let claimerStatus = roomSpawn.createCreep(claimerArray, creepName);
                } else {
                    roomSpawn.createCreep(builderArray, creepName);
                }
            }else {
                for( let flagName in Game.flags){
                    console.log( "flag found - " + flagName);
                }
            }
            //console.log("trying a room claimer - status - " + claimerStatus);
            Memory.creeps[creepName] = {};
            Memory.creeps[creepName].role = 'roomClaimer';   
            //Memory.creeps['roomClaimer1'].mineSource = 3;
            
        }   else if(!Game.creeps[roomPrefix + 'harvestTender2'] && creepLevel > 0) {
            creepName =  roomPrefix + 'harvestTender2';
            roomSpawn.createCreep(transferArray, creepName);
                Memory.creeps[creepName] = {};
                Memory.creeps[creepName].role = 'harvestTender';   
            
        }else if(!Game.creeps[roomPrefix + 'harvester4'] && creepLevel < 6 ) { //harvester 2 is more buff for heavier mining
            creepName =  roomPrefix + 'harvester4';
            roomSpawn.createCreep(builderArray, creepName);
            Memory.creeps[creepName] = {};
            Memory.creeps[creepName].role = 'harvester';   
            
        }else if(!Game.creeps[roomPrefix +'fortifier1']) {
        
            buildAndRememberCreep(roomPrefix +'fortifier1', builderArray, "fortifier", roomSpawn);    
            
        }else if(!Game.creeps[roomPrefix +'builder1'] && buildSitesPresent) {
            
            buildAndRememberCreep(roomPrefix +'builder1', builderArray, "builder", roomSpawn);
            
        }else if(!Game.creeps[roomPrefix + 'transferCreep2'] && creepLevel > 0) {
            
            buildAndRememberCreep(roomPrefix +'transferCreep2', transferArray, "transferCreep", roomSpawn);
      
        }else if(!Game.creeps[roomPrefix +'archer1'] && Game.flags.armyFlag) {
            
            buildAndRememberCreep(roomPrefix +'archer1', defenderArray, "archer", roomSpawn);
            
        }else if(!Game.creeps[roomPrefix + 'remoteHarv1'] ) {
            buildAndRememberCreep(roomPrefix +'remoteHarv1', builderArray, "remoteHarvester", roomSpawn);
            
        }else if(!Game.creeps[roomPrefix +'sourceGuard'] && hostilesPresent) {
           buildAndRememberCreep(roomPrefix +'sourceGuard', defenderArray, "sourceGuard", roomSpawn);
            
        }else if(!Game.creeps[roomPrefix + 'roomClaimer2'] && creepLevel >= 2 && Game.flags.claimRoom) {
            creepName =  roomPrefix + 'roomClaimer2';
            roomSpawn.createCreep(builderArray, creepName);
                Memory.creeps[creepName] = {};
                Memory.creeps[creepName].role = 'roomClaimer';   
                //Memory.creeps['roomClaimer2'].mineSource = 3;
            
        
        }else if(!Game.creeps[roomPrefix + 'harvester5'] && creepLevel < 5) { //harvester 2 is more buff for heavier mining
            
            buildAndRememberCreep(roomPrefix +'harvester5', builderArray, "harvester", roomSpawn);
            
        }else if(!Game.creeps[roomPrefix +'fortifier2']) {
            buildAndRememberCreep(roomPrefix +'fortifier2', builderArray, "fortifier", roomSpawn);
            
        }else if(!Game.creeps[roomPrefix +'defender1'] && hostilesPresent) {
            buildAndRememberCreep(roomPrefix +'defender1', defenderArray, "defender", roomSpawn);
            
        }else if(!Game.creeps[roomPrefix +'sourceGuard2'] && hostilesPresent) {
            
            buildAndRememberCreep(roomPrefix +'sourceGuard2', builderArray, "sourceGuard", roomSpawn);
            
        }else if(!Game.creeps[roomPrefix +'builder2'] && buildSitesPresent) {
            
            buildAndRememberCreep(roomPrefix +'builder2', builderArray, "builder", roomSpawn);
            
        } else if(!Game.creeps[roomPrefix + 'upgrader2'] ) {
            creepName =  roomPrefix + 'upgrader2';
            buildAndRememberCreep(creepName, upgraderArray, "upgrader", roomSpawn);

        }  else if(!Game.creeps[roomPrefix + 'remoteHarv2'] ) {
            creepName =  roomPrefix + 'remoteHarv2';
            buildAndRememberCreep(creepName, builderArray, "remoteHarvester", roomSpawn);
            
        } else if(!Game.creeps[roomPrefix + 'remoteHarv3'] ) {
            creepName =  roomPrefix + 'remoteHarv3';
            buildAndRememberCreep(creepName, builderArray, "remoteHarvester", roomSpawn);
            
        } else if(!Game.creeps[roomPrefix + 'remoteHarv4'] ) {
            creepName =  roomPrefix + 'remoteHarv4';
            buildAndRememberCreep(creepName, builderArray, "remoteHarvester", roomSpawn);
            
        }  else if(!Game.creeps[roomPrefix + 'remoteHarv5'] ) {
            creepName =  roomPrefix + 'remoteHarv5';
            buildAndRememberCreep(creepName, builderArray, "remoteHarvester", roomSpawn);
            
        } 
        
        /*else if(!Game.creeps[roomPrefix + 'harvester6']) { //harvester 2 is more buff for heavier mining
            creepName =  roomPrefix + 'harvester6';
            roomSpawn.createCreep(builderArray, creepName);
            Memory.creeps[creepName] = {};
            Memory.creeps[creepName].role = 'harvester';   
            
        }*/else{
            if(creepLevel >= 1) {
                //return;
                //arbitrary.. just need a unique name from one line to the next
                Memory.room2Count++;
                var creepName = 'roomClaimer' + Memory.room2Count;
                
                var status = roomSpawn.createCreep( builderArray, creepName);
                //console.log("Trying to create room claimer"+ status);
                if(status != OK && status != ERR_NAME_EXISTS){
                    Memory.room2Count--;
                } else {
                    Memory.creeps[creepName] = {};
                    Memory.creeps[creepName].role = 'roomClaimer';
                }
            }
        }
       
  }
  
  function buildAndRememberCreep(creepName, bodyArray, role, roomSpawn) {
      var status = roomSpawn.createCreep( bodyArray, creepName);
      //console.log("building " + creepName);
      
          Memory.creeps[creepName] = {};
          Memory.creeps[creepName].role = role;
  }
  
  
  
  
  
  function hasConstructionSites(room) {
      let sites = room.find(FIND_CONSTRUCTION_SITES);
      return sites && sites.length > 0;
  }