import {browser} from 'webextension-polyfill-ts';
// import $ from 'cash-dom';

async function ScreenshotSchedule() {
    let tabs = await browser.tabs.query({
        active: true,
        windowId: browser.windows.WINDOW_ID_CURRENT,
    });
    if (
        tabs.length > 0 &&
        tabs[0].url.startsWith('https://duckscheduler.com')
    ) {
        let screenshot = await browser.tabs.captureVisibleTab();
        await browser.storage.local.set({
            schedule: screenshot,
        });
    } else {
        alert('You are not on Duckscheduler!');
    }
}

export {ScreenshotSchedule};
