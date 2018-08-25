"use strict";

require('StructureSpawnPrototype');
var rampup = require('rampup');
var rampup2 = require('rampup2');
var rampup3 = require('rampup3');

var aatest = require('aatest');


//let p = new aatest();
//p.test();

Creep.prototype.mysay = function(message) {
    this.say(message);
}

Creep.prototype.isOnRampart = function () {
    let onStructures = this.pos.lookFor('structure');
    for(let structureId in onStructures) {
        let curStruct = onStructures[structureId];
        if(curStruct.structureType == STRUCTURE_RAMPART) {
            return true;
        }
    }
    return false;
}

//careful when using this, as ramparts typically are chokepoints, and you could block traversal of
// the chokepoint
Creep.prototype.moveToNearbyRampart = function() {
    if(!this.isOnRampart()) {
        console.log("moving creep to safe position");
	    let safeRampart = this.room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_RAMPART }
        });
    
        this.moveTo(safeRampart[0]);
    }
}

Creep.prototype.dropOffAtNearbyLink = function() {
    
    let nearbyStructures = this.pos.findInRange(FIND_MY_STRUCTURES, 6);
    let moveToStructure = null;
    for(let structureName in nearbyStructures) {
        let nearStructure = nearbyStructures[structureName];
        if(nearStructure.structureType == STRUCTURE_LINK) {
            moveToStructure = nearStructure;
            break;
        }
    }
    if(moveToStructure != null && moveToStructure.energy != moveToStructure.energyCapacity ) {
        this.moveTo(moveToStructure);
        this.transferEnergy(moveToStructure);
        return true;
    }
    return false;
	
}
Creep.prototype.restoreOldRole = function () {
    //console.log('restoring old ' + this.memory.oldRole + ' role for ' + this);
    if(this.memory.oldRole && this.memory.oldRole != '' ) {
        console.log(this +'returning to old role as' + this.memory.oldRole);
        this.memory.role = this.memory.oldRole;
        this.memory.oldRole = '';
    }
}

Room.prototype.checkForHostiles = function () {
    let hostiles = this.find(FIND_HOSTILE_CREEPS);
    if(hostiles && hostiles.length > 0) {
        console.log("hostiles found" + hostiles.length);
        var allKeepers = true;
        for(let hostile in hostiles)
        {
             console.log("Hostile owner is " + hostiles[hostile].owner.username);
            if(hostiles[hostile].owner.username != "Source Keeper") {
               
                allKeepers = false;
            }
        } 
        return !allKeepers;
    }
    return false;
}

Room.prototype.hasConstructionSites = function() {
    let sites = this.find(FIND_CONSTRUCTION_SITES);
    return sites && sites.length > 0;
}

Room.prototype.getCreepLevel = function () {
    let extensions = this.find(FIND_MY_STRUCTURES, {
    		filter: { structureType: STRUCTURE_EXTENSION }
    	});
       
    let creepLevel = Math.floor( extensions.length / 5 );
    return creepLevel;
}

Room.prototype.getStorage = function () {
    let storage = this.find(FIND_MY_STRUCTURES, {
        filter: { structureType: STRUCTURE_STORAGE }
    });
    return storage[0];
}
Room.prototype.hasStorage = function() {
    let storage = this.find(FIND_MY_STRUCTURES, {
        filter: { structureType: STRUCTURE_STORAGE }
    });
    return storage.length > 0;
}
Room.prototype.getFirstSpawn = function () {
    let roomSpawns = this.find(FIND_MY_STRUCTURES, {
        filter: { structureType: STRUCTURE_SPAWN }
    });
    return roomSpawns[0];
}
/**
 * Typically, we will place a link near the spawn to transfer energy from remote locations back near the spawn where 
 * transfer creeps can pick it up. This method will get a spawn link that is within a range of 5 of the first room spawn
 */
Room.prototype.getSpawnLink = function() {
    let spawn = this.getFirstSpawn();
    let nearbyLinks = spawn.pos.findInRange(FIND_MY_STRUCTURES, 5, {
        filter: function(object) {
            return object.structureType == STRUCTURE_LINK;
        }
    });
    return nearbyLinks[0]; // could be null
    
}

