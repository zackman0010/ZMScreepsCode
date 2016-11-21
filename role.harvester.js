var roleHarvester =
{
	//This function is called for each Creep with the Harvester or Big Harvester role.
    run: function(creep, targetlist)
	{
		//Set variable array for all energy sources in room
		var sources = creep.room.find(FIND_SOURCES);
		var sourceFlags = creep.room.memory.sourceFlags;
		
		if(!creep.memory.collecting && creep.carry.energy == 0)
		{
			//If the creep is not collecting energy and has no energy, set the collecting flag
			for(var x = 0;x < sourceFlags.length;x++)
			{
				var source = Game.flags[sourceFlags[x]];
				if(source.memory.availHarvest > source.memory.actHarvest)
				{
				    creep.memory.collecting = true;
					creep.memory.harvestingFrom = x;
					source.memory.actHarvest++;
					break;
				}
			}
			if (creep.memory.harvestingFrom == null) creep.memory.collecting = false;
	    } else if(creep.memory.collecting && creep.carry.energy == creep.carryCapacity)
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
			var error = creep.harvest(sources[creep.memory.harvestingFrom])
            if(error == ERR_NOT_IN_RANGE)
			{
                creep.moveTo(sources[creep.memory.harvestingFrom]);
            } else if (error == ERR_NOT_ENOUGH_RESOURCES) {
                if (creep.carry.energy == 0) {
                    creep.moveTo(sources[creep.memory.harvestingFrom]);
                } else {
                    //If source is empty, disable collecting and turn in any current energy
                    creep.memory.collecting	= false;
        			var source = Game.flags[sourceFlags[creep.memory.harvestingFrom]];
        			creep.memory.harvestingFrom = null;
        			source.memory.actHarvest--;
        			creep.memory.targetSet = false;
        			creep.memory.target = null;
                }
            }
        }
        else
		{
	        if(!creep.memory.targetSet)
	        {
				//Find the closest target among the list of targets and set it as the creep's current target
	            if(targetlist.length > 0)
	            {
					var target_object = creep.pos.findClosestByPath(targetlist);
					if (target_object == null) return;
					creep.memory.target = target_object.id;
					creep.memory.targetSet = true;
				}
	        } else {
				//If the target was filled by something else, delete the target
	            if(creep.memory.target == null)
	            {
					creep.memory.targetSet = false;
					return;
				}
				var current_target = Game.getObjectById(creep.memory.target);
				if (current_target == null) {
				    creep.memory.target = null;
				    creep.memory.targetSet = false;
				    return;
				}
				if(current_target.energy == current_target.energyCapacity)
				{
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