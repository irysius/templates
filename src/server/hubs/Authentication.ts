import { Hub, HubTemplate, augmentHub, HubSend } from '@irysius/anguli-components/Hub';
import { Authentication } from '../../shared/Authentication';
import { ISessionManager } from '../SessionManager';
type IReceive = Authentication.Hub.IReceive;
type ISend = Authentication.Hub.ISend;

export interface IAuthenticationHub extends Hub<IReceive, ISend> {

}
export interface IOptions {
    io: SocketIO.Server;
    sessionManager: ISessionManager;
}
export function AuthenticationHub(options: IOptions): IAuthenticationHub {
    let { io, sessionManager } = options;

    function connect(socket: SocketIO.Socket) {
        console.log(`connected: ${socket.id}`);
    }

    function authenticate(this: HubSend<ISend>, creds: Authentication.ICredentials, socket: SocketIO.Socket) {
        // NOTE: For the purposes of this example, authentication always succeeds.
        let token = sessionManager.create(socket, creds);
        this.success({ token }, socket.id);
    }

    let template: HubTemplate<IReceive, ISend> = {
        path: '/authenticate',
        connect,
        receive: { 
            authenticate
        },
        sendTypes: { success: null, failure: null }
    };

    augmentHub(template, io);
    let hub = template as IAuthenticationHub;
    return hub;
}
