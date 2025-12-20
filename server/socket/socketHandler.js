const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');

let io;
const userSockets = new Map(); // Map<userId, socketId>

const initializeSocket = (server) => {
    io = socketIo(server, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:3000",
            methods: ["GET", "POST"]
        }
    });

    // Authenticate Socket Connection
    io.use((socket, next) => {
        if (socket.handshake.query && socket.handshake.query.token) {
            jwt.verify(socket.handshake.query.token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) return next(new Error('Authentication error'));
                socket.user = decoded;
                next();
            });
        } else {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`User Connected: ${socket.user.id}`);
        
        // Map user ID to socket ID for direct messaging
        userSockets.set(socket.user.id, socket.id);
        
        // Join a room with their own User ID for easy notification targeting
        socket.join(socket.user.id);
        
        // Typing Events
        socket.on('typing', ({ recipientId }) => {
            if (userSockets.has(recipientId)) {
                io.to(userSockets.get(recipientId)).emit('typing', {
                    senderId: socket.user.id
                });
            }
        });

        socket.on('stop_typing', ({ recipientId }) => {
            if (userSockets.has(recipientId)) {
                io.to(userSockets.get(recipientId)).emit('stop_typing', {
                    senderId: socket.user.id
                });
            }
        });

        // Broadcast online status? (Optional for now)
        // io.emit('user_online', socket.user.id);

        socket.on('disconnect', () => {
            console.log('User Disconnected', socket.user.id);
            userSockets.delete(socket.user.id);
        });
    });

    return io;
};

const getIo = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};

module.exports = { initializeSocket, getIo };
