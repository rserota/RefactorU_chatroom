
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var socketio = require('socket.io')
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//index route
app.get('/', routes.index);
 
//Create the server
var server = http.createServer(app)

//Start the web socket server
var io = socketio.listen(server);

var users = {}

//If the client just connected
io.sockets.on('connection', function(socket) {
    users[socket.id] = {name : ''}
    socket.emit('message','Server has connected!')
    io.sockets.emit('userlist',users)
    socket.on('message', function(data){
        console.log(data)
        io.sockets.emit('message',data)
    }) 

    socket.on('setname', function(data){
        console.log(data)
        socket.set('name',data, function(){console.log('socket name: ', socket.name)})
        users[socket.id]['name'] = data

    })
    socket.on('connectmessage', function(data){
        console.log(data)
        socket.broadcast.emit('message',data)
    }) 

    socket.on('disconnect',function(data){
        console.log(data)
        io.sockets.emit('message','Someone Left...')
        delete users[socket.id]
        io.sockets.emit('userlist', users)
    })
});



server.listen(3000, function(){
  console.log('Express server listening on port ' + app.get('port'));
});


