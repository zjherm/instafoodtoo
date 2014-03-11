var util = require('util'),
  http = require('http'),
  express = require('express'),
  ejs = require('ejs'),
  app = express(),
  Instagram = require('instagram-node-lib'),
  $ = require('jquery');


//Listen on port 3000
var port = process.env.PORT || 3000;
var server = app.listen(port);
var io = require('socket.io').listen(server);

//This is required to work on Heroku; it defaults to long polling; actual web-sockets not supported
// io.configure(function () { 
//   io.set("transports", ["xhr-polling"]); 
//   io.set("polling duration", 10); 
// });

Instagram.set('client_id', 'INSTAGRAM_CLIENT_ID');
Instagram.set('client_secret', 'INSTAGRAM_CLIENT_SECRET');
Instagram.set('callback_url', 'http://instafoodtoo.jit.su/endpoint');
Instagram.set('redirect_uri', 'http://instafoodtoo.jit.su/');

// app.use(express.static(__dirname + '/'));
app.use(express.static(__dirname + '/Public'));
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.use(express.bodyParser()); // get information from html forms

app.use(express.logger());

app.post('/endpoint', function (req, res) {
    getPhoto(req.body);
    res.send(200);
});

app.get('/endpoint', function (req, res){
    Instagram.subscriptions.handshake(req, res); 
});

app.get('/', function(req, res){
  res.render('index.ejs', {
    layout:false,
    locals: { 
      someVariable: "blah"
    }
  });
  
});


// Get Form Data
io.sockets.on('connection', function(socket) {
  socket.on('data', function(data) {
    console.log("heres the hash " + data.hash);
    Instagram.subscriptions.subscribe({ object: 'tag', object_id: data.hash });
    // Instagram.subscriptions.list( function (err, data) {
    //   console.log("subscription list" + data);
    // });
  });
  socket.on('disconnect', function() {
    console.log("disconnected"); // not working at this point.. 
  });
});

function getPhoto(inf){
  prt = inf[0]; // Grab the first object, IG sends about 20..
  console.log("heres subscriptionid " + prt.subscription_id)
  console.log("=======================BODY========================");
  Instagram.tags.recent({
    name: prt.object_id,
    complete: function(data){
        if(data[0] == null){
        }else{
          var piece = {};
          piece.img = data[0].images.standard_resolution.url;
          piece.url = data[0].link;
          piece.long = data[0].location.longitude;
          piece.lat = data[0].location.latitude;
          piece.caption = data[0].caption.text;
          piece.username = data[0].user.username;
          piece.userpic = data[0].user.profile_picture;
          piece.comments = data[0].comments.data;
          piece.tags = data[0].tags;
          io.sockets.emit('photo', piece);
        }
    }
  });
  console.log("====================END BODY=======================");
}
