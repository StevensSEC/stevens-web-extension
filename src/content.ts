import {browser} from 'webextension-polyfill-ts';

/* This listener responds with corresponding page data when
requested from a background page. */
browser.runtime.onMessage.addListener((msg, sender) => {
    return new Promise((res, rej) => {
        if (msg.type === 'getPageInfo') {
            res({
                title: document.title,
                html: document.body.innerHTML,
            });
        } else {
            rej('Unexpected message: ' + msg.type);
        }
    });
});
