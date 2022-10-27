const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const webPush = require('web-push')

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const vapidKeys = {
  publicKey: 'BNgZPgqinBqkHBKtXdGU1xASx5GzjPoLLMP9QiXCV9RCBx-7jjHdb8ME1LFgNxhaVVoxTjrKGP6P9DuaYjUnXyg',
  privateKey: '13TX6AZBp96EoJCCMkeoxybNNCym_yzd69hs64h6z18'
}
webPush.setVapidDetails(
  'mailto:example@yourdomain.org',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

app.get("/", (req, res) => {
  res.status(200).json({})
})

app.get("/subscribe", (req, res) => {
  const sub = {"endpoint":"https://fcm.googleapis.com/fcm/send/frjEiPd-Sbk:APA91bGhavEEnUv5xAra_UEP2pRdce354EIYgfVI_NgN6aONYh876bGnnOVq8ITWOHf3uX0dPwoZOVCTFF6b2dK6LnUquN4qX1JGTfFkrz0x2csFLqk_s_yFzFx_wOn_no0NIB68tXyw","expirationTime":null,"keys":{"p256dh":"BAMYva7MUsqsXzNB5HFFgyHWeZpjtQOHA2NDRq7t4mcyXyJ69wIIYuCUozTsPKN18sI-x7yz6ieQI2a4DkU8JZk","auth":"TVoKMUzcv6wb3Yj-tdsfrg"}}
  webPush.sendNotification(sub, 'Your Push Payload Text');
  res.status(200).json(sub);
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