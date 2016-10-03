var respawner = {
	'length': 10,
	'1': {
		type: 'harvester',
		name: 'Harvester1',
		minenergy: 0,
		maxenergy: 550,
		body: [WORK, CARRY, MOVE]
	},
	'2': {
		type: 'harvester',
		name: 'Harvester2',
		minenergy: 0,
		maxenergy: 550,
		body: [WORK, CARRY, MOVE]
	},
	'3': {
		type: 'harvester',
		name: 'Harvester3',
		minenergy: 0,
		maxenergy: 550,
		body: [WORK, CARRY, MOVE]
	},
	'4': {
		type: 'bigharvester',
		name: 'BigHarvester1',
		minenergy: 550,
		maxenergy: 25000,
		body: [WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE]
	},
	'5': {
		type: 'bigharvester',
		name: 'BigHarvester2',
		minenergy: 550,
		maxenergy: 25000,
		body: [WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE]
	},
	'6': {
		type: 'bigharvester',
		name: 'BigHarvester3',
		minenergy: 550,
		maxenergy: 25000,
		body: [WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE]
	},
	'7': {
		type: 'upgrader',
		name: 'Upgrader1',
		minenergy: 0,
		maxenergy: 25000,
		body: [WORK,CARRY,MOVE]
	},
	'8': {
		type: 'upgrader',
		name: 'Upgrader2',
		minenergy: 0,
		maxenergy: 25000,
		body: [WORK,CARRY,MOVE]
	},
	'9': {
		type: 'upgrader',
		name: 'Upgrader3',
		minenergy: 0,
		maxenergy: 25000,
		body: [WORK,CARRY,MOVE]
	},
	'10': {
		type: 'builder',
		name: 'Builder1',
		minenergy: 0,
		maxenergy: 25000,
		body: [WORK,CARRY,MOVE]
	}
};

module.exports = respawner;