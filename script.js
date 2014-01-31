  var io = require('socket.io').listen(app)
    , fs = require('fs')
    , connect = require('connect')
    , $ = require('jquery')
    , express = require('express')
    , app = express()
    , port = process.env.PORT || 5000;

  app.listen(port);
  app.set('view engine', 'ejs');

  // Defining Routes

app.get('/', function(req, res) {
  res.render('index', { content: 'The index page!' })
});

  // app.get('/', function (req, res) {
  //   res.send('Testing');
  //   console.log(Instagram.subscriptions.list());
  //   console.log('hello');

  // });

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

app.post('/endpoint', function(req, res) {
    var data = req.body;

    data.forEach(function(tag) {
      var url = 'https://api.instagram.com/v1/tags/' + tag.object_id + '/media/recent?client_id=70393263f72f44cc9a3ef9786a4d389f';
      sendMessage(url);

    });
    res.end();
});

function sendMessage(url) {
  io.sockets.emit('show', { show: url });
}

// app.get('/set_sub', function(req, res){
//   Instagram.subscriptions.subscribe({ object: 'tag', object_id: 'breakfast' });
//   Instagram.subscriptions.subscribe({ object: 'tag', object_id: 'food' });
//   Instagram.subscriptions.subscribe({ object: 'tag', object_id: 'lunch' });
//   Instagram.subscriptions.subscribe({ object: 'tag', object_id: 'dinner' });
//   res.writeHead(200);
//   res.end();
// });