// These scripts run in the background continuously
import './assets/temp_icon.png';
import './features/canvas/CanvasIntegration';
import './features/tempBookmarks/TemporaryBookmarks';
import Settings from './shared/settings';
import './shared/hot_reload';
import './popup.pug';
import './features/freeRooms/FreeRooms';

import {name, version} from '../package.json';
// To see the console output, click the "background page" link on `chrome://extensions`
console.log(`${name} v${version} started!`);

chrome.runtime.onInstalled.addListener(Settings.resetSettings);
