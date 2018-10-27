'use strict';

const auth = require('basic-auth');
const jwt = require('jsonwebtoken');

const userController = require('../controller/user_controller');
const password = require('../controller/password');
const config = require('../config/config.json');
const setup = require('../setup')
const requestResponse = setup.requestResponse
module.exports = router => {

	router.get('/', (req, res) => res.end('Royal Video Ads !'));

	router.post('/users/signin', (req, res) => {

		const credentials = auth(req);

		if (!credentials) {

			res.status(400).json({ rm: 'Invalid Request !' });

		} else {

			userController.loginUser(credentials.name, credentials.pass)

			.then(result => {

				const token = jwt.sign(result, config.secret, { expiresIn: 1440 });

				userController.getProfile(result.message)
				.then(result =>{
												var _tok = {access_token : token}
												var name = {name : result.name}
												var email = {email : result.email}
												var phone_number = {phone_number : result.phone_number}
												var city = {city : result.city}
												var city_code = {city_code : result.city_code}
												var address = {address : result.address}
												var created= {created_at : result.created_at}
												var data = Object.assign(name,email,phone_number,city,city_code,address,created,_tok)
												var msg = Object.assign(requestResponse.common_signin_success)
												msg['result']= data
												//res.json(Object.assign(requestResponse.common_success,{result:data}))
												res.json(msg)
												//res.json(result)

			})
				.catch(err => res.json(err));
			})

			.catch(err => res.json(err));
		}
	});

	router.post('/users/signup', (req, res) => {

		const name = req.body.name;
		const email = req.body.email;
		const phone_number = req.body.phone_number;
		const password = req.body.password;
		const city = req.body.city;
		const city_code = req.body.city_code;
		const address = req.body.address;

		if (!name || !email || !phone_number ||!city || !city_code || !address || !password || !name.trim() || !email.trim() || !phone_number.trim() || !city.trim() || !city_code.trim() || !address.trim() || !password.trim()) {

			res.status(400).json({message: 'Invalid Request !'});

		} else {
			userController.registerUser(name,email,phone_number,city,city_code,address, password)
			.then(result => {
				//res.setHeader('Location', '/users/'+email);
				res.json(result)
			})
			.catch(err => res.json(err));
		}
	});

	router.get('/users/:id', (req,res) => {

		if (checkToken(req)) {

			userController.getProfile(req.params.id)

			.then(result => res.json(result))

			.catch(err => res.status(err.status).json({ message: err.message }));

		} else {

			res.status(401).json({ message: 'Invalid Token !' });
		}
	});

	router.put('/users/:id', (req,res) => {

		if (checkToken(req)) {

			const oldPassword = req.body.password;
			const newPassword = req.body.newPassword;

			if (!oldPassword || !newPassword || !oldPassword.trim() || !newPassword.trim()) {

				res.status(400).json({ message: 'Invalid Request !' });

			} else {

				password.changePassword(req.params.id, oldPassword, newPassword)

				.then(result => res.status(result.status).json({ message: result.message }))

				.catch(err => res.status(err.status).json({ message: err.message }));

			}
		} else {

			res.status(401).json({ message: 'Invalid Token !' });
		}
	});

	router.post('/users/:id/password', (req,res) => {

		const email = req.params.id;
		const token = req.body.token;
		const newPassword = req.body.password;

		if (!token || !newPassword || !token.trim() || !newPassword.trim()) {

			password.resetPasswordInit(email)

			.then(result => res.status(result.status).json({ message: result.message }))

			.catch(err => res.status(err.status).json({ message: err.message }));

		} else {

			password.resetPasswordFinish(email, token, newPassword)

			.then(result => res.status(result.status).json({ message: result.message }))

			.catch(err => res.status(err.status).json({ message: err.message }));
		}
	});

	function checkToken(req) {

		const token = req.headers['x-access-token'];

		if (token) {

			try {

  				var decoded = jwt.verify(token, config.secret);

  				return decoded.message === req.params.id;

			} catch(err) {

				return false;
			}

		} else {

			return false;
		}
	}
}
