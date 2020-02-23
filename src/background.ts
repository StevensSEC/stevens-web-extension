// These scripts run in the background continuously
import Settings from './shared/settings';
import './features/TemporaryBookmarks';
import './assets/temp_icon.png';
import './popup.pug';
import './features/FreeRooms/FreeRooms';

import {name, version} from '../package.json';
// To see the console output, click the "background page" link on `chrome://extensions`
console.log(`${name} v${version} started!`);

chrome.runtime.onInstalled.addListener(Settings.resetSettings);
