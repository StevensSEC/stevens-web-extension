import {browser} from 'webextension-polyfill-ts';
import $ from 'cash-dom';
import moment from 'moment';

async function GetMealSwipes() {
    /* Retrieves the number of meal swipes remaining by
    scraping myStevens webapps. */
    let data = await browser.storage.local.get([
        'stevens-username',
        'stevens-password',
    ]);
    if (!data['stevens-username'] || !data['stevens-password']) {
        // console.error('Cannot get meal swipes without Stevens credentials.');
        await browser.storage.local.set({
            duckcard: {
                auth: false,
                data: {},
                updated: moment().format(),
            },
        });
        return;
    }

    // Navigate to Duckbill Overview page
    const BASE_URI = 'https://services.jsatech.com';
    let baseTab = await browser.tabs.create({
        url: BASE_URI + '/login.php?cid=33&wason=/statementnew.php',
    });

    browser.tabs.onUpdated.addListener(async function listener(id, info, tab) {
        if (id === baseTab.id && info.status === 'complete') {
            // Send a message to the tab asking for its DOM
            // Login to Duckcard website
            let port = browser.tabs.connect(id, {
                name: 'tabPort',
            });
            port.postMessage({
                type: 'duckcardAuth',
                username: data['stevens-username'],
                password: data['stevens-password'],
            });
            port.onMessage.addListener(async (msg, port) => {
                if (msg.type === 'setPageInfo') {
                    let names = [];
                    let amounts = [];
                    let $html = $($.parseHTML(msg.html));
                    let $content = $html.find('.jsa_content-interior');
                    $content.find('h3').each((i, x) => {
                        names.push(
                            $(x)
                                .text()
                                .trim()
                        );
                    });
                    $content.find('.jsa_transactions').each((i, x) => {
                        let amount = $(x).find('.jsa_amount');
                        let numBal = 1;
                        if (names[i].includes('Plan')) {
                            numBal += 1;
                            names[i] = 'Meal Swipes';
                            names.push('Guest Swipes');
                        }
                        for (let j = 0; j < numBal; j++) {
                            let text = $(amount[j + 1]).text();
                            let val = text.match(/\$?[\d\.]+/)[0];
                            amounts.push(val);
                        }
                    });
                    let data = names.reduce(
                        (o, k, i) => ({...o, [k]: amounts[i]}),
                        {}
                    );
                    await browser.storage.local.set({
                        duckcard: {
                            auth: true,
                            data: data,
                            updated: moment().format(),
                        },
                    });
                    browser.tabs.onUpdated.removeListener(listener);
                    port.disconnect();
                    await browser.tabs.remove(tab.id);
                }
            });
            if (tab.url.startsWith(BASE_URI + '/statementnew.php')) {
                await browser.tabs.update(id, {
                    url: tab.url.replace(/statementnew/, 'index'),
                });
            } else if (tab.url.startsWith(BASE_URI + '/index.php')) {
                port.postMessage({type: 'getPageInfo'});
            }
        }
    });
}

export {GetMealSwipes};
