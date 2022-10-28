const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors')
const webPush = require('web-push')

const Subscribe = require('./schema.js')

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const uri = 'mongodb+srv://jidonu2:shegzy1234@push-notification.o5npj91.mongodb.net/?retryWrites=true&w=majority'

const vapidKeys = {
  publicKey: 'BNgZPgqinBqkHBKtXdGU1xASx5GzjPoLLMP9QiXCV9RCBx-7jjHdb8ME1LFgNxhaVVoxTjrKGP6P9DuaYjUnXyg',
  privateKey: '13TX6AZBp96EoJCCMkeoxybNNCym_yzd69hs64h6z18'
}
webPush.setVapidDetails(
  'mailto:example@yourdomain.org',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

async function connect() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to mongoDB")
  } catch(err) {
    console.log(err)
  }
}
connect();

app.post("/subscribe", (req, res) => {
  const data = req.body
  Subscribe.findOne({sub: data})
  .then(result => {
    if (!result) {
      const subscribe = new Subscribe({sub: data})
      subscribe.save((error) => {
        if(error) {
          res.status(500).json({msg: `An error occur... subscription not save ${error}`})
          return;
        } 
        return res.status(200).json({msg: 'Data saved successfully'});
      });
    } else {
      res.status(500).json({msg: `Subscription already exist`})
      return;
    }
  })
})

app.get("/subscribe", (req, res) => {
  Subscribe.find({}, (error, datas) => {
    if(error) {
      res.status(500).json({msg: "An error occur... could not get data from the databse"})
      return;
    } 
    if(datas.length > 0) {
      datas.map((data) => {
        data?.sub && webPush.sendNotification(data.sub, 'Your Push Payload Text');
      })
      return res.status(200).json({txt: "Notification sent successfully"})
    }
  })
})

app.listen(process.env.PORT || 4001, () => console.log("Server running on port 4001"))






















// const webSocketsServerPort = 8000;
// const webSocketServer = require('websocket').server;
// const http = require('http');
// // Spinning the http server and the websocket server.
// const server = http.createServer();
// server.listen(webSocketsServerPort);
// console.log('listening on port 8000')
// const wsServer = new webSocketServer({
//   httpServer: server
// });

// // I'm maintaining all active connections in this object
// const clients = {};

// // This code generates unique userid for everyuser.
// const getUniqueID = () => {
//   const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
//   return s4() + s4() + '-' + s4();
// };

// wsServer.on('request', function(request) {
//   var userID = getUniqueID();
//   console.log((new Date()) + ' Recieved a new connection from origin ' + request.origin + '.');
//   // You can rewrite this part of the code to accept only the requests from allowed origin
//   const connection = request.accept(null, request.origin);
//   clients[userID] = connection;
//   console.log('connected: ' + userID + ' in ' + Object.getOwnPropertyNames(clients))

//   connection.on('message', function(message){

//     if(message.type === 'utf8') {
//         console.log('Received Message: ', message.utf8Data);
//         console.log("Clients: ",clients)
//         for(key in clients) {
//             clients[key].sendUTF(message.utf8Data);
//             console.log('Sent Message to: ', clients[key]);
//         }
//     }
//   })
// });