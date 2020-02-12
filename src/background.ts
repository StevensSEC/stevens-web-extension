<<<<<<< HEAD
import './features/WorkAssistant';
import './assets/temp_icon.png';
=======
// These scripts run in the background continuously
import Settings from './shared/Settings';
import './features/TemporaryBookmarks';
import './assets/temp_icon.png';

import {name, version} from '../package.json';
// To see the console output, click the "background page" link on `chrome://extensions`
console.log(`${name} v${version} started!`);

chrome.runtime.onInstalled.addListener(Settings.resetSettings);
>>>>>>> v0.1.1: Update temporary bookmarks to use internal timer for display/removal, modify configuration
