var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var redis = require('socket.io-redis');
var SpotifyWebApi = require('spotify-web-api-node');

io.adapter(redis({ host: 'redis', port: 6379 }));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', "Voter: " + msg); 
  });
});

// var spotifyApi = new SpotifyWebApi({
//   clientId : '4658a83f5b35440398ea4f3590979658',
//   clientSecret : 'f4c1782bf58446518647dd2c9a272bc2',
//   redirectUri : 'http://www.example.com/callback'
// });

var spotifyApi = new SpotifyWebApi();

// Get Elvis' albums
spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE')
  .then(function(data) {
    console.log('Artist albums', data.body);
  }, function(err) {
    console.error(err);
  });

http.listen(3000, function(){
  console.log('listening on *:3000');
});