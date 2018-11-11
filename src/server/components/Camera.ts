import { IGameComponent } from "../GameEngine";
import { ISize } from "@irysius/grid-math/Size";
import { IVector2 } from "@irysius/grid-math/Vector2";
import { IRect } from "@irysius/grid-math/Rect";

// load starting position
// tie a socket id to a character or camera
// - sockets should connect with an identity?
// - all socket connections are cameras
// begin integrating grid-math for positioning

// need to kinda introduce identities (even if I'm only aiming for a single player game)

// for character updates, it's ok if we take all state and filter
// for aggregate information like map data, it's less ok.
// filter needs to act on the entirety of the state of data
// - direction should be reversed for large aggregates, for the component, pass in a filter, and it returns you what you should see.

// for things like map data, need to also have a concept of diffs/chunks
interface IState {
    viewport: IRect;
}
interface IOptions {
    id: string;
}
export interface ICamera extends IGameComponent<IState> {
    setViewport(size: ISize): void;
    setPosition(position: IVector2): void;
}
export function Camera(options: IOptions): ICamera {
    let { id } = options;
    let state = { 
        viewport: {
            x: 0, y: 0, width: 0, height: 0
        }
    };

    function getState() {
        return state;
    }
    function setViewport(size: ISize) {
        state.viewport.width = size.width;
        state.viewport.height = size.height;
    }
    function setPosition(position: IVector2) {
        state.viewport.x = position.x;
        state.viewport.y = position.y;
    }

    return {
        type: 'camera', id,
        getState, setViewport, setPosition
    };
}