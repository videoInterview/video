/* The Schemas of collections
   Exports 2 Models:
   * RoomModel
   * UserModel
*/

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
	
var roomSchema = Schema({
	room: String,
	type: { type: String, enum: [ 'FREE', 'INDIVIDUAL', 'BUSINESS' ]},
	owner: { type: String/*,type: Schema.Types.ObjectId, ref: 'User'*/ },
	status: String,
	interviewee: String,
	interviewers: [mongoose.Schema({
      id: String,
      name: String,
      status: String
   	}, { _id: false })],
	date_created: { type: Date, default: Date.now },
	editor_file: { type: Schema.Types.ObjectId, ref: 'Editor_file' },
	video_file: { type: Schema.Types.ObjectId, ref: 'Video_file' },
});

// password could use Buffer instead
// not add Billing info yet..
var userSchema = Schema({
	name: { type: String, require: true },
	password: {type: String/*, require: true */},
	email: String,
	active: { type: Number, default: '0' },
	user_type: { type: String, 
		enum: [ 'FREE', 'INDIVIDUAL_TRAIL', 'INDIVIDUAL', 'BUSINESS_TRAIL', 'BUSINESS' ]},
	trial_left: { type: Number, default: '0' },
	room_history: [{type: Schema.Types.ObjectId, ref: 'Room'}]
});

var User = mongoose.model('User', userSchema);
// roomSchema.statics.findInterviewers = function findInterviewers (RoomId, cb) {
// 	return this.model('Room').findById(RoomId, cb).interviewers;
// };
var Room = mongoose.model('Room', roomSchema);

module.exports = {
	RoomModel: Room,
	UserModel: User
}