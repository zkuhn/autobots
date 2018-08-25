/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('rampup2'); // -> 'a thing'
 */
    module.exports = function () {
        
        var creepsByRole  = require('creepsByRole');
        var roomPrefix = "R2";
        var roomSpawn = Game.spawns.Spawn2;
        if(!Game.creeps.harvester1) { //harvester 1 can always reboot us
            roomSpawn.createCreep([WORK,CARRY,MOVE,CARRY,MOVE], 'harvester1');
                Memory.creeps['harvester1'] = {};
                Memory.creeps['harvester1'].role = 'harvester';   
            
        } else if(!Game.creeps.transferCreep1) {
            Game.spawns.Spawn2.createCreep([CARRY,MOVE,CARRY,MOVE,CARRY,MOVE], 'transferCreep1');
                Memory.creeps['transferCreep1'] = {};
                Memory.creeps['transferCreep1'].role = 'transferCreep';   
            
        }else if(!Game.creeps.harvester2) { //harvester 2 is more buff for heavier mining
            Game.spawns.Spawn2.createCreep([WORK,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,WORK, WORK], 'harvester2');
            Memory.creeps['harvester2'] = {};
            Memory.creeps['harvester2'].role = 'harvester';   
            
        }   else if(!Game.creeps.roomClaimer1) {
            Game.spawns.Spawn2.createCreep([MOVE,WORK,WORK,CARRY,MOVE,MOVE,CARRY,WORK], 'roomClaimer1');
                Memory.creeps['roomClaimer1'] = {};
                Memory.creeps['roomClaimer1'].role = 'roomClaimer';   
                //Memory.creeps['roomClaimer1'].mineSource = 3;
            
        }  else if(!Game.creeps.roomClaimer2) {
            Game.spawns.Spawn2.createCreep([MOVE,WORK,WORK,CARRY,MOVE,MOVE,CARRY,WORK], 'roomClaimer2');
                Memory.creeps['roomClaimer2'] = {};
                Memory.creeps['roomClaimer2'].role = 'roomClaimer';   
                //Memory.creeps['roomClaimer2'].mineSource = 3;
            
        }else if(!Game.creeps.fortifier1) {
            Game.spawns.Spawn2.createCreep([WORK,CARRY,MOVE,CARRY,MOVE], 'fortifier1');
                Memory.creeps['fortifier1'] = {};
                Memory.creeps['fortifier1'].role = 'fortifier';   
            
        }else if(!Game.creeps[roomPrefix + 'harvester3']) { //harvester 2 is more buff for heavier mining
            creepName =  roomPrefix + 'harvester3';
            roomSpawn.createCreep([WORK,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,WORK, WORK], creepName);
            Memory.creeps[creepName] = {};
            Memory.creeps[creepName].role = 'harvester';   
            
        }else{
            //arbitrary.. just need a unique name from one line to the next
            var creepCounts = creepsByRole();
            if(creepCounts['roomClaimer'] > 7){
                return;
            }
            Memory.room2Count++;
            var creepName = 'upgrader' + Memory.room2Count;
            var status = Game.spawns.Spawn2.createCreep([CARRY, MOVE, MOVE, WORK,CARRY,MOVE,CARRY,WORK, MOVE] , creepName);
            //console.log("Trying to create room claimer"+ status);
            if(status != OK && status != ERR_NAME_EXISTS){
                Memory.room2Count--;
            } else {
                Memory.creeps[creepName] = {};
                Memory.creeps[creepName].role = 'roomClaimer';
            }
        }
       
  }