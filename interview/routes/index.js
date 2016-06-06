var express = require('express');
var router = express.Router();
var http = require('http');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

/* Create a room. */
router.get('/create_room', function (req, res, next) {
	http.get("http://localhost:3000/api/create_room", function(resp) {
		console.log("Got response: " + resp.statusCode);
		resp.on('data', function (data) {
			res.redirect(JSON.parse(data.toString())._id);
		});
	}).on('error', function (e) {
		console.log("Got error: " + e.message);
	});
});

/* GET room page. */
router.get('/:room_id', function (req, res, next) {
	console.log("123");
	http.get("http://localhost:3000/api/rooms/"+req.params.room_id, function(resp) {
		console.log("Got response1: " + resp.statusCode);
		resp.on('data', function (data) {
			res.json(JSON.parse(data.toString()));
		});
	}).on('error', function (e) {
		console.log("Got error: " + e.message);
	});

});

module.exports = router;
