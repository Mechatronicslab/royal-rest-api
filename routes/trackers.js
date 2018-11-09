const trackerController = require('../controller/tracker_controller');
const userController = require('../controller/user_controller');
const setup = require('../setup')
const requestResponse = setup.requestResponse
const multer = require('multer');
const mongoose = require('mongoose');
module.exports = router => {
  router.post('/tracker/create',(req, res) => {
      let token = req.headers['x-access-token']
      let email = req.body.email;
      let distance = req.body.distance;
      let speed = req.body.speed ;
      console.log(token)
        userController.checkToken(email,token)
        .then((result) => {
          trackerController.update_tracker(email,distance)
          .then(result => {
            res.json(result)
          }).catch(err => res.json(err));
        }).catch(err => res.json(err));
    });

    router.post('/tracker/checkTotalTrip',(req, res) => {
        let token = req.headers['x-access-token']
        let email = req.body.email;

        console.log(token)
          userController.checkToken(email,token)
          .then((result) => {
            trackerController.checkTotalTrip(email)
            .then(result => {
              res.json(result)
            }).catch(err => res.json(err));
          }).catch(err => res.json(err));
    });

    router.get('/tracker/listTrip/:email',(req, res) => {
      let email = req.params.email;
      trackerController.getTripById(email)
      .then(result => {
        res.json(result)
      })
      .catch(err => res.json(err));


    });
}
