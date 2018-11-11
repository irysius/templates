import { ComponentState } from "../server/ComponentManager";
import { ISize } from "@irysius/grid-math/Size";
import { ICellOffset } from "@irysius/grid-math/Cell";
export namespace Game {
    export interface IReconcileState {
        [key: string]: any;
    }
    export interface IClientState {
        viewportSize: ISize;
    }
    export interface IGlobalSettings {
        cellSize: ISize;
        cellOffset: ICellOffset;
    }
    // handshake: clientState -> status
    // sporadically: input
    // constant: update
    interface IHubSend {
        // per tick, update client with game state
        update: ComponentState;
        globalSettings: IGlobalSettings;
    }
    interface IHubReceive {
        // update server with client state, like viewport size
        clientState: IClientState;
        // update server with user input
        reconcileState: IReconcileState;
    }
    export namespace Hub {
        export interface ISend extends IHubSend {
        }
        export interface IReceive extends IHubReceive {
        }
    }
    export namespace Client {
        export interface ISend extends IHubReceive {
        }
        export interface IReceive extends IHubSend {
        }
    }
}