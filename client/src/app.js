var express = require("express"),
    app = express();
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var redis = require('socket.io-redis');
var SpotifyWebApi = require('spotify-web-api-node');
var path = require('path');

app.use('/dist', express.static(path.join(__dirname, 'dist')));
app.use('/node_dist', express.static(path.join(__dirname, 'node_modules')));

// io.adapter(redis({ host: 'redis', port: 6379 }));

app.use(express.static(__dirname));

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname,'index.html'))
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
      var container = data.body.tracks || data.body.artists || data.body.albums;
      var response = {
        type: request.type,
        booleans: {
          isAlbumSearch: data.body.albums ? true : false,
          isArtistSearch: data.body.artists ? true : false,
          isTrackSearch: data.body.tracks ? true : false
        },
        items: container.items,
        limit: container.limit,
        total: container.total,
        offset: container.offset,
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