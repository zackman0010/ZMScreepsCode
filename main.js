var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var respawner = require('respawner');

module.exports.loop = function ()
{	
	//Set variable for used spawner
	//Miles note: This'll need to be changed when one or both of us starts using multiple spawns, probably "for(var spawn in Game.spawns)"
	var spawn = Game.spawns['Spawn1'];
	
	//Set variable array for all towers in spawn's room
	var towers = spawn.room.find(FIND_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_TOWER)}});
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
	
	//Set variable array for all Extensions in room
	var extensions = spawn.room.find(FIND_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_EXTENSION)}});
	//Set variable for max energy in room (300 from spawn, 50 from each extension)
	var totalenergy = 300 + (50 * extensions.length);
	
	if (spawn.spawning == null) {
		for(var i = 1; i <= respawner.length; i++) {
			var current = respawner[i.toString()];
			if (!Game.creeps[current.name]) {
				if (totalenergy >= current.minenergy && totalenergy < current.maxenergy) {
					if (spawn.createCreep(current.body, current.name, {role: current.type}) == ERR_NOT_ENOUGH_ENERGY) {
						spawn.memory.saving = true;
					}
					break;
				}
			}
		}
	} else {
		spawn.memory.saving = false;
	}

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
        if(creep.memory.role == 'upgrader' && (!spawn.memory.saving || creep.energy > 0))
		{
			//If creep is an Upgrader AND the spawn is not saving OR the creep has stored energy, run the Upgrader role
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder' && (!spawn.memory.saving || creep.energy > 0))
		{
			//If creep is a Builder AND the spawn is not saving OR the creep has stored energy, run the Builder role
            roleBuilder.run(creep);
        }
    }
}