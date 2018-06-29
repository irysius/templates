import * as PIXI from 'pixi';
export interface IOptions {
    socket: SocketIOClient.Socket;
    mount: HTMLElement;
}
export function PixiRenderer(options: IOptions) {
    let {
        mount, socket
    } = options;
    let renderer = PIXI.autoDetectRenderer(
        800, 600, { backgroundColor: 0x93CCEA, antialias: true });
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
    ticker.add(render);
    ticker.start();
    
    let sprite = PIXI.Sprite.fromImage('img/edit.png', false, PIXI.SCALE_MODES.LINEAR);
    sprite.anchor.set(0.5);
    stage.addChild(sprite);

    socket.on('rotation', angle => {
        sprite.rotation = angle;
    });
    
    window.addEventListener('resize', resize);
    function resize() {
        renderer.resize(mount.clientWidth, mount.clientHeight);
        sprite.position.x = renderer.width / 2;
        sprite.position.y = renderer.height / 2;
    }
    resize();
    function render() {
        renderer.render(stage);
    }
    function cleanup() {
        window.removeEventListener('resize', resize);
    }
    // function tick(delta) {
    //     sprite.rotation += 0.05 * delta;
    //     render();
    // }

    
}