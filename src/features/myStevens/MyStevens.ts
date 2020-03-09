import {browser} from 'webextension-polyfill-ts';
// import auth from './auth.json';
// import $ from 'cash-dom';
// import {log} from '../../shared/utility';

async function getMealSwipes() {
    /* Retrieves the number of meal swipes remaining by emulating
    the browser using Selenium. */
    let tab = await browser.tabs.create({
        url: 'https://my.stevens.edu/',
    });
    browser.tabs.onUpdated.addListener(async function listener(id, info) {
        if (id === tab.id && info.status === 'complete') {
            browser.tabs.onUpdated.removeListener(listener);
            let page = await browser.tabs.sendMessage(id, {
                type: 'getPageInfo',
            });
            console.log(page);
        }
    });
    // console.log(page);
    // if (!page) {
    //     console.log(page);
    //     console.error('Could not get myStevens page.');
    //     return;
    // }
    // if (page[0].title === 'Stevens Web Login') {
    //     console.log('Logging in to myStevens...');
    //     let html = $.parseHTML(page[0].html);
    //     console.log(html);
    // }
}

browser.runtime.onInstalled.addListener(details => {
    getMealSwipes();
});

// chrome.runtime.onInstalled.addListener(details => {
//     getMealSwipes();
//     chrome.alarms.create('myStevens', {
//         periodInMinutes: 90,
//     });

//     chrome.alarms.onAlarm.addListener(alarm => {
//         if (alarm.name === 'myStevens') {
//             getMealSwipes();
//         }
//     });
// });
