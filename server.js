const express = require('express'),
    http = require('http'),
    socketIo = require('socket.io'),

    app = express(),
    server = http.createServer(app),
    port = 3000,
    io = socketIo(server),
    UsersService = require('./UsersService'),
    
    userService = new UsersService();

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
//funkcje, które zostaną wykonane po podłączeniu klienta:

    // klient nasłuchuje na wiadomość wejścia do czatu
    socket.on('join', (name) => {
        userService.addUser({
            id: socket.id,
            name
        });
        // aplikacja emituje zdarzenie update,
        //które aktualizuje informację na temat listy użytkowników
        //każdemu nasłuchującemu na wydarzenie 'update'
        io.emit('update', {
            users: userService.getAllUsers()
        });
    });

    socket.on('message', (message) => {
        const {name} = userService.getUserById(socket.id);
        socket.broadcast.emit('message', {
              text: message.text,
              from: name
        });
    });

    socket.on('disconnect', () => {
        userService.removeUser(socket.id);
        socket.broadcast.emit('update', {
            users: userService.getAllUsers()
        });
    });

});

server.listen(port, () => {
    console.log(`listening on *:${port}`);
});