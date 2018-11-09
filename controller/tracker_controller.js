const tracker = require('../model/tracker_model');
const setup = require('../setup')
const requestResponse = setup.requestResponse
//const multer = require('multer');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


exports.update_tracker = (email,distance) =>
	new Promise((resolve,reject) => {
		let trip = {distance:distance , time : new Date().toISOString()};
				tracker.findOneAndUpdate(
					{ email: email },
					{ $push: { trip: trip }},
					{ upsert: true }

				)
			.then(() => resolve(requestResponse.common_success))
			.catch(err => reject(requestResponse.common_error))
	});

exports.getTripById = email =>
	  	new Promise((resolve,reject) => {
	  		tracker.find({ email: email})
	  		.then(result =>{
					resolve(result[0])
				}).catch(err => reject(requestResponse.common_error))
		});

exports.checkTotalTrip = (email) =>
			new Promise((resolve,reject) => {
				var match = {$match:{email :email}}
				var unwind = {$unwind: '$trip'}
				var groupByDay = {$group:{_id: { $dayOfMonth:"$trip.time" },distance:{$sum:"$trip.distance"}}}
				var groupByMonth = {$group:{_id: { $week: "$trip.time" },distance:{$sum:"$trip.distance"}}}
				tracker.aggregate([
					{ "$facet": { "trip": [ match,unwind,groupByDay] }}
			     // {
			     //   $project:
			     //     {
			     //       TotalTrip: { $sum: "$trip.distance" }
			     //     }
			     // }

					//  {$match:{email :email}},
					//  {$unwind: '$trip'},
         	// {$group:{
					// 	_id: {day:{$dayOfMonth:"$trip.time"},
					// 	distance:{$sum:"$trip.distance"}}}
					// },
					// {$group:{_id: { $dayOfMonth: "$trip.time" },distance:{$sum:"$trip.distance"}}},
	// 				{
  //   $project: {
  //     Minggu : {$week: "$trip.time"},
  //     Hari: {$dayOfMonth: "$trip.time"},
	// 		TotalTrip: { $sum: "$trip.distance" }
  //   }
  // },
  // {
  //   $group: {
  //     _id: {
  //       Week: '$Minggu',
  //       Day: '$Hari'
  //     },
  //     count: {
  //       $sum: "$TotalTrip"
  //     }
  //   }
  // }
   ])
					.then(result => resolve(result))
					.catch(err => reject(requestResponse.common_error))
	});
