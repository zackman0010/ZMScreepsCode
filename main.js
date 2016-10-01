var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function ()
{
	for(var name in Memory.creeps)
	{
		if (!Game.creeps[name])
		{
			delete Memory.creeps[name];
		}
	}
	
	var spawn = Game.spawns['Spawn1'];
	
	var towers = spawn.room.find(FIND_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_TOWER)}});
	if (towers.length > 0)
	{
		for(var ind in towers)
		{
			var tower = towers[ind];
			var targets = tower.room.find(FIND_STRUCTURES,
			{
				filter: (structure) =>
				{
					return ((structure.structureType == STRUCTURE_RAMPART && structure.hits < 10000) ||
							(structure.structureType == STRUCTURE_WALL && structure.hits < 10000) ||
							(structure.hits < structure.hitsMax && structure.structureType != STRUCTURE_RAMPART && structure.structureType != STRUCTURE_WALL))
					}
				});
			if(targets.length > 0)
			{
				tower.repair(targets[0]);
			}
			var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
			if(closestHostile)
			{
				tower.attack(closestHostile);
			}
		}
	}
	
	var extensions = spawn.room.find(FIND_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_EXTENSION)}});
	var maxenergy = 300 + (50 * extensions.length);
	
	var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
	var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
	var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
	var bigharvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'bigharvester');
	
    if(harvesters.length < 3 && spawn.canCreateCreep([WORK,CARRY,MOVE]) == OK && (maxenergy < 550 || !(bigharvesters.length > 1)))
	{
		//If there are fewer than three harvesters, 1 or fewer big harvesters, ...wait I'm confused. ZACK PLS HELP
        var newName = spawn.createCreep([WORK,CARRY,MOVE], undefined, {role: 'harvester'});
        console.log('Spawning new harvester: ' + newName);
		spawn.memory.saving = false;
    }
	else if(harvesters.length < 3 && spawn.canCreateCreep([WORK,CARRY,MOVE]) == ERR_NOT_ENOUGH_ENERGY && (maxenergy < 550 || !(bigharvesters.length > 1)))
	{
		spawn.memory.saving = true;
	}
	else if(maxenergy >= 550 && bigharvesters.length < 3 && spawn.canCreateCreep([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE]) == OK)
	{
		var newName = spawn.createCreep([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE], undefined, {role: 'bigharvester'});
		console.log('Spawning new big harvester: ' + newName);
		spawn.memory.saving = false;
	}
	else if(maxenergy >= 550 && bigharvesters.length < 3 && spawn.canCreateCreep([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE]))
	{
		spawn.memory.saving = true;
	}
	else if(upgraders.length < 3 && spawn.canCreateCreep([WORK,CARRY,MOVE]) == OK)
	{
        var newName = spawn.createCreep([WORK,CARRY,MOVE], undefined, {role: 'upgrader'});
        console.log('Spawning new upgrader: ' + newName);
		spawn.memory.saving = false;
    }
	else if(upgraders.length < 3 && spawn.canCreateCreep([WORK,CARRY,MOVE]) == ERR_NOT_ENOUGH_ENERGY)
	{
		spawn.memory.saving = true;
	}
	else if(builders.length < 1 && spawn.canCreateCreep([WORK,CARRY,MOVE]) == OK)
	{
        var newName = spawn.createCreep([WORK,CARRY,MOVE], undefined, {role: 'builder'});
        console.log('Spawning new builder: ' + newName);
		spawn.memory.saving = false;
    }
	else if(builders.length < 1 && spawn.canCreateCreep([WORK,CARRY,MOVE]) == ERR_NOT_ENOUGH_ENERGY)
	{
		spawn.memory.saving = true;
	}
	else
	{
	    spawn.memory.saving = false;
	}

    for(var name in Game.creeps)
	{
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester' || creep.memory.role == 'bigharvester')
		{
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader' && (!spawn.memory.saving || creep.energy > 0))
		{
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder' && (!spawn.memory.saving || creep.energy > 0))
		{
            roleBuilder.run(creep);
        }
    }
}