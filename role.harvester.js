var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
		var sources = creep.room.find(FIND_SOURCES);
		
		if(!creep.memory.collecting && creep.carry.energy == 0) {
            creep.memory.collecting = true;
	    }
	    if(creep.memory.collecting && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.collecting	= false;
	    }
		
	    if(creep.memory.collecting) {
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                    }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            } else {
				if(creep.harvest(sources[0]) != ERR_NOT_IN_RANGE) {
					creep.move(BOTTOM_LEFT);
				}
			}
        }
	}
};

module.exports = roleHarvester;