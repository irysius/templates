import * as ReactDOM from 'react-dom';
import * as React from 'react';
import * as io from 'socket.io-client';
import * as _ from 'lodash';
import { Sample } from './components/Sample';

let socket = io();

let mount = document.getElementById('container');
ReactDOM.render(<Sample socket={socket}/>, mount);

console.log('Hello World');
console.log(`lodash version: ${_.VERSION}`);