var claimRoom =
{
	claim: function()
	{
		var canRun = true;
		if(Memory.claimHome == null)
		{
			//Verify that a home room has been set (the room that will spawn any creeps needed to claim the room)
			console.log("Error: No home room set. Please set home room using Memory.claimHome");
			canRun = false;
		}

		if(Memory.claimTarget == null)
		{
			//Verify that a target room has been set (the room to be claimed)
			console.log("Error: No target room set. Please set target room using Memory.claimTarget");
			canRun = false;
		}

		//Set up myRooms list for extra error checking
		var myRooms = [];
		for(var thisRoomind in Game.rooms) if(Game.rooms[thisRoomind].controller.my) myRooms.push(Game.rooms[thisRoomind]);

		if(Game.gcl.level <= myRooms.length)
		{
			//Verify that a room can be claimed (GCL is high enough to allow a new room)
			console.log("Error: GCL is insufficient to claim a new room. Please wait until GCL increases or use the reserve function instead.");
			canRun = false;
		}

		if(Memory.claimHome)
		{
			//Verify that the home room is owned by the user
			var homeRoom = false;
			for(var thisRoomind in myRooms)
			{
				var thisRoom = myRooms[thisRoomind];
				if(thisRoom.name == Memory.claimHome)
				{
					homeRoom = true;
					break;
				}
			}
			if(!homeRoom)
			{
				console.log("Error: You do not own specified home room. Please reset home room using Memory.claimHome");
				canRun = false;
			}
		}
	}
};