const mongoose = require('mongoose');
const moment = require('moment');
const userSchema = mongoose.Schema({

	name 			: String,
	nik : String ,
	gender : String ,
	tmpt_lahir : String ,
	tgl_lahir : String ,
	address : String,
	phone_number1 : {type: String, unique: true, index: true},
	phone_number2 : {type: String, unique: true, index: true},
	email			: {type: String, unique: true, index: true},
	city : String,
	city_code : String,
	user_file : [
								{
									user_photo: String ,
									ktp_photo: String ,
									kk_photo : String ,
									ijasah_photo : String
								}
							],

	vehicle : [
								{
									image_kendaraan : String,
									merk_kendaraan:String ,
									jns_kendaraan : String ,
									thn_kendaraan :String ,
									no_plat:String
								}
							],
	data_area : [
								{
									area_prioritas : String ,
									area_sekunder : String
								}
							],
  data_referensi : String,
	hashed_password	: String,
	token : String,
	created_at		: String

});
//mongoose.Promise = global.Promise;
//database.dbConnect();
//mongoose.connect(mongodbUri,{useMongoClient: true});
module.exports = mongoose.model('user', userSchema);
