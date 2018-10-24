'use strict';

const mongoose = require('mongoose');
const moment = require('moment');
require('mongoose-double')(mongoose);
var SchemaTypes = mongoose.Schema.Types;
const trackerSchema = mongoose.Schema({
	email			: {type: String, unique: true},
	distance : Number,
  speed : Number,
	created_at		: {type: String, default: moment().format()},
});

//mongoose.Promise = global.Promise;
//database.dbConnect();
//mongoose.connect(mongodbUri,{useMongoClient: true});
module.exports = mongoose.model('tracker', trackerSchema);
