import { IGameComponent } from "../GameEngine";
import { ICoordManager } from '@irysius/grid-math/CoordManager';
import { create as v_world, IWorldPosition } from "@irysius/grid-math/WorldPosition";
import { create as v_cell, ICellCoord } from '@irysius/grid-math/CellCoord';

import { PathExecutor } from '@irysius/grid-math/pathfinding/PathExecutor';
import { simpleSquare, createPath } from '@irysius/grid-math/pathfinding/tools';
import { map } from '@irysius/grid-math/helpers/Iterable';
interface IState {
    rotation: number;
    position: IWorldPosition;
}
interface IOptions {
    id: string;
    coordManager: ICoordManager;
}

export function Pencil(options: IOptions): IGameComponent<IState> {
    let { id, coordManager } = options;
    let state = { rotation: 0, position: v_world(0, 0) };
    let changed = true;

    function toWorldPosition(value: ICellCoord) {
        return coordManager.toWorldPosition(value);
    }

    let steps = simpleSquare(v_cell(0, 0));
    let path = createPath(steps);
    let worldPath = map(toWorldPosition)(path);
    let executor = PathExecutor(worldPath, 1000 / 16.67);

    function update(deltaFrame: number) {
        executor.update(deltaFrame);
        state.position = executor.value;
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