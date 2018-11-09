const mongoose = require('mongoose');
const moment = require('moment');
var uniqueValidator = require('mongoose-unique-validator');
const userSchema = mongoose.Schema({

	name 			: String,
	email			: {type: String, unique: true, index: true},
	phone_number : {type: String, unique: true, index: true},
	city : String,
	city_code : String,
	address : String,
	level : String,
	token : String,
	user_photo : [{image_user:String ,ktp : String , KK : String , Ijasah : String}],
	vehicle : [{image_kendaraan : String,merk_kendaraan:String , jns_kendaraan : String ,no_plat:String ,_id : false}],
	hashed_password	: String,
	referensi : String ,
	created_at		: String,
	temp_password	: String,
	temp_password_time: String

});
//mongoose.Promise = global.Promise;
//database.dbConnect();
//mongoose.connect(mongodbUri,{useMongoClient: true});
module.exports = mongoose.model('user', userSchema);
