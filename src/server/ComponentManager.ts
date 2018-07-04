import * as _ from 'lodash';
import { IGameComponent } from "./GameEngine";
import { EventEmitter, FunctionLike } from './EventEmitter';

// component has a name, is this class?
// give each component an id
// hash should be classname#?
// what about collisions?
interface IGameComponents {
    [type: string]: {
        [id: string]: IGameComponent<any>;
    };
}

export interface ComponentState {
    [key: string]: any;
}
export type StateArray = [ComponentState, string, string];
type StateArrayCallback = (stateArray: StateArray[]) => void;
type IterComponent<T = any> = (component: IGameComponent<T>, type: string, id: string) => void;
type MapComponent<T = any, U = any> = (component: IGameComponent<T>, type: string, id: string) => U;

function forEach<T>(components: IGameComponents, iter: IterComponent<T>): void {
    Object.keys(components).forEach(type => {
        let x = components[type];
        Object.keys(x).forEach(id => {
            let component = x[id];
            iter(component, type, id);
        });
    });
}
function compactMap<T, U>(components: IGameComponents, map: MapComponent<T, U>): U[] {
    let results: U[] = [];
    Object.keys(components).forEach(type => {
        let x = components[type];
        Object.keys(x).forEach(id => {
            let component = x[id];
            let result = map(component, type, id);
            if (result != null) {
                results.push(result);
            }
        });
    });
    return results;
}

export interface IComponentManager {
    update(deltaFrame: number): void;
    register(component: IGameComponent<any>): void;
    find(type: string, id: string): IGameComponent<any>;
    on(eventName: 'broadcast', callback: StateArrayCallback): void;
    off(eventName: 'broadcast', callback?: StateArrayCallback): void;
}

export function ComponentManager(): IComponentManager {
    let components: IGameComponents = {};
    let eventEmitter = EventEmitter();

    function update(deltaFrame: number) {
        forEach(components, (component) => {
            component.update && component.update(deltaFrame);
        });
        // Should consolidation take mergedState?
        forEach(components, (component) => {
            component.consolidate && component.consolidate();
        });

        broadcast();
    }

    function broadcast() {
        if (eventEmitter.listenerCount('broadcast') > 0) {
            let states = compactMap(components, (component, type, id) => {
                let state = component.getState();
                if (state) {
                    return [state, type, id] as StateArray;
                } else {
                    return null;
                }
            });
            eventEmitter.emit('broadcast', states);
        }
    }

    function register(component: IGameComponent<any>) {
        if (!components[component.type]) {
            components[component.type] = {};
        }
        components[component.type][component.id] = component;
    }
    
    function find(type: string, id: string) {
        if (components[type] && components[type][id]) {
            return components[type][id];
        } else {
            return null;
        }
    }

    return {
        update, register, find,
        on: eventEmitter.on,
        off: eventEmitter.off
    };
}