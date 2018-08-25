/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 * creep should be an instance of a creep with memory role remoteHarvester
 * mcp should be an instance of a master control program we can ask for information (rather than acessing global memory)
 */
 "use strict";
 var harvester = require("harvester");
   module.exports = function (creep, mcp) {
       //0 if we are full, return home, and dump energy until empty
       let creepSpawn =  Game.spawns.Spawn1;
       if(creep.memory.originRoom) {
           //console.log("recalled origin " + creep.memory.originRoom);
           let recalledRoom = Game.rooms[creep.memory.originRoom];
           let testCreepSpawn = recalledRoom.getFirstSpawn();
           //console.log(testCreepSpawn);
           creepSpawn = testCreepSpawn;
       }
       
       if(creep.room == creepSpawn.room ) {
           creep.restoreOldRole();
       }
       
       if((creep.carry.energy == creep.carryCapacity) || (creep.carry.energy > 0 && creep.room == creepSpawn.room )) {
           creep.say("Ret-harv");
           //console.log("test1234567");
           
           //as we are wandering along, if we see a link, drop off at it
           let dropping = creep.dropOffAtNearbyLink();
           if(!dropping) {
               
           
               //refactor to creep.dropoffEnergy(room);
               if(creepSpawn.room.hasStorage()){
                    let roomStorage = creepSpawn.room.getStorage();
                    creep.moveTo(roomStorage);
                    creep.transfer(roomStorage, RESOURCE_ENERGY);
               } else {
                   creep.moveTo(creepSpawn);
                   creep.transfer(creepSpawn, RESOURCE_ENERGY);    
               }
           }
           //console.log("RTB");
           // if the creep was put on temporary remote ahrvest, get them back off it..
           if(creep.carry.energy == 0 ){
               console.log('creep seems to have dropped off energy');
               if(creep.memory.oldRole && creep.memory.oldRole != '' ) {
                   console.log(creep +'returning to old role as' + creep.memory.oldRole);
                   creep.memory.role = creep.memory.oldRole;
                   creep.memory.oldRole = '';
               }
           } else {
               //console.log('creep seems to have not yet dropped off energy');
           }
           return;
       }
       
       if(!creep.memory.originRoom) {
           for (let roomNames in Game.rooms) {
               if(Game.rooms[roomNames] == creep.room){
                   console.log("setting remote harvester origin room to "  + roomNames);
                   creep.memory.originRoom = roomNames;
               }
           }
       }
       
       //1 - ask for a target room
       creep.say("R-Harv");
       let destination =  mcp.findEnergySource(creep);
       //console.log(creep.id + "destination is : " + destination);
       
       if(destination) {
           creep.moveTo(destination);
           return;
       }
       
       harvester(creep);
       
       //2 - move to the target room if not in it
       
       //3 - move to the nearest unmined source in the room
       
       //4 - harvest until full - let tenders take excess energy as needed
       //    watch out for enemies while harvesting..  but if near end of life, just keep harvesting
       
       //5 - head back towards our nearest room - rendevous with a tender if possible
       
       //6 - repeat
   }