import * as PIXI from 'pixi';
import { IVector2 } from '@irysius/grid-math/Vector2';
import { CoordManager } from '@irysius/grid-math/CoordManager';
import { create as r_screen } from '@irysius/grid-math/ScreenRect';
import { create as s } from '@irysius/grid-math/Size';
import { create as v_world, IWorldPosition } from '@irysius/grid-math/WorldPosition';
import { cellOffset as makeCellOffset } from '@irysius/grid-math/Cell';
import Gravity from '@irysius/grid-math/Gravity';

export interface IOptions {
    mount: HTMLElement;
    keyboard;
}
export function PixiRenderer(options: IOptions) {
    let {
        mount, keyboard
    } = options;
    let renderer = PIXI.autoDetectRenderer(
        800, 600, { backgroundColor: 0x93CCEA, antialias: true });
    
    let coordManager = CoordManager({ 
        state: {
            cellSize: s(20, 20),
            cellOffset: makeCellOffset(s(20, 20), Gravity.Center),
            gridBounds: r_screen(0, 0, 800, 600),
            position: v_world(0, 0)
        } 
    });
    // let renderer = new PIXI.CanvasRenderer({
    //     width: 800, height: 600,
    //     backgroundColor: 0x93CCEA
    // });
    mount.appendChild(renderer.view);
    switch (renderer.type) {
        case PIXI.RENDERER_TYPE.CANVAS:
            console.log('canvas renderer');
            break;
        case PIXI.RENDERER_TYPE.WEBGL:
            console.log('webgl renderer');
            break;
    }
    
    let stage = new PIXI.Container();
    let ticker = new PIXI.ticker.Ticker();
    ticker.add(tick);
    ticker.start();
    
    let sprite = PIXI.Sprite.fromImage('img/edit.png', false, PIXI.SCALE_MODES.LINEAR);
    sprite.anchor.set(0.5);
    stage.addChild(sprite);

    // let position: IVector2 = null;
    let cameraPosition: IWorldPosition = v_world(0, 0);
    function update(state) {
        
        let pencilState = state.pencil.test;
        sprite.rotation = pencilState.rotation;
        let position = coordManager.toScreenPosition(pencilState.position);
        sprite.position.x = position.x;
        sprite.position.y = position.y;
    }
    
    window.addEventListener('resize', resize);
    function resize() {
        // renderer.resize(mount.clientWidth, mount.clientHeight);
        // sprite.position.x = renderer.width / 2 + position.x;
        // sprite.position.y = renderer.height / 2 + position.y;
    }
    resize();
    function render() {
        renderer.render(stage);
    }
    function cleanup() {
        window.removeEventListener('resize', resize);
    }
    let speed = 2.5;
    function tick(delta) {
        //     sprite.rotation += 0.05 * delta;
        let hasChanged = false;
        let { position } = coordManager.getState();
        if (position) {
            if (keyboard.isPressed('KeyW')) {
                position.y -= speed * delta;
                hasChanged = true;
            }
            if (keyboard.isPressed('KeyA')) {
                position.x -= speed * delta;
                hasChanged = true;
            }
            if (keyboard.isPressed('KeyS')) {
                position.y += speed * delta;
                hasChanged = true;
            }
            if (keyboard.isPressed('KeyD')) {
                position.x += speed * delta;
                hasChanged = true;
            }
        }
        if (hasChanged) {
            coordManager.updateWithState({ position });
        }
        
        keyboard.consolidate();
        render();
    }

    let _client;
    function setClient(client) {
        _client = client;
    }

    function reconcile(state) {
        _client && _client.send.reconcileState(state);
    }
    return { update, setClient };
}