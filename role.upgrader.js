var roleUpgrader =
{
	//This function is called for each creep with the Upgrader role, if it has stored energy or the spawn is not saving energy.
    run: function(creep)
	{
        if(creep.memory.upgrading && creep.carry.energy == 0)
		{
			//If the creep is upgrading and is out of energy, remove the upgrading flag.
            creep.memory.upgrading = false;
	    }
	    if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity)
		{
			//If the creep is not upgrading and has max energy, set the upgrading flag.
	        creep.memory.upgrading = true;
	    }

	    if(creep.memory.upgrading)
		{
			//If the creep is upgrading:
			//If the creep is out of range of the room controller, move to the controller.
			//If the creep is in range, it upgrades the controller automatically due to the if statement
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE)
			{
                creep.moveTo(creep.room.controller);
            }
        }
        else
		{
			//If the creep is not upgrading:
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

module.exports = roleUpgrader;