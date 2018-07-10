import * as PATH from 'path';
import * as http from 'http';
import * as express from 'express';
import * as socketio from 'socket.io';
import { AddressInfo } from 'net';
import { GameEngine } from './GameEngine';
import { Pencil } from './components/Pencil';
import { GameHub } from './hubs/Game';
import { AuthenticationHub } from './hubs/Authentication';
import { ComponentManager } from './ComponentManager';
import { SessionManager } from './SessionManager';
import { CoordManager } from '@irysius/grid-math/CoordManager';
import { cellOffset as makeCellOffset } from '@irysius/grid-math/Cell';
import { create as s } from '@irysius/grid-math/Size';
import { create as r_screen } from '@irysius/grid-math/ScreenRect';
import { create as v_world } from "@irysius/grid-math/WorldPosition";
import Gravity from '@irysius/grid-math/Gravity';
let settings = require('./settings.json');

let app = express();
let viewPath = PATH.normalize(PATH.join(__dirname, '..', 'browser'));
app.use(express.static(PATH.join(viewPath)));
app.get('/', (req, res) => {
    res.render('index.html');
});
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

let httpServer = http.createServer(app);
httpServer.on('listening', () => {
    let address = httpServer.address() as AddressInfo;
    console.log(`server is up and running at port: ${address.port}`);
});
let io = socketio(httpServer);

// let router = HubRouter({ io, logger: Logger.console() });
// let hubs = router.setup('./src/server/');
// let gameHub = (hubs['GameHub'] as IGameHub);
let componentManager = ComponentManager();
let sessionManager = SessionManager();
let authHub = AuthenticationHub({ io, sessionManager });
let coordManager = CoordManager({
    cellSize: s(200, 200),
    cellOffset: makeCellOffset(s(200, 200), Gravity.Center)
});
let gameHub = GameHub({ 
    io, componentManager, sessionManager, coordManager
});
componentManager.on('broadcast', gameHub.broadcast);
let gameEngine = GameEngine({ componentManager });

gameEngine.register(Pencil({ id: 'test', coordManager }));

// Timer(io);

httpServer.listen(settings.port);
gameEngine.run();
