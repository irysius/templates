import * as io from 'socket.io';
export function Timer(io: io.Server) {
    setInterval(() => {
        io.emit('server-time', new Date().toISOString());
    }, 1000);
}

