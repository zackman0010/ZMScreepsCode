var roleHarvester =
{
	//This function is called for each Creep with the Harvester or Big Harvester role.
    run: function(creep)
	{
		//Set variable array for all energy sources in room
		var sources = creep.room.find(FIND_SOURCES);
		var sourceFlags = creep.room.memory.sourceFlags;
		
		if(!creep.memory.collecting && creep.carry.energy == 0)
		{
			//If the creep is not collecting energy and has no energy, set the collecting flag
            creep.memory.collecting = true;
			for(var x = 0;x < sourceFlags.length;x++)
			{
				var source = Game.flags[sourceFlags[x]];
				if(source.memory.availHarvest > source.memory.actHarvest)
				{
					creep.memory.harvestingFrom = x;
					source.memory.actHarvest++;
					break;
				}
			}
			if (creep.memory.harvestingFrom == null) creep.memory.collecting = false;
	    }
	    if(creep.memory.collecting && creep.carry.energy == creep.carryCapacity)
		{
			//If the creep is collecting energy and has full energy, remove the collecting flag
	        creep.memory.collecting	= false;
			var source = Game.flags[sourceFlags[creep.memory.harvestingFrom]];
			creep.memory.harvestingFrom = null;
			source.memory.actHarvest--;
			creep.memory.targetSet = false;
			creep.memory.target = null;
	    }
		
	    if(creep.memory.collecting)
		{
			//If the creep is collecting energy and is not in range of the first energy source, move it there
			//If the creep is in range of the first energy source, it automatically collects thanks to the if statement
            if(creep.harvest(sources[creep.memory.harvestingFrom]) == ERR_NOT_IN_RANGE)
			{
                creep.moveTo(sources[creep.memory.harvestingFrom]);
            }
        }
        else
		{
			if (!creep.memory.targetSet) {
				//If the creep is not collecting energy:
				//Find the closest spawn that is not yet full, then fill it
				var targets = creep.room.find(FIND_STRUCTURES, {filter: (structure) =>
					{return (structure.structureType == STRUCTURE_SPAWN && structure.energy < structure.energyCapacity)},
					}
				);
				//If no spawns are found, find the closest extension and fill it
				if (targets.length == 0) {
					targets = creep.room.find(FIND_STRUCTURES, {filter: (structure) =>
						{return (structure.structureType == STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity)},
						}
					);
				}
				//If no extensions are found, find the closest tower and fill it
				if (targets.length == 0) {
					targets = creep.room.find(FIND_STRUCTURES, {filter: (structure) =>
						{return (structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity)},
						}
					);
				}
				
				//Set the current target of the creep
				if (targets.length > 0) {
					var target_object = creep.pos.findClosestByPath(targets);
					if (target_object == null) return;
					creep.memory.target = target_object.id;
					creep.memory.targetSet = true;
				}
			} else {
				//If the target was filled by something else, delete the target
				if (creep.memory.target == null) {
					creep.memory.targetSet = false;
					return;
				}
				var current_target = Game.getObjectById(creep.memory.target);
				if (current_target == null) return;
				if (current_target.energy == current_target.energyCapacity) {
					creep.memory.target = null;
					creep.memory.targetSet = false;
					return;
				}
				//If there are targets to transfer energy to:
				//If the creep is out of range of the first target, move toward it.
				//If the creep is in range, it automatically transfers thanks to the if statement
				if(creep.transfer(current_target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
				{
					creep.moveTo(current_target);
				}
			}
        }
	}
};

module.exports = roleHarvester;