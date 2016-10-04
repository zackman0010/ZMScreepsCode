var roomInit = 
{
	//NOTE TO SELF IN CASE I FORGET: To fix this bug, split into two inits because items created don't actually exist until the second tick.
	first: function(room)
	{
		//Set variable array for all energy sources in room
		var sources = room.find(FIND_SOURCES);
		
		//Set variable array within room memory for all energy sources in room
		room.memory.sourceFlags = [];
		for(var x = 0;x < sources.length;x++)
		{
			//For each energy source in room, create a flag and add it to the room memory array
			var flagname = sources[x].pos.createFlag('SourceFlag' + x.toString());
			if (flagname == -3)
			{
				//For some unknown reason, the above command is returning -3 (ERR_NAME_EXISTS) on every call. This workaround makes the rest of the code work.
				flagname = 'SourceFlag' + x.toString();
			}
			room.memory.sourceFlags.push(flagname);
		}
		
		//Set variable array within room memory for total tiles in room that can be harvested from
		room.memory.totalHarvest = 0;
		
		
		
		//Once room is successfully initialized, set initialize flag so this code does not run again
		room.memory.initialized1 = true;
		//Set second initialize flag to signal the need for the second initializer to run.
		room.memory.initialize2 = true;
	},
	
	second: function(room)
	{
		//Loop through all sources in room to determine harvestable tiles for each
		for(var sourceindex in room.memory.sourceFlags)
		{
			var source = Game.flags[room.memory.sourceFlags[sourceindex]];
			//Create and initialize variable for number of tiles around the source that can be harvested from
			source.memory.availHarvest = 0;
			source.memory.actHarvest = 0;
			
			//Loop through the tiles within a 1-tile radius of the source.
			for(var i = (source.pos.x)-1;i <= (source.pos.x)+1;i++)
			{
				for(var j = (source.pos.y)-1;j <= (source.pos.y)+1;j++)
				{
					if(Game.map.getTerrainAt(i,j,room.name) == "plain" || Game.map.getTerrainAt(i,j,room.name) == "swamp")
					{
						//If the tile being checked is walkable terrain (plain or swamp), increment the number of tiles that can be harvested from.
						source.memory.availHarvest++;
					}
				}
			}
			//Add this source's harvestable tiles to the total number
			room.memory.totalHarvest += source.memory.availHarvest;
			
			room.memory.initialize2 = false;
		}
	}
}

module.exports = roomInit;