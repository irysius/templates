function Input() {
    // Keybinds, defined inputs
    
}

import { IMap } from '@irysius/anguli-components/helpers';
import { IGameClient } from './clients/Game';
const id = 'keyboard';
function noop() { }

declare global {
	interface IPixiContext {
		keyboard: IKeyboardContext
	}
}

interface IKeyboardContext {
	isPressed(code: string): boolean;
	isClicked(code: string): boolean;
	stopPropagation: boolean;
}

interface IOptions {
}

export function Keyboard(options: IOptions) {
	let pressedKeys: IMap<any> = {};
	let clickedKeys: IMap<any> = {};
	let stopPropagation = false;

	function onKeyDown(event: KeyboardEvent) {
		pressedKeys[event.code] = true;
		if (stopPropagation) { event.stopPropagation(); }
	}
	function onKeyUp(event: KeyboardEvent) {
		clickedKeys[event.code] = true;
		delete pressedKeys[event.code];
		if (stopPropagation) { event.stopPropagation(); }
	}
	function isPressed(code: string) {
		return !!pressedKeys[code];
	}
	function isClicked(code: string) {
		return !!clickedKeys[code];
	}

	function consolidate() {
		clickedKeys = {};	
	}

	window.addEventListener('keyup', onKeyUp);
	window.addEventListener('keydown', onKeyDown);

	return {
        isPressed, isClicked, consolidate
	};
}