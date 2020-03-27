import {browser} from 'webextension-polyfill-ts';

// Allow usage of console.log on pages without access to the extension console
// This includes the popup and options page
async function log(...msgs) {
    let page = browser.extension.getBackgroundPage();
    if (page) {
        page.console.log(...msgs);
    }
}

export {log};
