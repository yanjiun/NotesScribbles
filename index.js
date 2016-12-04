var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

app.get('/',function(req,res){
    res.sendFile(__dirname + '/indexCanvas.html');
});

io.sockets.on('connection',function(socket){
    console.log('a user connected');
    socket.on('mousemove', function(data){
        socket.broadcast.emit('moving', data);
    });
    //socket.on('chat message', function(msg){
    //    io.emit('chat message', msg);
    //});
    //socket.on('disconnect',function(){
     //   console.log('user disconnected');
    //});
});

http.listen(3000,"0.0.0.0", function(){
	console.log('listening on *:3000');
});

