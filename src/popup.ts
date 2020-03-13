const UpdateCanvas = require('./features/Canvas/CanvasDisplay.pug');
const UpdateRooms = require('./features/FreeRooms/FreeRoomsDisplay.pug');
const UpdateMyStevens = require('./features/MyStevens/MyStevensDisplay.pug');
import {browser} from 'webextension-polyfill-ts';
import $ from 'cash-dom';
import moment from 'moment';
import {log} from './shared/utility';

document.addEventListener('DOMContentLoaded', () => {
    /* To Do
    - Update the below features to only display/operate if they are enabled */
    // Exit if on options page
    if (document.title === 'Stevens Web Extension Options') {
        return;
    }
    // Canvas Integration
    chrome.storage.local.get('assignments', ({assignments}) => {
        let hasToken = false;
        if (assignments) {
            hasToken = true;
        }
        $('#canvas-integration').html(
            UpdateCanvas({
                assignments: assignments,
                hasToken: hasToken,
            })
        );
    });
    // Room Availability
    chrome.storage.local.get('availableRooms', ({availableRooms}) => {
        if (availableRooms) {
            $('#free-rooms').html(
                UpdateRooms({
                    availableRooms: availableRooms,
                })
            );
        }
    });
    // myStevens: Duckcard Balances + Meal Swipes
    browser.storage.local.get('duckcard').then(({duckcard}) => {
        let auth = false;
        let updated = 'Never';
        if (duckcard) {
            auth = duckcard.auth;
            updated = moment(duckcard.updated).fromNow();
        }
        $('#my-stevens').html(
            UpdateMyStevens({
                duckcard: duckcard.data,
                hasAuth: auth,
                updated: updated,
            })
        );
        $('#update-duckcard').on('click', e => {
            log('Querying Duckcard info...');
            browser.runtime.sendMessage({
                type: 'queryDuckcard',
            });
        });
    });
});
