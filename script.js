  var io = require('socket.io').listen(app)
//    , fs = require('fs')
    , connect = require('connect')
    , $ = require('jquery')
    , express = require('express')
    , app = express()
    , https = require("https")
    , port = process.env.PORT || 5000;

// SETTING UP EJS

// Register ejs as .html. If we did
// not call this, we would need to
// name our views foo.ejs instead
// of foo.html. The __express method
// is simply a function that engines
// use to hook into the Express view
// system by default, so if we want
// to change "foo.ejs" to "foo.html"
// we simply pass _any_ function, in this
// case `ejs.__express`.
app.engine('.html', require('ejs').__express);

// Optional since express defaults to CWD/views
app.set('views', __dirname + '/views');

// Without this you would need to
// supply the extension to res.render()
// ex: res.render('users.html').
app.set('view engine', 'html');

app.configure(function(){
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
    app.use(express.errorHandler());
});

app.listen(port);

  // app.get('/endpoint', function (req, res) { 
  //   // For convention's sake, we only respond to this if it's a properly formatted request from Instagram
  //   if (req.query['hub.challenge']) {
  //     // First we check if hub.challenge exists in the query, then we do something
  //     res.send(req.query['hub.challenge']);
  //   }
  // });


Instagram = require('instagram-node-lib');

Instagram.set('client_id', '70393263f72f44cc9a3ef9786a4d389f');
Instagram.set('client_secret', 'fa2725e2a08a4158bad297f35b5c6bec');
Instagram.set('callback_url', 'http://instafood.herokuapp.com/endpoint');

app.post('/endpoint', function (req, res) {
    console.log(req.body); 
    console.log("on app.post this is good!!!!!!!!!!!!!!")
});

app.get('/endpoint', function (req, res){
    Instagram.subscriptions.handshake(req, res); 
});

app.get('/', function(req, res) {
  res.render('index', { 
    content: 'The index page!',
    secondary: "Another paragraph"
  });
    Instagram.subscriptions.subscribe({ object: 'tag', object_id: 'breakfast' });
    Instagram.subscriptions.subscribe({ object: 'tag', object_id: 'food' });
    Instagram.subscriptions.subscribe({ object: 'tag', object_id: 'lunch' });
    Instagram.subscriptions.subscribe({ object: 'tag', object_id: 'dinner' });
    console.log(Instagram.subscriptions.list());

});

// CRISTIAN: THIS IS STUFF I'VE ADDED SINCE OUR LAST EMAIL, JUST TESTING..


// POST /callback
//   Receives POST nofications with the geometries updated
//   Each notification contains a geography_id, which is
//   the identifier of the geography that has a new photo.
//   It's necessary to perform another API call to get the last
//   photo from that geography
app.post('/endpoint', function(req, res){
  // request.body is a JSON already parsed
  var data = req.body;

  data.forEach(function(tag) {
      var url = 'https://api.instagram.com/v1/tags/' + tag.object_id + '/media/recent?client_id=70393263f72f44cc9a3ef9786a4d389f';
      sendMessage(url);
      console.log("this is the url: " + url);
  });

  red.end();

});

function sendMessage(url) {
  io.sockets.emit('show', { show: url });
}

console.log("Listening on port " + port);

