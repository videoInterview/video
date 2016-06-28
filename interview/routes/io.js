module.exports = function() {
	var io = require('socket.io')();
	var dataSchema = require('./dataSchema');
	var mongoose = require('mongoose');

	mongoose.connect("localhost:27017/test");
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	io.on('connection', function (socket) {
		var Room = dataSchema.RoomModel;
		var _room, _username, _userId;
		var _users = [];
	  	socket.on('disconnect', function() {
	  		//connections.splice(connections.indexOf(socket), 1);
	  		console.log('a user disconnected');
	  		console.log("disconnected:: %s sockets", io.sockets.in(_room).clients().length);
	  		Room.findOneAndUpdate(
					{ '_id': _room, 'interviewers.id': _userId},
					{ $set: {'interviewers.$.status': 'left', 'interviewers.$.statusDate': Date.now()} },
					{ new: true },
		            function ( err, room ) {
		            	if (err) throw err;
		            	if (room){
		            		var _users = [];
		            		for(var i = 0; i< room.interviewers.length; i++){
		            			if(room.interviewers[i].status=='online')
		    						_users.push(room.interviewers[i].name);
		    				}
		    					socket.broadcast.to( _room ).emit('leave', _userId);
		    					io.sockets.in(_room).emit('get users', _users);
		    				// io.sockets.in(_room).emit('left', {user: _username, userId: _userId});
		            	}
		            });
	  	});

	  	// Join a room
	  	socket.on('join', function (data, cb) {
	  		_room = data.room;
	  		_username = data.name;
	  		socket.username = _username;
	  		console.log(data);
	  		socket.join(_room);
			console.log(data.room+ "::a user connected!!");
			console.log(data.room+ "::has %s sockets", io.sockets.in(_room).clients().length);
			// io.sockets.in(_room).clients(function(err, clients) {
			// 	if(err) throw err;
			// 	console.log(_room+': '+clients);
			// });
	    	Room.findById(_room, function (err,room){
				_userId = room.interviewers.length;
				for(var i = 0; i< room.interviewers.length; i++){
					if(room.interviewers[i].status=='online')
						_users.push(room.interviewers[i].name);
				}
				Room.update({ '_id': _room },
					{ $addToSet: { 'interviewers': {'id': _userId, 'name': _username, 'status': 'online', 'statusDate': Date.now() } },
					  $set: { 'status': 'waiting'} },
					{ new: true },
		            function ( err ) {
		            	if (err) throw err;
		    				// io.sockets.in(_room).emit('joined', {user: _username, userId: _userId});
    					_users.push(_username);
    					io.sockets.in(_room).emit('get users', _users);
    					cb(true);
		            });
	    	});
	  		// Room.findOneAndUpdate(
					// { '_id': _room },
					// { $addToSet: { 'interviewers': {'id': _userId, 'name': _username, 'status': 'online', 'statusDate': Date.now() } },
					//   $set: { 'status': 'waiting'} },
					// { new: true },
		   //          function ( err, room ) {
		   //          	if (err) throw err;
		   //          	if (room){
		   //  				// io.sockets.in(_room).emit('joined', {user: _username, userId: _userId});
		   //  				var _users = [];
		   //  				for(var i = 0; i< room.interviewers.length; i++){
		   //  					if(room.interviewers[i].status=='online')
		   //  						_users.push(room.interviewers[i].name);
		   //  				}
		   //  					io.sockets.in(_room).emit('get _users', _users);
		   //  					cb(true);
		   //          	}
		   //          });
	  	});

	  	// Send Message
	  	socket.on('send message', function (data) {
	  		io.sockets.in( _room ).emit('new message', {msg: data, user: socket.username});
	  	});

	  	socket.on('streamOn', function (image){
	  		socket.broadcast.to( _room ).emit('stream', {URL: image.URL, user: image.user, userId: _userId });
	  	});

	});

	return io;
};