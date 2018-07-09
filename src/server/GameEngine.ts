import { IComponentManager } from './ComponentManager';

export interface IGameComponent<T> {
    readonly id: string;
    readonly type: string;
    update?(deltaFrame: number): void;
    consolidate?(): void; // is there a better way to handle this?
    getState?(fullState?: boolean): T;
    reconcile?(state): void;
}

interface IOptions {
    componentManager: IComponentManager;
}
export function GameEngine(options: IOptions) {
    let { componentManager } = options;
    
    let targetFps = 60;
    let msPerFrame = 1000 / targetFps;
    let tickNS = Math.round(1 / targetFps * 1e9);
    let tickMS = Math.round(tickNS / 1e3) / 1e3;
    let prevTime = process.hrtime();
    let storedNS = 0;
    let isPaused = true;

    function tick() {
        let currTime = process.hrtime();
        let diff = [
            currTime[0] - prevTime[0], 
            currTime[1] - prevTime[1]
        ];
        let diffNS = diff[0] * 1e9 + diff[1];
        storedNS += diffNS;
        if (storedNS > tickNS) {
            storedNS -= tickNS;
            if (!isPaused) { update(tickMS / msPerFrame); }
        }
        prevTime = currTime;

        if (!isPaused) {
            setImmediate(tick);
        }
    }

    function run() {
        if (isPaused) {
            isPaused = false;
            prevTime = process.hrtime();
            tick();
        }
    }
    function pause() {
        isPaused = true;
    }
    function update(deltaFrame: number) {
        componentManager.update(deltaFrame);
    }
    function register(component: IGameComponent<any>) {
        componentManager.register(component);
    }

    return {
        run: run,
        pause: pause,
        register: register
    };
}

// you need to be able store a stack of snapshot ids
// so client can recieve diffs based on the last snapshot they requested.
