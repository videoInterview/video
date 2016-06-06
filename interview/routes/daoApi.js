/* The DAO API controller
   Exports DAO API methods for CRUD on DB
*/

var express = require('express');
var dataSchema = require('./dataSchema');
var router = express.Router();
var mongoose = require('mongoose');

mongoose.connect("localhost:27017/test");
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

router.get('/create_room', function (req, res, next) {
	var Room = dataSchema.RoomModel;
	var room = new Room({});
	room.save(function (err,room) {
		if (err) return console.log(err);
		res.json(room);
	});
});

router.get('/rooms', function (req, res, next) {
	var Room = dataSchema.RoomModel;
	Room.find(function (err, rooms) {
		if (err) return console.log(err);
		res.json(rooms);
	})
});

router.get('/rooms/:id', function (req, res, next) {
	var Room = dataSchema.RoomModel;
	Room.findById(req.params.id, function (err,room) {
		if (err) return console.log(err);
		res.json(room);
	});
});

router.delete('/rooms/:id', function (req, res, next) {
	var Room = dataSchema.RoomModel;
	Room.findByIdAndRemove(req.params.id, function (err,room) {
		if (err) return console.log(err);
		res.json({"message": "remove" + room._id});
	});
});

//POST, PUT

module.exports = router;