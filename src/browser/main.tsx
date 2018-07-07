import * as ReactDOM from 'react-dom';
import * as React from 'react';
import * as io from 'socket.io-client';
import * as _ from 'lodash';
import { Sample } from './components/Sample';
import { PixiRenderer } from './PixiRenderer';
import { AuthenticationClient } from './clients/Authentication';
import { GameClient } from './clients/Game';

let socket = io();

let divMount = document.getElementById('container-div');
ReactDOM.render(<Sample socket={socket}/>, divMount);

let canvasMount = document.getElementById('container-canvas');
let renderer = PixiRenderer({ mount: canvasMount });
let authClient = AuthenticationClient({ io });
authClient.on('success', token => {
    let gameClient = GameClient({ io, token, renderer });
    gameClient.open();
});
authClient.open();

console.log('Hello World');
console.log(`lodash version: ${_.VERSION}`);
