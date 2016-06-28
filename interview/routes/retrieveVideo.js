//example for retrieve video

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// establish Mongoose connection
mongoose.connect('localhost:27017/gridfsTest');
var conn = mongoose.connection;
// require FS module

var fs = require('fs');
var path = require('path');

// require GridFS
var Grid = require('gridfs-stream');

// connect MongoDB and GridFS
Grid.mongo = mongoose.mongo;

conn.once('open', function() {
	console.log('- Connection open -');
	var gfs = Grid(conn.db);

	// write content form DB to file system with
	// the given name (in this case, demo.m4v)

	var fs_write_stream = fs.createWriteStream(path.join(__dirname, '../public/newdemo.m4v'));

	// create read-steam from mongodb
	// in this case, finding the correct file by 'filename'
	// but could also find by ID or other properties
	var readstream = gfs.createReadStream({
		filename: '_demo.m4v'
	});

	// pipe the read-stream in to the write stream
	readstream.pipe(fs_write_stream);
	fs_write_stream.on('close', function () {
		console.log('File has been written fully!');
	});
});