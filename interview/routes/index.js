module.exports = function(io) {
	var express = require('express');
	var dataSchema = require('./dataSchema');
	var router = express.Router();
	var http = require('http');
	var mongoose = require('mongoose');
	var path = require('path');

	mongoose.connect("localhost:27017/test");
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));

	/* GET home page. */
	router.get('/www', function (req, res, next) {
	  res.render('index', { title: 'Express' });
	});

	/* GET room page. */
	router.get('/:room_id([0-9a-z]{24})', function (req, res, next) {
		res.sendFile(path.join(__dirname, '../public', 'socket.html'));
	});

	return router;
};