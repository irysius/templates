import * as _ from 'lodash';
import { ComponentState, StateArray, IComponentManager } from "./ComponentManager";
import { Hub, HubTemplate, augmentHub } from '@irysius/anguli-components/Hub';
import { ISize } from '@irysius/grid-math/Size';
import { Camera, ICamera } from './Camera';
import { IVector2 } from '@irysius/grid-math/Vector2';
import { IRect } from '@irysius/grid-math/Rect';

// Filters are most likely only location based?
// With remote exceptions based on some other criteria (like party members)

// client state -> generate filter -> apply against mergedState.


// it comes to reason that there has to be certain state properties that are common
// such as position, or zone.

interface IClient {
    socketId: string;
    cameraId: string;
    filter(state: ComponentState): boolean;
}
interface IMap<T> {
    [key: string]: T;
}
interface ComponentUpdate {
    [type: string]: {
        [id: string]: ComponentState;
    };
}
interface IReceive {
    hail: IViewport;
}
interface ISend {
    update: ComponentUpdate;
}
interface IOptions {
    io: SocketIO.Server;
    componentManager: IComponentManager;
}
type Iter<T> = (item: T) => void;
function forEach<T>(hash: IMap<T>, iter: Iter<T>) {
    Object.keys(hash).forEach(key => {
        iter(hash[key]);
    });
}
interface IViewport {
    cameraId: string;
    size: ISize;
}

// Make grid-math do this.
function isInView(position: IVector2, viewport: IRect) {
    return true;
}

export function GameHub(options: IOptions) {
    let { io, componentManager }  = options;
    let clients: IMap<IClient> = {};

    function connect(socket: SocketIO.Socket) {
        console.log(`connected: ${socket.id}`);
    }
    function disconnect(socket: SocketIO.Socket, reason: string) {
        delete clients[socket.id];
        console.log(`disconnected: ${socket.id} ${reason}`);
    }
    function broadcast(results: StateArray[]) {
        // mailroom sorting
        let letters: IMap<StateArray[]> = {};
        results.forEach(result => {
            let [state, type, id] = result;

            // Do not broadcast cameras.
            if (type == 'camera') { return; }

            forEach(clients, client => {
                if (client.filter(state)) {
                    if (letters[client.socketId] == null) {
                        letters[client.socketId] = [];
                    }
                    letters[client.socketId].push(result);
                }
            });
        });

        // merge states per client
        let updates: IMap<ComponentUpdate> = {};
        Object.keys(letters).forEach(clientId => {
            let states = letters[clientId].map(x => {
                let [state, type, id] = x;
                return {
                    [type]: { [id]: state }
                } as ComponentUpdate;
            });
        
            updates[clientId] = states.reduce(_.merge, {});
        });

        Object.keys(updates).forEach(clientId => {
            let payload = updates[clientId];
            hub.send.update(payload, clientId);
        });
    }

    function hail(payload: IViewport, socket: SocketIO.Socket) {
        console.log(payload);
        let camera = componentManager.find('camera', payload.cameraId) as ICamera;
        if (!camera) {
            camera = Camera({ id: payload.cameraId });
            componentManager.register(camera);
        }
        camera.setViewport(payload.size);

        clients[socket.id] = {
            socketId: socket.id,
            cameraId: payload.cameraId,
            filter: (state) => {
                return isInView(state.position, camera.getState().viewport);
            }
        };
    }

    let template: HubTemplate<IReceive, ISend> = {
        path: '/game',
        connect, disconnect,
        receive: { hail },
        sendTypes: { update: null }
    };

    augmentHub(template, io);
    let hub = template as Hub<IReceive, ISend>;

    return {
        broadcast
    };
}