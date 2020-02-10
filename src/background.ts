<<<<<<< HEAD
<<<<<<< HEAD
// These scripts run in the background continuously
import Settings from './shared/Settings';
import './features/TemporaryBookmarks';
import './assets/temp_icon.png';

import {name, version} from '../package.json';
// To see the console output, click the "background page" link on `chrome://extensions`
console.log(`${name} v${version} started!`);

chrome.runtime.onInstalled.addListener(Settings.resetSettings);
=======
import './features/WorkAssistant';
import './assets/temp_icon.png';
>>>>>>> Change webpack asset bundling, create sample extension functionality: temporary bookmarks
=======
// These scripts run in the background continuously
import './features/TemporaryBookmarks';
import './assets/temp_icon.png';

import {name, version} from '../package.json';
// To see the console output, click the "background page" link on `chrome://extensions`
console.log(`${name} v${version} started!`);
>>>>>>> Update extension configuration to support background/content scripts, webpack setup for Pug files
