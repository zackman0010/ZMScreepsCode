var spawnDict =
{
    'queue': function(thisRoom)
    {
        //Function run by the dictionary. Main passes in the room being used by this spawner.
        //Create a dictionary from this dictionary using the key of the room's controller level
        var roomDict = this[thisRoom.controller.level.toString()];

        //Miles note: This originally was intended to be stored in thisroom.memory, although I've completely forgotten why. Consider moving it if necessary.
        var harvesters = _.filter(Game.creeps,(creep) => creep.memory.role == 'harvester');
        var harvesterCt = harvesters.length;
        var harvester2s = _.filter(Game.creeps,(creep) => creep.memory.role == 'harvester2');
        harvesterCt += harvester2s.length;
        var upgraders = _.filter(Game.creeps,(creep) => creep.memory.role == 'upgrader');
        var upgraderCt = upgraders.length;
        var builders = _.filter(Game.creeps,(creep) => creep.memory.role == 'builder');
        var builderCt = builders.length;

        for(var i = 1;i < roomDict.length;i++)
        {
            var current = roomDict[i.toString()];
            var role = current.type;
            var max = current.qty;
            var condition = this.condList(thisRoom,current.condition);
            switch(role)
            {
                case 'harvester':
                    if(harvesterCt < max && condition) return 'harvester';
                    break;
                case 'harvester2':
                    if(harvesterCt < max && condition) return 'harvester2';
                    break;
                case 'upgrader':
                    if(upgraderCt < max && condition) return 'upgrader';
                    break;
                case 'builder':
                    if(builderCt < max && condition) return 'builder';
                    break;
                default:
                    break;
            }
        }

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
        else if(condition == 'build')
        {
            var damTar = thisRoom.find(FIND_STRUCTURES,
            {
                //Detect all damaged structures (or Ramparts and Walls with less than a desired max HP)
                filter: (structure) =>
                {
                    return ((structure.structureType == STRUCTURE_RAMPART && structure.hits < 10000) ||
                            (structure.structureType == STRUCTURE_WALL && structure.hits < 10000) ||
                            (structure.hits < structure.hitsMax && structure.structureType != STRUCTURE_RAMPART && structure.structureType != STRUCTURE_WALL))
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
            case 'harvester':
                return [[WORK,CARRY,MOVE],null,{role: 'harvester'}];
                break;
            case 'harvester2':
                return [[WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE],null,{role: 'harvester2'}];
                break;
            case 'upgrader':
                return [[WORK,CARRY,MOVE],null,{role: 'upgrader'}];
                break;
            case 'upgrader2':
                return [[WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE],null,{role: 'upgrader2'}];
                break;
            case 'builder':
                return [[WORK,CARRY,MOVE],null,{role: 'builder'}];
            default:
                break;
        }
    },
    '1'://RCL 1
    {
        '1'://First priority: 3 Harvesters
        {
            type: 'harvester',
            qty: 3,
            condition: 'true'
        },
        '2'://Second priority: 1 Upgrader (to allow room to reach RCL2 asap)
        {
            type: 'upgrader',
            qty: 1,
            condition: 'true'
        },
        '3'://Third and final priority: Harvesters until maxed or RCL upgrade
        {
            type: 'harvester',
            qty: thisRoom.memory.totalHarvest,
            condition: 'true'
        }
    },
    '2'://RCL 2
    {
        '1'://Emergency Harvester (placed at beginning to avoid Harvester2 cancellation of regular Harvester spawn)
        {
            type: 'harvester',
            qty: 3,
            condition: 'emergency'
        },
        '2'://Emergency Upgrader (failsafe to prevent RCL downgrade)
        {
            type: 'upgrader',
            qty: 1,
            condition: 'downgrade'
        },
        '3'://First main priority: Room qty of Harvesters (if RCL2 extensions not finished)
        {
            type: 'harvester',
            qty: thisRoom.memory.totalHarvest,
            condition: 'etier1'
        },
        '4'://First main priority: Room qty of Harvester2s (if RCL2 extensions finished)
        {
            type: 'harvester2',
            qty: thisRoom.memory.totalHarvest,
            condition: 'etier2'
        },
        '5'://Third main priority: Single Builder (to begin construction work ASAP)
        {
            //(Miles note: This is only really a good idea if build code can be modified to start building stuff before spawner deactivates saving)
            type: 'builder',
            qty: 1,
            condiion: 'build'
        },
        '6'://Fourth main priority: Handful of Upgraders (Miles note: Argue about exact number later. May want to detect max number of locations that upgraders can upgrade from.)
        {
            type: 'upgrader',
            qty: 5,
            condition: 'true'
        },
        '7'://Fifth main priority: Handful of Builders (if there are construction sites or repairs needed) (Miles note: Argue about exact number later. Sounds like more than 1 is overkill.)
        {
            type: 'builder',
            qty: 3,
            condition: 'build'
        }
    }
    
}