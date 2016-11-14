var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roomInit = require('room.init');
var respawner = require('respawner');

module.exports.loop = function ()
{
	//Creates list of rooms we control for room update loop
	var myRooms = [];
	for(var thisRoomind in Game.rooms)
	{
		if(Game.rooms[thisRoomind].controller.my) myRooms.push(Game.rooms[thisRoomind]);
	}
	if (!Memory.creeps) {
	    Memory.creeps ={};
	}
	for(var thisRoomind in myRooms)
	{
		//Room update loop -- Runs only in rooms we control, makes sure all variables are properly set up
		var thisRoom = myRooms[thisRoomind];
		//If room has not been initialized, run the room initializer
		//Miles note: Modify this once we fix code to run via room instead of a single spawner
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
					var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
					//Fire at closest creep
					if(closestHostile)
					{
						tower.attack(closestHostile);
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
					//Repair any targets
					if(targets.length > 0)
					{
						tower.repair(targets[0]);
					}
				}
			}
			//Set variable array for all Spawns in room
			var spawns = thisRoom.find(FIND_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_SPAWN)}});
			var spawnbusy = [false, false, false]; //Required so that spawn is only given one order per tick
			//Set variable for max energy in room (300 from each spawn, 50 from each extension)
			var totalenergy = thisRoom.energyCapacityAvailable;
			
			//Begins the respawning code
			for(var i = 1; i <= respawner.length; i++)
			{
				//Gets the current creep in the dictionary of creeps
				var current = respawner[i.toString()];
				if (current.role == "builder") {
					var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
					if (targets.length == 0) continue;
				}
				if (!Game.creeps[current.name])
				{
					//If creep does not exist in game (Died or not created yet)
					var creepmem = {};
					//Check to prevent memory from being overwritten
					if (!Memory.creeps[current.name]) {
						creepmem = {role: current.type}; //Memory does not exist, set initial memory
					} else {
						creepmem = Memory.creeps[current.name]; //Memory does exist, do not overwrite memory
						if (creepmem.harvestingFrom != null) Memory.flags[thisRoom.memory.sourceFlags[creepmem.harvestingFrom]].actHarvest--;
						creepmem.harvestingFrom = null;
						creepmem.collecting = false;
					}
					if (totalenergy >= current.minenergy && totalenergy < current.maxenergy)
					{
						//If energy in room is in acceptable range for creep
						var breakloop = false;
						var allbusy = false;
						for (var spawnind in spawns) {
							//Check each spawn in the room
							var spawn = spawns[spawnind];
							if (!spawnbusy[spawnind]) {
								//Only try to spawn the creep if the spawn has not been given an order this tick
								var result = spawn.createCreep(current.body, current.name, creepmem);
							} else {
								//If the spawn has been given an order this tick, prevent previous order from being overwritten
								var result = ERR_BUSY;
							}
							
							if (result == ERR_NOT_ENOUGH_ENERGY)
							{
								//If there is not enough energy to create a creep, then the entire creep loop needs to be broken out of
								thisRoom.memory.saving = true;
								allbusy = false
								breakloop = true;
								break;
							} else if (result == ERR_BUSY) {
								//If the spawn is busy, check the next spawn
								allbusy = true;
								continue;
							} else {
								//If the spawn successfully begins creating the creep, set appropriate variables to relect this
								thisRoom.memory.saving = false;
								spawnbusy[spawnind] = true; //Spawn has been given command this tick, do not overwrite command
								allbusy = false;
								console.log(spawn.name + " is now creating " + current.name);
								break;
							}
						}
						if (breakloop || allbusy) {
							//If not enough energy in the room or if all spawns are busy, break the creep loop
							break;
						}
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
		
		if(creep.memory.role == 'harvester')
		{
			//If creep is a Harvester or Big Harvester, run the Harvester role
			roleHarvester.run(creep);
		}
		if(creep.memory.role == 'upgrader' && (creep.memory.upgrading || !creep.room.memory.saving))
		{
			//If creep is an Upgrader AND the room is not saving OR the creep has stored energy, run the Upgrader role
			roleUpgrader.run(creep);
		}
		if(creep.memory.role == 'builder' && (creep.memory.building || !creep.room.memory.saving))
		{
			//If creep is a Builder AND the room is not saving OR the creep has stored energy, run the Builder role
			roleBuilder.run(creep);
		}
	}
}