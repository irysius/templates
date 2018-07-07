export interface ISessionManager {
    create(socket: SocketIO.Socket, user: IUser): string;
    isValid(token: string): boolean;
    invalidate(token: string): void;
    getUser(socket: SocketIO.Socket): IUser;
    middleware;
}
interface IUser {
    username: string;
}
interface IMap<T> {
    [key: string]: T;
}

// NOTE: Currently for testing purposes only
// Register username? Register active socket ids?
export function SessionManager(): ISessionManager {
    const TOKEN = 'SAMPLE-TOKEN';
    let _user: IUser;
    let socketIds: IMap<boolean> = {};
    function create(socket: SocketIO.Socket, user: IUser): string {
        socketIds[socket.id] = true;
        _user = user;
        return TOKEN;
    }
    function isValid(token: string): boolean {
        return token === TOKEN;
    }
    function invalidate(token: string): void {

    }
    function getUser(socket: SocketIO.Socket): IUser {
        if (socketIds[socket.id]) {
            return _user;
        }
    }
    function middleware(socket: SocketIO.Socket, next: (err?) => void) {
        let { token } = socket.handshake.query;
        if (isValid(token)) {
            socketIds[socket.id] = true;
            return next();
        } else {
            return next(new Error('Invalid authentication token.'));
        }
    }

    return {
        create, isValid, invalidate, getUser,
        middleware
    };
}