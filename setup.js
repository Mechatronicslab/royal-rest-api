const config = require('./config/config.json')
const mongodbUri = config['database']['production']['uri']
const client = require('mongoose')

const options = {
  useMongoClient: true,
  autoIndex: false, // Don't build indexes
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0,
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4 // Use IPv4, skip trying IPv6

};


function dbConnect() {
    return new Promise((resolve, reject) => {
      client.Promise = global.Promise;
        client.connect(mongodbUri,options,(err, database) => {
            if (err) { console.log("Connected to mongodb server failed");
            reject(err);
          }else
          resolve(database)
        });
    });
}

const requestResponse = {
    common_signin_success: {
        success: true,
        rc: '0000',
        rm: 'Berhasil memuat permintaan'
    },
    common_success: {
        success: true,
        rc: '0000',
        rm: 'Berhasil memuat permintaan'
    },
    common_success_simple: {
        success: true,
        rc: '0000',
        rm: 'Berhasil memuat permintaan'
    },
    account_not_found: {
        success: false,
        rc: '401',
        rm: 'Akun tidak terdaftar atau password tidak sesuai'
    },
    common_error: {
        success: false,
        rc: '5000',
        rm: 'Server tidak merespon, silahkan hubungi call center untuk info lebih lanjut'
    },
    email_already_use: {
          success: false,
          rc: '0011',
          rm: 'Email sudah digunakan'
    },
    phone_number_already_use: {
          success: false,
          rc: '0012',
          rm: 'Nomor telepon telah digunakan'
    },
    user_already_like: {
          success: true,
          rc: '0013',
          rm: 'Like'
    },
    user_not_like: {
          success: false,
          rc: '0000',
          rm: 'Unlike'
    },
  }

module.exports = {requestResponse,mongodbUri,dbConnect}
