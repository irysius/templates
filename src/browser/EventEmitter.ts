export type FunctionLike = (...args: any[]) => any;
interface IMap<T> {
    [key: string]: T;
}
export function EventEmitter() {
    let events: IMap<FunctionLike[]> = {};
    function on(eventName: string, callback: FunctionLike) {
        if (!events[eventName]) {
            events[eventName] = [];
        }
        events[eventName].push(callback);
    }
    function off(eventName: string, callback?: FunctionLike) {
        if (!events[eventName]) {
            events[eventName] = [];
        }
        if (callback) {
            events[eventName] = events[eventName].filter(f => f !== callback);
        } else {
            events[eventName] = [];
        }
    }
    function listenerCount(eventName: string) {
        if (!events[eventName]) {
            return 0;
        } else {
            return events[eventName].length;
        }
    }
    function emit(eventName: string, ...args: any[]) {
        if (events[eventName]) {
            events[eventName].forEach(callback => {
                callback.apply(null, args);
            });
        }
    }
    function clear() {
        events = {};
    }
    return {
        on, off, emit, clear,
        listenerCount
    };
}