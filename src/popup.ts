const UpdateCanvas = require('./features/Canvas/CanvasDisplay.pug');
const UpdateRooms = require('./features/FreeRooms/FreeRoomsDisplay.pug');
const UpdateMyStevens = require('./features/MyStevens/MyStevensDisplay.pug');
import {browser} from 'webextension-polyfill-ts';
import $ from 'cash-dom';
// import {log} from './shared/utility';

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
        let hasAuth = false;
        if (duckcard) {
            hasAuth = true;
        }
        $('#my-stevens').html(
            UpdateMyStevens({
                duckcard: duckcard,
                hasAuth: hasAuth,
            })
        );
    });
});
