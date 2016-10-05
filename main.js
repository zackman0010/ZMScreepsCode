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
			//Set variable array for all towers in spawn's room
			var towers = thisRoom.find(FIND_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_TOWER)}});
			if (towers.length > 0)
			{
				//For each tower:
				for(var ind in towers)
				{
					//Set variable for individual tower
					var tower = towers[ind];
					//Set variable array for targets to heal (Ramparts or walls with less than 10,000 health; any other structures with less than max health)
					var targets = tower.room.find(FIND_STRUCTURES,
					{
						filter: (structure) =>
						{
							return ((structure.structureType == STRUCTURE_RAMPART && structure.hits < 10000) ||
									(structure.structureType == STRUCTURE_WALL && structure.hits < 10000) ||
									(structure.hits < structure.hitsMax && structure.structureType != STRUCTURE_RAMPART && structure.structureType != STRUCTURE_WALL))
						}
					});
					//Repair any targets
					if(targets.length > 0)
					{
						tower.repair(targets[0]);
					}
					
					//Set variable for closest hostile creep
					var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
					//Fire at closest creep
					if(closestHostile)
					{
						tower.attack(closestHostile);
					}
				}
			}
			//Set variable array for all Spawns in room
			var spawns = thisRoom.find(FIND_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_SPAWN)}});
			var spawnbusy = [false, false, false]; //Required so that spawn is only given one order per tick
			//Set variable for max energy in room (300 from each spawn, 50 from each extension)
			var totalenergy = thisRoom.energyCapacityAvailable;
			
			for(var i = 1; i <= respawner.length; i++)
			{
				var current = respawner[i.toString()];
				if (!Game.creeps[current.name])
				{
					var creepmem = {};
					if (!Memory.creeps[current.name]) {
						creepmem = {role: current.type};
					} else {
						creepmem = Memory.creeps[current.name];
					}
					if (totalenergy >= current.minenergy && totalenergy < current.maxenergy)
					{
						var breakloop = false;
						var allbusy = false;
						for (var spawnind in spawns) {
							var spawn = spawns[spawnind];
							if (!spawnbusy[spawnind]) {
								var result = spawn.createCreep(current.body, current.name, creepmem);
							} else {
								var result = ERR_BUSY;
							}
							
							if (result == ERR_NOT_ENOUGH_ENERGY)
							{
								thisRoom.memory.saving = true;
								allbusy = false
								breakloop = true;
								break;
							} else if (result == ERR_BUSY) {
								allbusy = true;
								continue;
							} else {
								thisRoom.memory.saving = false;
								spawnbusy[spawnind] = true; //Spawn has been given command this tick, do not overwrite command
								allbusy = false;
								break;
							}
						}
						if (breakloop || allbusy) {
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
		
		if(creep.memory.role == 'harvester' || creep.memory.role == 'bigharvester')
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