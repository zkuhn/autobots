/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('StructureSpawnPrototype');
 * mod.thing == 'a thing'; // true
 */
"use strict";

//build a creep and use the memory convention to assign it a role that it can have run in the game loop
//name it according to its original role, so it is easier to identify what it should be doing
StructureSpawn.prototype.buildRoleCreep = function(nameOfRoom, role, roleCount, bodyArray) {
      let creepName = nameOfRoom + role + roleCount;
      var status = this.createCreep( bodyArray, creepName);
      //console.log("building " + creepName);
      
          Memory.creeps[creepName] = {};
          Memory.creeps[creepName].role = role;
  }
  
  
  /** build order assuming we don't need a reboot
   This is the build and priority maintenance list for the first few levels
   acording to how the creeps behave as of 9/25/2017
   with a few conditionals, this build order will get a colony up and running.
   This is without automated building, all building is by hand. 
   This is a first pass transition from an if-elseif chain with some 
   conditions. Not sure yet how to check on the conditions.
  
  */
  StructureSpawn.prototype.buildOrderCheck = function(creepsByRole) {
      
      var buildOrder = [
          ['harvester'], //small version if reboot
          ['defender'], //if there are enemies
          ['defender'],
          ['defender'],
          ['harvester'],
          ['transferCreep'],//small version if reboot
          ['upgrader'],
          ['harvester'],
          ['harvestTender'],
          ['transferCreep'],
          ['healer'],//if there are enemies
          ['roomClaimer'],//if there is a flag, the one with the claim body
          ['harvestTender'],
          ['harvester'],
          ['fortifier'],
          ['builder'],
          ['transferCreep'],
          
          ['remoteHarvester'],
          ['sourceGuard'],
          ['roomClaimer'],//if there is a flag,
          
          ['harvester'],
          ['fortifier'],
          ['defender'],
          
          ['sourceGuard'],
          ['builder'],
          ['upgrader'],
          
          ['remoteHarvester'],
          ['remoteHarvester'],
          ['remoteHarvester'],
          ['remoteHarvester'],
          
          
          ];
          /*
          var buildOrderCount = [
              'harvester' : 0,
              'defender' : 0,
              'trasferCreep' : 0,
              'upgrader' : 0,
              'harvestTender' : 0,
              'fortifier' : 0,
              'builder' : 0,
              'remoteHarvester' : 0,
              'sourceGuard' : 0,
          ];
          */
          for( var i in buildOrder) {
              
              let role = buildOrder[i][0]; //maye this should be an object instead of an array?
              buildOrderCount[role]++;
              //if there are at least as many of the role as the count seen so far, keep going
              if (buildOrderCount[role] <= creepsByRole[role]) {
                  continue;
              }
              // if there  are not, 
              //  any checks (like enemies not present), say to skip building the unit?
              let checkFunction = buildOrder[i][1];
              if(checkFuntion != null) {
                  //see if we should skip
                  if(checkSkipFunction()) {
                      continue;
                  }
              }
              
               //build a unit of this role 
              var creepBodyArray = this.getBodyForRole(role);
              this.buildRoleCreep(this.room.name, role, buildOrderCount[role], creepBodyArray );
          }
      
  }
  
  StructureSpawn.prototype.getBodyForRole = function (){
      
  }