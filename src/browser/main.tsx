import * as ReactDOM from 'react-dom';
import * as React from 'react';
import * as io from 'socket.io-client';
import * as _ from 'lodash';
import { Sample } from './components/Sample';
import { PixiRenderer } from './PixiRenderer';

let socket = io();

let divMount = document.getElementById('container-div');
ReactDOM.render(<Sample socket={socket}/>, divMount);

let canvasMount = document.getElementById('container-canvas');
PixiRenderer({ mount: canvasMount, socket });

console.log('Hello World');
console.log(`lodash version: ${_.VERSION}`);
