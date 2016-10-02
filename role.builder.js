var roleBuilder =
{
	//This function runs for each Creep with the Builder role, if it has stored energy or the spawn is not saving energy.
    run: function(creep)
	{
	    if(creep.memory.building && creep.carry.energy == 0)
		{
			//If the creep is building and has no energy, remove the building flag
            creep.memory.building = false;
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity)
		{
			//If the creep is not building and has full energy, set the building flag
	        creep.memory.building = true;
	    }

	    if(creep.memory.building)
		{
			//If the creep is building:
			//Create a variable array for the construction sites in the room
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
			
            if(targets.length)
			{
				//If there are construction sites:
				//If the creep is out of range of the first site, move it to the site
				//If the creep is in range, it will automatically build due to the if statement
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE)
				{
                    creep.moveTo(targets[0]);
                }
            }
	    }
	    else
		{
			//If the creep is not building:
			//Create a variable array of the room's spawns and extensions that have energy
			var targets = creep.room.find(FIND_STRUCTURES,
			{
				filter: (structure) =>
				{
					return (structure.structureType == STRUCTURE_SPAWN ||
							structure.structureType == STRUCTURE_EXTENSION) && structure.energy > 0;
				}
			});
			
			if (targets.length > 0)
			{
				//If there are targets:
				//If the creep is out of range of the first target, move it to the site
				//If the creep is in range, it will automatically withdraw energy due to the if statement
				if (creep.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
				{
					creep.moveTo(targets[0]);
				}
			}
        }
	}
};

module.exports = roleBuilder;