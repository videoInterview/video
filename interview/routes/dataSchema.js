var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var roomSchema = Schema({
	code: String,
	owener: { type: Schema.Types.ObjectId, ref: 'User' },
	interviewee: String,
	interviewers: [{ name: String }],
	date_created: { type: Date, default: Date.now },
	editor_file: { type: Schema.Types.ObjectId, ref: 'editor_file' },
	video_file: { type: Schema.Types.ObjectId, ref: 'video_file' }
});

// password could use Buffer instead
// not add Billing info yet..
var userSchema = Schema({
	name: { type: String, require: true },
	password: {type: String, require: true }，
	email: String,
	active { type: Number, default: '0'},
});

var User = mongoose.model('User', userSchema);
var Room = mongoose.model('Room', roomSchema);

module.exports = {
	roomModel: Room,
	UserModel: User
}