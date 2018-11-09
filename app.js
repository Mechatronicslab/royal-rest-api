'use strict';

const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');
const logger 	   = require('morgan');
const router 	   = express.Router();
const port 	   = process.env.PORT || 8080;
var http = require('http');
var server = http.createServer(app);
const setUp = require('./setup');

require('./routes/users')(router);
require('./routes/trackers')(router);
app.use(bodyParser.urlencoded({
  enableTypes:['json', 'form'],extended: false
}))
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(logger('dev'))
//setUp.dbConnect()

app.use('/', router)

server.listen(port)
server.on('listening', onListening)

//app.time(100)
//console.log(`App Runs on ${port}`);

async function onListening() {
  try {
    console.log('try to listen...')
    var addr = server.address();
    var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    setUp.dbConnect()
    //app.database = database
    console.log('Listening on ' + bind)
    //debug('Listening on ' + bind);
  } catch (error) {
    console.log(error)
    console.log('listen failed, try to reconnect in 5 secs...')
    setTimeout(function () {
      onListening()
    }, 5000);
  }
}
