const { Server } = require('socket.io');

let io;
const { FRONTEND_DOMAIN_URL } = process.env;

module.exports = {
    init: (httpServer) => {
        io = new Server(httpServer, {
            cors: {
                origin: FRONTEND_DOMAIN_URL,
                withCredentials: true,
            },
        });
        return io;
    },
    getIO: () => {
        if (!io) {
            throw new Error('Socket.io not initialized!');
        }
        return io;
    },
};
