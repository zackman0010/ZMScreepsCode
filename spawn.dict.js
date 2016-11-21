var spawnDict =
{
    'queue': function(thisRoom)
    {
        //Function run by the dictionary. Main passes in the room being used by this spawner.
        //Create a dictionary from this dictionary using the key of the room's controller level
        var roomDict = this[thisRoom.controller.level.toString()];

        //Miles note: This originally was intended to be stored in thisRoom.memory, although I've completely forgotten why. Consider moving it if necessary.
        var harvesters = _.filter(Game.creeps,(creep) => {return creep.memory.role == 'harvester1' && creep.room.name == thisRoom.name});
        var harvesterCt = harvesters.length;
        var harvester2s = _.filter(Game.creeps,(creep) => {return creep.memory.role == 'harvester2' && creep.room.name == thisRoom.name});
        harvesterCt += harvester2s.length;
        var harvester3s = _.filter(Game.creeps,(creep) => {return creep.memory.role == 'harvester3' && creep.room.name == thisRoom.name});
        harvesterCt += harvester3s.length;
        var harvester4s = _.filter(Game.creeps,(creep) => {return creep.memory.role == 'harvester4' && creep.room.name == thisRoom.name});
        harvesterCt += harvester4s.length;
        var harvester5s = _.filter(Game.creeps,(creep) => {return creep.memory.role == 'harvester5' && creep.room.name == thisRoom.name});
        harvesterCt += harvester5s.length;
        var harvester6s = _.filter(Game.creeps,(creep) => {return creep.memory.role == 'harvester6' && creep.room.name == thisRoom.name});
        harvesterCt += harvester6s.length;
		
		thisRoom.memory.harvesterCt = harvesterCt;

        var upgraders = _.filter(Game.creeps,(creep) => {return creep.memory.role == 'upgrader1' && creep.room.name == thisRoom.name});
        var upgraderCt = upgraders.length;
        var upgrader2s = _.filter(Game.creeps,(creep) => {return creep.memory.role == 'upgrader2' && creep.room.name == thisRoom.name});
        upgraderCt += upgrader2s.length;
        var upgrader3s = _.filter(Game.creeps,(creep) => {return creep.memory.role == 'upgrader3' && creep.room.name == thisRoom.name});
        upgraderCt += upgrader3s.length;
        var upgrader4s = _.filter(Game.creeps,(creep) => {return creep.memory.role == 'upgrader4' && creep.room.name == thisRoom.name});
        upgraderCt += upgrader4s.length;
        var upgrader5s = _.filter(Game.creeps,(creep) => {return creep.memory.role == 'upgrader5' && creep.room.name == thisRoom.name});
        upgraderCt += upgrader5s.length;
        var upgrader6s = _.filter(Game.creeps,(creep) => {return creep.memory.role == 'upgrader6' && creep.room.name == thisRoom.name});
        upgraderCt += upgrader6s.length;

        var builders = _.filter(Game.creeps,(creep) => {return creep.memory.role == 'builder1' && creep.room.name == thisRoom.name});
        var builderCt = builders.length;
        var builder2s = _.filter(Game.creeps,(creep) => {return creep.memory.role == 'builder2' && creep.room.name == thisRoom.name});
        builderCt += builder2s.length;
        var builder3s = _.filter(Game.creeps,(creep) => {return creep.memory.role == 'builder3' && creep.room.name == thisRoom.name});
        builderCt += builder3s.length;
        var builder4s = _.filter(Game.creeps,(creep) => {return creep.memory.role == 'builder4' && creep.room.name == thisRoom.name});
        builderCt += builder4s.length;
        var builder5s = _.filter(Game.creeps,(creep) => {return creep.memory.role == 'builder5' && creep.room.name == thisRoom.name});
        builderCt += builder5s.length;
        var builder6s = _.filter(Game.creeps,(creep) => {return creep.memory.role == 'builder6' && creep.room.name == thisRoom.name});
        builderCt += builder6s.length;

        for(var i = 1;i < Object.keys(roomDict).length;i++)
        {
            var current = roomDict[i.toString()];
            var role = current.type;
            var max = current.qty;
			if (max == 'max') max = thisRoom.memory.totalHarvest;
            var condition1 = this.condList(thisRoom,current.condition1);
            var condition2 = this.condList(thisRoom,current.condition2);
            switch(role)
            {
                case 'harvester1':
                    if(harvesterCt < max && condition1 && condition2) return role;
            		break;
                case 'harvester2':
            	case 'harvester3':
            	case 'harvester4':
            	case 'harvester5':
            	case 'harvester6':
            		if(harvesterCt < max && condition1 && condition2) return role;
            		break;
                case 'upgrader1':
            	case 'upgrader2':
            	case 'upgrader3':
            	case 'upgrader4':
            	case 'upgrader5':
            	case 'upgrader6':
            		if(upgraderCt < max && condition1 && condition2) return role;
            		break;
                case 'builder1':
            	case 'builder2':
            	case 'builder3':
            	case 'builder4':
            	case 'builder5':
            	case 'builder6':
            		if(builderCt < max && condition1 && condition2) return role;
            		break;
            	default:
                    break;
            }
        }
        return null;

    },
    'condList': function(thisRoom,condition)
    {
        //Function run by queue. Queue passes in the room being used by this spawner and a condition.
        //Purpose is to return a specific condition based on the string condition passed in.
        if(condition == 'true') return true;
            //No condition
        else if(condition == 'emergency') return (thisRoom.memory.harvesterCt < 3);//NOTE TO SELF: harvesterCt does not exist yet
            //Emergency conditions -- spawn a regular harvester regardless of normal harvester size
        else if(condition == 'downgrade') return (thisRoom.controller.ticksToDowngrade < 2000);
            //Emergency condition -- spawn an Upgrader to prevent room controller downgrade
        else if(condition == 'etier1') return (thisRoom.energyCapacityAvailable < 550);
            //Energy tier 1 -- spawner cannot create 550-energy Creeps
        else if(condition == 'etier2') return (thisRoom.energyCapacityAvailable >= 550 && thisRoom.energyCapacityAvailable < 800);
        	//Energy tier 2 -- spawner can create 550-energy creeps but not 800-energy creeps
        else if(condition == 'etier3') return (thisRoom.energyCapacityAvailable >= 800 && thisRoom.energyCapacityAvailable < 1300);
        	//Energy tier 3 -- spawner can create 800-energy creeps but not 1300-energy creeps
        else if(condition == 'etier4') return (thisRoom.energyCapacityAvailable >= 1300 && thisRoom.energyCapacityAvailable < 1800);
        	//Energy tier 4 -- spawner can create 1300-energy creeps but not 1800-energy creeps
        else if(condition == 'etier5') return (thisRoom.energyCapacityAvailable >= 1800 && thisRoom.energyCapacityAvailable < 2300);
        	//Energy tier 5 -- spawner can create 1800-energy creeps but not 2300-energy creeps
        else if(condition == 'etier6') return (thisRoom.energyCapacityAvailable >= 2300 && thisRoom.energyCapacityAvailable < 5600);
			//Energy tier 6 -- spawner can create 2300-energy creeps but not 5600-energy creeps
        else if(condition == 'build')
        {
            var damTar = thisRoom.find(FIND_STRUCTURES,
            {
                //Detect all damaged structures (or Ramparts and Walls with less than a desired max HP)
            	filter: (structure) => {
            		return ((structure.structureType == STRUCTURE_RAMPART && structure.hits < 10000) ||
							(structure.structureType == STRUCTURE_WALL && structure.hits < 10000) ||
							(structure.structureType == STRUCTURE_ROAD && structure.hits < structure.hitsMax - 300) ||
							(structure.hits < structure.hitsMax && structure.structureType != STRUCTURE_RAMPART && structure.structureType != STRUCTURE_WALL && structure.structureType != STRUCTURE_ROAD))
            	}
            });
            return (thisRoom.memory.buildSites > 0 || damTar.length > 0);
        }
            //Construction sites or damaged structures are present in room
        else
        {
            console.log("Spawning error has occurred: Condition not found.");
            return false;
        }
    },
    'role': function(thisRoom,type)
    {
        //Function run by spawning code. Takes role determined by queue function and returns an array with the three parts of a creep's constructor.
        switch(type)
        {
            case 'harvester1'://Energy cost: 200 (etier1)
                return [[WORK,CARRY,MOVE],null,{role: 'harvester1'}];
                break;
            case 'harvester2'://Energy cost: 400 (etier2)
                return [[WORK,WORK,CARRY,CARRY,MOVE,MOVE],null,{role: 'harvester2'}];
                break;
            case 'harvester3'://Energy cost: 600 (etier3)
                return [[WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],null,{role: 'harvester3'}];
                break;
        	case 'harvester4'://Energy cost: 800 (etier3)
				return [[WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE],null,{role: 'harvester4'}];
				break;
        	case 'harvester5'://Energy cost: 1000 (etier4)
				return [[WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE],null,{role: 'harvester5'}];
				break;
        	case 'harvester6'://Energy cost: 1200 (etier4)
				return [[WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],null,{role: 'harvester6'}];
				break;
            case 'upgrader1'://Energy cost: 250 (etier1)
			case 'upgrader2':
                return [[WORK,CARRY,MOVE,MOVE],null,{role: 'upgrader1'}];
                break;
            case 'upgrader3'://Energy cost: 500 (etier2)
			case 'upgrader4':
                return [[WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE],null,{role: 'upgrader2'}];
                break;
            case 'upgrader5'://Energy cost: 750 (etier3)
			case 'upgrader6':
                return [[WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],null,{role: 'upgrader3'}];
                break;
            case 'builder1'://Energy cost: 250 (etier1)
			case 'builder2':
                return [[WORK,CARRY,MOVE,MOVE],null,{role: 'builder1'}];
                break;
            case 'builder3'://Energy cost: 500 (etier2)
			case 'builder4':
                return [[WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE],null,{role: 'builder2'}];
                break;
            case 'builder5'://Energy cost: 750 (etier3)
			case 'builder6':
                return [[WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],null,{role: 'builder3'}];
                break;
            default:
                break;
        }
    },
    '1'://RCL 1
    {
        '1'://First priority: 3 Harvesters
        {
            type: 'harvester1',
            qty: 3,
            condition1: 'true',
            condition2: 'true'
        },
        '2'://Second priority: 1 Upgrader (to allow room to reach RCL2 asap)
        {
            type: 'upgrader1',
            qty: 1,
            condition1: 'true',
            condition2: 'true'
        },
        '3'://Third and final priority: Harvesters until maxed or RCL upgrade
        {
            type: 'harvester1',
            qty: 'max',
            condition1: 'true',
            condition2: 'true'
        }
    },
    '2'://RCL 2
    {
        '1'://Emergency Harvester (placed at beginning to avoid Harvester2 cancellation of regular Harvester spawn)
        {
            type: 'harvester1',
            qty: 3,
            condition1: 'emergency',
            condition2: 'true'
        },
        '2'://Emergency Upgrader (failsafe to prevent RCL downgrade)
        {
            type: 'upgrader1',
            qty: 1,
            condition1: 'downgrade',
            condition2: 'true'
        },
        '3'://First main priority: Room qty of Harvesters (if RCL2 extensions not finished)
        {
            type: 'harvester1',
            qty: 'max',
            condition1: 'etier1',
            condition2: 'true'
        },
        '4'://First main priority: Room qty of Harvester2s (if RCL2 extensions finished)
        {
            type: 'harvester2',
            qty: 'max',
            condition1: 'etier2',
            condition2: 'true'
        },
        '5'://Second main priority: Single Builder (to begin construction work ASAP)
        {
            //(Miles note: This is only really a good idea if build code can be modified to start building stuff before spawner deactivates saving)
            type: 'builder1',
            qty: 1,
            condition1: 'build',
            condition2: 'true'
        },
        '6'://Third main priority: Handful of Upgraders (if RCL2 extensions not finished)
        {
            //(Miles note: Argue about exact number later. May want to detect max number of locations that upgraders can upgrade from.)
            type: 'upgrader1',
            qty: 2,
            condition1: 'etier1',
            condition2: 'true'
        },
        '7'://Third main priority: Handful of Upgrader2s (if RCL2 extensions finished)
        {
            type: 'upgrader2',
            qty: 2,
            condition1: 'etier2',
            condition2: 'true'
        },
        '8'://Fourth main priority: Handful of Builders (if RCL2 extensions not finished) (if there are construction sites or repairs needed)
        {
            //(Miles note: Argue about exact number later. Sounds like more than 1 is overkill.)
            type: 'builder1',
            qty: 1,
            condition1: 'build',
            condition2: 'etier1'
        },
        '9'://Fourth main priority: Handful of Builder2s (if RCL2 extensions finished) (if there are construction sites or repairs needed)
        {
            //(Miles note: Argue about exact number later. Sounds like more than 1 is overkill.)
            type: 'builder2',
            qty: 1,
            condition1: 'build',
            condition2: 'etier2'
        }
    },
    '3'://RCL3
    {
        '1'://Emergency Harvester (placed at beginning to avoid Harvester2 cancellation of regular Harvester spawn)
        {
            type: 'harvester1',
            qty: 4,
            condition1: 'emergency',
            condition2: 'true'
        },
        '2'://Emergency Upgrader (failsafe to prevent RCL downgrade)
        {
            type: 'upgrader1',
            qty: 1,
            condition1: 'downgrade',
            condition2: 'true'
        },
        '3'://First main priority: Room qty of Harvesters (if RCL2 extensions somehow not finished)
        {
            type: 'harvester1',
            qty: 'max',
            condition1: 'etier1',
            condition2: 'true'
        },
        '4'://First main priority: Room qty of Harvester2s (if RCL2 extensions finished but not RCL3 extensions)
        {
            type: 'harvester2',
            qty: 'max',
            condition1: 'etier2',
            condition2: 'true'
        },
        '5'://First main priority: Room qty of Harvester3s (if RCL3 extensions finished)
        {
            type: 'harvester3',
            qty: 'max',
            condition1: 'etier3',
            condition2: 'true'
        },
        '6'://Second main priority: Single Builder (to begin construction work ASAP)
        {
            //(Miles note: This is only really a good idea if build code can be modified to start building stuff before spawner deactivates saving)
            type: 'builder1',
            qty: 1,
            condition1: 'build',
            condition2: 'true'
        },
        '7'://Third main priority: Handful of Upgraders (if RCL2 extensions somehow not finished)
        {
            //(Miles note: Argue about exact number later. May want to detect max number of locations that upgraders can upgrade from.)
            type: 'upgrader1',
            qty: 2,
            condition1: 'etier1',
            condition2: 'true'
        },
        '8'://Third main priority: Handful of Upgrader2s (if RCL2 extensions finished but not RCL3 extensions)
        {
            //(Miles note: Argue about exact number later. May want to detect max number of locations that upgraders can upgrade from.)
            type: 'upgrader2',
            qty: 2,
            condition1: 'etier2',
            condition2: 'true'
        },
        '9'://Third main priority: Handful of Upgrader3s (if RCL3 extensions finished)
        {
            //(Miles note: Argue about exact number later. May want to detect max number of locations that upgraders can upgrade from.)
            type: 'upgrader3',
            qty: 2,
            condition1: 'etier3',
            condition2: 'true'
        },
        '10'://Fourth main priority: Handful of Builders (if RCL2 extensions somehow not finished) (if there are construction sites or repairs needed)
        {
            //(Miles note: Argue about exact number later. Sounds like more than 1 is overkill.)
            type: 'builder1',
            qty: 1,
            condition1: 'build',
            condition2: 'etier1'
        },
        '11'://Fourth main priority: Handful of Builder2s (if RCL2 extensions finished but not RCL3 extensions) (if there are construction sites or repairs needed)
        {
            //(Miles note: Argue about exact number later. Sounds like more than 1 is overkill.)
            type: 'builder2',
            qty: 1,
            condition1: 'build',
            condition2: 'etier2'
        },
        '12'://Fourth main priority: Handful of Builder3s (if RCL3 extensions finished) (if there are construction sites or repairs needed)
        {
            //(Miles note: Argue about exact number later. Sounds like more than 1 is overkill.)
            type: 'builder3',
            qty: 1,
            condition1: 'build',
            condition2: 'etier3'
        }
    },
    '4'://RCL4
    {
    	'1'://Emergency Harvester (placed at beginning to avoid Harvester2 cancellation of regular Harvester spawn)
        {
        	type: 'harvester1',
        	qty: 4,
        	condition1: 'emergency',
        	condition2: 'true'
        },
    	'2'://Emergency Upgrader (failsafe to prevent RCL downgrade)
        {
        	type: 'upgrader1',
        	qty: 1,
        	condition1: 'downgrade',
        	condition2: 'true'
        },
    	'3'://First main priority: Room qty of Harvesters (why are RCL2 extensions not finished yet?)
        {
        	type: 'harvester1',
        	qty: 'max',
        	condition1: 'etier1',
        	condition2: 'true'
        },
    	'4'://First main priority: Room qty of Harvester2s (if RCL2 extensions finished but somehow not RCL3 extensions)
        {
        	type: 'harvester2',
        	qty: 'max',
        	condition1: 'etier2',
        	condition2: 'true'
        },
    	'5'://First main priority: Room qty of Harvester3s (if RCL3 extensions finished but not RCL4 extensions)
        {
        	type: 'harvester3',
        	qty: 'max',
        	condition1: 'etier3',
        	condition2: 'true'
        },
    	'6'://First main priority: Room qty of Harvester4s (if RCL4 extensions finished)
        {
        	type: 'harvester4',
        	qty: 'max',
        	condition1: 'etier4',
        	condition2: 'true'
        },
    	'7'://Second main priority: Single Builder (to begin construction work ASAP)
        {
        	//(Miles note: This is only really a good idea if build code can be modified to start building stuff before spawner deactivates saving)
        	type: 'builder1',
        	qty: 1,
        	condition1: 'build',
        	condition2: 'true'
        },
    	'8'://Third main priority: Handful of Upgraders (why are RCL2 extensions not finished yet?)
        {
        	//(Miles note: Argue about exact number later. May want to detect max number of locations that upgraders can upgrade from.)
        	type: 'upgrader1',
        	qty: 2,
        	condition1: 'etier1',
        	condition2: 'true'
        },
    	'9'://Third main priority: Handful of Upgrader2s (if RCL2 extensions finished but somehow not RCL3 extensions)
        {
        	//(Miles note: Argue about exact number later. May want to detect max number of locations that upgraders can upgrade from.)
        	type: 'upgrader2',
        	qty: 2,
        	condition1: 'etier2',
        	condition2: 'true'
        },
    	'10'://Third main priority: Handful of Upgrader3s (if RCL3 extensions finished but not RCL4 extensions)
        {
        	//(Miles note: Argue about exact number later. May want to detect max number of locations that upgraders can upgrade from.)
        	type: 'upgrader3',
        	qty: 2,
        	condition1: 'etier3',
        	condition2: 'true'
        },
    	'11'://Third main priority: Handful of Upgrader4s (if RCL4 extensions finished)
        {
        	//(Miles note: Argue about exact number later. May want to detect max number of locations that upgraders can upgrade from.)
        	type: 'upgrader4',
        	qty: 2,
        	condition1: 'etier4',
        	condition2: 'true'
        },
    	'12'://Fourth main priority: Handful of Builders (why are RCL2 extensions not finished yet?) (if there are construction sites or repairs needed)
        {
        	//(Miles note: Argue about exact number later. Sounds like more than 1 is overkill.)
        	type: 'builder1',
        	qty: 1,
        	condition1: 'build',
        	condition2: 'etier1'
        },
    	'13'://Fourth main priority: Handful of Builder2s (if RCL2 extensions not finished but somehow not RCL3 extensions) (if there are construction sites or repairs needed)
        {
        	//(Miles note: Argue about exact number later. Sounds like more than 1 is overkill.)
        	type: 'builder2',
        	qty: 1,
        	condition1: 'build',
        	condition2: 'etier2'
        },
    	'14'://Fourth main priority: Handful of Builder3s (if RCL3 extensions finished but not RCL4 extensions) (if there are construction sites or repairs needed)
        {
        	//(Miles note: Argue about exact number later. Sounds like more than 1 is overkill.)
        	type: 'builder3',
        	qty: 1,
        	condition1: 'build',
        	condition2: 'etier3'
        },
		'15'://Fourth main priority: Handful of Builder4s (if RCL4 extensions finished) (if there are construction sites or repairs needed)
        {
        	//(Miles note: Argue about exact number later. Sounds like more than 1 is overkill.)
        	type: 'builder4',
        	qty: 1,
        	condition1: 'build',
        	condition2: 'etier4'
        }
    },
    '5'://RCL5
    {
    	'1'://Emergency Harvester (placed at beginning to avoid Harvester2 cancellation of regular Harvester spawn)
        {
        	type: 'harvester1',
        	qty: 5,
        	condition1: 'emergency',
        	condition2: 'true'
        },
    	'2'://Emergency Upgrader (failsafe to prevent RCL downgrade)
        {
        	type: 'upgrader1',
        	qty: 1,
        	condition1: 'downgrade',
        	condition2: 'true'
        },
    	'3'://First main priority: Room qty of Harvesters (what's wrong with you?)
        {
        	type: 'harvester1',
        	qty: 'max',
        	condition1: 'etier1',
        	condition2: 'true'
        },
    	'4'://First main priority: Room qty of Harvester2s (are RCL3 extensions seriously not done yet?)
        {
        	type: 'harvester2',
        	qty: 'max',
        	condition1: 'etier2',
        	condition2: 'true'
        },
    	'5'://First main priority: Room qty of Harvester3s (if RCL3 extensions finished but somehow not RCL4 extensions)
        {
        	type: 'harvester3',
        	qty: 'max',
        	condition1: 'etier3',
        	condition2: 'true'
        },
    	'6'://First main priority: Room qty of Harvester4s (if RCL4 extensions finished but not RCL5 extensions)
        {
        	type: 'harvester4',
        	qty: 'max',
        	condition1: 'etier4',
        	condition2: 'true'
        },
    	'7'://First main priority: Room qty of Harvester5s (if RCL5 extensions finished)
        {
        	type: 'harvester5',
        	qty: 'max',
        	condition1: 'etier5',
        	condition2: 'true'
        },
    	'8'://Second main priority: Single Builder (to begin construction work ASAP)
        {
        	//(Miles note: This is only really a good idea if build code can be modified to start building stuff before spawner deactivates saving)
        	type: 'builder1',
        	qty: 1,
        	condition1: 'build',
        	condition2: 'true'
        },
    	'9'://Third main priority: Handful of Upgraders (what's wrong with you?)
        {
        	//(Miles note: Argue about exact number later. May want to detect max number of locations that upgraders can upgrade from.)
        	type: 'upgrader1',
        	qty: 2,
        	condition1: 'etier1',
        	condition2: 'true'
        },
    	'10'://Third main priority: Handful of Upgrader2s (are RCL3 extensions seriously not done yet?)
        {
        	//(Miles note: Argue about exact number later. May want to detect max number of locations that upgraders can upgrade from.)
        	type: 'upgrader2',
        	qty: 2,
        	condition1: 'etier2',
        	condition2: 'true'
        },
    	'11'://Third main priority: Handful of Upgrader3s (if RCL3 extensions finished but somehow not RCL4 extensions)
        {
        	//(Miles note: Argue about exact number later. May want to detect max number of locations that upgraders can upgrade from.)
        	type: 'upgrader3',
        	qty: 2,
        	condition1: 'etier3',
        	condition2: 'true'
        },
    	'12'://Third main priority: Handful of Upgrader4s (if RCL4 extensions finished but not RCL5 extensions)
        {
        	//(Miles note: Argue about exact number later. May want to detect max number of locations that upgraders can upgrade from.)
        	type: 'upgrader4',
        	qty: 2,
        	condition1: 'etier4',
        	condition2: 'true'
        },
    	'13'://Third main priority: Handful of Upgrader5s (if RCL5 extensions finished)
        {
        	//(Miles note: Argue about exact number later. May want to detect max number of locations that upgraders can upgrade from.)
        	type: 'upgrader5',
        	qty: 2,
        	condition1: 'etier5',
        	condition2: 'true'
        },
    	'14'://Fourth main priority: Handful of Builders (what's wrong with you?) (if there are construction sites or repairs needed)
        {
        	//(Miles note: Argue about exact number later. Sounds like more than 1 is overkill.)
        	type: 'builder1',
        	qty: 1,
        	condition1: 'build',
        	condition2: 'etier1'
        },
    	'15'://Fourth main priority: Handful of Builder2s (are RCL3 extensions seriously not finished yet?) (if there are construction sites or repairs needed)
        {
        	//(Miles note: Argue about exact number later. Sounds like more than 1 is overkill.)
        	type: 'builder2',
        	qty: 1,
        	condition1: 'build',
        	condition2: 'etier2'
        },
    	'16'://Fourth main priority: Handful of Builder3s (if RCL3 extensions finished but somehow not RCL4 extensions) (if there are construction sites or repairs needed)
        {
        	//(Miles note: Argue about exact number later. Sounds like more than 1 is overkill.)
        	type: 'builder3',
        	qty: 1,
        	condition1: 'build',
        	condition2: 'etier3'
        },
    	'17'://Fourth main priority: Handful of Builder4s (if RCL4 extensions finished but not RCL5 extensions) (if there are construction sites or repairs needed)
        {
        	//(Miles note: Argue about exact number later. Sounds like more than 1 is overkill.)
        	type: 'builder4',
        	qty: 1,
        	condition1: 'build',
        	condition2: 'etier4'
        },
		'18'://Fourth main priority: Handful of Builder5s (if RCL5 extensions finished) (if there are construction sites or repairs needed)
		{
			//(Miles note: Argue about exact number later. Sounds like more than 1 is overkill.)
			type: 'builder5',
			qty: 1,
			condition1: 'build',
			condition2: 'etier5'
		}
    },
    '6'://RCL5
    {
    	'1'://Emergency Harvester (placed at beginning to avoid Harvester2 cancellation of regular Harvester spawn)
        {
        	type: 'harvester1',
        	qty: 5,
        	condition1: 'emergency',
        	condition2: 'true'
        },
    	'2'://Emergency Upgrader (failsafe to prevent RCL downgrade)
        {
        	type: 'upgrader1',
        	qty: 1,
        	condition1: 'downgrade',
        	condition2: 'true'
        },
    	'3'://First main priority: Room qty of Harvesters (what's wrong with you?)
        {
        	type: 'harvester1',
        	qty: 'max',
        	condition1: 'etier1',
        	condition2: 'true'
        },
    	'4'://First main priority: Room qty of Harvester2s (you must have been wiped if these are still spawning)
        {
        	type: 'harvester2',
        	qty: 'max',
        	condition1: 'etier2',
        	condition2: 'true'
        },
    	'5'://First main priority: Room qty of Harvester3s (RCL4 extensions aren't even done yet?)
        {
        	type: 'harvester3',
        	qty: 'max',
        	condition1: 'etier3',
        	condition2: 'true'
        },
    	'6'://First main priority: Room qty of Harvester4s (if RCL4 extensions finished but somehow not RCL5 extensions)
        {
        	type: 'harvester4',
        	qty: 'max',
        	condition1: 'etier4',
        	condition2: 'true'
        },
    	'7'://First main priority: Room qty of Harvester5s (if RCL5 extensions finished but not RCL6 extensions)
        {
        	type: 'harvester5',
        	qty: 'max',
        	condition1: 'etier5',
        	condition2: 'true'
        },
    	'8'://First main priority: Room qty of Harvester6s (if RCL6 extensions finished)
        {
        	type: 'harvester6',
        	qty: 'max',
        	condition1: 'etier6',
        	condition2: 'true'
        },
    	'9'://Second main priority: Single Builder (to begin construction work ASAP)
        {
        	//(Miles note: This is only really a good idea if build code can be modified to start building stuff before spawner deactivates saving)
        	type: 'builder1',
        	qty: 1,
        	condition1: 'build',
        	condition2: 'true'
        },
    	'10'://Third main priority: Handful of Upgraders (what's wrong with you?)
        {
        	//(Miles note: Argue about exact number later. May want to detect max number of locations that upgraders can upgrade from.)
        	type: 'upgrader1',
        	qty: 2,
        	condition1: 'etier1',
        	condition2: 'true'
        },
    	'11'://Third main priority: Handful of Upgrader2s (you must have been wiped if these are still spawning)
        {
        	//(Miles note: Argue about exact number later. May want to detect max number of locations that upgraders can upgrade from.)
        	type: 'upgrader2',
        	qty: 2,
        	condition1: 'etier2',
        	condition2: 'true'
        },
    	'12'://Third main priority: Handful of Upgrader3s (RCL4 extensions aren't even done yet?)
        {
        	//(Miles note: Argue about exact number later. May want to detect max number of locations that upgraders can upgrade from.)
        	type: 'upgrader3',
        	qty: 2,
        	condition1: 'etier3',
        	condition2: 'true'
        },
    	'13'://Third main priority: Handful of Upgrader4s (if RCL4 extensions finished but somehow not RCL5 extensions)
        {
        	//(Miles note: Argue about exact number later. May want to detect max number of locations that upgraders can upgrade from.)
        	type: 'upgrader4',
        	qty: 2,
        	condition1: 'etier4',
        	condition2: 'true'
        },
    	'14'://Third main priority: Handful of Upgrader5s (if RCL5 extensions finished but not RCL6 extensions)
        {
        	//(Miles note: Argue about exact number later. May want to detect max number of locations that upgraders can upgrade from.)
        	type: 'upgrader5',
        	qty: 2,
        	condition1: 'etier5',
        	condition2: 'true'
        },
    	'15'://Third main priority: Handful of Upgrader6s (if RCL6 extensions finished)
        {
        	//(Miles note: Argue about exact number later. May want to detect max number of locations that upgraders can upgrade from.)
        	type: 'upgrader6',
        	qty: 2,
        	condition1: 'etier6',
        	condition2: 'true'
        },
    	'16'://Fourth main priority: Handful of Builders (what's wrong with you?) (if there are construction sites or repairs needed)
        {
        	//(Miles note: Argue about exact number later. Sounds like more than 1 is overkill.)
        	type: 'builder1',
        	qty: 1,
        	condition1: 'build',
        	condition2: 'etier1'
        },
    	'17'://Fourth main priority: Handful of Builder2s (you must have been wiped if these are still spawning) (if there are construction sites or repairs needed)
        {
        	//(Miles note: Argue about exact number later. Sounds like more than 1 is overkill.)
        	type: 'builder2',
        	qty: 1,
        	condition1: 'build',
        	condition2: 'etier2'
        },
    	'18'://Fourth main priority: Handful of Builder3s (RCL4 extensions aren't even done yet?) (if there are construction sites or repairs needed)
        {
        	//(Miles note: Argue about exact number later. Sounds like more than 1 is overkill.)
        	type: 'builder3',
        	qty: 1,
        	condition1: 'build',
        	condition2: 'etier3'
        },
    	'19'://Fourth main priority: Handful of Builder4s (if RCL4 extensions finished but somehow not RCL5 extensions) (if there are construction sites or repairs needed)
        {
        	//(Miles note: Argue about exact number later. Sounds like more than 1 is overkill.)
        	type: 'builder4',
        	qty: 1,
        	condition1: 'build',
        	condition2: 'etier4'
        },
    	'20'://Fourth main priority: Handful of Builder5s (if RCL5 extensions finished but not RCL6 extensions) (if there are construction sites or repairs needed)
		{
			//(Miles note: Argue about exact number later. Sounds like more than 1 is overkill.)
			type: 'builder5',
			qty: 1,
			condition1: 'build',
			condition2: 'etier5'
		},
    	'21'://Fourth main priority: Handful of Builder6s (if RCL6 extensions finished) (if there are construction sites or repairs needed)
		{
			//(Miles note: Argue about exact number later. Sounds like more than 1 is overkill.)
			type: 'builder6',
			qty: 1,
			condition1: 'build',
			condition2: 'etier6'
		}
    }
}

module.exports = spawnDict;
