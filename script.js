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

Instagram.set('client_id', '98196d9d542248b2aab2261a9b121696');
Instagram.set('client_secret', 'bb34b287393a489c8d71433137e9439b');
Instagram.set('callback_url', 'http://instafood.herokuapp.com/endpoint');



app.use(express.static(__dirname + '/'));
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

app.use(express.logger());

app.post('/endpoint', function (req, res) {
     var body = "";
        req.on('data', function (chunk) {
          console.log('chunk');
          body += chunk;
        });
        req.on('end', function () {
          console.log('end');
          getPhoto(body);
          res.writeHead(200);
          res.end();
        });
});

app.get('/endpoint', function (req, res){
    Instagram.subscriptions.handshake(req, res); 
});
app.get('/', function(req, res){
      res.render('index.ejs', {
      layout:false,
      locals: { 
        someVariable: "value"
         }
      });
  });
app.get('/set_sub', function(req, res) {
    Instagram.subscriptions.subscribe({ object: 'tag', object_id: 'sherman' });
    Instagram.subscriptions.subscribe({ object: 'tag', object_id: 'lebron' });
    console.log(Instagram.subscriptions.list());
    res.writeHead(200);
    res.end();

});

function getPhoto(inf){
  inf = JSON.parse(inf);
  prt = inf[0]; 
  console.log("=======================BODY========================");
  Instagram.tags.recent({
    name: prt.object_id,
    complete: function(data){
        if(data[0] == null){
        }else{
          var piece = {};
          piece.img = data[0].images.low_resolution.url;
          piece.url = data[0].link;
          console.log(piece.img)
          io.sockets.emit('alert', prt.object_id);
          io.sockets.emit('photo', piece);
        }
    }
  });
  console.log("====================END BODY=======================");
}


