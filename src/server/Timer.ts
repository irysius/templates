import * as io from 'socket.io';
export function Timer(io: io.Server) {
    setInterval(() => {
        io.emit('server-time', new Date().toISOString());
        
    }, 1000);

    let angle = 0;
    setInterval(() => {
        angle += 0.05;
        if (angle > Math.PI * 2) {
            angle = angle % (Math.PI * 2);
        }
        io.emit('rotation', angle);
    }, 1000 / 60);
}

