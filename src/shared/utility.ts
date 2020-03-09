import {browser} from 'webextension-polyfill-ts';

async function log(message) {
    let page = browser.extension.getBackgroundPage();
    if (page) {
        page.console.log(message);
    }
}

async function getPageInfo() {
    return {
        title: document.title,
        html: document.body.innerHTML,
    };
}

export {log, getPageInfo};
