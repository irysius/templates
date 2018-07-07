import { Authentication } from './../../shared/Authentication';
import { Client, ClientTemplate, augmentClient, ClientSend } from '@irysius/anguli-components/Client';
import { EventEmitter } from '../EventEmitter';
type IReceive = Authentication.Client.IReceive;
type ISend = Authentication.Client.ISend;

type ISuccessCallback = (token: string) => void;
type IFailureCallback = (reason: string) => void;
export interface IAuthenticationClient extends Client<IReceive, ISend> {
    on(eventName: 'success', callback: ISuccessCallback): void;
    on(eventName: 'failure', callback: IFailureCallback): void;
}
export interface IOptions {
    io: SocketIOClientStatic;
}
export function AuthenticationClient(options: IOptions) {
    let { io } = options;
    let eventEmitter = EventEmitter();
    function connect(this: ClientSend<ISend>) {
        this.authenticate({ username: 'player', password: 'a1s2d3' });
    }
    function success(this: ClientSend<ISend>, payload: Authentication.ISuccess) {
        let { token } = payload;
        eventEmitter.emit('success', token);
    }
    function failure(this: ClientSend<ISend>, payload: Authentication.IFailure) {
        let { reason } = payload;
        eventEmitter.emit('failure', reason);
    }

    let template: ClientTemplate<IReceive, ISend> = {
        path: '/authenticate',
        connect, reconnect: null, disconnect: null,
        receive: {
            success, failure
        },
        sendTypes: { authenticate: null },
        error: (err) => {
            console.error(err);
        }
    };

    augmentClient(template, io);
    let client = template as IAuthenticationClient;
    client.on = eventEmitter.on;
    return client;
}