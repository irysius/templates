import { ComponentState } from "./../server/ComponentManager";
import { ISize } from "@irysius/grid-math/Size";
export namespace Game {
    export interface IInput {
        input: string;
    }
    export interface IClientState {
        viewportSize: ISize;
    }
    // handshake: clientState -> status
    // sporadically: input
    // constant: update
    interface IHubSend {
        // per tick, update client with game state
        update: ComponentState;
    }
    interface IHubReceive {
        // update server with client state, like viewport size
        clientState: IClientState;
        // update server with user input
        input: IInput;
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