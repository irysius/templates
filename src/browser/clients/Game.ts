import { ClientTemplate, Client, augmentClient } from '@irysius/anguli-components/Client';
import { ISize } from '@irysius/grid-math/Size';
import { Game } from './../../shared/Game';

interface ComponentState {
    [key: string]: any;
}
interface ComponentUpdate {
    [type: string]: {
        [id: string]: ComponentState;
    };
}
type IReceive = Game.Client.IReceive;
type ISend = Game.Client.ISend;

// client should have way to hail on init

export interface IGameClient extends Client<IReceive, ISend> {

}
export interface IOptions {
    io: SocketIOClientStatic;
    token: string;
    renderer;
}
export function GameClient(options: IOptions) {
    let { io, token, renderer } = options;
    let template: ClientTemplate<IReceive, ISend> = {
        path: '/game',
        query: { token },
        connect: function () {
            this.clientState({ 
                viewportSize: { width: 600, height: 400 } 
            });
        },
        sendTypes: { clientState: null, reconcileState: null },
        receive: {
            update: renderer.update,
            globalSettings: renderer.globalSettings
        },
        error: (err) => {
            console.error(err);
        }
    };

    augmentClient(template, io);
    let client = template as IGameClient;
    renderer.setClient(client); // TODO: Figure out if there's another way.
    return client;
}