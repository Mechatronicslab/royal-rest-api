'use strict';

const mongoose = require('mongoose');
const moment = require('moment');
const userSchema = mongoose.Schema({

	name 			: String,
	email			: {type: String, unique: true},
	phone_number : String,
	city : String,
	city_code : String,
	address : String,
	level : String,
	hashed_password	: String,
	created_at		: {type: String, default: moment().format()},
	temp_password	: String,
	temp_password_time: String

});

//mongoose.Promise = global.Promise;
//database.dbConnect();
//mongoose.connect(mongodbUri,{useMongoClient: true});
module.exports = mongoose.model('user', userSchema);
