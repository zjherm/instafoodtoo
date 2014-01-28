var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
  , connect = require('connect')
  , $ = require('jquery')
  , port = process.env.PORT || 5000;

app.listen(port);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.emit('stuff', function() {
    console.log("http server listening on %d", port);
  )};
  socket.on('my other event', function (data) {
    console.log(data);
  });

});

Instagram = require('instagram-node-lib');

Instagram.set('client_id', '70393263f72f44cc9a3ef9786a4d389f');
Instagram.set('client_secret', 'fa2725e2a08a4158bad297f35b5c6bec');
Instagram.set('callback_url', 'http://serene-basin-7449.herokuapp.com/api');

Instagram.tags.info({
  name: 'blue',
  complete: function(data){
    console.log(data);
  }
});

// Instagram.subscriptions.subscribe({
//   object: 'tag',
//   object_id: 'breakfast',
//   aspect: 'media',
//   callback_url: 'http://serene-basin-7449.herokuapp.com/api',
//   type: 'subscription',
//   id: '#'
// });

// app.get('/api', function (req, res) {
//   // first we tell our connected clients that there has been a new picture posted
//   socket.emit('newPicture', req.body); // This sends the new picture to all connected clients.
//   // Do whatever else you want here.
// });