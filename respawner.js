var respawner = {
	'clength': 35,
	'1': {
		type: 'harvester',
		name: 'Harvester1',
		minenergy: 0,
		maxenergy: 25000,
		body: [WORK, CARRY, MOVE]
	},
	'2': {
		type: 'harvester',
		name: 'Harvester2',
		minenergy: 0,
		maxenergy: 25000,
		body: [WORK, CARRY, MOVE]
	},
	'3': {
		type: 'harvester',
		name: 'Harvester3',
		minenergy: 0,
		maxenergy: 25000,
		body: [WORK, CARRY, MOVE]
	},
	'4': {
		type: 'harvester',
		name: 'Harvester4',
		minenergy: 0,
		maxenergy: 550,
		body: [WORK, CARRY, MOVE]
	},
	'5': {
		type: 'harvester',
		name: 'Harvester5',
		minenergy: 0,
		maxenergy: 550,
		body: [WORK, CARRY, MOVE]
	},
	'6': {
		type: 'harvester',
		name: 'Harvester6',
		minenergy: 0,
		maxenergy: 550,
		body: [WORK, CARRY, MOVE]
	},
	'7': {
		type: 'harvester',
		name: 'Harvester7',
		minenergy: 0,
		maxenergy: 550,
		body: [WORK, CARRY, MOVE]
	},
	'8': {
		type: 'harvester',
		name: 'Harvester4',
		minenergy: 550,
		maxenergy: 800,
		body: [WORK, WORK, CARRY, CARRY, MOVE, MOVE]
	},
	'9': {
		type: 'harvester',
		name: 'Harvester5',
		minenergy: 550,
		maxenergy: 800,
		body: [WORK,WORK,CARRY,CARRY,MOVE,MOVE]
	},
	'10': {
		type: 'harvester',
		name: 'Harvester6',
		minenergy: 550,
		maxenergy: 800,
		body: [WORK,WORK,CARRY,CARRY,MOVE,MOVE]
	},
	'11': {
		type: 'harvester',
		name: 'Harvester7',
		minenergy: 550,
		maxenergy: 800,
		body: [WORK,WORK,CARRY,CARRY,MOVE,MOVE]
	},
	'12': {
		type: 'harvester',
		name: 'Harvester4',
		minenergy: 800,
		maxenergy: 1300,
		body: [WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE]
	},
	'13':
    {
    	type: 'harvester',
    	name: 'Harvester5',
    	minenergy: 800,
    	maxenergy: 1300,
		body: [WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE]
    },
	'14':
	{
		type: 'harvester',
		name: 'Harvester6',
		minenergy: 800,
		maxenergy: 1300,
		body: [WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE]
	},
	'15':
	{
		type: 'harvester',
		name: 'Harvester7',
		minenergy: 800,
		maxenergy: 1300,
		body: [WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE]
	},
	'16':
	{
		type: 'harvester',
		name: 'Harvester4',
		minenergy: 1300,
		maxenergy: 25000,
		body: [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE]
	},
	'17':
	{
		type: 'harvester',
		name: 'Harvester5',
		minenergy: 1300,
		maxenergy: 25000,
		body: [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE]
	},
	'18':
	{
		type: 'harvester',
		name: 'Harvester6',
		minenergy: 1300,
		maxenergy: 25000,
		body: [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE]
	},
	'19':
	{
		type: 'harvester',
		name: 'Harvester7',
		minenergy: 1300,
		maxenergy: 25000,
		body: [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE]
	},
	'20': {
		type: 'upgrader',
		name: 'Upgrader1',
		minenergy: 0,
		maxenergy: 25000,
		body: [WORK,CARRY,MOVE,MOVE]
	},
	'21': {
		type: 'upgrader',
		name: 'Upgrader2',
		minenergy: 0,
		maxenergy: 550,
		body: [WORK,CARRY,MOVE,MOVE]
	},
	'22': {
		type: 'upgrader',
		name: 'Upgrader3',
		minenergy: 0,
		maxenergy: 550,
		body: [WORK,CARRY,MOVE,MOVE]
	},
	'23': {
		type: 'builder',
		name: 'Builder1',
		minenergy: 0,
		maxenergy: 25000,
		body: [WORK,CARRY,MOVE,MOVE]
	},
	'24': {
		type: 'upgrader',
		name: 'Upgrader2',
		minenergy: 550,
		maxenergy: 800,
		body: [WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE]
	},
	'25':
	{
		type: 'upgrader',
		name: 'Upgrader3',
		minenergy: 550,
		maxenergy: 800,
		body: [WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE]
	},
	'26':
	{
		type: 'upgrader',
		name: 'Upgrader4',
		minenergy: 550,
		maxenergy: 800,
		body: [WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE]
	},
	'27':
	{
		type: 'upgrader',
		name: 'Upgrader5',
		minenergy: 550,
		maxenergy: 800,
		body: [WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE]
	},
	'28':
	{
		type: 'upgrader',
		name: 'Upgrader2',
		minenergy: 800,
		maxenergy: 1300,
		body: [WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]
	},
	'29':
	{
		type: 'upgrader',
		name: 'Upgrader3',
		minenergy: 800,
		maxenergy: 1300,
		body: [WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]
	},
	'30':
	{
		type: 'upgrader',
		name: 'Upgrader4',
		minenergy: 800,
		maxenergy: 1300,
		body: [WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]
	},
	'31':
	{
		type: 'upgrader',
		name: 'Upgrader5',
		minenergy: 800,
		maxenergy: 1300,
		body: [WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]
	},
	'32':
	{
		type: 'upgrader',
		name: 'Upgrader2',
		minenergy: 1300,
		maxenergy: 25000,
		body: [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]
	},
	'33':
	{
		type: 'upgrader',
		name: 'Upgrader3',
		minenergy: 1300,
		maxenergy: 25000,
		body: [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]
	},
	'34':
	{
		type: 'upgrader',
		name: 'Upgrader4',
		minenergy: 1300,
		maxenergy: 25000,
		body: [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]
	},
	'35':
	{
		type: 'upgrader',
		name: 'Upgrader5',
		minenergy: 1300,
		maxenergy: 25000,
		body: [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]
	},
};

module.exports = respawner;