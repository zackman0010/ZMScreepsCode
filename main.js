var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function ()
{
	//Purge memory of deceased Creeps
	for(var name in Memory.creeps)
	{
		if (!Game.creeps[name])
		{
			delete Memory.creeps[name];
		}
	}
	
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
	var maxenergy = 300 + (50 * extensions.length);
	
	//Set variable array for each Creep role
	var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
	var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
	var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
	var bigharvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'bigharvester');
	
    if(harvesters.length < 3 && spawn.canCreateCreep([WORK,CARRY,MOVE]) == OK && (maxenergy < 550 || !(bigharvesters.length > 1)))
	{
		/*
		Requirements to run:
		-Fewer than 3 basic harvesters already exist
		-Spawn has enough energy to create basic harvester
		-Max energy available is less than 550 OR less than 1 big harvester already exist
		Creates a Creep with the Harvester role (1 work module, 1 carry module, 1 move module).
		*/
        var newName = spawn.createCreep([WORK,CARRY,MOVE], undefined, {role: 'harvester'});
        console.log('Spawning new harvester: ' + newName);
		spawn.memory.saving = false;
    }
	else if(harvesters.length < 3 && spawn.canCreateCreep([WORK,CARRY,MOVE]) == ERR_NOT_ENOUGH_ENERGY && (maxenergy < 550 || !(bigharvesters.length > 1)))
	{
		//If previous statement fails due to not having enough energy, set the spawn to save energy
		spawn.memory.saving = true;
	}
	else if(maxenergy >= 550 && bigharvesters.length < 3 && spawn.canCreateCreep([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE]) == OK)
	{
		/*
		Requirements to run:
		-Max energy available is greater than 550
		-Both basic harvester checks failed
		-Fewer than 3 big harvesters already exist
		-Spawn has enough energy to create big harvester
		Creates a Creep with the Big Harvester role (3 work modules, 2 carry modules, 3 move modules).
		*/
		var newName = spawn.createCreep([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE], undefined, {role: 'bigharvester'});
		console.log('Spawning new big harvester: ' + newName);
		spawn.memory.saving = false;
	}
	else if(maxenergy >= 550 && bigharvesters.length < 3 && spawn.canCreateCreep([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE]) == ERR_NOT_ENOUGH_ENERGY)
	{
		//If previous statement fails due to not having enough energy, set the spawn to save energy
		spawn.memory.saving = true;
	}
	else if(upgraders.length < 3 && spawn.canCreateCreep([WORK,CARRY,MOVE]) == OK)
	{
		/*
		Requirements to run:
		-Fewer than 3 Upgraders already exist
		-Spawn has enough energy to create Upgrader
		Creates a Creep with the Upgrader role (1 work module, 1 carry module, 1 move module).
		*/
        var newName = spawn.createCreep([WORK,CARRY,MOVE], undefined, {role: 'upgrader'});
        console.log('Spawning new upgrader: ' + newName);
		spawn.memory.saving = false;
    }
	else if(upgraders.length < 3 && spawn.canCreateCreep([WORK,CARRY,MOVE]) == ERR_NOT_ENOUGH_ENERGY)
	{
		//If previous statement fails due to not having enough energy, set the spawn to save energy
		spawn.memory.saving = true;
	}
	else if(builders.length < 1 && spawn.canCreateCreep([WORK,CARRY,MOVE]) == OK)
	{
		/*
		Requirements to run:
		-Fewer than 1 Builder already exits
		-Spawn has enough energy to create Builder
		Creates a Creep with the Builder role (1 work module, 1 carry module, 1 move module).
		*/
        var newName = spawn.createCreep([WORK,CARRY,MOVE], undefined, {role: 'builder'});
        console.log('Spawning new builder: ' + newName);
		spawn.memory.saving = false;
    }
	else if(builders.length < 1 && spawn.canCreateCreep([WORK,CARRY,MOVE]) == ERR_NOT_ENOUGH_ENERGY)
	{
		//If previous statement fails due to not having enough energy, set the spawn to save energy
		spawn.memory.saving = true;
	}
	else
	{
		//If all previous statements fail (thus, all creeps are spawned), set the spawn to not save energy
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