  var io = require('socket.io').listen(app)
    , fs = require('fs')
    , connect = require('connect')
    , $ = require('jquery')
  //  , ngrok = require('ngrok')
    , express = require('express')
    , app = express()
    , port = process.env.PORT || 5000;

  //ngrok.connect(5000, function (err, url) {
    
  //})

  app.listen(port);

  // function handler (req, res) {
  //   fs.readFile(__dirname + '/index.html',
  //   function (err, data) {
  //     if (err) {
  //       res.writeHead(500);
  //       return res.end('Error loading index.html');
  //     }

  //     res.writeHead(200);
  //     res.end(data);
  //   });
  // }

  io.sockets.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.emit('stuff', function() {
      console.log("http server listening on %d", port);
    });
    socket.on('my other event', function (data) {
      console.log(data);
    });

  });

  // Defining Routes

  app.use(express.static(process.cwd() + '/public'));

  app.get('/', function (req, res) {
    res.send('Testing');

  });

  // app.get('/endpoint', function (req, res) { 
  //   // For convention's sake, we only respond to this if it's a properly formatted request from Instagram
  //   if (req.query['hub.challenge']) {
  //     // First we check if hub.challenge exists in the query, then we do something
  //     res.send(req.query['hub.challenge']);
  //   }
  // });

  // app.use(express.bodyParser());

  // app.post('/endpoint', function (req, res) {
  //   console.log(req.body);
  // });

Instagram = require('instagram-node-lib');

Instagram.set('client_id', '70393263f72f44cc9a3ef9786a4d389f');
Instagram.set('client_secret', 'fa2725e2a08a4158bad297f35b5c6bec');
Instagram.set('callback_url', 'http://instafood.herokuapp.com/endpoint');

app.get('/endpoint', function(req, res){
    Instagram.subscriptions.handshake(req, res); 
});
// app.post('/endpoint', function(req, res){    
//       var body = "";
//       req.on('data', function (chunk) {
//         body += chunk;
//       });
//       req.on('end', function () {
//         getPhoto(body);
//         res.writeHead(200);
//         res.end();
//       });
// });

  app.get('/', function (req, res) {
    console.log(Instagram.subscriptions.list());

  });

// app.get('/set_sub', function(req, res){
//   Instagram.subscriptions.subscribe({ object: 'tag', object_id: 'breakfast' });
//   Instagram.subscriptions.subscribe({ object: 'tag', object_id: 'food' });
//   Instagram.subscriptions.subscribe({ object: 'tag', object_id: 'lunch' });
//   Instagram.subscriptions.subscribe({ object: 'tag', object_id: 'dinner' });
//   res.writeHead(200);
//   res.end();
// });