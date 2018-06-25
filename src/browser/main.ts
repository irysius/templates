import * as io from 'socket.io-client';
import * as _ from 'lodash';

let socket = io();
let serverTime = document.getElementById('serverTime');
socket.on('server-time', (payload) => {
    serverTime.innerText = payload;
});

console.log('Hello World');
console.log(`lodash version: ${_.VERSION}`);