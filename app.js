var express = require("express"),
    app = express();
var exphbs = require('express-handlebars');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var redis = require('socket.io-redis');
var SpotifyWebApi = require('spotify-web-api-node');
var path = require('path');

app.use('/dist', express.static(path.join(__dirname, 'dist')));
app.use('/node_dist', express.static(path.join(__dirname, 'node_modules')));

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

io.adapter(redis({ host: 'redis', port: 6379 }));

app.get('/', function(req, res){
    res.render('home');
});

var spotifyApi = new SpotifyWebApi({
  clientId : '4658a83f5b35440398ea4f3590979658',
  clientSecret : 'f4c1782bf58446518647dd2c9a272bc2'
});

spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    console.log('The access token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token']);

  }, function(err) {
        console.log('Something went wrong when retrieving an access token', err);
  });

io.on('connection', function(socket){
  socket.on('voter search', function(request){

    switch(request.type){
      case 'Artist':
        var search = spotifyApi.searchArtists(request.search);
        break;
      case 'Album':
        var search = spotifyApi.searchAlbums(request.search);
        break;
      default:
        var search = spotifyApi.searchTracks(request.search);
        break;
    }

    search.then(function(data) {
      var response = {
        type: request.type,
        value: data
      };
      io.emit('voter response', response);
    }, function(err) {
      console.error(err);
    }); 
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});