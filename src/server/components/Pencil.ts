import { IGameComponent } from "./../GameEngine";
import { IVector2 } from "@irysius/grid-math/Vector2";
import { create as v_world, IWorldPosition } from "@irysius/grid-math/WorldPosition";
interface IState {
    rotation: number;
    position: IWorldPosition;
}
interface IOptions {
    id: string;
}
export function Pencil(options: IOptions): IGameComponent<IState> {
    let { id } = options;
    let state = { rotation: 0, position: v_world(0, 0) };
    let changed = true;

    function update(deltaFrame: number) {
        state.rotation += 0.05 * deltaFrame;
    }
    function getState(fullState: boolean = false) {
        if (fullState || changed) {
            return state;
        } else {
            return null;
        }
    }
    function reconcile(newState: IState) {
        state = {
            ...state,
            ...newState
        };
    }
    return {
        type: 'pencil', id,
        update, getState, reconcile
    };
}