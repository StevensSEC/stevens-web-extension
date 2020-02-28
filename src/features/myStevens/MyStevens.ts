import {Builder, By} from 'selenium-webdriver';
import auth from './auth.json';

async function getMealSwipes() {
    /* Retrieves the number of meal swipes remaining by emulating
    the browser using Selenium. */
    var driver = new Builder().build();
    await driver.get('https://my.stevens.edu');
    await driver.findElement(By.id('username')).sendKeys(auth.username);
    await driver.findElement(By.id('password')).sendKeys(auth.password);
}

chrome.runtime.onInstalled.addListener(details => {
    getMealSwipes();
    chrome.alarms.create('myStevens', {
        periodInMinutes: 90,
    });

    chrome.alarms.onAlarm.addListener(alarm => {
        if (alarm.name === 'myStevens') {
            getMealSwipes();
        }
    });
});
