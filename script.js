var util = require('util'),
  http = require('http'),
  express = require('express'),
  ejs = require('ejs'),
  app = express(),
  Instagram = require('instagram-node-lib');

//Listen on port 3000
var port = process.env.PORT || 3000;
var server = app.listen(port);
var io = require('socket.io').listen(server);

//This is required to work on Heroku; it defaults to long polling; actual web-sockets not supported
io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

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

Instagram.set('client_id', '70393263f72f44cc9a3ef9786a4d389f');
Instagram.set('client_secret', 'fa2725e2a08a4158bad297f35b5c6bec');
Instagram.set('callback_url', 'http://instafood.herokuapp.com/endpoint');

app.post('/endpoint', function (req, res) {
     var body = "";
        req.on('data', function (chunk) {
          body += chunk;
        });
        req.on('end', function () {
          getPhoto(body);
          res.writeHead(200);
          res.end();
        });
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


function getPhoto(body){
  console.log("=======================BODY========================");
  console.log(body);
  console.log("====================END BODY=======================");
}


console.log("Listening on port " + port);

