var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// establish MongoDB connection
mongoose.connect('localhost:27017/gridfsTest');
var conn = mongoose.connection;
var path = require('path');
// require GridFS
var Grid = require('gridfs-stream');
// require filesystem module
var fs = require('fs');

// where to find the video in the filesystem that we will store in the DB
var videoPath = path.join(__dirname, '../public/demo.m4v');

// connect GridFS and Mongo
Grid.mongo = mongoose.mongo;

conn.once('open', function () {
	console.log('- Connection open -');
	var gfs = Grid(conn.db);

	// when connection is open, create write stream with
	// the name to store file as in the DB
	var writestream = gfs.createWriteStream({
		// will be stored in Mongo as 'swimVid.mp4'
		filename: '_demo.m4v'
	});
	// create a read-stream from where the video currently is (videoPath)
	// and pipe it into the database (through write-stream)
	fs.createReadStream(videoPath).pipe(writestream);

	writestream.on('close', function (file) {
		// do something with 'file'
		// console logging that it was written successfuly
		console.log(file.filename + 'Written To DB');
	});
});


