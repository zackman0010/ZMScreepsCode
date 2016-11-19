/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.externalbuilder');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    run: function(creep) {
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
			if (creep.memory.target_set) {
				if (creep.memory.target == null) {
					creep.memory.targetSet = false;
					return;
				}
				var current_target = Game.getObjectById(creep.memory.target);
				if (current_target && current_target.progress != undefined) {
					//Only Construction Sites have the 'progress' modifier, this will return false if construction is complete
					if (creep.build(current_target) == ERR_NOT_IN_RANGE) creep.moveTo(current_target);
				} else {
					creep.memory.target = null;
					creep.memory.target_set = false;
				}
			} else {
				var targets = Game.flags["ExternalBuilder"].room.find(FIND_CONSTRUCTION_SITES);
				if (targets.length > 0) {
					var target_object = Game.flags["ExternalBuilder"].pos.findClosestByPath(targets);
					if (target_object == null) return;
					creep.memory.target = target_object.id;
					creep.memory.target_set = true;
				}
			}
	    }
	    else
		{
			//If the creep is not building:
			//Create a variable array of the room's spawns and extensions that have energy
			var targets = Game.rooms[creep.memory.homeroom].find(FIND_STRUCTURES,
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