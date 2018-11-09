const auth = require('basic-auth');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const userController = require('../controller/user_controller');
const password = require('../controller/password');
const config = require('../config/config.json');



const storage = multer.diskStorage({
		destination: function(req, file, cb) {
			cb(null, './uploads');
		},
		filename: function(req, file, cb) {
			cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
		}
	});


	const fileFilter = (req, file, cb) => {
		// reject a file
		if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
			cb(null, true);
		} else {
			cb(null, false);
		}
	};

	const upload = multer({
		storage: storage,
		limits: {
			fileSize: 1024 * 1024 * 5
		},
		//fileFilter: fileFilter
	});
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
				let email = result.message ;
				userController.updateToken(email,token)
				.then(result =>{
						//res.json(result)
												// var _tok = {access_token : token}
												// var name = {name : result.name}
												// var email = {email : result.email}
												// var phone_number = {phone_number : result.phone_number}
												// var city = {city : result.city}
												// var city_code = {city_code : result.city_code}
												// var address = {address : result.address}
												// var created= {created_at : result.created_at}
												// var data = Object.assign(name,email,phone_number,city,city_code,address,created,_tok)
												// var msg = Object.assign(requestResponse.common_signin_success)
												// msg['result']= data
												// res.json(msg)
					userController.getProfile(email)
					.then(result =>{
						res.json(result)
					}).catch(err => res.json(err));
				}).catch(err => res.json(err));
			}).catch(err => res.json(err));
		}
	});

	var upload_ = upload.fields([{name: 'user_photo', maxCount: 1},{name: 'ktp_photo', maxCount: 1}])
	router.post('/users/signup',upload_,(req, res) => {
		const name = req.body.name
		const nik = req.body.nik
		const gender = req.body.gender
		const tmpt_lahir = req.body.tmpt_lahir
		const tgl_lahir = req.body.tgl_lahir
		const address = req.body.address
		const phone_number1 = req.body.phone_number1
		const phone_number2 = req.body.phone_number2
		const email = req.body.email
		const city = req.body.city
		const city_code = req.body.city_code
		const user_photo = req.files['user_photo'][0].filename
		const ktp_photo = req.files['ktp_photo'][0].filename
		const kk_photo = req.files['kk_photo'][0].filename
		const ijasah_photo = req.files['ijasah_photo'][0].filename
		const kendaraan_photo = req.files['kendaraan_photo'][0].filename
		const merk_kendaraan = req.body.merk_kendaraan
		const jns_kendaraan = req.body.jns_kendaraan
		const thn_kendaraan = req.body.thn_kendaraan
		const no_plat = req.body.no_plat
		const area_prioritas = req.body.area_prioritas
		const area_sekunder = req.body.area_sekunder
		const data_referensi = req.body.data_referensi
		const password = req.body.password

		console.log(user_photo)
		console.log(ktp_photo)

		if (!name || !email || !phone_number ||!city || !city_code || !address ||!password ||
				!name.trim() || !email.trim() || !phone_number.trim() || !city.trim() || !city_code.trim() || !address.trim() || !password.trim()) {

			res.status(400).json({message: 'Invalid Request !'});

		} else {
			userController.registerUser(name,email,phone_number,city,city_code,address,password,no_plat,image,user_photo,ktp_photo)
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

	router.post('/users/checkToken',(req, res) => {
      const email = req.body.email;
      const token = req.headers['x-access-token'] ;
        userController.checkToken(email,token)
        .then(result => {
          res.json(result)
        })
        .catch(err => res.json(err));
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
