/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('rommClaimer'); // -> 'a thing'
 */
 var harvester = require('harvester');
  module.exports = function (creep) {
      //creep.memory.role = 'upgrader2'; 
     
     //creep.moveTo(Game.flags.claimRoom);
     //return;
     
      if(creep.room != Game.flags.claimRoom.room) {
          creep.say("CLAIM-M!");
          creep.moveTo(Game.flags.claimRoom);
      } else {
          //once in the room, harvest and build the spawn
          //if (!creep.memory.task) {
        //      creep.memory.task = 'harvest';
          //}
        if(creep.name == "claimer1") {
            creep.moveTo(creep.room.controller);
            creep.say("Claimer 1!");
            //creep.upgradeController(creep.room.controller);
            let claimStatus = creep.claimController(creep.room.controller);
            return;
        }
          if(creep.carry.energy == 0){
              creep.memory.task = 'harvest';
          } else if( creep.carry.energy == creep.carryCapacity) {
              creep.memory.task = 'build';
          }
          //if(Game.spawns.Spawn2.energy < Game.spawns.Spawn2.energyCapacity) {
             // harvester(creep);
             // return;
          //}
          if(creep.memory.task == 'harvest') {
             //find the nearest safe source, and harvest it
             
             //this should only execute the harvest portion of the harvester class, as we've effectively shortcut the creep at energy capacity section
             harvester(creep);
             
          } else {
              
              
              //console.log("claimsttatus was : " + claimStatus);
              //return;
                //find the source construction site, and build it
                var buildSites = creep.room.find(FIND_CONSTRUCTION_SITES, {
                //filter: { structureType: STRUCTURE_CONTROLLER }
                }); 
                if(!buildSites || buildSites.length == 0){
                    creep.say("CLAIMing");
                    creep.moveTo(creep.room.controller);
                    creep.upgradeController(creep.room.controller);
                    creep.claimController(creep.room.controller);
                } else {
                    
                    
                    creep.say("B-N");
                    //builder(creep);
                    if(!creep.pos.isNearTo(buildSites[0])) {
                        creep.moveTo(buildSites[0]);
                    }
                    creep.build(buildSites[0]);
                    //creep.upgradeController(creep.room.controller);
                }
              
          }
          
          
      }
      
  }