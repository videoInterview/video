/* The DAO API controller
   Exports DAO API methods for CRUD on DB
*/

module.exports = function(io) {
	var express = require('express');
	var dataSchema = require('./dataSchema');
	var router = express.Router();
	var mongoose = require('mongoose');

	mongoose.connect("localhost:27017/test");
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));

	// Time log
	router.use(function timeLog(req, res, next) {
	  //console.log('>>Time: ', Date.now());
	  next();
	});

	// Used to create and save a room obj to DB 
	// and return room info with owner info
	router.post('/create_room', function (req, res, next) {
		//req.session.room = null;
		var Room = dataSchema.RoomModel;
		var room = new Room({
			room: 'room1',
			type: 'FREE',
			//owner: req.body.ownerName,
			status: 'open'
			//interviewers: [{name: req.body.ownerName}]
		});
		room.save(function (err,room) {
			if (err) throw err;
			var data = room.toJSON();
			//data.action = 'start';
			//data.person = req.body.ownerName;
			//data.isOwner = true;
			//req.session.room = data;
			res.json(data);
		});
	});

	// Used to update a specific room info
	router.put('/rooms/:id([0-9a-z]{24})', function (req, res, next) {
		var Room = dataSchema.RoomModel;
		Room.count({_id:req.params.id}, function (err,count) {
			if (err) throw err;
			if (count==0) {
				res.send( 400, { code: 'roomNotFound', message: 'Failed to find the expected room' } );
			} else {
				Room.findOneAndUpdate(
					{ '_id': req.params.id },
					{ $addToSet: { 'interviewers': {'id': req.body.id, 'name': req.body.name, 'status': 'joined' } },
					  $set: { 'status': 'waiting'} },
					{ new: true },
		            function ( err, room ) {
		            	if (err) throw err;
		            	if (room){
		            		var data = room.toJSON();
		            		//data.action = 'start';
		            		data.player = req.body.id;
		            		data.player = req.body.name;
		            		res.json(data);
		            	}
		            });
			}	
		});
	});

	// Used to get a specific room info
	router.get('/rooms/:id', function (req, res, next) {
			var Room = dataSchema.RoomModel;
			Room.findById(req.params.id, function (err,room) {
				if (err) throw err;
				if(!room) {
					res.send( 400, { code: 'roomNotFound', message: 'Failed to find the expected room' } );
				} else {
					var data = room.toJSON();
					res.json(data);
				}
			});
	});

	// Used to get all rooms from DB
	router.get('/rooms', function (req, res, next) {
		var Room = dataSchema.RoomModel;
		Room.find(function (err, rooms) {
			if (err) return console.log(err);
			res.json(rooms);
		})
	});

	
	// Used to delete a specific room
	router.delete('/rooms/:id', function (req, res, next) {
		var Room = dataSchema.RoomModel;
		Room.findByIdAndRemove(req.params.id, function (err,room) {
			if (err) return console.log(err);
			res.json({"message": "remove" + room._id});
		});
	});

	return router;
};