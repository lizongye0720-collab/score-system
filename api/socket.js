const { Server } = require('socket.io');

module.exports = (req, res) => {
    if (!res.socket.server.io) {
        console.log('初始化Socket.IO服务器');
        
        const io = new Server(res.socket.server, {
            path: '/api/socket',
            addTrailingSlash: false,
            cors: {
                origin: "*"
            }
        });
        
        io.on('connection', (socket) => {
            console.log('客户端连接:', socket.id);
            
            socket.on('broadcastUpdate', (data) => {
                // 向所有其他客户端广播更新
                socket.broadcast.emit('dataUpdated', data);
            });
            
            socket.on('disconnect', () => {
                console.log('客户端断开连接:', socket.id);
            });
        });
        
        res.socket.server.io = io;
    } else {
        console.log('Socket.IO服务器已存在');
    }
    
    res.end();
};
