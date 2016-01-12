var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3002;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

var numUsers = 0;
var socketJson={};

io.on('connection', function (socket) {
socket.on('add user', function (data) {
   //连接成功广播用户
     socket.username=data.username;
     socket.broadcast.emit('message', {
      username: socket.username,
      message: data.message
    });
    socketJson[socket.username]=socket;
})

socket.on('message', function (json) {
    var to=json.to;
    if(to !=""){
      socketJson[to].emit('message', json); 
    }else{
      socket.broadcast.emit('message', json); 
    }
    socket.emit('message', json); 

})



  socket.on('disconnect', function () {
     var json={};
     json.username=socket.username;
     json.message="logout";
     if(socket.username !=undefined){
     delete socketJson[socket.username];
     socket.broadcast.emit('message', json);
   }
    
  
    
  });
});