Room.prototype.getLinks = function() {
    let roomLinks = this.find(FIND_MY_STRUCTURES,  {
        filter: function(object) {
            return object.structureType == STRUCTURE_LINK;
        }
    });
    return roomLinks;
}

Room.prototype.hasEnergySources = function () {
    let sources = this.find(FIND_SOURCES);
    if(sources.length > 0) {
        return true;
    }
    return false;
}

Room.prototype.hasHostiles = function () {
    let hostiles = this.find(FIND_HOSTILE_CREEPS);
    if(hostiles.length > 0) {
        return true;
    }
    return false;
}

class MasterControl {
    constructor(game){
        this.game = game;
    }
    
    /**
     * Find an energySource for the creep to go harvest from that is not in one of our controlled rooms
     * so that we can start to gather more resources..
     */
    findEnergySource(creep) {
        
        let inControlledRoom = false;
        
        for(let spawnName in Game.spawns) {
            if (creep.room == Game.spawns[spawnName].room) {
                inControlledRoom = true;
                break;
            }
        }
        
        //if the creep is not in a room we control, let it harvest.. (what if no energy?)
        if(!inControlledRoom) {
            
            //make sure there is energy and there are no enemies
            
            if(creep.room.hasEnergySources() && !creep.room.hasHostiles() ) {
                //console.log("creep was not in a controlled room")
                return null;
            }
            if(creep.room.hasHostiles()) {
                //send them back to their origin room
                
            }
        }
        
        //1) Do we know of any good safe rooms?
        
        let exitDir = creep.room.find(FIND_EXIT);
        
        //hack.. always go right on this room
        if(creep.memory.originRoom == 'E9N1'){
            exitDir = creep.room.find(FIND_EXIT_RIGHT);
        }
        
        
        //console.log(exitDir);
        return exitDir[0];
        return null;
        let roomExit = creep.pos.findClosest(exitDir[0]);
        
        //creep needs to know where to go, and also where to return to
        
        return roomExit;
        
    }
}

class RoomController{
    constructor(refRoom) {
        this.refRoom = refRoom;
    }
    
    /**
     *  Given a creep, look at its body, and tell it a job that needs to be done
     *  also, keep track of the fact that there is a creep doing that job.
     */
    getJob(creep) {
        
    }
    
    /**
     * Tell the room controller that there is a new job to be done. 
     * Should this also register as a listener to whatever is asking to let it 
     * know when the job is done?
     */
    addJob() {
        
    };
    
    /**
     * The room controller is tracking the jobs that need to be done. It knows what creeps
     * are assigned to what jobs. It can best tell us if we need another creep to do some job.
     * Should this return all the jobs needed? Should they be prioritized somehow?
     * 
     * Given a list of jobs to be done, how do we determine the priority? There is some context 
     * about what workers we already have doing jobs, and expected future demand. This is probably 
     * a factor of the role. For instance, 5 units of work per energy source should probably be 
     * assigned to harvesting.. If there are no enemies in the room, minimal defense is needed.
     * 
     * Also, the room might need low body cost creeps if the room is low on stored energy...
     */
    getCreepNeeded() {
        
    };
}

let masterControl = new MasterControl(Game);

var harvester = require('harvester');

var upgrader = require('upgrader');
var upgrader2 = require('upgrader2');
var builder = require('builder');
var transferCreep = require('transferCreep');
var harvestTender = require('harvestTender');
var fortifier = require('fortifier');
var archer = require('archer');
var healer = require('healer');
var sourceGuard = require('sourceGuard');
var roomClaimer = require('rommClaimer'); //Note typo.. fix
var defender = require('defender');
var remoteHarvester = require('remoteHarvester');
for(var i in Memory.creeps) {
    if(!Game.creeps[i]) {
        delete Memory.creeps[i];
    }
}
var startCpu = Game.cpu.getUsed();
creepActions();
var elapsed = Game.cpu.getUsed() - startCpu;
//console.log("creep loop took" + elapsed);
//do this last in case we are running out of cpu from too many workers

