import * as _ from 'lodash';
import { ComponentState, StateArray, IComponentManager } from "../ComponentManager";
import { Hub, HubTemplate, augmentHub, HubSend } from '@irysius/anguli-components/Hub';
import { ISize } from '@irysius/grid-math/Size';
import { Camera, ICamera } from '../components/Camera';
import { IVector2 } from '@irysius/grid-math/Vector2';
import { IRect } from '@irysius/grid-math/Rect';
import { Game } from '../../shared/Game';
import { ISessionManager } from '../SessionManager';
import { ICoordManager } from '@irysius/grid-math/CoordManager';
import { IWorldManager } from '../WorldManager';

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
export interface IMap<T> {
    [key: string]: T;
}
interface ComponentUpdate {
    [type: string]: {
        [id: string]: ComponentState;
    };
}
type IReceive = Game.Hub.IReceive;
type ISend = Game.Hub.ISend;


type Iter<T> = (item: T) => void;
function forEach<T>(hash: IMap<T>, iter: Iter<T>) {
    Object.keys(hash).forEach(key => {
        iter(hash[key]);
    });
}

// Make grid-math do this.
function isInView(position: IVector2, viewport: IRect) {
    return true;
}
export interface IGameHub extends Hub<IReceive, ISend> {
    broadcast(results: StateArray[]): void;
}
export interface IOptions {
    io: SocketIO.Server;
    coordManager: ICoordManager;
    sessionManager: ISessionManager;
    componentManager: IComponentManager;
    worldManager: IWorldManager;
}
export function GameHub(options: IOptions) {
    let { 
        io, 
        componentManager, 
        worldManager,
        sessionManager, 
        coordManager 
    } = options;
    
    let clients: IMap<IClient> = {};

    function connect(this: HubSend<ISend>, socket: SocketIO.Socket) {
        console.log(`connected: ${socket.id}`);
        let { cellSize, cellOffset } = coordManager.getState();
        this.globalSettings({ cellSize, cellOffset });
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
                // if the client cares about the state, add to processsing
                if (client.filter(state)) {
                    if (letters[client.socketId] == null) {
                        letters[client.socketId] = [];
                    }
                    letters[client.socketId].push(result);
                }
            });
        });

        // For larger components that should customize a client's payload
        // (ie, a client cannot simply filter through the states)
        
        forEach(clients, client => {
            worldManager.calcUpdate(client);
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

    function clientState(this: HubSend<ISend>, payload: Game.IClientState, socket: SocketIO.Socket) {
        let user = sessionManager.getUser(socket);
        if (!user) { return; }
        let camera = componentManager.find('camera', user.username) as ICamera;
        if (!camera) {
            camera = Camera({ id: user.username });
            componentManager.register(camera);
        }
        camera.setViewport(payload.viewportSize);

        clients[socket.id] = {
            socketId: socket.id,
            cameraId: user.username,
            filter: (state) => {
                return isInView(state.position, camera.getState().viewport);
            }
        };
    }
    function reconcileState(this: HubSend<ISend>, payload: Game.IReconcileState, socket: SocketIO.Socket) {
        Object.keys(payload).forEach(type => {
            Object.keys(payload[type]).forEach(id => {
                let component = componentManager.find(type, id);
                if (component && component.reconcile) {
                    component.reconcile(payload[type][id]);
                }
            });
        })
    }

    let template: HubTemplate<IReceive, ISend> = {
        path: '/game',
        connect, disconnect,
        receive: {
            clientState,
            reconcileState
        },
        sendTypes: { update: null, globalSettings: null }
    };

    augmentHub(template, io, [sessionManager.middleware]);
    let hub = template as IGameHub;
    hub.broadcast = broadcast;

    return hub;
}