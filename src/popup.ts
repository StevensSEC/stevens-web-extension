const UpdateCanvas = require('./features/Canvas/CanvasDisplay.pug');
const UpdateRooms = require('./features/FreeRooms/FreeRoomsDisplay.pug');
import {log} from './shared/utility';

document.addEventListener('DOMContentLoaded', () => {
    /* To Do
    - Update the below features to only display/operate if they are enabled */
    // Canvas Integration
    chrome.storage.local.get('upcomingAssignments', res => {
        log('Loading Canvas assignments...');
        if (res.upcomingAssignments) {
            document.querySelector(
                '#canvas-integration'
            ).innerHTML = UpdateCanvas({
                assignments: res.upcomingAssignments,
            });
        }
    });
    //Room Availability
    chrome.storage.local.get('availableRooms', res => {
        if (res.availableRooms) {
            document.querySelector('#free-rooms').innerHTML = UpdateRooms({
                availableRooms: res.availableRooms,
            });
        }
    });
});
