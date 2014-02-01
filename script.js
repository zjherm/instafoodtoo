  var io = require('socket.io').listen(app)
//    , fs = require('fs')
    , connect = require('connect')
    , $ = require('jquery')
    , express = require('express')
    , app = express()
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



// app.post('/endpoint', function(req, res) {
//     var data = req.body;

//     data.forEach(function(tag) {
//       var url = 'https://api.instagram.com/v1/tags/' + tag.object_id + '/media/recent?client_id=70393263f72f44cc9a3ef9786a4d389f';
//       sendMessage(url);

//     });
//     res.end();
// });

app.configure(function(){
    app.use(express.static(__dirname + '/public'));
});

app.get('/', function(req, res) {
  res.render('index', { 
    content: 'The index page!',
    secondary: "Another paragraph"
  })
});

app.post('/endpoint', function (req, res) {
    console.log(req.body); 
    console.log(Instagram.subscriptions.list());
});

app.get('/endpoint', function (req, res){
    Instagram.subscriptions.handshake(req, res); 
});

app.listen(port);

// SET UP SUBSCRIPTIONS THEN COMMENT OUT
// app.get('/set_sub', function(req, res){
//   Instagram.subscriptions.subscribe({ object: 'tag', object_id: 'breakfast' });
//   Instagram.subscriptions.subscribe({ object: 'tag', object_id: 'food' });
//   Instagram.subscriptions.subscribe({ object: 'tag', object_id: 'lunch' });
//   Instagram.subscriptions.subscribe({ object: 'tag', object_id: 'dinner' });
//   res.writeHead(200);
//   res.end();
// });