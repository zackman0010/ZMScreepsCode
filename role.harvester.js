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
	        if(!creep.memory.targetSet)
	        {
				//If the creep is not collecting energy:
				//Find the closest spawn or extension that is not yet full
	            var targets = creep.room.find(FIND_STRUCTURES,
                    {
                        filter: (structure) =>
				        {
                            return ((structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION) && structure.energy < structure.energyCapacity)
				        },
					});
				//If targets are found, find target links and add them to the list
	            if(targets.length > 0)
	            {
	                if(creep.room.memory.sendLink1 != null)
	                {
	                    var sendLinkA = Game.getObjectById(creep.room.memory.sendLink1);
	                    if(sendLinkA.energy < sendLinkA.energyCapacity) targets.push(sendLinkA);
	                }
	                if(creep.room.memory.sendLink2 != null)
	                {
	                    var sendLinkB = Game.getObjectById(creep.room.memory.sendLink2);
	                    if(sendLinkB.energy < sendLinkB.energyCapacity) targets.push(sendLinkB);
	                }
	                if(creep.room.memory.sendLink3 != null)
	                {
	                    var sendLinkC = Game.getObjectById(creep.room.memory.sendLink3);
	                    if(sendLinkC.energy < sendLinkC.energyCapacity) targets.push(sendLinkC);
	                }
	                if(creep.room.memory.sendLink4 != null)
	                {
	                    var sendLinkD = Game.getObjectById(creep.room.memory.sendLink4);
	                    if(sendLinkD.energy < sendLinkD.energyCapacity) targets.push(sendLinkD);
	                }
	                if(creep.room.memory.sendLink5 != null)
	                {
	                    var sendLinkE = Game.getObjectById(creep.room.memory.sendLink5);
	                    if(sendLinkE.energy < sendLinkE.energyCapacity) targets.push(sendLinkE);
	                }
				}
				//If no spawns or extensions need energy, find the closest tower
	            if(targets.length == 0)
	            {
	                targets = creep.room.find(FIND_STRUCTURES,
                        {
                            filter: (structure) =>
                            {
                                return (structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity)
                            },
						});
				}
				
				//Find the closest target among the list of targets and set it as the creep's current target
	            if(targets.length > 0)
	            {
					var target_object = creep.pos.findClosestByPath(targets);
					creep.memory.target = target_object.id;
					creep.memory.targetSet = true;
				}
	        }

	        else
	        {
				//If the target was filled by something else, delete the target
	            if(creep.memory.target == null)
	            {
					creep.memory.targetSet = false;
					return;
				}
				var current_target = Game.getObjectById(creep.memory.target);
				if (current_target == null) return;
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