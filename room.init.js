var roomInit = 
{
	//NOTE TO SELF IN CASE I FORGET: To fix this bug, split into two inits because items created don't actually exist until the second tick.
	first: function(thisRoom)
	{
		//Set variable array for all energy sources in room
		var sources = thisRoom.find(FIND_SOURCES);
		
		//Set variable array within room memory for all energy sources in room
		thisRoom.memory.sourceFlags = [];
		for(var x = 0;x < sources.length;x++)
		{
			//For each energy source in room, create a flag and add it to the room memory array
			var flagname = sources[x].pos.createFlag('SourceFlag' + x.toString());
			if (flagname == -3)
			{
				//For some unknown reason, the above command is returning -3 (ERR_NAME_EXISTS) on every call. This workaround makes the rest of the code work.
				flagname = 'SourceFlag' + x.toString();
			}
			thisRoom.memory.sourceFlags.push(flagname);
		}
		
		//Set variable array within room memory for total tiles in room that can be harvested from
		thisRoom.memory.totalHarvest = 0;
		
		
		
		//Once room is successfully initialized, set initialize flag so this code does not run again
		thisRoom.memory.initialized1 = true;
		//Set second initialize flag to signal the need for the second initializer to run.
		thisRoom.memory.initialize2 = true;
	},
	
	second: function(thisRoom)
	{
		//Loop through all sources in room to determine harvestable tiles for each
		for(var sourceindex in thisRoom.memory.sourceFlags)
		{
			var source = Game.flags[thisRoom.memory.sourceFlags[sourceindex]];
			//Create and initialize variable for number of tiles around the source that can be harvested from
			source.memory.availHarvest = 0;
			source.memory.actHarvest = 0;
			
			//Loop through the tiles within a 1-tile radius of the source.
			for(var i = (source.pos.x)-1;i <= (source.pos.x)+1;i++)
			{
				for(var j = (source.pos.y)-1;j <= (source.pos.y)+1;j++)
				{
					if(Game.map.getTerrainAt(i,j,thisRoom.name) == "plain" || Game.map.getTerrainAt(i,j,thisRoom.name) == "swamp")
					{
						//If the tile being checked is walkable terrain (plain or swamp), increment the number of tiles that can be harvested from.
						source.memory.availHarvest++;
					}
				}
			}
			//Add this source's harvestable tiles to the total number
			thisRoom.memory.totalHarvest += source.memory.availHarvest;
			
			thisRoom.memory.initialize2 = false;
		}
	}
}

module.exports = roomInit;