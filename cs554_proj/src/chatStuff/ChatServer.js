var express = require('express');
var app = express();
var socket = require('socket.io');

var allMessages = [];

server = app.listen(8080, function(){
    console.log('server is running on port 8080')
});

io = socket(server);

// io.on('connection', (socket) => {
//     console.log(socket.id);
// });

io.on('connection', (socket) => {
    console.log(socket.id);

    socket.on("GET_ALL_MESSAGES",function(){
        io.emit("RECIEVE_INITIAL_MESSAGES",allMessages)
    })

    socket.on('SEND_MESSAGE', function(data){
        allMessages.push(data)
        io.emit('RECEIVE_MESSAGE', data);
    })
});