for(let linkRoomName in Game.rooms) {
    let linkRoom = Game.rooms[linkRoomName];
    let spawnLink = null;
    try {
         spawnLink = linkRoom.getSpawnLink();
         console.log("got spawn link");
    } catch(e) {
        //console.log("Exception getting spawn link for :" + linkRoom);
        //console.log(e);
        continue;
    } 
    let roomLinks  = linkRoom.getLinks();
    for (let localLinkKey in roomLinks) {
        if(roomLinks[localLinkKey] == spawnLink) {
            continue;
        }
        roomLinks[localLinkKey].transferEnergy(spawnLink);
    }
}


if(Game.spawns.Spawn5) {
    rampup3(Game.spawns.Spawn5, "R5");
}
if(Game.spawns.Spawn4) {
    rampup3(Game.spawns.Spawn4, "R4");
}
if(Game.spawns.Spawn3) {
    rampup3(Game.spawns.Spawn3, "R3");
}
if(Game.spawns.Spawn2) {
    rampup3(Game.spawns.Spawn2, "R2");
}
if(Game.spawns.Spawn1) {
    //rampup();
    console.log("ramping up Spawn 1");
    rampup3(Game.spawns.Spawn1, "R1");
}

buildOut();

function buildOut(){
    for (let roomName in Game.rooms) {
        let room = Game.rooms[roomName];
        
        // room.createConstructionSite();
        // check if extensions are available to be built
        // build extensions near drop off
        return;
        for (let i = 0; i < 3; i++){
            for (let j = 0; j < 3; j++){
                let status = room.createConstructionSite( Game.spawns['Spawn1'].pos.x + (i - 1)*3, Game.spawns['Spawn1'].pos.y + (j - 1)*3, STRUCTURE_EXTENSION);
                if (status == 0) {
                    console.log(" created extension build site - status" + status);
                   return;
                } else {
                    console.log("failure to create extension - status" + status + "x = " + Game.spawns['Spawn1'].pos.x + i + ", y = " + Game.spawns['Spawn1'].pos.y);
                }
                
            }
        }
    }
}


function creepActions() {
    

    // creep logic goes here
    var maxElapsed = 0;
    var maxCreep = '';

    
	for(var name in Game.creeps) {
	
	    var startCpu = Game.cpu.getUsed();
	    if(Game.cpu.getUsed() / Game.cpuLimit  > .95) {
	        console.log('Early return: Hihgest user Creep '+maxCreep+' has used '+elapsed+' CPU time');
	        return;
	    }
    
    try {
		var creep = Game.creeps[name];
		if (creep.memory.role == 'harvester') {
		    //console.log("running harester");
	        harvester(creep);;
	        //builder(creep);
		} else if (creep.memory.role == 'upgrader') {
	        upgrader(creep);
	        //harvester(creep);
		}else if (creep.memory.role == 'upgrader2') {
	        upgrader2(creep);
	        
	        //harvester(creep);
		}else if (creep.memory.role == 'roomClaimer') {
			roomClaimer(creep);
			
		} else if (creep.memory.role == 'archer') {
			archer(creep);
		} else if (creep.memory.role == 'builder') {
		    console.log("builder");
	        builder(creep);
	        //fortifier(creep);
	        //harvester(creep);
		} else if (creep.memory.role == 'transferCreep') {
	        transferCreep(creep);
		} else  if (creep.memory.role == 'harvestTender') {
			harvestTender(creep);
			//transferCreep(creep);
		} else if (creep.memory.role == 'fortifier') {
			fortifier(creep);
			//builder(creep);
			
		} else if (creep.memory.role == 'healer') {
			healer(creep);
		} else if (creep.memory.role == 'sourceGuard') {
			defender(creep);
			//sourceGuard(creep);
		}else if (creep.memory.role == 'defender') {
			defender(creep);
		}else if (creep.memory.role == 'remoteHarvester') {
			remoteHarvester(creep,masterControl);
		}

		//Memory.creeps[workerName].role =  bodyType;
		var elapsed = Game.cpu.getUsed() - startCpu;
		if (elapsed > maxElapsed) {
		    maxElapsed = elapsed;
		    maxCreep = name;
		}
    } catch (e) {
        console.log(e);
    }
	}
	//console.log('Hihgest user Creep '+maxCreep+' has used '+elapsed+' CPU time');
}
