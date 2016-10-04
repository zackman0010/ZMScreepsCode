var roomInit = 
{
	run: function(spawn)
	{
		//Set variable array for all energy sources in room
		var sources = spawn.room.find(FIND_SOURCES);
		
		//Set variable array within room memory for all energy sources in room
		spawn.room.memory.sourceFlags = [];
		for(var x = 0;x < sources.length;x++)
		{
			//For each energy source in room, create a flag and add it to the room memory array
			var flagname = sources[x].pos.createFlag('SourceFlag' + x.toString())
			if (flagname == -3) {
				//For some unknown reason, the above command is returning -3 (ERR_NAME_EXISTS) on every call. This workaround makes the rest of the code work.
				flagname = 'SourceFlag' + x.toString();
			}
			spawn.room.memory.sourceFlags.push(flagname);
		}
		
		//Set variable array within room memory for total tiles in room that can be harvested from
		spawn.room.memory.totalHarvest = 0;
		
		//Loop through all sources in room to determine harvestable tiles for each
		for(var sourcename in spawn.room.memory.sourceFlags)
		{
			var source = Game.flags[sourcename];
			//Create and initialize variable for number of tiles around the source that can be harvested from
			Game.flags[sourcename]source.memory.availHarvest = 0;
			source.memory.actHarvest = 0;
			
			//Loop through the tiles within a 1-tile radius of the source.
			for(var i = (source.pos.x)-1;i <= (source.pos.x)+1;i++)
			{
				for(var j = (source.pos.y)-1;j <= (source.pos.y)+1;j++)
				{
					if(getTerrainAt(i,j,spawn.room.name) == "plain" || getTerrainAt(i,j,spawn.room.name) == "swamp")
					{
						//If the tile being checked is walkable terrain (plain or swamp), increment the number of tiles that can be harvested from.
						source.memory.availHarvest++;
					}
				}
			}
			//Add this source's harvestable tiles to the total number
			spawn.room.memory.totalHarvest += source.memory.availHarvest;
		}
		
		//Once room is successfully initialized, set initialize flag so this code does not run again
		spawn.room.memory.initialized = true;
	}
}

module.exports = roomInit;