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
			if(creep.memory.harvestingFrom == null)
			{
				for(var x = 0;x < sourceFlags.length;x++)
				{
					var source = Game.flags[sourceFlags[x]];
					if(source[x].memory.availHarvest > sourceFlags[x].memory.actHarvest)
					{
						creep.memory.harvestingFrom = x;
						source[x].memory.actHarvest++;
						break;
					}
				}
			}
	    }
	    if(creep.memory.collecting && creep.carry.energy == creep.carryCapacity)
		{
			//If the creep is collecting energy and has full energy, remove the collecting flag
	        creep.memory.collecting	= false;
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
			//If the creep is not collecting energy:
			//Create a variable array of the room's extensions, spawns, and towers (the structures that can hold energy) that are not full
            var targets = creep.room.find(FIND_STRUCTURES,
			{
                    filter: (structure) =>
					{
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                    }
            });
			
            if(targets.length > 0)
			{
				//If there are targets to transfer energy to:
				//If the creep is out of range of the first target, move toward it.
				//If the creep is in range, it automatically transfers thanks to the if statement
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
				{
                    creep.moveTo(targets[0]);
                }
            }
			else
			{
				//If there are no targets to transfer energy to:
				if(creep.harvest(sources[creep.memory.harvestingFrom]) != ERR_NOT_IN_RANGE)
				{
					//If the creep is in range of an energy source, move it away to the bottom-left.
					creep.move(BOTTOM_LEFT);
				}
			}
        }
	}
};

module.exports = roleHarvester;