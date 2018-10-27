const trackerController = require('../controller/tracker_controller');
const setup = require('../setup')
const requestResponse = setup.requestResponse
const multer = require('multer');
const mongoose = require('mongoose');
module.exports = router => {
  router.post('/tracker/create',(req, res) => {
      const email = req.body.email;
      const distance = req.body.distance;
      const speed = req.body.speed ;
        trackerController.create_tracker(email,distance,speed)
        .then(result => {
          res.json(result)
        })
        .catch(err => res.json(err));
    });
}
