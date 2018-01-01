const io = require('socket.io')();

let queues = {};

let users = {};

io.on('connection', (client) => {

    // Songs
    client.on('getQueue', () => {
        room = Object.keys(client.rooms)[1]
        client.emit('updateQueue', queues[room]);
    });

    client.on('add', (song) => {
        room = Object.keys(client.rooms)[1]
        song.addedBy = users[client.id];
        queues[room].push(song)
        io.to(room).emit('updateQueue', queues[room]);
    });

    client.on('skip', () => {
        room = Object.keys(client.rooms)[1]
        queues[room].shift();
        io.to(room).emit('updateQueue', queues[room]);
    });

    client.on('remove', (index) => {
        room = Object.keys(client.rooms)[1]
        queues[room].splice(index, 1);
        io.to(room).emit('updateQueue', queues[room]);
    });

    // Users
    client.on('join', (room, name) => {
        room = room.toUpperCase();
        if(!queues[room]) {
            queues[room] = []
        }
        users[client.id] = name;
        client.join(room);
        client.emit('updateQueue', queues[room])
    });
});

const port = 3030;
io.listen(port);
console.log('socket listening on port ', port);