import { IGameComponent } from "./GameEngine";
interface IState {
    rotation: number;
}
interface IOptions {
    id: string;
}
export function Pencil(options: IOptions): IGameComponent<IState> {
    let { id } = options;
    let state = { rotation: 0, position: { x: 0, y: 0 } };
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
    return {
        type: 'pencil', id,
        update, getState
    };
}