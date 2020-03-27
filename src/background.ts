// These scripts run in the background continuously
import './assets/icon128.png';
import './assets/icon48.png';
import './assets/icon16.png';
import './features/Canvas/CanvasIntegration';
import './features/FreeRooms/FreeRooms';
import {GetMealSwipes} from './features/MyStevens/MyStevens';
import './features/TempBookmarks/TemporaryBookmarks';
import Settings from './shared/settings';
import './shared/hot_reload';
import './popup.pug';

import {browser} from 'webextension-polyfill-ts';
import {name, version} from '../package.json';
// To see the console output, click the "background page" link on `chrome://extensions`
console.log(`${name} v${version} started!`);

browser.runtime.onInstalled.addListener(Settings.resetSettings);

browser.runtime.onMessage.addListener(async (msg, sender) => {
    if (msg.type === 'queryDuckcard') {
        await GetMealSwipes();
    }
});
