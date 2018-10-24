const posting = require('../model/tracker_model');
const setup = require('../setup')
const requestResponse = setup.requestResponse
//const multer = require('multer');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

exports.create_tracker = (email,distance,speed) =>
	new Promise((resolve,reject) => {
    var distances = {type:"double"}
				const newTracker = new posting({
					email: email,
          distance:distance,
					speed:speed,
					updated_at:new Date().toISOString(),
					created_at:new Date().toISOString()
				});
					newTracker.save()
					.then(() => resolve(requestResponse.common_success))
					.catch(err => reject(requestResponse.common_error))
	});
