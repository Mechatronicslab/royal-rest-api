const user = require('../model/user_model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config.json');
const { requestResponse } = require('../setup')
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

	exports.registerUser = (name,email,phone_number,city,city_code,address,password,no_plat,image) =>
		new Promise((resolve,reject) => {
	    const salt = bcrypt.genSaltSync(10);
			const hash = bcrypt.hashSync(password, salt);
			user.find({ email: email})
			.then(users => {
				if (users.length > 0) {
						reject(requestResponse.email_already_use)
				}else{
					user.find({phone_number:phone_number})
					.then(result =>{
						if(result.length>0){
							reject(requestResponse.phone_number_already_use)
						}else {
							const newUser = new user({
								name: name,
								email: email,
								phone_number:phone_number,
								city:city,
								city_code:city_code,
								address:address,
								hashed_password: hash,
								vehicle:{image : image,no_plat:no_plat},
								created_at: new Date().toISOString(),
							});
							newUser.save()
							.then(() => resolve(requestResponse.common_success))
							.catch(err => {
					    				reject(requestResponse.phone_number_already_use);
							});
							return users[0];
						}
					})
				}
			}).catch(err => reject(requestResponse.common_error))



		});

	exports.updateToken = (email,token) =>
			new Promise((resolve,reject) => {
				user.update(
					{ email: email },
					{ token : token }
				)
					.then(result => resolve(result))
					.catch(err => reject(requestResponse.common_error))
	});

	exports.checkToken = (email, token) =>
		new Promise((resolve,reject) => {
			user.find({ email: email })
			.then(users => {
				if (users.length == 0) {
					reject(requestResponse.token_invalid)
				} else {
					return users[0];
				}
			})
			.then(user => {
				const user_token = user.token;
	    			if (user_token == token) {
							let respMsg = Object.assign(requestResponse.common_signin_success)
							respMsg['result'] = user
	    				resolve(respMsg);
	    			} else {
	    				reject(requestResponse.token_invalid);
	    			}
			}).catch(err => reject(requestResponse.common_error));
		});


	exports.getProfile = email =>
	  	new Promise((resolve,reject) => {
	  		user.find({ email: email})
	  		.then(users =>{
					let respMsg = Object.assign(requestResponse.common_signin_success)
					respMsg['result'] = users[0]
					resolve(respMsg)
				})
	  		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))
		});
