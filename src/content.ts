import {browser} from 'webextension-polyfill-ts';
import $ from 'cash-dom';

/* This listener responds and interacts with corresponding
page data when requested from a background page. */
browser.runtime.onConnect.addListener(function listener(port) {
    if (port.name !== 'tabPort') {
        return;
    }
    port.onMessage.addListener(async (msg, port) => {
        // Responds with document properties in 'setPageInfo' message type
        if (msg.type === 'getPageInfo') {
            port.postMessage({
                document: document,
                html: document.body.innerHTML,
                title: document.title,
                type: 'setPageInfo',
                url: document.URL,
            });
        }
        // Log in to Duckcard portal
        if (msg.type === 'duckcardAuth') {
            $('#loginphrase').val(msg.username);
            $('#password').val(msg.password);
            $('input[type=submit][value=Login]').trigger('click');
            browser.runtime.onConnect.removeListener(listener);
        }
    });
});
