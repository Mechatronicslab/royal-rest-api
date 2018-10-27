'use strict';

const user = require('../model/user_model');
const bcrypt = require('bcryptjs');
const setup = require('../setup')
const requestResponse = setup.requestResponse
exports.loginUser = (email, password) =>
	new Promise((resolve,reject) => {
		user.find({ email: email })
		.then(users => {
			if (users.length == 0) {
				reject(requestResponse.account_not_found);
			} else {
				return users[0];

			}
		})
		.then(user => {
			const hashed_password = user.hashed_password;
    			if (bcrypt.compareSync(password, hashed_password)) {
    				resolve({ message : email });
    			} else {
    				reject(requestResponse.account_not_found);
    			}
		}).catch(err => reject(requestResponse.common_error));
	});

exports.registerUser = (name,email,phone_number,city,city_code,address ,password) =>
	new Promise((resolve,reject) => {
    const salt = bcrypt.genSaltSync(10);
		const hash = bcrypt.hashSync(password, salt);
		user.find({ phone_number: phone_number })
		.then(users => {
			if (users.length > 0) {
				reject(requestResponse.phone_number_already_use);
			} else {
				const newUser = new user({
					name: name,
					email: email,
					phone_number:phone_number,
					city:city,
					city_code:city_code,
					address:address,
					hashed_password: hash
				});
				newUser.save()
				.then(() => resolve(requestResponse.common_success))
				.catch(err => {
		    			if (err.code == 11000) {
		    				reject(requestResponse.email_already_use);
		    			} else {
		    				reject(requestResponse.common_error);
		    			}
				});
				return users[0];
			}
		})

	});

exports.getProfile = email =>
  	new Promise((resolve,reject) => {
  		user.find({ email: email})
  		.then(users => resolve(users[0]))
  		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))
	});
