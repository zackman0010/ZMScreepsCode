var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleExternal = require('role.externalbuilder');
var roomInit = require('room.init');
var spawnDict = require('spawn.dict');

module.exports.loop = function ()
{
	var allylist = ["zackman0010", "SuperNerdMiles"];
	
	//Creates list of rooms we control for room update loop
	var myRooms = [];
	for(var thisRoomind in Game.rooms)
	{
		if(Game.rooms[thisRoomind].controller && Game.rooms[thisRoomind].controller.my) myRooms.push(Game.rooms[thisRoomind]);
	}
	if (!Memory.creeps) {
	    Memory.creeps ={};
	}
	for(var thisRoomind in myRooms)
	{
		//Room update loop -- Runs only in rooms we control, makes sure all variables are properly set up
		var thisRoom = myRooms[thisRoomind];
		//If room has not been initialized, run the room initializer
		if(!thisRoom.memory.initialized1) roomInit.first(thisRoom);
		else if(thisRoom.memory.initialize2) roomInit.second(thisRoom);
		else if(thisRoom.memory.initialized1 && !thisRoom.memory.initialize2)
		{
			//Check for RCL upgrade
			if (thisRoom.memory.RCL < thisRoom.controller.level) {
				thisRoom.memory.RCL = thisRoom.controller.level;
				Game.notify("The RCL in room " + thisRoom.name + " has gone up a level.");
				console.log("The RCL in room " + thisRoom.name + " has gone up a level.")
			} else if (thisRoom.memory.RCL > thisRoom.controller.level) {
				thisRoom.memory.RCL = thisRoom.controller.level;
				Game.notify("The RCL in room " + thisRoom.name + " has downgraded! Check your Upgraders.");
				console.log("The RCL in room " + thisRoom.name + " has downgraded! Check your Upgraders.");
			}
			//Set variable array for all towers in spawn's room
			var towers = thisRoom.find(FIND_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_TOWER)}});
			if (towers.length > 0)
			{
				//For each tower:
				for(var ind in towers)
				{
					//Set variable for individual tower
					var tower = towers[ind];
					
					//Set variable for closest hostile creep
					var creepList = tower.room.find(FIND_CREEPS);
					var hostileList = [];
					for(var creepind in creepList) {
						if (!allylist.includes(creepList[creepind].owner.username)) {
							hostileList.push(creepList[creepind]);
						}
					}
					
					var closestHostile = tower.pos.findClosestByRange(hostileList);
					//Fire at closest creep
					if(closestHostile)
					{
					    if (!thisRoom.memory.alerted) {
					        thisRoom.memory.alerted = true;
					        Game.notify("Another fucking invader has spawned in room " + thisRoom.name);
					    }
						tower.attack(closestHostile);
						continue;
					}
					
					if (thisRoom.memory.alerted) {
					    thisRoom.memory.alerted = false;
					    Game.notify("The invader is dead, but you may want to check the status of your creeps.");
					}
					
					//Set variable array for targets to heal (Ramparts or walls with less than 10,000 health; any other structures with less than max health)
					var targets = tower.room.find(FIND_STRUCTURES,
					{
						filter: (structure) =>
						{
							return ((structure.structureType == STRUCTURE_RAMPART && structure.hits < 10000) ||
									(structure.structureType == STRUCTURE_WALL && structure.hits < 10000) ||
									(structure.structureType == STRUCTURE_ROAD && structure.hits < structure.hitsMax - 300) ||
									(structure.hits < structure.hitsMax && structure.structureType != STRUCTURE_RAMPART && structure.structureType != STRUCTURE_WALL && structure.structureType != STRUCTURE_ROAD))
						}
					});

				    //If tower is sufficiently charged, attempt to repair ramparts and walls further than normal
					if(tower.energy > 750)
					{
					    targets.push(tower.room.find(FIND_STRUCTURES,
                            {
                                filter: (structure) => {
                                    return ((structure.structureType == STRUCTURE_RAMPART && structure.hits < 20000) ||
                                            (structure.structureType == STRUCTURE_WALL && structure.hits < 20000))
                                }
                            }));
					}
					//Repair any targets
					if(targets.length > 0)
					{
						tower.repair(targets[0]);
						continue;
					}
				}
			}

			var currSites = [];
			for(var sites in Game.constructionSites)
			{
			    var site = Game.constructionSites[sites];
			    if(site.room == thisRoom) currSites.push(site);//If construction site is in current room, increment the number of sites within the room.
			    thisRoom.memory.buildSites = currSites.length;
			}
			
			//Set variable array for all Spawns in room
			var spawns = thisRoom.find(FIND_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_SPAWN)}});
			var spawnbusy = [false, false, false]; //Required so that spawn is only given one order per tick
			//Set variable for max energy in room (300 from each spawn, 50 from each extension)
			var totalenergy = thisRoom.energyCapacityAvailable;
			

			//Gets the current creep in the dictionary of creeps
			var current = spawnDict.role(thisRoom, spawnDict.queue(thisRoom));
			if (current) {
				var currentbody = current[0];
				var currentmem = current[2];
				for (var spawnind in spawns) {
					//Check each spawn in the room
					var spawn = spawns[spawnind];
					if (!spawnbusy[spawnind]) {
						//Only try to spawn the creep if the spawn has not been given an order this tick
						var result = spawn.createCreep(currentbody, null, currentmem);
					} else {
						//If the spawn has been given an order this tick, prevent previous order from being overwritten
						var result = ERR_BUSY;
					}
					
					if (result == ERR_NOT_ENOUGH_ENERGY)
					{
						//If there is not enough energy to create a creep, then the entire spawn loop needs to be broken out of
						thisRoom.memory.saving = true;
						break;
					} else if (result == ERR_BUSY) {
						//If the spawn is busy, check the next spawn
						continue;
					} else {
						//If the spawn successfully begins creating the creep, set appropriate variables to reflect this
						thisRoom.memory.saving = false;
						spawnbusy[spawnind] = true; //Spawn has been given command this tick, do not overwrite command
						console.log(spawn.name + " is now creating " + result);
						break;
					}
				}
			}
		}
		else
		{
			console.log("An error has occurred: Rooms not initialized properly.");
			break;
		}
	}
	//Creep Control Loop
	for(var name in Game.creeps)
	{
		//For each creep in existence:
		//Set variable creep for current creep
		var creep = Game.creeps[name];
		var role = creep.memory.role.substring(0, creep.memory.role.length - 1);
		
		if(role == 'harvester')
		{
			//If creep is a Harvester or Big Harvester, run the Harvester role
			roleHarvester.run(creep);
		}
		if(role == 'upgrader' && (creep.memory.upgrading || !creep.room.memory.saving || (creep.room.controller.my && (creep.room.controller.level == 1 || creep.room.controller.ticksToDowngrade < 2000))))
		{
			//If creep is an Upgrader AND the room is not saving OR the creep has stored energy OR the room is level 1 OR the room is about to downgrade, run the Upgrader role
			roleUpgrader.run(creep);
		}
		if(role == 'builder' && (creep.memory.building || !creep.room.memory.saving))
		{
			//If creep is a Builder AND the room is not saving OR the creep has stored energy, run the Builder role
		    roleBuilder.run(creep);
		}
		if(role == 'externalbuilder') {
		    roleExternal.run(creep);
		}
	}
}